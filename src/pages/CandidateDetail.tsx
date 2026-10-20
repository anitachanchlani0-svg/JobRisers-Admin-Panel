import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  LockKeyhole,
  LockOpen,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Briefcase,
  GraduationCap,
  Clock,
  CheckCircle2,
  MapPin,
  Sparkles,
  Award,
  Layers,
  Send,
  Calendar,
  ExternalLink,
  Download,
  AlertTriangle,
  RotateCcw,
  Mail,
  Phone,
  Eye,
  KeyRound,
  Trash2,
  UserCheck,
  UserX,
  MessageSquare,
  Video,
  FileCheck,
  Shield,
  Bookmark,
  Bell,
  GitMerge,
  Globe,
  Sliders,
  Check,
  Plus,
  XCircle,
  Copy,
  Info,
  CalendarDays,
  Smartphone,
  ChevronRight,
} from 'lucide-react';
import {
  adminCandidates,
  adminApplications,
  adminApplicationStageMappings,
  adminInterviews,
  adminConversations,
  adminJobs,
  adminMatchScoreSamples,
  adminProfileStrengthFormula,
  initialAdminResumeTemplates,
  initialAdminAtsValidationSettings,
  type AdminCandidate,
  type CandidateAuditLog,
  type CandidateResumeVersion,
} from '@/mock-data';
import { Avatar, StatusPill, Modal } from '@/components/ui';
import { fetchCandidateById, unmaskCandidatePii, updateCandidateStatus, addCandidateNote } from '@/lib/api';

type CandidateSubTab =
  | 'overview'
  | 'resumes'
  | 'applications'
  | 'interviews'
  | 'onboarding'
  | 'consent'
  | 'privacy';

