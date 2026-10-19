import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Globe,
  FileCheck,
  Users,
  Briefcase,
  CreditCard,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  FileText,
  Eye,
  Calendar,
  Layers,
  MapPin,
  Crop,
  Image,
  GitMerge,
  UserPlus,
  UserMinus,
  RefreshCw,
  AlertTriangle,
  MessageSquare,
  Clock,
  Send,
  Shield,
  Lock,
  Phone,
  Mail,
} from 'lucide-react';
import { adminEmployers, type AdminEmployer, type EmployerDocument } from '@/mock-data';
import { Avatar, StatusPill, Modal } from '@/components/ui';

export function EmployerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [employersList, setEmployersList] = useState<AdminEmployer[]>(adminEmployers);
  const [previewDoc, setPreviewDoc] = useState<EmployerDocument | null>(null);

  // Logo Moderation State (EMP-4)
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [logoDecisionReason, setLogoDecisionReason] = useState('');

  // Duplicate Employer Merge State (EMP-6)
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [survivingEmployerId, setSurvivingEmployerId] = useState<string>('');

  // Recruiter Seat Controls State (EMP-7)
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Recruiter');
  const [adjustQuotaModalOpen, setAdjustQuotaModalOpen] = useState(false);
  const [newQuotaValue, setNewQuotaValue] = useState(5);

  // Persistent Staff Casework Notes (EMP-15)
  const [staffNoteInput, setStaffNoteInput] = useState('');

  // Chronological Audit Trail (EMP-13)
  const [auditNoteInput, setAuditNoteInput] = useState('');

  // Center Confirmation/Action Modal
  const [actionModal, setActionModal] = useState<{
    title: string;
    subtitle: string;
    actionText: string;
    tone: string;
    onConfirm?: () => void;
  } | null>(null);

  // Employer Primary Contact PII Masking & Unmask Workflow (EMP-8 / XMOD-3)
  const [isContactPiiUnmasked, setIsContactPiiUnmasked] = useState(false);
  const [unmaskContactModalOpen, setUnmaskContactModalOpen] = useState(false);
  const [unmaskContactJustification, setUnmaskContactJustification] = useState('');
  const [unmaskContactError, setUnmaskContactError] = useState('');

  const handleConfirmContactUnmask = () => {
    const trimmed = unmaskContactJustification.trim();
    if (!trimmed || trimmed.length < 5) {
      setUnmaskContactError('A valid business justification (min 5 characters) is required under DPDP Act 2023.');
      return;
    }
    const auditRecord = {
      id: `aud-pii-${Date.now()}`,
      date: 'Just now',
      actor: 'Super Admin Anita',
      action: 'Authorized Contact PII Unmask',
      reason: `Unmasked primary employer contact details. Casework reason: "${trimmed}"`,
    };
    setEmployersList((prev) =>
      prev.map((e) =>
        e.id === employer.id
          ? {
              ...e,
              auditLog: [auditRecord, ...(e.auditLog || [])],
            }
          : e
      )
    );
    setIsContactPiiUnmasked(true);
    setUnmaskContactModalOpen(false);
    setUnmaskContactJustification('');
    setUnmaskContactError('');
  };

  const employer = employersList.find((e) => e.id === id) || employersList[0];

  if (!employer) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/employers"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Back to Employers
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-base font-bold text-foreground">Employer not found</h2>
          <p className="text-xs text-muted-foreground mt-1">No employer matching ID "{id}".</p>
        </div>
      </div>
    );
  }

  const docsCount = employer.documents?.length || 0;
  const teamCount = employer.teamMembers?.length || 0;
  const jobsCount = employer.jobs || 0;

  const duplicateSignalItem = Array.isArray(employer.duplicateSignals)
    ? employer.duplicateSignals[0]
    : employer.duplicateSignals;
  const duplicateScore = duplicateSignalItem?.matchConfidence ?? (duplicateSignalItem as any)?.similarityScore ?? 94;
  const duplicateReasons = duplicateSignalItem?.matchedField
    ? [duplicateSignalItem.matchedField]
    : (duplicateSignalItem as any)?.reasons || ['CIN / Domain registration match'];
  const duplicateTargetId = duplicateSignalItem?.targetId || (duplicateSignalItem as any)?.potentialDuplicateEmployerId || 'emp-2005';

  const handleApprove = () => {
    setActionModal({
      title: 'Approve Employer Account?',
      subtitle: `Mark ${employer.company} as Verified. This grants full marketplace posting privileges and issues a Verified Employer badge.`,
      actionText: 'Approve & Verify',
      tone: 'emerald',
      onConfirm: () => {
        setEmployersList((prev) =>
          prev.map((e) => (e.id === employer.id ? { ...e, verification: 'Verified' } : e))
        );
      },
    });
  };

  const handleReject = () => {
    setActionModal({
      title: 'Reject Employer Verification?',
      subtitle: `Reject verification for ${employer.company}. The employer will receive instructions to resubmit valid statutory incorporation documentation.`,
      actionText: 'Reject Verification',
      tone: 'rose',
      onConfirm: () => {
        setEmployersList((prev) =>
          prev.map((e) => (e.id === employer.id ? { ...e, verification: 'Rejected' } : e))
        );
      },
    });
  };

  const handleRequestInfo = () => {
    setActionModal({
      title: 'Request Additional Documents?',
      subtitle: `Ask ${employer.company} to provide additional documentation regarding their GSTIN and MCA business filing.`,
      actionText: 'Send Information Request',
      tone: 'amber',
      onConfirm: () => {
        setEmployersList((prev) =>
          prev.map((e) => (e.id === employer.id ? { ...e, verification: 'Need info' } : e))
        );
      },
    });
  };

  const handleSuspend = () => {
    setActionModal({
      title: 'Suspend Employer Account?',
      subtitle: `Are you sure you want to suspend ${employer.company}? All active job postings will be paused and candidate applications halted.`,
      actionText: 'Suspend Employer',
      tone: 'rose',
      onConfirm: () => {
        setEmployersList((prev) =>
          prev.map((e) => (e.id === employer.id ? { ...e, status: 'Suspended' } : e))
        );
      },
    });
  };

  // EMP-14: KYC Re-verification trigger
  const handleTriggerKYC = () => {
    setActionModal({
      title: 'Trigger KYC Re-verification Workflow?',
      subtitle: `Initiate a mandatory KYC re-verification cycle for ${employer.company}. The employer will receive an official notification requiring updated statutory incorporation and GSTIN filing documents within 14 days.`,
      actionText: 'Initiate KYC Re-verification',
      tone: 'amber',
      onConfirm: () => {
        const auditRecord = {
          id: `aud-${Date.now()}`,
          date: 'Just now',
          actor: 'Super Admin Anita',
          action: 'Triggered KYC Re-verification',
          reason: 'Periodic statutory compliance review pursuant to DPDP guidelines',
        };
        setEmployersList((prev) =>
          prev.map((e) =>
            e.id === employer.id
              ? {
                  ...e,
                  verification: 'Need info',
                  auditLog: [auditRecord, ...(e.auditLog || [])],
                }
              : e
          )
        );
      },
    });
  };

  // EMP-4: Logo Moderation & Crop
  const handleModerateLogo = (decision: 'Approved' | 'Rejected') => {
    const auditRecord = {
      id: `aud-${Date.now()}`,
      date: 'Just now',
      actor: 'Brand Safety Moderator Anita',
      action: `Logo ${decision}`,
      reason: logoDecisionReason || (decision === 'Approved' ? 'Logo satisfies brand guidelines' : 'Logo failed brand safety checks'),
    };
    setEmployersList((prev) =>
      prev.map((e) =>
        e.id === employer.id
          ? {
              ...e,
              logoStatus: decision,
              auditLog: [auditRecord, ...(e.auditLog || [])],
            }
          : e
      )
    );
    setLogoModalOpen(false);
    setLogoDecisionReason('');
  };

  // EMP-6: Duplicate Detection & Merge
  const handleOpenDuplicateMerge = () => {
    setSurvivingEmployerId(employer.id);
    setDuplicateModalOpen(true);
  };

  const handleConfirmMerge = () => {
    const duplicateTarget = employer.duplicateSignals
      ? employersList.find((e) => e.id === duplicateTargetId)
      : null;

    if (!duplicateTarget) {
      setDuplicateModalOpen(false);
      return;
    }

    const isCurrentSurviving = survivingEmployerId === employer.id;
    const surviving = isCurrentSurviving ? employer : duplicateTarget;
    const absorbed = isCurrentSurviving ? duplicateTarget : employer;

    // Consolidate non-destructively: merge team members, aggregate jobs, archive absorbed record
    const mergedTeam = [
      ...(surviving.teamMembers || []),
      ...(absorbed.teamMembers || []).filter(
        (atm) => !(surviving.teamMembers || []).some((stm) => stm.email === atm.email)
      ),
    ];
    const consolidatedJobs = (surviving.jobs || 0) + (absorbed.jobs || 0);

    const auditRecord = {
      id: `aud-${Date.now()}`,
      date: 'Just now',
      actor: 'Super Admin Anita',
      action: 'Merged Duplicate Employer Account',
      reason: `Consolidated account ${absorbed.company} (${absorbed.id}) into ${surviving.company} (${surviving.id})`,
    };

    setEmployersList((prev) =>
      prev.map((e) => {
        if (e.id === surviving.id) {
          return {
            ...e,
            jobs: consolidatedJobs,
            teamMembers: mergedTeam,
            duplicateSignals: undefined,
            auditLog: [auditRecord, ...(e.auditLog || [])],
          };
        }
        if (e.id === absorbed.id) {
          return {
            ...e,
            status: 'Suspended',
            company: `${e.company} (Merged into ${surviving.id})`,
            duplicateSignals: undefined,
            auditLog: [
              {
                id: `aud-${Date.now()}-abs`,
                date: 'Just now',
                actor: 'Super Admin Anita',
                action: 'Account Merged & Archived',
                reason: `Consolidated into surviving canonical account ${surviving.id}`,
              },
              ...(e.auditLog || []),
            ],
          };
        }
        return e;
      })
    );

    setDuplicateModalOpen(false);
  };

  // EMP-7: Recruiter Seat Controls
  const handleInviteMember = () => {
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    const newMember = {
      id: `tm-${Date.now().toString().slice(-4)}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      status: 'Active',
    };
    const auditRecord = {
      id: `aud-${Date.now()}`,
      date: 'Just now',
      actor: 'Super Admin Anita',
      action: `Invited Team Member: ${newMember.name} (${newMember.role})`,
      reason: 'Recruiter seat provisioned',
    };
    setEmployersList((prev) =>
      prev.map((e) =>
        e.id === employer.id
          ? {
              ...e,
              teamMembers: [...(e.teamMembers || []), newMember],
              auditLog: [auditRecord, ...(e.auditLog || [])],
            }
          : e
      )
    );
    setInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
    setInviteRole('Recruiter');
  };

  const handleRevokeSeat = (memberId: string, memberName: string) => {
    setActionModal({
      title: `Revoke Seat for ${memberName}?`,
      subtitle: `Are you sure you want to revoke recruiter seat access for ${memberName}? Their login credentials will be invalidated immediately.`,
      actionText: 'Confirm Revocation',
      tone: 'rose',
      onConfirm: () => {
        const auditRecord = {
          id: `aud-${Date.now()}`,
          date: 'Just now',
          actor: 'Super Admin Anita',
          action: `Revoked Recruiter Seat: ${memberName}`,
          reason: 'Staff seat reclaimed',
        };
        setEmployersList((prev) =>
          prev.map((e) =>
            e.id === employer.id
              ? {
                  ...e,
                  teamMembers: (e.teamMembers || []).filter((m) => m.id !== memberId),
                  auditLog: [auditRecord, ...(e.auditLog || [])],
                }
              : e
          )
        );
      },
    });
  };

  const handleTransferOwnership = (newOwnerId: string, newOwnerName: string) => {
    setActionModal({
      title: `Transfer Account Ownership to ${newOwnerName}?`,
      subtitle: `Make ${newOwnerName} the primary billing and legal administrative owner of ${employer.company}.`,
      actionText: 'Transfer Ownership',
      tone: 'emerald',
      onConfirm: () => {
        const auditRecord = {
          id: `aud-${Date.now()}`,
          date: 'Just now',
          actor: 'Super Admin Anita',
          action: `Transferred Primary Ownership to ${newOwnerName}`,
          reason: 'Administrative ownership reassigned',
        };
        setEmployersList((prev) =>
          prev.map((e) =>
            e.id === employer.id
              ? {
                  ...e,
                  teamMembers: (e.teamMembers || []).map((m) => ({
                    ...m,
                    role: m.id === newOwnerId ? 'Admin (Owner)' : m.role === 'Admin (Owner)' ? 'Recruiter' : m.role,
                  })),
                  auditLog: [auditRecord, ...(e.auditLog || [])],
                }
              : e
          )
        );
      },
    });
  };

  const handleAdjustQuota = () => {
    const auditRecord = {
      id: `aud-${Date.now()}`,
      date: 'Just now',
      actor: 'Super Admin Anita',
      action: `Adjusted Recruiter Seat Quota to ${newQuotaValue}`,
      reason: 'Plan entitlement adjusted by administrator',
    };
    setEmployersList((prev) =>
      prev.map((e) =>
        e.id === employer.id
          ? {
              ...e,
              seatQuota: newQuotaValue,
              auditLog: [auditRecord, ...(e.auditLog || [])],
            }
          : e
      )
    );
    setAdjustQuotaModalOpen(false);
  };

  // EMP-15: Persistent Staff Notes
  const handleAddStaffNote = () => {
    if (!staffNoteInput.trim()) return;
    const newNote = {
      id: `not-${Date.now().toString().slice(-4)}`,
      author: 'Super Admin Anita',
      timestamp: 'Just now',
      text: staffNoteInput.trim(),
    };
    setEmployersList((prev) =>
      prev.map((e) =>
        e.id === employer.id
          ? {
              ...e,
              staffNotes: [newNote, ...(e.staffNotes || [])],
            }
          : e
      )
    );
    setStaffNoteInput('');
  };

  // EMP-13: Add Audit Note
  const handleAddAuditNote = () => {
    if (!auditNoteInput.trim()) return;
    const newAudit = {
      id: `aud-${Date.now()}`,
      date: 'Just now',
      actor: 'Super Admin Anita',
      action: 'Administrative Audit Note',
      reason: auditNoteInput.trim(),
    };
    setEmployersList((prev) =>
      prev.map((e) =>
        e.id === employer.id
          ? {
              ...e,
              auditLog: [newAudit, ...(e.auditLog || [])],
            }
          : e
      )
    );
    setAuditNoteInput('');
  };

  return (
    <div className="space-y-6">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/employers"
          data-testid="link-back-to-employers"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          Back to Employers
        </Link>
        <span className="text-[10px] font-mono text-muted-foreground">Employer ID: {employer.id}</span>
      </div>

      {/* Main Header Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative group">
              <Avatar name={employer.company} />
              {employer.logoStatus && (
                <span
                  className={`absolute -bottom-1 -right-1 rounded-full px-1.5 py-0.2 text-[8px] font-extrabold border ${
                    employer.logoStatus === 'Approved'
                      ? 'bg-emerald-500 text-white border-white'
                      : employer.logoStatus === 'Rejected'
                      ? 'bg-rose-500 text-white border-white'
                      : 'bg-amber-500 text-white border-white'
                  }`}
                  title={`Logo Status: ${employer.logoStatus}`}
                >
                  {employer.logoStatus === 'Approved' ? '✓' : '!'}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl truncate">
                  {employer.company}
                </h1>
                <StatusPill value={employer.verification} />
                <StatusPill value={employer.status} />
                {employer.logoStatus && (
                  <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    Logo: {employer.logoStatus}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-1 truncate">
                <span>{employer.industry || 'Technology'}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} className="text-muted-foreground" />
                  {employer.location}
                </span>
                <span>·</span>
                <span>Joined {employer.joined}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              data-testid="button-open-logo-moderation"
              onClick={() => setLogoModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-[11px] font-bold text-foreground hover:bg-muted transition-colors shadow-2xs"
            >
              <Crop size={14} className="text-primary" /> Review & Crop Logo
            </button>
            <button
              type="button"
              data-testid="button-suspend-employer"
              onClick={handleSuspend}
              className="flex items-center gap-1.5 rounded-xl bg-rose-50 border border-rose-200/80 px-3.5 py-2 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition-colors shadow-2xs"
            >
              <ShieldAlert size={14} /> Suspend Account
            </button>
            <button
              type="button"
              data-testid="button-view-as-employer"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('jobrisers-view-as-user', {
                    detail: {
                      id: employer.id,
                      name: employer.company,
                      email: employer.teamMembers?.[0]?.email || 'recruiter@' + employer.company.toLowerCase().replace(/\s+/g, '') + '.com',
                      role: 'Employer',
                    },
                  })
                );
              }}
              className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2 text-[11px] font-bold text-primary hover:bg-primary/20 transition-colors shadow-2xs cursor-pointer"
            >
              <Eye size={14} /> View as Recruiter (AUTH-7)
            </button>
          </div>
        </div>
      </div>

      {/* Duplicate Employer Detection Alert Banner (EMP-6) */}
      {employer.duplicateSignals && (
        <div
          data-testid="banner-duplicate-employer"
          className="rounded-2xl border border-amber-300 bg-amber-50/80 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in"
        >
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <AlertTriangle size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900 flex items-center gap-2">
                <span>Potential Duplicate Account Detected ({duplicateScore}% Match)</span>
                <span className="rounded bg-amber-200/80 px-1.5 py-0.2 text-[9px] font-bold text-amber-900">EMP-6</span>
              </div>
              <div className="text-[11px] text-amber-800/90 mt-0.5">
                Duplicate signals: {duplicateReasons.join(' · ')} · Match ID: {duplicateTargetId}
              </div>
            </div>
          </div>
          <button
            type="button"
            data-testid="button-open-duplicate-merge"
            onClick={handleOpenDuplicateMerge}
            className="flex items-center gap-1.5 rounded-xl bg-amber-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-amber-800 transition-colors shrink-0 shadow-2xs"
          >
            <GitMerge size={14} /> Review & Merge
          </button>
        </div>
      )}

      {/* 1. Quick Stats Strip */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Active Jobs
          </div>
          <div className="font-display text-lg font-extrabold text-foreground">
            {jobsCount} Listings
          </div>
          <div className="text-[10px] text-muted-foreground">Live marketplace posts</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Workforce Size
          </div>
          <div className="font-display text-lg font-extrabold text-foreground">
            {employer.size || '51-200'}
          </div>
          <div className="text-[10px] text-muted-foreground">Reported employee count</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Plan Tier
          </div>
          <div className="font-display text-lg font-extrabold text-foreground truncate">
            {employer.subscriptionStanding?.plan || employer.plan || 'Standard'}
          </div>
          <div className="text-[10px] text-muted-foreground">Active monetization</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Standing
          </div>
          <div className="font-display text-lg font-extrabold text-foreground truncate">
            {employer.verification}
          </div>
          <div className="text-[10px] text-muted-foreground">{docsCount} Docs reviewed</div>
        </div>
      </section>

      {/* 2. Verification Decisions Banner */}
      <section className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/20 p-5 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Verification Decisions
            </h3>
          </div>
          <span className="text-[11px] font-medium text-muted-foreground">
            Current Status: <strong className="text-foreground">{employer.verification}</strong>
          </span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Verify corporate registration, MCA incorporation filings, and tax records before granting full hiring privileges.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
          <button
            type="button"
            data-testid="button-approve-employer"
            onClick={handleApprove}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-[11px] font-bold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
          >
            <CheckCircle2 size={14} /> Approve Verification
          </button>
          <button
            type="button"
            data-testid="button-reject-employer"
            onClick={handleReject}
            className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-[11px] font-bold text-white hover:bg-rose-700 transition-colors shadow-2xs"
          >
            <XCircle size={14} /> Reject
          </button>
          <button
            type="button"
            data-testid="button-request-info-employer"
            onClick={handleRequestInfo}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-[11px] font-bold text-foreground hover:bg-muted transition-colors"
          >
            <HelpCircle size={14} className="text-amber-600" /> Request Information
          </button>
          <button
            type="button"
            data-testid="button-trigger-kyc"
            onClick={handleTriggerKYC}
            className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-[11px] font-bold text-amber-800 hover:bg-amber-100 transition-colors shadow-2xs ml-auto"
          >
            <RefreshCw size={13} /> Trigger KYC Re-verification
          </button>
        </div>
      </section>

      {/* 3. Company Profile & Registration */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Building2 size={15} className="text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Company Profile & Credentials
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="rounded-xl bg-muted/30 p-3 border border-border/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Primary Contact</span>
              {!isContactPiiUnmasked ? (
                <button
                  type="button"
                  data-testid="button-unmask-employer-pii"
                  onClick={() => setUnmaskContactModalOpen(true)}
                  className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary hover:bg-primary/20 transition-colors shadow-2xs"
                >
                  <Lock size={10} /> Unmask PII
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700">
                    <ShieldCheck size={10} /> Unmasked
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsContactPiiUnmasked(false)}
                    className="text-[9px] text-muted-foreground hover:text-foreground underline ml-1"
                  >
                    Re-mask
                  </button>
                </div>
              )}
            </div>
            <div className="font-semibold text-foreground text-xs truncate">{employer.name}</div>
            <div className="text-[10px] text-muted-foreground font-mono truncate mt-0.5">
              {isContactPiiUnmasked
                ? employer.emailFull || `${employer.name.toLowerCase().replace(/[^a-z0-9]+/g, '.')}@${employer.company.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com`
                : employer.emailMasked}
            </div>
            <div className="text-[10px] text-muted-foreground font-mono truncate mt-0.5">
              {isContactPiiUnmasked
                ? (employer.phoneMasked ? employer.phoneMasked.replace('****', '4912') : '+91 22 4891 4912')
                : (employer.phoneMasked || '+91 22 4891 ****')}
            </div>
          </div>
          <div className="rounded-xl bg-muted/30 p-3 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">CIN / Reg No</span>
            <div className="font-mono font-semibold text-foreground mt-0.5 text-[11px] truncate">
              {employer.cin || 'U72900KA2021PTC'}
            </div>
          </div>
          <div className="rounded-xl bg-muted/30 p-3 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">GSTIN</span>
            <div className="font-mono font-semibold text-foreground mt-0.5 text-[11px] truncate">
              {employer.gst || '29ABCDE1234F1Z5'}
            </div>
          </div>
          <div className="rounded-xl bg-muted/30 p-3 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Industry</span>
            <div className="font-semibold text-foreground mt-0.5">{employer.industry || 'Technology'}</div>
          </div>
          <div className="rounded-xl bg-muted/30 p-3 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Headquarters</span>
            <div className="font-semibold text-foreground mt-0.5">{employer.location}</div>
          </div>
          <div className="rounded-xl bg-muted/30 p-3 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Member Since</span>
            <div className="font-semibold text-foreground mt-0.5">{employer.joined}</div>
          </div>
        </div>

        {employer.website && (
          <div className="flex items-center gap-2 pt-1 text-xs">
            <Globe size={14} className="text-muted-foreground" />
            <a
              href={employer.website}
              target="_blank"
              rel="noreferrer"
              className="text-primary font-medium hover:underline inline-flex items-center gap-1"
            >
              {employer.website} <ExternalLink size={12} />
            </a>
          </div>
        )}

        {employer.about && (
          <div className="rounded-xl bg-muted/30 p-3.5 border border-border/60 text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Company Overview: </span>
            {employer.about}
          </div>
        )}
      </section>

      {/* 4. Verification Documents */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck size={15} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Verification Documents ({docsCount})
            </h3>
          </div>
          <span className="text-[10px] text-muted-foreground">Statutory records</span>
        </div>

        {employer.documents && employer.documents.length > 0 ? (
          <div className="space-y-2.5">
            {employer.documents.map((doc) => (
              <div
                key={doc.id}
                className="rounded-xl border border-border/70 bg-muted/20 p-3 flex items-center justify-between gap-3 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-foreground truncate">{doc.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {doc.type} · {doc.uploadDate} · {doc.size}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
                      doc.status === 'Verified'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : doc.status === 'Rejected'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {doc.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewDoc(previewDoc?.id === doc.id ? null : doc)}
                    aria-label={`Preview document ${doc.name}`}
                    className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">No verification documents uploaded yet.</p>
        )}

        {previewDoc && (
          <div className="rounded-xl border border-primary/30 bg-primary/[0.03] p-4 space-y-2 mt-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                <FileCheck size={13} className="text-primary" /> Certificate: {previewDoc.name}
              </span>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="text-[10px] font-bold text-muted-foreground hover:text-foreground"
              >
                Close Preview
              </button>
            </div>
            <div className="rounded-xl bg-card p-3 border border-border text-[11px] space-y-1">
              <div><strong>Document Type:</strong> {previewDoc.type}</div>
              <div><strong>Upload Timestamp:</strong> {previewDoc.uploadDate}</div>
              <div><strong>Verification Status:</strong> {previewDoc.status}</div>
              <div className="font-mono text-[10px] text-muted-foreground pt-0.5">
                Digital Hash: SHA256: 9b2d8f...41ae (Verified MCA Seal)
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5. Team & Recruiter Seats (EMP-7) */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users size={15} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Team & Recruiter Seats ({(employer.teamMembers || []).length} / {employer.seatQuota || 5} Allocated)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="button-open-adjust-quota"
              onClick={() => {
                setNewQuotaValue(employer.seatQuota || 5);
                setAdjustQuotaModalOpen(true);
              }}
              className="rounded-xl border border-border bg-card px-3 py-1.5 text-[11px] font-bold text-foreground hover:bg-muted transition-colors shadow-2xs"
            >
              Adjust Quota
            </button>
            <button
              type="button"
              data-testid="button-open-invite-member"
              onClick={() => setInviteModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-[11px] font-bold text-white hover:opacity-90 transition-opacity shadow-2xs"
            >
              <UserPlus size={13} /> Invite Member
            </button>
          </div>
        </div>

        <div className="divide-y divide-border/60">
          {(employer.teamMembers || []).map((member) => {
            const isOwner = member.role.includes('Owner');
            return (
              <div key={member.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={member.name} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-foreground truncate">{member.name}</span>
                      {isOwner && (
                        <span className="rounded-md bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.2 text-[9px] font-extrabold">
                          Account Owner
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate">{member.role} · {member.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
                      member.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {member.status}
                  </span>
                  {!isOwner && (
                    <>
                      <button
                        type="button"
                        data-testid={`button-transfer-owner-${member.id}`}
                        onClick={() => handleTransferOwnership(member.id, member.name)}
                        className="rounded-lg border border-border px-2 py-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        Make Owner
                      </button>
                      <button
                        type="button"
                        data-testid={`button-revoke-seat-${member.id}`}
                        onClick={() => handleRevokeSeat(member.id, member.name)}
                        className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-[10px] font-bold text-rose-700 hover:bg-rose-100 transition-colors"
                      >
                        Revoke
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Active / Related Job Listings */}
      {employer.relatedJobs && employer.relatedJobs.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Briefcase size={15} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Related Job Listings ({employer.relatedJobs.length})
            </h3>
          </div>
          <div className="space-y-2.5">
            {employer.relatedJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-xl border border-border/70 bg-muted/20 p-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-foreground truncate">{job.title}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {job.location} · {job.workMode} · {job.applicants} applicants
                  </div>
                </div>
                <StatusPill value={job.status} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Subscription & Billing Standing */}
      {employer.subscriptionStanding && (
        <section className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <CreditCard size={15} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Subscription & Monetization Standing
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded-xl bg-muted/30 p-3 border border-border/50">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Plan Tier</span>
              <div className="font-bold text-foreground mt-0.5">{employer.subscriptionStanding.plan}</div>
            </div>
            <div className="rounded-xl bg-muted/30 p-3 border border-border/50">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Billing Rate</span>
              <div className="font-semibold text-foreground mt-0.5">{employer.subscriptionStanding.amount}</div>
            </div>
            <div className="rounded-xl bg-muted/30 p-3 border border-border/50">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Billing Cycle</span>
              <div className="font-semibold text-foreground mt-0.5">{employer.subscriptionStanding.billingCycle}</div>
            </div>
            <div className="rounded-xl bg-muted/30 p-3 border border-border/50">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Next Renewal</span>
              <div className="font-semibold text-foreground mt-0.5">{employer.subscriptionStanding.renewalDate}</div>
            </div>
          </div>
        </section>
      )}

      {/* 8. Persistent Staff Casework Notes (EMP-15) */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={15} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Internal Staff Casework Notes ({(employer.staffNotes || []).length})
            </h3>
          </div>
          <span className="text-[10px] text-muted-foreground">Admin-only · Not visible to employer</span>
        </div>

        {/* Add note input */}
        <div className="space-y-2">
          <textarea
            rows={3}
            data-testid="input-staff-note"
            value={staffNoteInput}
            onChange={(e) => setStaffNoteInput(e.target.value)}
            placeholder="Add internal casework note, risk assessment, or compliance remarks regarding this employer…"
            className="w-full rounded-xl border border-border bg-background p-3 text-xs outline-none focus:border-primary transition-shadow resize-none"
          />
          <div className="flex justify-end">
            <button
              type="button"
              data-testid="button-add-staff-note"
              disabled={!staffNoteInput.trim()}
              onClick={handleAddStaffNote}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50 shadow-2xs"
            >
              <Send size={13} /> Add Internal Note
            </button>
          </div>
        </div>

        {/* List of notes */}
        <div className="space-y-2 pt-2 border-t border-border/60">
          {(employer.staffNotes || []).length > 0 ? (
            (employer.staffNotes || []).map((note) => (
              <div key={note.id} className="rounded-xl bg-muted/20 border border-border/60 p-3 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-foreground">{note.author}</span>
                  <span className="text-[10px] text-muted-foreground">{note.timestamp}</span>
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed">{note.text}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground italic">No internal staff casework notes recorded yet.</p>
          )}
        </div>
      </section>

      {/* 9. Chronological Employer Audit Trail (EMP-13) */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Chronological Employer Audit Trail ({(employer.auditLog || []).length})
            </h3>
          </div>
          <span className="text-[10px] text-muted-foreground">Immutable compliance event log</span>
        </div>

        {/* Add audit entry */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            data-testid="input-audit-note"
            value={auditNoteInput}
            onChange={(e) => setAuditNoteInput(e.target.value)}
            placeholder="Add an administrative audit log note…"
            className="h-9 flex-1 rounded-xl border border-border bg-card px-3 text-xs outline-none focus:border-primary"
          />
          <button
            type="button"
            data-testid="button-add-audit-note"
            disabled={!auditNoteInput.trim()}
            onClick={handleAddAuditNote}
            className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            Log Event
          </button>
        </div>

        <div className="space-y-2 pt-1">
          {(employer.auditLog || []).length > 0 ? (
            (employer.auditLog || []).map((log) => (
              <div key={log.id} className="rounded-xl bg-muted/20 border border-border/50 p-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">{log.action}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{log.date}</span>
                </div>
                <div className="text-[11px] text-primary font-medium">Actor: {log.actor}</div>
                {log.reason && (
                  <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{log.reason}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground italic">No audit trail records logged yet.</p>
          )}
        </div>
      </section>

      {/* Confirmation / Action Center Modal */}
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
              className="rounded-xl border border-border px-4 py-2 text-[11px] font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              data-testid="button-confirm-modal-action"
              onClick={() => {
                if (actionModal?.onConfirm) actionModal.onConfirm();
                setActionModal(null);
              }}
              className={`rounded-xl px-4 py-2 text-[11px] font-bold text-white shadow-sm transition-opacity hover:opacity-90 ${
                actionModal?.tone === 'rose'
                  ? 'bg-rose-600'
                  : actionModal?.tone === 'amber'
                  ? 'bg-amber-600'
                  : 'bg-emerald-600'
              }`}
            >
              {actionModal?.actionText}
            </button>
          </div>
        }
      />

      {/* Logo Moderation & Crop Modal (EMP-4) */}
      <Modal
        isOpen={logoModalOpen}
        onClose={() => setLogoModalOpen(false)}
        eyebrow="BRAND SAFETY & MODERATION"
        title={`Review & Crop Logo for ${employer.company}`}
        subtitle="Verify company brand logo compliance. Logos must be square (1:1), high resolution, without trademark infringement or inappropriate content."
        maxWidth="max-w-[520px]"
        dataTestId="modal-logo-moderation"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setLogoModalOpen(false)}
              className="rounded-xl border border-border px-4 py-2 text-[11px] font-bold text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              data-testid="button-reject-logo"
              onClick={() => handleModerateLogo('Rejected')}
              className="rounded-xl bg-rose-600 px-4 py-2 text-[11px] font-bold text-white shadow-sm hover:bg-rose-700 transition-colors"
            >
              Reject Logo
            </button>
            <button
              type="button"
              data-testid="button-approve-logo"
              onClick={() => handleModerateLogo('Approved')}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-[11px] font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              Approve Logo
            </button>
          </div>
        }
      >
        <div className="space-y-4 py-1 text-xs">
          {/* Simulated 1:1 Crop Viewport */}
          <div className="flex items-center justify-center p-6 bg-muted/40 rounded-2xl border-2 border-dashed border-primary/30">
            <div className="relative h-32 w-32 rounded-2xl overflow-hidden border-2 border-primary bg-card shadow-md flex items-center justify-center group">
              <Avatar name={employer.company} className="h-24 w-24 text-2xl font-bold" />
              <div className="absolute inset-0 bg-primary/20 border-2 border-dashed border-white pointer-events-none flex items-center justify-center">
                <span className="text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">
                  1:1 Crop Grid
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-muted/30 p-3 text-[11px] space-y-1.5 border border-border/60">
            <div className="font-bold text-foreground">Brand Safety Moderation Checklist:</div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <CheckCircle2 size={13} /> Valid 512x512 resolution (exceeds min 200x200)
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <CheckCircle2 size={13} /> No offensive, violent, or sexually explicit content
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <CheckCircle2 size={13} /> Matches corporate registered entity name ({employer.company})
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-foreground mb-1">
              Moderation Reason / Employer Feedback:
            </label>
            <input
              type="text"
              data-testid="input-logo-reason"
              value={logoDecisionReason}
              onChange={(e) => setLogoDecisionReason(e.target.value)}
              placeholder="e.g. Logo cleared brand safety checks and square formatting criteria…"
              className="h-9 w-full rounded-xl border border-border bg-card px-3 text-xs outline-none focus:border-primary"
            />
          </div>
        </div>
      </Modal>

      {/* Duplicate Employer Merge Modal (EMP-6) */}
      <Modal
        isOpen={duplicateModalOpen}
        onClose={() => setDuplicateModalOpen(false)}
        eyebrow="DUPLICATE RESOLUTION"
        title="Consolidate Duplicate Employer Accounts"
        subtitle="Merge duplicate employer accounts side-by-side to consolidate team recruiter seats and job postings without losing relational data."
        maxWidth="max-w-[580px]"
        dataTestId="modal-duplicate-employer-merge"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setDuplicateModalOpen(false)}
              className="rounded-xl border border-border px-4 py-2 text-[11px] font-bold text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              data-testid="button-confirm-employer-merge"
              onClick={handleConfirmMerge}
              className="rounded-xl bg-primary px-4 py-2 text-[11px] font-bold text-white shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <GitMerge size={14} /> Confirm Account Merge
            </button>
          </div>
        }
      >
        <div className="space-y-4 py-1 text-xs">
          <div className="rounded-xl bg-amber-50 border border-amber-200/80 p-3 text-amber-800 text-[11px] flex items-center gap-2">
            <AlertTriangle size={15} className="shrink-0 text-amber-700" />
            <span>
              Matches detected on CIN / GSTIN filings. Select which account remains the surviving primary profile:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`rounded-xl border p-3 cursor-pointer transition-all ${
                survivingEmployerId === employer.id
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-border bg-card hover:bg-muted/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name="survivingEmployer"
                  checked={survivingEmployerId === employer.id}
                  onChange={() => setSurvivingEmployerId(employer.id)}
                  className="accent-primary"
                />
                <span className="font-bold text-[11px] text-foreground">Record A (Current)</span>
                <span className="font-mono text-[9px] text-muted-foreground ml-auto">{employer.id}</span>
              </div>
              <div className="font-semibold text-foreground truncate">{employer.company}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{employer.location} · {employer.plan}</div>
              <div className="text-[10px] text-muted-foreground mt-1 flex items-center justify-between">
                <span>Jobs: <strong>{employer.jobs}</strong> · Team: <strong>{employer.teamMembers?.length || 0}</strong></span>
                <StatusPill value={employer.verification} />
              </div>
            </label>

            <label
              className={`rounded-xl border p-3 cursor-pointer transition-all ${
                survivingEmployerId !== employer.id
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-border bg-card hover:bg-muted/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name="survivingEmployer"
                  checked={survivingEmployerId !== employer.id}
                  onChange={() => setSurvivingEmployerId(duplicateTargetId)}
                  className="accent-primary"
                />
                <span className="font-bold text-[11px] text-foreground">Record B (Duplicate)</span>
                <span className="font-mono text-[9px] text-muted-foreground ml-auto">
                  {duplicateTargetId}
                </span>
              </div>
              <div className="font-semibold text-foreground truncate">Northstar Tech Labs</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Bengaluru · Standard</div>
              <div className="text-[10px] text-muted-foreground mt-1 flex items-center justify-between">
                <span>Jobs: <strong>2</strong> · Team: <strong>1</strong></span>
                <StatusPill value="Under review" />
              </div>
            </label>
          </div>

          <div className="rounded-xl bg-muted/40 p-3 text-[11px] text-muted-foreground space-y-1">
            <div className="font-semibold text-foreground">Merge Actions Performed:</div>
            <div>• All active team recruiter seats and posting quotas are unified into the surviving account.</div>
            <div>• All active job listings remain accessible to existing applicants.</div>
            <div>• The duplicate record is archived and marked as merged in audit trails.</div>
          </div>
        </div>
      </Modal>

      {/* Invite Team Member Modal (EMP-7) */}
      <Modal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title={`Invite Team Member to ${employer.company}`}
        subtitle="Invite a recruiter or hiring manager to access this employer's account."
        maxWidth="max-w-[440px]"
        dataTestId="modal-invite-team-member"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setInviteModalOpen(false)}
              className="rounded-xl border border-border px-4 py-2 text-[11px] font-bold text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              data-testid="button-confirm-invite-member"
              onClick={handleInviteMember}
              disabled={!inviteName.trim() || !inviteEmail.trim()}
              className="rounded-xl bg-primary px-4 py-2 text-[11px] font-bold text-white shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Send Invitation
            </button>
          </div>
        }
      >
        <div className="space-y-3.5 py-1 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-foreground mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              data-testid="input-invite-name"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="h-9 w-full rounded-xl border border-border bg-card px-3 text-xs outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-foreground mb-1">
              Corporate Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              data-testid="input-invite-email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="e.g. priya@company.com"
              className="h-9 w-full rounded-xl border border-border bg-card px-3 text-xs outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-foreground mb-1">
              Assigned Role
            </label>
            <select
              data-testid="select-invite-role"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="h-9 w-full rounded-xl border border-border bg-card px-3 text-xs outline-none focus:border-primary"
            >
              <option value="Recruiter">Recruiter</option>
              <option value="Hiring Manager">Hiring Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Adjust Seat Quota Modal (EMP-7) */}
      <Modal
        isOpen={adjustQuotaModalOpen}
        onClose={() => setAdjustQuotaModalOpen(false)}
        title="Adjust Recruiter Seat Quota"
        subtitle={`Set maximum allowed recruiter seats for ${employer.company} under their current subscription tier.`}
        maxWidth="max-w-[420px]"
        dataTestId="modal-adjust-quota"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setAdjustQuotaModalOpen(false)}
              className="rounded-xl border border-border px-4 py-2 text-[11px] font-bold text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              data-testid="button-confirm-adjust-quota"
              onClick={handleAdjustQuota}
              className="rounded-xl bg-primary px-4 py-2 text-[11px] font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
            >
              Save Quota
            </button>
          </div>
        }
      >
        <div className="space-y-3 py-1 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-foreground mb-1">
              Maximum Recruiter Seats:
            </label>
            <input
              type="number"
              min="1"
              max="50"
              data-testid="input-seat-quota"
              value={newQuotaValue}
              onChange={(e) => setNewQuotaValue(parseInt(e.target.value, 10) || 1)}
              className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm font-bold font-mono outline-none focus:border-primary"
            />
          </div>
          <div className="rounded-xl bg-muted/30 p-3 text-[11px] text-muted-foreground">
            Current active team members: <strong>{(employer.teamMembers || []).length}</strong>. Quota cannot be reduced below current headcount without revoking seats first.
          </div>
        </div>
      </Modal>

      {/* Employer Contact PII Unmask Justification Modal (EMP-8 / XMOD-3) */}
      {unmaskContactModalOpen && (
        <Modal
          isOpen={unmaskContactModalOpen}
          onClose={() => {
            setUnmaskContactModalOpen(false);
            setUnmaskContactError('');
            setUnmaskContactJustification('');
          }}
          title="Authorized Employer PII Unmask"
          subtitle="Primary contact corporate email and direct phone line are protected under DPDP Act 2023."
          maxWidth="max-w-[480px]"
          dataTestId="modal-unmask-employer-pii"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => {
                  setUnmaskContactModalOpen(false);
                  setUnmaskContactError('');
                  setUnmaskContactJustification('');
                }}
                className="rounded-xl border border-border px-4 py-2 text-[11px] font-bold text-muted-foreground hover:bg-muted transition-colors"
              >
                Cancel (Keep Masked)
              </button>
              <button
                type="button"
                data-testid="button-confirm-unmask-employer"
                onClick={handleConfirmContactUnmask}
                disabled={!unmaskContactJustification.trim() || unmaskContactJustification.trim().length < 5}
                className="rounded-xl bg-primary px-4 py-2 text-[11px] font-bold text-white shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Authorize & Reveal Contact
              </button>
            </div>
          }
        >
          <div className="space-y-3.5 py-1 text-xs">
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-amber-900 leading-relaxed text-[11px] space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <ShieldAlert size={14} /> Statutory DPDP Compliance Notice
              </div>
              <p>
                Revealing direct executive contact details appends an immutable compliance audit event to this employer's record. Please specify your business or compliance justification.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-foreground mb-1">
                Business Justification <span className="text-rose-500">*</span>
              </label>
              <textarea
                data-testid="input-unmask-employer-justification"
                rows={3}
                value={unmaskContactJustification}
                onChange={(e) => {
                  setUnmaskContactJustification(e.target.value);
                  if (unmaskContactError) setUnmaskContactError('');
                }}
                placeholder="State specific audit, statutory KYC validation, or legal inquiry reason (minimum 5 characters)..."
                className="w-full rounded-xl border border-border bg-card p-2.5 text-xs outline-none focus:border-primary leading-relaxed"
              />
              <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
                <span>Actor: Super Admin Anita</span>
                <span>{unmaskContactJustification.trim().length}/5 min characters</span>
              </div>
              {unmaskContactError && (
                <p className="text-[11px] font-semibold text-rose-600 mt-1">{unmaskContactError}</p>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