export function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [candidatesList, setCandidatesList] = useState<AdminCandidate[]>(adminCandidates);
  const [activeTab, setActiveTab] = useState<CandidateSubTab>('overview');

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    fetchCandidateById(id)
      .then((data) => {
        if (isMounted && data) {
          setCandidatesList((prev) => {
            const index = prev.findIndex((c) => c.id === id || (c as any).customId === id);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = { ...updated[index], ...data };
              return updated;
            }
            return [data, ...prev];
          });
        }
      })
      .catch((err) => {
        console.warn('Backend candidate detail notice:', err);
      });
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Candidate Unmasked PII Tracking
  const [unmaskedCandidateIds, setUnmaskedCandidateIds] = useState<Set<string>>(new Set());

  // Critical Security: PII Unmask Justification Modal (AUTH-5 / DPDP Compliance)
  const [unmaskModalOpen, setUnmaskModalOpen] = useState(false);
  const [unmaskJustification, setUnmaskJustification] = useState('');
  const [unmaskError, setUnmaskError] = useState('');

  // Center Action Modal
  const [actionModal, setActionModal] = useState<{
    title: string;
    subtitle: string;
    actionText: string;
    tone: string;
    onConfirm?: () => void;
  } | null>(null);

  // Form State for Adding Staff Note
  const [newStaffNote, setNewStaffNote] = useState('');

  // Merge Candidate Modal State (CAN-6)
  const [mergeModalOpen, setMergeModalOpen] = useState(false);
  const [mergeTargetId, setMergeTargetId] = useState('');

  // Notification Toggles Local State (CAN-12)
  const candidate = candidatesList.find((c) => c.id === id) || candidatesList[0];
  const isUnmasked = candidate ? unmaskedCandidateIds.has(candidate.id) : false;

  const [notifState, setNotifState] = useState(
    candidate?.notificationPreferences || {
      jobAlerts: true,
      applicationUpdates: true,
      interviewReminders: true,
      messages: true,
      productUpdates: false,
      promotionalEmails: false,
      emailChannel: true,
      pushChannel: true,
      smsChannel: false,
    }
  );

  if (!candidate) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/candidates"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Back to Candidates
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-base font-bold text-foreground">Candidate not found</h2>
          <p className="text-xs text-muted-foreground mt-1">No candidate matching ID "{id}".</p>
        </div>
      </div>
    );
  }

  // Cross-Module Data Matching
  const candidateApplications = useMemo(() => {
    return adminApplications.filter(
      (app) =>
        app.candidateName.toLowerCase() === candidate.name.toLowerCase() ||
        app.id.includes(candidate.id.replace('can-', ''))
    );
  }, [candidate]);

  const candidateInterviewsList = useMemo(() => {
    return adminInterviews.filter(
      (intv) =>
        intv.candidateId === candidate.id ||
        intv.candidateName.toLowerCase() === candidate.name.toLowerCase()
    );
  }, [candidate]);

  const candidateConversationsList = useMemo(() => {
    return adminConversations.filter(
      (conv) =>
        conv.candidateId === candidate.id ||
        conv.candidateName.toLowerCase() === candidate.name.toLowerCase()
    );
  }, [candidate]);

  const savedJobsList = useMemo(() => {
    if (candidate.savedJobIds?.length) {
      return adminJobs.filter((j) => candidate.savedJobIds?.includes(j.id));
    }
    // Fallback sample for demonstration
    return adminJobs.slice(0, 2);
  }, [candidate]);

  const matchSample = useMemo(() => {
    return (
      adminMatchScoreSamples.find((s) => s.candidateId === candidate.id) || {
        matchScore: candidate.completion >= 90 ? 94 : 85,
        factors: { skillsMatch: 90, experienceMatch: 88, locationMatch: 95, salaryFit: 86 },
      }
    );
  }, [candidate]);

  // Profile Strength Tier from Formula
  const profileStrengthTier = useMemo(() => {
    const score = candidate.completion || 0;
    const tiers = adminProfileStrengthFormula.tiers;
    if (score >= tiers[3].minScore) return tiers[3];
    if (score >= tiers[2].minScore) return tiers[2];
    if (score >= tiers[1].minScore) return tiers[1];
    return tiers[0];
  }, [candidate]);

  // -------------------------------------------------------------
  // PII UNMASKING WORKFLOW (CAN-2 & AUTH-5 STRICT SECURITY FIX)
  // -------------------------------------------------------------
  const handleOpenUnmaskModal = () => {
    setUnmaskJustification('');
    setUnmaskError('');
    setUnmaskModalOpen(true);
  };

  const handleConfirmUnmask = () => {
    const trimmed = unmaskJustification.trim();
    if (!trimmed || trimmed.length < 5) {
      setUnmaskError('A valid business justification (min 5 characters) is required under DPDP Act 2023.');
      return;
    }

    const timestamp = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    const newAuditEntry: CandidateAuditLog = {
      action: `PII Unmask Requested. Casework Reason: "${trimmed}"`,
      timestamp: `Today, ${timestamp}`,
      actor: 'Admin: Rahul Sharma (Super Admin)',
    };

    unmaskCandidatePii(candidate.id, trimmed)
      .then((res) => {
        if (res && res.unmasked) {
          setCandidatesList((prev) =>
            prev.map((c) =>
              c.id === candidate.id
                ? {
                    ...c,
                    emailFull: res.unmasked.email,
                    phoneFull: res.unmasked.phone,
                    isUnmasked: true,
                    auditLog: [newAuditEntry, ...(c.auditLog || [])],
                  }
                : c
            )
          );
        }
      })
      .catch((err) => {
        console.warn('Backend unmask notice:', err);
      });

    setUnmaskedCandidateIds((prev) => new Set(prev).add(candidate.id));
    setCandidatesList((prev) =>
      prev.map((c) =>
        c.id === candidate.id
          ? {
              ...c,
              isUnmasked: true,
              auditLog: [newAuditEntry, ...(c.auditLog || [])],
            }
          : c
      )
    );

    setUnmaskModalOpen(false);
    setUnmaskJustification('');
    setUnmaskError('');
  };

  // -------------------------------------------------------------
  // ADMIN ACTIONS (CAN-4)
  // -------------------------------------------------------------
  const handleToggleSuspend = () => {
    const isCurrentlySuspended = candidate.status === 'Suspended';
    setActionModal({
      title: isCurrentlySuspended ? 'Reactivate Candidate Account?' : 'Suspend Candidate Account?',
      subtitle: isCurrentlySuspended
        ? `Reactivating ${candidate.name} will restore access to application submissions, Pro services, and recruiter indexing.`
        : `Suspending ${candidate.name} will immediately block job applications and pause active Pro subscriptions.`,
      actionText: isCurrentlySuspended ? 'Confirm Reactivation' : 'Confirm Suspension',
      tone: isCurrentlySuspended ? 'green' : 'rose',
      onConfirm: () => {
        const newStatus = isCurrentlySuspended ? 'Active' : 'Suspended';
        const auditAction = isCurrentlySuspended
          ? 'Admin reactivated account following casework clearance'
          : 'Admin suspended candidate account due to policy inquiry';

        setCandidatesList((prev) =>
          prev.map((c) =>
            c.id === candidate.id
              ? {
                  ...c,
                  status: newStatus,
                  auditLog: [
                    { action: auditAction, timestamp: 'Just now', actor: 'Admin: Rahul Sharma' },
                    ...(c.auditLog || []),
                  ],
                }
              : c
          )
        );
      },
    });
  };

  const handleForceVerifyEmail = () => {
    setActionModal({
      title: 'Force Verify Candidate Email?',
      subtitle: `Manually mark ${candidate.name} (${candidate.emailFull || candidate.emailMasked}) as email-verified. This bypasses the email token handshake.`,
      actionText: 'Force Verify',
      tone: 'green',
      onConfirm: () => {
        setCandidatesList((prev) =>
          prev.map((c) =>
            c.id === candidate.id
              ? {
                  ...c,
                  isEmailVerified: true,
                  auditLog: [
                    { action: 'Admin manually verified email address', timestamp: 'Just now', actor: 'Admin: Rahul Sharma' },
                    ...(c.auditLog || []),
                  ],
                }
              : c
          )
        );
      },
    });
  };

  const handleSendPasswordReset = () => {
    setActionModal({
      title: 'Send Password Reset Email?',
      subtitle: `An encrypted one-time password reset link will be dispatched to ${candidate.name}'s verified email address. Valid for 60 minutes.`,
      actionText: 'Dispatch Reset Link',
      tone: 'violet',
      onConfirm: () => {
        setCandidatesList((prev) =>
          prev.map((c) =>
            c.id === candidate.id
              ? {
                  ...c,
                  auditLog: [
                    { action: 'Dispatched password reset token link', timestamp: 'Just now', actor: 'Admin: Rahul Sharma' },
                    ...(c.auditLog || []),
                  ],
                }
              : c
          )
        );
      },
    });
  };

  const handleExportDataArchive = () => {
    const exportPayload = {
      candidateProfile: candidate,
      applications: candidateApplications,
      interviews: candidateInterviewsList,
      conversationsMetadata: candidateConversationsList,
      consentRecords: candidate.consentRecords,
      exportTimestamp: new Date().toISOString(),
      statutoryAuthority: 'JobRisers DPDP 2023 / GDPR Article 15 Compliance Archive',
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `candidate-archive-${candidate.id}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddStaffNote = () => {
    if (!newStaffNote.trim()) return;
    const noteEntry = {
      id: `sn-${Date.now()}`,
      author: 'Admin: Rahul Sharma',
      note: newStaffNote.trim(),
      createdAt: 'Just now',
    };
    setCandidatesList((prev) =>
      prev.map((c) =>
        c.id === candidate.id
          ? {
              ...c,
              staffNotes: [noteEntry, ...(c.staffNotes || [])],
            }
          : c
      )
    );
    setNewStaffNote('');
  };

  const handleMergeCandidate = () => {
    if (!mergeTargetId.trim()) return;
    setActionModal({
      title: 'Merge Duplicate Candidate Profiles?',
      subtitle: `Merge candidate profile ${mergeTargetId} into canonical profile ${candidate.name} (${candidate.id})? All application history, consent logs, and resume records will be consolidated.`,
      actionText: 'Confirm Merge',
      tone: 'violet',
      onConfirm: () => {
        setCandidatesList((prev) =>
          prev.map((c) =>
            c.id === candidate.id
              ? {
                  ...c,
                  duplicateSignals: [],
                  auditLog: [
                    { action: `Merged secondary candidate account ${mergeTargetId} into primary record`, timestamp: 'Just now', actor: 'Admin: Rahul Sharma' },
                    ...(c.auditLog || []),
                  ],
                }
              : c
          )
        );
        setMergeModalOpen(false);
        setMergeTargetId('');
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/candidates"
          data-testid="link-back-to-candidates"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          Back to Candidates
        </Link>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
            ID: {candidate.id}
          </span>
          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
            Member since: {candidate.createdAt || '2026-03-15'}
          </span>
        </div>
      </div>

      {/* 2. Candidate Header Workspace Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            <Avatar name={candidate.name} />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl truncate">
                  {candidate.name}
                </h1>
                {candidate.pro && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#eee9fc] border border-[#d8cbf9] px-2.5 py-0.5 text-[10px] font-bold text-primary">
                    <Sparkles size={11} /> PRO
                  </span>
                )}
                <StatusPill value={candidate.status} />
                {candidate.isEmailVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                    <CheckCircle2 size={11} /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[9px] font-bold text-amber-700">
                    <AlertTriangle size={11} /> Unverified Email
                  </span>
                )}
                {candidate.openToRemote && (
                  <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[9px] font-bold text-blue-700">
                    Remote Ready
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-2 mt-1 truncate">
                <span>{candidate.headline}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} className="text-muted-foreground" />
                  {candidate.location}
                </span>
                <span>·</span>
                <span>Source: {candidate.source}</span>
              </p>
            </div>
          </div>

          {/* Quick Header Admin Actions */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              data-testid="button-header-suspend"
              onClick={handleToggleSuspend}
              className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[11px] font-bold transition-colors shadow-2xs ${
                candidate.status === 'Suspended'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
              }`}
            >
              <ShieldAlert size={14} />
              {candidate.status === 'Suspended' ? 'Reactivate Account' : 'Suspend Account'}
            </button>
            <button
              type="button"
              data-testid="button-header-export-archive"
              onClick={handleExportDataArchive}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-[11px] font-bold text-foreground hover:bg-muted transition-colors shadow-2xs"
            >
              <Download size={14} className="text-primary" /> Export DSR Archive
            </button>
            <button
              type="button"
              data-testid="button-view-as-candidate"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('jobrisers-view-as-user', {
                    detail: {
                      id: candidate.id,
                      name: candidate.name,
                      email: isUnmasked ? candidate.emailFull || candidate.emailMasked : candidate.emailMasked,
                      role: 'Candidate',
                    },
                  })
                );
              }}
              className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2 text-[11px] font-bold text-primary hover:bg-primary/20 transition-colors shadow-2xs cursor-pointer"
            >
              <Eye size={14} /> View as Candidate (AUTH-7)
            </button>
          </div>
        </div>

        {/* Contact Masking & Unmask Banner (CAN-2 & Security) */}
        <div className="mt-5 pt-4 border-t border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 rounded-b-2xl">
          <div className="flex items-center gap-4 flex-wrap text-xs">
            <div className="flex items-center gap-1.5">
              <Mail size={13} className="text-muted-foreground" />
              <span className="font-mono text-foreground font-semibold">
                {isUnmasked ? candidate.emailFull || candidate.emailMasked : candidate.emailMasked}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone size={13} className="text-muted-foreground" />
              <span className="font-mono text-foreground font-semibold">
                {isUnmasked ? candidate.phoneFull || candidate.phoneMasked : candidate.phoneMasked}
              </span>
            </div>
            {isUnmasked && (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700 animate-in fade-in">
                <LockOpen size={11} /> Unmasked (Audit Logged)
              </span>
            )}
          </div>

          <div>
            {!isUnmasked ? (
              <button
                type="button"
                data-testid="button-request-unmask"
                onClick={handleOpenUnmaskModal}
                className="flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-bold text-primary hover:bg-primary/20 transition-colors shadow-2xs"
              >
                <LockKeyhole size={13} /> Request Unmask (Audit Logged)
              </button>
            ) : (
              <button
                type="button"
                data-testid="button-remask-contact"
                onClick={() => {
                  setUnmaskedCandidateIds((prev) => {
                    const next = new Set(prev);
                    next.delete(candidate.id);
                    return next;
                  });
                }}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[11px] font-bold text-muted-foreground hover:bg-muted transition-colors"
              >
                <LockKeyhole size={13} /> Re-mask Contact
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Seven Canonical Workspace Tabs (CAN-3) */}
      <div className="flex items-center gap-1.5 border-b border-border overflow-x-auto pb-px">
        {[
          { key: 'overview', label: 'Overview', icon: UserCheck },
          {
            key: 'resumes',
            label: `Resumes (${candidate.resumeVersions?.length || 1})`,
            icon: FileText,
          },
          {
            key: 'applications',
            label: `Pipeline (${candidateApplications.length})`,
            icon: Briefcase,
          },
          {
            key: 'interviews',
            label: `Interviews & Chats (${candidateInterviewsList.length + candidateConversationsList.length})`,
            icon: CalendarDays,
          },
          { key: 'onboarding', label: 'Onboarding', icon: Sliders },
          { key: 'consent', label: 'Consent & Alerts', icon: ShieldCheck },
          { key: 'privacy', label: 'Privacy & Account', icon: ShieldAlert },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              data-testid={`tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key as CandidateSubTab)}
              className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px ${
                isActive
                  ? 'border-primary text-primary bg-primary/5 rounded-t-xl'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 4. Tab Content Panels */}

      {/* ======================================================== */}
      {/* TAB 1: OVERVIEW & PROFILE STRENGTH */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Duplicate / Fake Profile Warning (CAN-6) */}
          {candidate.duplicateSignals && candidate.duplicateSignals.length > 0 && (
            <div
              data-testid="card-duplicate-signal-warning"
              className="rounded-2xl border border-amber-300 bg-amber-50/70 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                  <div>
                    <h3 className="text-xs font-bold text-amber-900">
                      Duplicate Profile Signals Detected ({candidate.duplicateSignals[0].matchScore}% confidence match)
                    </h3>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      {candidate.duplicateSignals[0].reason}. Potential conflict with{' '}
                      <strong>{candidate.duplicateSignals[0].duplicateCandidateName}</strong> (ID:{' '}
                      {candidate.duplicateSignals[0].duplicateCandidateId}).
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  data-testid="button-review-merge-candidate"
                  onClick={() => {
                    setMergeTargetId(candidate.duplicateSignals?.[0].duplicateCandidateId || '');
                    setMergeModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-[11px] font-bold text-amber-900 hover:bg-amber-100/70 shadow-2xs shrink-0"
                >
                  <GitMerge size={13} /> Review & Merge
                </button>
              </div>
            </div>
          )}

          {/* Profile Strength & Recruiter Insights (CAN-14) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Profile Strength Tier
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-extrabold text-primary">
                  {profileStrengthTier.tier}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-extrabold text-foreground">
                  {candidate.completion}%
                </span>
                <span className="text-xs text-muted-foreground font-medium">score</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${candidate.completion}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                💡 <strong>Optimization Tip:</strong> {profileStrengthTier.tipText}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Recruiter Views Counter
                </span>
                <Eye size={16} className="text-primary" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-extrabold text-foreground">
                  {candidate.recruiterViewsCount || 24}
                </span>
                <span className="text-xs text-muted-foreground font-medium">views this month</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Profile spotlighted in employer candidate search. Indexed in high-intent keyword queries.
              </p>
              <div className="pt-1 text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={12} /> Active in Recruiter Spotlight Index
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Matching Algorithmic Fit
                </span>
                <Sparkles size={16} className="text-amber-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-extrabold text-foreground">
                  {matchSample.matchScore}%
                </span>
                <span className="text-xs text-muted-foreground font-medium">composite fit</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="rounded bg-muted/40 p-1.5">
                  Skills: <strong>{matchSample.factors.skillsMatch}%</strong>
                </div>
                <div className="rounded bg-muted/40 p-1.5">
                  Role Exp: <strong>{matchSample.factors.experienceMatch}%</strong>
                </div>
                <div className="rounded bg-muted/40 p-1.5">
                  Location: <strong>{matchSample.factors.locationMatch}%</strong>
                </div>
                <div className="rounded bg-muted/40 p-1.5">
                  Salary: <strong>{matchSample.factors.salaryFit}%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links & Bio */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Globe size={16} className="text-primary" /> Verified Portfolio & Social Handles
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              {candidate.socialLinks?.linkedin && (
                <a
                  href={candidate.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  <ExternalLink size={12} className="text-primary" /> LinkedIn Profile
                </a>
              )}
              {candidate.socialLinks?.github && (
                <a
                  href={candidate.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  <ExternalLink size={12} className="text-primary" /> GitHub Repository
                </a>
              )}
              {candidate.socialLinks?.portfolio && (
                <a
                  href={candidate.socialLinks.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  <ExternalLink size={12} className="text-primary" /> Design Portfolio Live
                </a>
              )}
              <span className="text-xs text-muted-foreground ml-auto">
                Public Slug: <code>jobrisers.com/c/{candidate.privacySettings?.publicProfileSlug || candidate.id}</code>
              </span>
            </div>
          </div>

          {/* Skills Matrix */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Layers size={16} className="text-primary" /> Core Technical & Functional Competencies
            </h2>
            <div className="flex flex-wrap gap-2 pt-1">
              {candidate.skills?.map((skill) => (
                <span
                  key={skill}
                  className="rounded-xl border border-border bg-muted/40 px-3 py-1 text-xs font-semibold text-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Work Experience */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Briefcase size={16} className="text-primary" /> Career History
            </h2>
            <div className="space-y-4 divide-y divide-border/60">
              {candidate.experience?.map((exp, index) => (
                <div key={index} className={index > 0 ? 'pt-4' : ''}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-foreground">{exp.role}</h3>
                    <span className="text-[11px] text-muted-foreground font-mono">{exp.duration}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-primary mt-0.5">{exp.company}</div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <GraduationCap size={16} className="text-primary" /> Academic Qualifications
            </h2>
            <div className="space-y-3">
              {candidate.education?.map((edu, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-foreground">{edu.degree}</h3>
                    <div className="text-[11px] text-muted-foreground">{edu.institution}</div>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono">{edu.year}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Roles & 1-Click Apply Eligibility (CAN-17) */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Bookmark size={16} className="text-primary" /> Bookmarked & Saved Roles (CAN-17)
              </h2>
              {candidate.completion >= 90 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  <CheckCircle2 size={11} /> 1-Click Apply Enabled (&gt;90% complete)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                  <AlertTriangle size={11} /> 1-Click Apply Disabled (&lt;90%)
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedJobsList.map((job) => (
                <div key={job.id} className="rounded-xl border border-border p-3.5 space-y-1.5 bg-muted/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">{job.title}</span>
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                      {job.workMode || 'Remote'}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {job.company} · {job.location}
                  </div>
                  <div className="text-[10px] text-muted-foreground pt-1 flex items-center justify-between border-t border-border/50">
                    <span>Saved to bookmarks</span>
                    <Link to={`/admin/jobs/${job.id}`} className="text-primary font-bold hover:underline">
                      View Job →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: RESUMES & ARTIFACTS (CAN-10, CAN-18) */}
      {/* ======================================================== */}
      {activeTab === 'resumes' && (
        <div className="space-y-6">
          {/* Artifact Security Sentinel Banner (CAN-18) */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-sm flex items-start gap-3">
            <ShieldCheck size={20} className="text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-emerald-950">
                Artifact Security Sentinel (CAN-18 — Simulated / Mock Scan)
              </h3>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Security Scan: Clean (Mock verification). Simulated antivirus scanning, SHA-256 integrity checksums, and external hyperlink sanitization representation.
              </p>
              <div className="text-[10px] font-mono text-emerald-700 pt-0.5">
                Checksum: <code>e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</code> (SHA-256)
              </div>
            </div>
          </div>

          {/* Resume Versions List */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FileText size={16} className="text-primary" /> Stored Resume Versions
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Multi-version management with ATS certification scores and template bindings.
                </p>
              </div>
              <span className="text-xs font-bold text-muted-foreground">
                Quota: {candidate.pro ? 'Unlimited (Pro)' : '1 of 1 (Free)'}
              </span>
            </div>

            <div className="space-y-3">
              {(candidate.resumeVersions || [candidate.resume]).map((res, index) => {
                const version = res as CandidateResumeVersion;
                const isDefault = version.isDefault !== false;
                return (
                  <div
                    key={version.id || index}
                    className={`rounded-xl border p-4 transition-all ${
                      isDefault ? 'border-primary/40 bg-primary/5' : 'border-border bg-card'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-foreground font-mono">
                            {version.filename}
                          </span>
                          {isDefault && (
                            <span className="rounded-full bg-primary text-white px-2 py-0.5 text-[9px] font-bold">
                              Default Primary
                            </span>
                          )}
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-bold text-muted-foreground">
                            {version.templateName || 'Modern Split v2.4'}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Uploaded {version.uploadedAt} · Size: {version.size} · ATS Score:{' '}
                          <strong className="text-foreground">{version.atsScore || 90}/100</strong>
                        </p>
                        {version.summary && (
                          <p className="text-xs text-foreground/80 pt-1 leading-relaxed">{version.summary}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          data-testid={`button-download-resume-${index}`}
                          onClick={() => {
                            const blob = new Blob([`JobRisers Simulated PDF/A Artifact for ${candidate.name}\nResume: ${version.filename}\nATS Score: ${version.atsScore}`], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = version.filename || 'resume.pdf';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[11px] font-bold text-foreground hover:bg-muted shadow-2xs"
                        >
                          <Download size={13} className="text-primary" /> Download PDF/A
                        </button>
                        {!isDefault && (
                          <button
                            type="button"
                            onClick={() => {
                              setActionModal({
                                title: 'Make Primary Default Resume?',
                                subtitle: `Set ${version.filename} as the default resume submitted during 1-click apply and recruiter searches.`,
                                actionText: 'Set as Default',
                                tone: 'violet',
                                onConfirm: () => {
                                  // Update default locally
                                },
                              });
                            }}
                            className="rounded-lg border border-border px-3 py-1.5 text-[11px] font-bold text-muted-foreground hover:bg-muted"
                          >
                            Set Default
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ATS Validation Engine Certification */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <FileCheck size={16} className="text-emerald-600" /> Multi-ATS Semantic Compatibility Report
            </h2>
            <p className="text-xs text-muted-foreground">
              Certified by <strong>{initialAdminAtsValidationSettings.validationAuthority}</strong>.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
              {initialAdminAtsValidationSettings.supportedAtsList.map((ats) => (
                <div key={ats} className="rounded-xl border border-border p-2.5 text-center bg-muted/20">
                  <CheckCircle2 size={16} className="text-emerald-600 mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-foreground">{ats}</div>
                  <div className="text-[9px] text-muted-foreground font-mono">100% Parsed</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: PIPELINE & APPLICATIONS (CAN-15) */}
      {/* ======================================================== */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-foreground">
                Active Job Applications ({candidateApplications.length})
              </h2>
              <p className="text-xs text-muted-foreground">
                Real-time tracking synchronized with hiring employer ATS workflows.
              </p>
            </div>
            <Link
              to="/admin/applications"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              Open Applications Hub →
            </Link>
          </div>

          {candidateApplications.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <Briefcase size={28} className="mx-auto text-muted-foreground/50 mb-2" />
              <h3 className="text-xs font-bold text-foreground">No Active Applications</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Candidate has not submitted applications within this cycle.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {candidateApplications.map((app) => (
                <div key={app.id} className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{app.jobTitle}</span>
                        <StatusPill value={app.status} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {app.company} · Applied on {app.appliedDate} · App ID: <span className="font-mono">{app.id}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                      <span>Step {app.currentStep || 2} of {app.totalSteps || 5}</span>
                      <span>·</span>
                      <span>Round {app.currentRound || 1} of {app.totalRounds || 3}</span>
                    </div>
                  </div>

                  {/* 6-Stage Pipeline Stepper */}
                  <div className="pt-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                      {adminApplicationStageMappings.map((stage) => {
                        const isCurrent = app.stage?.toLowerCase() === stage.adminStatus.toLowerCase() || app.status.toLowerCase() === stage.adminStatus.toLowerCase();
                        return (
                          <div
                            key={stage.id}
                            className={`rounded-xl border p-2 text-center transition-all ${
                              isCurrent
                                ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                                : 'border-border/70 bg-muted/20 text-muted-foreground text-[11px]'
                            }`}
                          >
                            <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-mono">
                              Stage {stage.order}
                            </div>
                            <div className="text-xs font-bold truncate mt-0.5">{stage.candidateStage}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interviewer Feedback Notes */}
                  {app.feedbackNotes && app.feedbackNotes.length > 0 && (
                    <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                        <span>Recruiter Evaluation Scorecard</span>
                        <span className="text-amber-500 font-bold">★ {app.feedbackNotes[0].rating} / 5</span>
                      </div>
                      <p className="text-xs text-foreground italic">"{app.feedbackNotes[0].note}"</p>
                      <div className="text-[10px] text-muted-foreground">
                        Logged by {app.feedbackNotes[0].author} ({app.feedbackNotes[0].role}) · {app.feedbackNotes[0].date}
                      </div>
                    </div>
                  )}

                  {/* Screening Questions */}
                  {app.screeningQuestions && app.screeningQuestions.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Candidate Screening Responses
                      </div>
                      <div className="space-y-1">
                        {app.screeningQuestions.map((q, idx) => (
                          <div key={idx} className="text-xs bg-muted/30 p-2 rounded-lg">
                            <span className="font-semibold text-foreground">Q: {q.question}</span>
                            <div className="text-muted-foreground mt-0.5">A: {q.answer}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: INTERVIEWS & MESSAGES (CAN-16) */}
      {/* ======================================================== */}
      {activeTab === 'interviews' && (
        <div className="space-y-6">
          {/* Privacy Sentinel Notice */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 shadow-sm flex items-start gap-3">
            <Shield size={20} className="text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-blue-950">
                Candidate Direct Messaging Privacy Shield (CAN-16)
              </h3>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Direct conversation content between candidate and recruiters is end-to-end encrypted under privacy policy. Administrators inspect message metadata, delivery timestamps, safety flags, and dispute casework only.
              </p>
            </div>
          </div>

          {/* Scheduled Interviews */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Video size={16} className="text-primary" /> Formal Video & On-site Interviews ({candidateInterviewsList.length})
            </h2>

            {candidateInterviewsList.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">No interviews scheduled.</p>
            ) : (
              <div className="space-y-3">
                {candidateInterviewsList.map((intv) => (
                  <div key={intv.id} className="rounded-xl border border-border p-4 bg-muted/10 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">{intv.jobTitle}</span>
                          <StatusPill value={intv.status} />
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {intv.companyName} · {intv.dateTime} ({intv.duration}) · Provider: {intv.provider}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {intv.meetingLink && (
                          <a
                            href={intv.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-bold text-primary hover:bg-primary/20 shadow-2xs"
                          >
                            <Video size={12} /> Meeting Room <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                      <span>Interviewer: {intv.interviewerName} ({intv.interviewerTitle})</span>
                      <span>Format: {intv.format}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Recruiter Conversations Metadata */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <MessageSquare size={16} className="text-primary" /> Recruiter Communication Threads ({candidateConversationsList.length})
            </h2>

            {candidateConversationsList.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">No active messaging threads.</p>
            ) : (
              <div className="space-y-3">
                {candidateConversationsList.map((conv) => (
                  <div key={conv.id} className="rounded-xl border border-border p-4 bg-muted/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">{conv.companyName}</span>
                        <span className="text-xs text-muted-foreground">({conv.employerContactName})</span>
                        <StatusPill value={conv.status} />
                        {conv.isFlagged && (
                          <span className="rounded bg-rose-100 text-rose-700 text-[9px] font-bold px-1.5 py-0.5 flex items-center gap-0.5">
                            <ShieldAlert size={10} /> Flagged
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        Last Active: {conv.lastActivity}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                      <span>Related Position: {conv.jobTitle}</span>
                      <span>{conv.messageCount} messages in thread</span>
                    </div>
                    {conv.flagReason && (
                      <div className="rounded bg-rose-50 border border-rose-200/80 p-2 text-[10px] text-rose-800">
                        Casework Flag: {conv.flagReason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: ONBOARDING & PREFERENCES (CAN-11) */}
      {/* ======================================================== */}
      {activeTab === 'onboarding' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Sliders size={16} className="text-primary" /> Candidate Onboarding Milestones
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Wizard progress tracking and role preference configuration.
                </p>
              </div>
              <button
                type="button"
                data-testid="button-reset-onboarding"
                onClick={() => {
                  setActionModal({
                    title: 'Reset Candidate Onboarding Wizard?',
                    subtitle: `Resetting onboarding for ${candidate.name} will require the candidate to re-enter career targets upon their next login session.`,
                    actionText: 'Reset Progress',
                    tone: 'amber',
                    onConfirm: () => {
                      setCandidatesList((prev) =>
                        prev.map((c) =>
                          c.id === candidate.id
                            ? {
                                ...c,
                                onboarding: { ...c.onboarding, completedSteps: 1 },
                                auditLog: [
                                  { action: 'Admin reset candidate onboarding wizard milestone', timestamp: 'Just now', actor: 'Admin: Rahul Sharma' },
                                  ...(c.auditLog || []),
                                ],
                              }
                            : c
                        )
                      );
                    },
                  });
                }}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[11px] font-bold text-muted-foreground hover:text-foreground shadow-2xs"
              >
                <RotateCcw size={12} /> Reset Wizard Progress
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-border p-4 bg-muted/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Career Objective
                </span>
                <p className="text-xs text-foreground font-medium leading-relaxed">
                  {candidate.onboarding?.careerGoal || 'Advance into engineering leadership roles in fintech.'}
                </p>
              </div>

              <div className="rounded-xl border border-border p-4 bg-muted/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Target Job Titles
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.onboarding?.targetRoles?.map((role) => (
                    <span key={role} className="rounded-lg bg-card border border-border px-2.5 py-1 text-[11px] font-semibold text-foreground">
                      {role}
                    </span>
                  )) || <span className="text-xs text-muted-foreground">None specified</span>}
                </div>
              </div>

              <div className="rounded-xl border border-border p-4 bg-muted/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Preferred Cities & Remote Willingness
                </span>
                <p className="text-xs text-foreground font-medium">
                  {candidate.onboarding?.preferredLocations?.join(', ') || candidate.location}
                </p>
                <div className="text-[10px] text-muted-foreground font-semibold">
                  Mode: <strong>{candidate.onboarding?.workMode || 'Hybrid'}</strong>
                </div>
              </div>

              <div className="rounded-xl border border-border p-4 bg-muted/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Onboarding Step Completion
                </span>
                <div className="flex items-center gap-2">
                  <div className="font-display text-2xl font-extrabold text-foreground">
                    {candidate.onboarding?.completedSteps || 4} / {candidate.onboarding?.totalSteps || 4}
                  </div>
                  <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                    Completed
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  Schema Version: {candidate.onboarding?.wizardVersion || 'v2.1'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: CONSENT & NOTIFICATIONS (CAN-12) */}
      {/* ======================================================== */}
      {activeTab === 'consent' && (
        <div className="space-y-6">
          {/* Notification Preferences */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Bell size={16} className="text-primary" /> Communication Channel Preferences (CAN-12)
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Granular opt-ins mapped to JobRisers Communication Matrix.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActionModal({
                    title: 'Save Notification Preferences?',
                    subtitle: `Update communication channel routing rules for ${candidate.name}.`,
                    actionText: 'Save Preferences',
                    tone: 'violet',
                    onConfirm: () => {
                      setCandidatesList((prev) =>
                        prev.map((c) =>
                          c.id === candidate.id
                            ? {
                                ...c,
                                notificationPreferences: notifState,
                                auditLog: [
                                  { action: 'Updated candidate notification channel matrix', timestamp: 'Just now', actor: 'Admin: Rahul Sharma' },
                                  ...(c.auditLog || []),
                                ],
                              }
                            : c
                        )
                      );
                    },
                  });
                }}
                className="rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold text-white hover:opacity-90 transition-opacity shadow-2xs"
              >
                Save Preferences
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {[
                { key: 'jobAlerts', label: 'Matching Job Alerts', desc: 'Real-time alerts for new job postings matching profile tags.' },
                { key: 'applicationUpdates', label: 'Application Status Changes', desc: 'Notifications when hiring team updates interview stage.' },
                { key: 'interviewReminders', label: 'Interview Calendar Reminders', desc: 'Automated 24h and 1h calendar alerts with meet links.' },
                { key: 'messages', label: 'Recruiter Chat Messages', desc: 'Immediate notification when a hiring partner sends a message.' },
                { key: 'productUpdates', label: 'JobRisers Product Releases', desc: 'Quarterly feature release digests and resume template alerts.' },
                { key: 'promotionalEmails', label: 'Marketing & Career Boosters', desc: 'Promotional discount codes for Resume Pro tier.' },
              ].map((item) => {
                const isChecked = Boolean(notifState[item.key as keyof typeof notifState]);
                return (
                  <label
                    key={item.key}
                    className="flex items-start gap-3 rounded-xl border border-border p-3.5 bg-muted/10 cursor-pointer hover:bg-muted/20 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        setNotifState((prev) => ({ ...prev, [item.key]: e.target.checked }))
                      }
                      className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
                    />
                    <div>
                      <div className="text-xs font-bold text-foreground">{item.label}</div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Statutory DPDP Consent History */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-600" /> Immutable DPDP Act 2023 Consent Audit Trail
            </h2>
            <div className="space-y-3">
              {(candidate.consentRecords || [
                {
                  id: 'cst-def-1',
                  purpose: 'DPDP Act 2023 Statutory Consent & Terms of Service',
                  version: 'v2.0',
                  consentedAt: 'Mar 15, 2026, 10:30 AM',
                  ipAddress: '157.48.12.90',
                  status: 'Granted' as const,
                },
              ]).map((cst) => (
                <div key={cst.id} className="rounded-xl border border-border p-3.5 flex items-center justify-between gap-3 bg-muted/10">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-foreground">{cst.purpose}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      Timestamp: {cst.consentedAt} · Client IP: {cst.ipAddress} · Policy Version: {cst.version}
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                    {cst.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: PRIVACY, SECURITY & ACCOUNT GOVERNANCE */}
      {/* ======================================================== */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          {/* Statutory DSR Erasure Request Tracker (CAN-7) */}
          {candidate.deletionRequest && (
            <div
              data-testid="card-dsr-deletion-request"
              className="rounded-2xl border border-rose-300 bg-rose-50/70 p-5 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Trash2 className="text-rose-600 shrink-0 mt-0.5" size={18} />
                  <div>
                    <h3 className="text-xs font-bold text-rose-950">
                      Pending Statutory Erasure Request (DPDP / GDPR Article 17)
                    </h3>
                    <p className="text-[11px] text-rose-800 mt-0.5">
                      {candidate.deletionRequest.reason}
                    </p>
                    <div className="text-[10px] font-mono text-rose-700 mt-1">
                      Filing Date: {candidate.deletionRequest.requestedAt} · Statutory SLA Deadline: {candidate.deletionRequest.slaDueDate}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  data-testid="button-approve-dsr-erasure"
                  onClick={() => {
                    setActionModal({
                      title: 'Execute Statutory Account Erasure?',
                      subtitle: `Permanently anonymize and erase personal data for ${candidate.name} in accordance with DPDP statutory compliance? This operation cannot be reversed.`,
                      actionText: 'Execute Anonymisation',
                      tone: 'rose',
                      onConfirm: () => {
                        setCandidatesList((prev) =>
                          prev.map((c) =>
                            c.id === candidate.id
                              ? {
                                  ...c,
                                  status: 'Anonymised',
                                  name: 'Anonymised Candidate',
                                  emailMasked: 'anonymised@gdpr.purge',
                                  phoneMasked: '+91 ***** *****',
                                  auditLog: [
                                    { action: 'Statutory DPDP erasure request executed. Personal identity purged.', timestamp: 'Just now', actor: 'Admin: Privacy Officer' },
                                    ...(c.auditLog || []),
                                  ],
                                }
                              : c
                          )
                        );
                      },
                    });
                  }}
                  className="rounded-lg bg-rose-600 px-3.5 py-2 text-[11px] font-bold text-white hover:bg-rose-700 shadow-2xs shrink-0"
                >
                  Approve & Erase
                </button>
              </div>
            </div>
          )}

          {/* Account Governance Suite */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <KeyRound size={16} className="text-primary" /> Platform Governance Controls (CAN-4, CAN-8)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                type="button"
                data-testid="button-action-force-verify"
                onClick={handleForceVerifyEmail}
                className="flex flex-col items-start p-3.5 rounded-xl border border-border bg-muted/10 hover:bg-muted/20 text-left transition-colors"
              >
                <UserCheck size={16} className="text-emerald-600 mb-1" />
                <span className="text-xs font-bold text-foreground">Force Verify Email</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">Bypasses verification loop</span>
              </button>

              <button
                type="button"
                data-testid="button-action-password-reset"
                onClick={handleSendPasswordReset}
                className="flex flex-col items-start p-3.5 rounded-xl border border-border bg-muted/10 hover:bg-muted/20 text-left transition-colors"
              >
                <KeyRound size={16} className="text-violet-600 mb-1" />
                <span className="text-xs font-bold text-foreground">Reset Password</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">Dispatches tokenized email</span>
              </button>

              <button
                type="button"
                data-testid="button-action-export-json"
                onClick={handleExportDataArchive}
                className="flex flex-col items-start p-3.5 rounded-xl border border-border bg-muted/10 hover:bg-muted/20 text-left transition-colors"
              >
                <Download size={16} className="text-primary mb-1" />
                <span className="text-xs font-bold text-foreground">Download Archive</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">GDPR/DPDP Art. 15 export</span>
              </button>

              <button
                type="button"
                data-testid="button-action-toggle-suspend"
                onClick={handleToggleSuspend}
                className="flex flex-col items-start p-3.5 rounded-xl border border-border bg-muted/10 hover:bg-muted/20 text-left transition-colors"
              >
                <ShieldAlert size={16} className="text-rose-600 mb-1" />
                <span className="text-xs font-bold text-foreground">
                  {candidate.status === 'Suspended' ? 'Reactivate' : 'Suspend Account'}
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5">Modifies platform access</span>
              </button>
            </div>
          </div>

          {/* Linked OAuth Providers (CAN-19) */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Globe size={16} className="text-primary" /> Linked Authentication Providers (CAN-19)
            </h2>
            <div className="space-y-3">
              {candidate.linkedOAuthAccounts && candidate.linkedOAuthAccounts.length > 0 ? (
                candidate.linkedOAuthAccounts.map((oa) => (
                  <div key={oa.provider} className="rounded-xl border border-border p-3.5 flex items-center justify-between bg-muted/10">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-card border border-border font-bold text-xs text-foreground">
                        {oa.provider[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground">{oa.provider} SSO</div>
                        <div className="text-[11px] text-muted-foreground font-mono">{oa.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[9px] font-bold">
                        {oa.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setActionModal({
                            title: `Unlink ${oa.provider} Provider?`,
                            subtitle: `Removing this OAuth connection will require ${candidate.name} to authenticate via primary email.`,
                            actionText: 'Unlink Provider',
                            tone: 'rose',
                            onConfirm: () => {
                              setCandidatesList((prev) =>
                                prev.map((c) =>
                                  c.id === candidate.id
                                    ? {
                                        ...c,
                                        linkedOAuthAccounts: (c.linkedOAuthAccounts || []).filter(
                                          (acc) => acc.provider !== oa.provider
                                        ),
                                        auditLog: [
                                          {
                                            action: `OAuth provider disconnected: ${oa.provider} SSO (Account unlinked by admin)`,
                                            timestamp: 'Just now',
                                            actor: 'Admin: Rahul Sharma (Super Admin)',
                                          },
                                          ...(c.auditLog || []),
                                        ],
                                      }
                                    : c
                                )
                              );
                            },
                          });
                        }}
                        className="rounded-lg border border-border bg-card px-2.5 py-1 text-[10px] font-bold text-muted-foreground hover:text-foreground"
                      >
                        Unlink
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                  No third-party OAuth providers currently linked to this candidate account.
                </div>
              )}
            </div>
          </div>

          {/* Internal Staff Notes */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <MessageSquare size={16} className="text-primary" /> Internal Staff Casework Notes (CAN-4)
            </h2>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  data-testid="input-new-staff-note"
                  value={newStaffNote}
                  onChange={(e) => setNewStaffNote(e.target.value)}
                  placeholder="Add confidential internal admin note regarding this candidate…"
                  className="h-9 flex-1 rounded-xl border border-border bg-card px-3 text-xs font-medium text-foreground outline-none focus:border-primary"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddStaffNote();
                  }}
                />
                <button
                  type="button"
                  data-testid="button-add-staff-note"
                  onClick={handleAddStaffNote}
                  className="rounded-xl bg-primary px-3.5 py-2 text-[11px] font-bold text-white hover:opacity-90 shadow-2xs"
                >
                  Add Note
                </button>
              </div>

              {candidate.staffNotes && candidate.staffNotes.length > 0 ? (
                <div className="space-y-2 pt-1">
                  {candidate.staffNotes.map((note) => (
                    <div key={note.id} className="rounded-xl border border-border p-3 bg-muted/20 text-xs">
                      <div className="text-foreground">{note.note}</div>
                      <div className="text-[10px] text-muted-foreground mt-1 flex items-center justify-between">
                        <span>Author: {note.author}</span>
                        <span>{note.createdAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic py-1">No internal staff notes on file.</p>
              )}
            </div>
          </div>

          {/* Security Login History */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Clock size={16} className="text-primary" /> Recent Authentication & Session Activity
            </h2>
            <div className="space-y-2">
              {(candidate.loginHistory || [
                { id: 'lh-1', timestamp: 'Today, 10:14 AM', ipAddress: '49.207.214.12', device: 'Chrome 128 / macOS 15.0', location: 'Bengaluru, India' },
              ]).map((log) => (
                <div key={log.id} className="flex items-center justify-between rounded-xl border border-border p-3 bg-muted/10 text-xs">
                  <div>
                    <span className="font-semibold text-foreground">{log.device}</span>
                    <div className="text-[10px] text-muted-foreground font-mono">IP: {log.ipAddress} · {log.location}</div>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Immutable Security Audit Trail */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary" /> Candidate Security Audit Log
            </h2>
            <div className="space-y-2">
              {candidate.auditLog?.map((log, index) => (
                <div key={index} className="flex items-start justify-between rounded-xl border border-border p-3 bg-muted/10 text-xs gap-3">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-foreground">{log.action}</span>
                    <div className="text-[10px] text-muted-foreground">Actor: {log.actor}</div>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 🔴 CRITICAL SECURITY MODAL: PII UNMASK JUSTIFICATION     */}
      {/* ======================================================== */}
      <Modal
        isOpen={unmaskModalOpen}
        onClose={() => {
          setUnmaskModalOpen(false);
          setUnmaskJustification('');
          setUnmaskError('');
        }}
        title="Unmask Candidate Personal Contact Info (AUTH-5 / DPDP)"
        subtitle="Under DPDP Act 2023 & GDPR compliance policies, accessing unmasked personal contact details requires a verified casework justification. This event is permanently recorded in the immutable security audit trail."
        dataTestId="modal-unmask-pii-justification"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => {
                setUnmaskModalOpen(false);
                setUnmaskJustification('');
                setUnmaskError('');
              }}
              className="rounded-xl border border-border px-4 py-2 text-[11px] font-bold text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              data-testid="button-confirm-unmask-submit"
              onClick={handleConfirmUnmask}
              disabled={unmaskJustification.trim().length < 5}
              className="rounded-xl bg-primary px-4 py-2 text-[11px] font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm &amp; Log Unmask
            </button>
          </div>
        }
      >
        <div className="space-y-3 py-2">
          <div>
            <label className="text-[11px] font-bold text-foreground block mb-1">
              Casework Justification <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              data-testid="textarea-unmask-justification"
              value={unmaskJustification}
              onChange={(e) => {
                setUnmaskJustification(e.target.value);
                if (unmaskError) setUnmaskError('');
              }}
              placeholder="e.g., Investigating candidate support ticket JR-C10451 regarding interview scheduling conflict with Northstar Labs..."
              className={`w-full rounded-xl border p-3 text-xs font-medium text-foreground outline-none focus:border-primary resize-none ${
                unmaskError ? 'border-rose-400 bg-rose-50/20' : 'border-border bg-card'
              }`}
            />
            {unmaskError && (
              <p className="text-[10px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                <AlertCircle size={11} /> {unmaskError}
              </p>
            )}
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-3 text-[11px] text-muted-foreground space-y-1">
            <div className="text-foreground font-bold">Audit Registration Parameters:</div>
            <div>• Active Auditor: <strong>Admin: Rahul Sharma (Super Admin)</strong></div>
            <div>• Target Subject: <strong>{candidate.name} (ID: {candidate.id})</strong></div>
            <div>• DPDP Registry Purpose: <strong>Statutory Identity Verification &amp; Casework</strong></div>
          </div>
        </div>
      </Modal>

      {/* ======================================================== */}
      {/* MERGE CANDIDATE MODAL (CAN-6)                            */}
      {/* ======================================================== */}
      <Modal
        isOpen={mergeModalOpen}
        onClose={() => setMergeModalOpen(false)}
        title="Consolidate Duplicate Candidate Records"
        subtitle={`Merge identified secondary duplicate account into canonical profile ${candidate.name} (${candidate.id}).`}
        dataTestId="modal-merge-candidate"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setMergeModalOpen(false)}
              className="rounded-xl border border-border px-4 py-2 text-[11px] font-bold text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              data-testid="button-confirm-merge-candidate"
              onClick={handleMergeCandidate}
              className="rounded-xl bg-primary px-4 py-2 text-[11px] font-bold text-white shadow-sm hover:opacity-90"
            >
              Consolidate Profiles
            </button>
          </div>
        }
      >
        <div className="space-y-3 py-2">
          <div>
            <label className="text-[11px] font-bold text-foreground block mb-1">
              Secondary Duplicate Candidate ID
            </label>
            <input
              type="text"
              data-testid="input-merge-target-id"
              value={mergeTargetId}
              onChange={(e) => setMergeTargetId(e.target.value)}
              placeholder="e.g. can-1094"
              className="h-10 w-full rounded-xl border border-border bg-card px-3 text-xs font-medium text-foreground outline-none focus:border-primary"
            />
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900 leading-relaxed">
            Consolidating will re-point all application records, resumes, and interview rooms to <strong>{candidate.id}</strong>. The secondary account will be marked as merged and archived.
          </div>
        </div>
      </Modal>

      {/* ======================================================== */}
      {/* GENERIC ACTION / CONFIRMATION MODAL                      */}
      {/* ======================================================== */}
      <Modal
        isOpen={Boolean(actionModal)}
        onClose={() => setActionModal(null)}
        title={actionModal?.title}
        subtitle={actionModal?.subtitle}
        dataTestId="modal-action-confirm"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setActionModal(null)}
              className="rounded-xl border border-border px-4 py-2 text-[11px] font-bold text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              data-testid="button-confirm-modal-action"
              onClick={() => {
                actionModal?.onConfirm?.();
                setActionModal(null);
              }}
              className={`rounded-xl px-4 py-2 text-[11px] font-bold text-white shadow-sm transition hover:opacity-90 ${
                actionModal?.tone === 'rose'
                  ? 'bg-rose-600'
                  : actionModal?.tone === 'amber'
                  ? 'bg-amber-600'
                  : actionModal?.tone === 'green'
                  ? 'bg-emerald-600'
                  : 'bg-primary'
              }`}
            >
              {actionModal?.actionText}
            </button>
          </div>
        }
      />
    </div>
  );
}
