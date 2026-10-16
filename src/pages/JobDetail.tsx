import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Briefcase,
  Building,
  MapPin,
  DollarSign,
  Users,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Edit3,
  Calendar,
  Clock,
  Sparkles,
  Layers,
  FileText,
  Download,
  RefreshCw,
  Sliders,
  Award,
  AlertTriangle,
  TrendingUp,
  Send,
  Check,
  ExternalLink,
} from 'lucide-react';
import { adminJobs, type AdminJob, type ReviewDecision } from '@/mock-data';
import { StatusPill, Modal } from '@/components/ui';

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [jobsList, setJobsList] = useState<AdminJob[]>(adminJobs);
  const [reviewTarget, setReviewTarget] = useState<AdminJob | null>(null);
  const [decision, setDecision] = useState<ReviewDecision>('approve');
  const [reason, setReason] = useState('');

  // JOB-10: Sponsored Promotion State
  const [sponsoredEnabled, setSponsoredEnabled] = useState(false);
  const [sponsoredDuration, setSponsoredDuration] = useState('14D');
  const [sponsoredImpressionCap, setSponsoredImpressionCap] = useState(10000);
  const [sponsoredDailyBudget, setSponsoredDailyBudget] = useState('₹1,500/day');
  const [sponsoredSavedToast, setSponsoredSavedToast] = useState(false);

  // JOB-4: ATS Feed Error & Override State
  const [editOverrideModal, setEditOverrideModal] = useState<{ sourceField: string; targetField: string } | null>(null);
  const [overrideValue, setOverrideValue] = useState('');
  const [isResyncing, setIsResyncing] = useState(false);
  const [syncFeedbackToast, setSyncFeedbackToast] = useState<string | null>(null);

  // JOB-14: Audit Trail State
  const [auditNoteText, setAuditNoteText] = useState('');

  const job = jobsList.find((j) => j.id === id) || jobsList[0];

  if (!job) {
    return (
      <div className="space-y-4">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Back to Jobs
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-base font-bold text-foreground">Job listing not found</h2>
          <p className="text-xs text-muted-foreground mt-1">No job matching ID "{id}".</p>
        </div>
      </div>
    );
  }

  const appliedCount = job.applicantBreakdown?.applied ?? Math.round(job.applicants * 0.55);
  const screeningCount = job.applicantBreakdown?.screening ?? Math.round(job.applicants * 0.25);
  const interviewCount = job.applicantBreakdown?.interview ?? Math.round(job.applicants * 0.12);
  const offeredCount = job.applicantBreakdown?.offered ?? Math.round(job.applicants * 0.05);
  const rejectedCount = job.applicantBreakdown?.rejected ?? Math.round(job.applicants * 0.03);

  const handleReviewAction = (action: ReviewDecision) => {
    if (action === 'approve') {
      setJobsList((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, status: 'Live' } : j))
      );
    } else {
      setDecision(action);
      setReviewTarget(job);
    }
  };

  const submitReview = () => {
    if (!reviewTarget) return;
    const newStatus = decision === 'approve' ? 'Live' : decision === 'reject' ? 'Rejected' : 'Draft';
    const auditRecord = {
      decision: `Moderator ${decision === 'approve' ? 'Approved Listing' : decision === 'reject' ? 'Rejected Listing' : 'Requested Edits'}`,
      date: 'Just now',
      reviewer: 'Lead Moderator Anita',
      note: reason || (decision === 'approve' ? 'Listing meets JobRisers compliance and wage transparency standards' : 'Violates community listing policies'),
    };
    setJobsList((prev) =>
      prev.map((j) =>
        j.id === reviewTarget.id
          ? {
              ...j,
              status: newStatus,
              moderationHistory: [auditRecord, ...(j.moderationHistory || [])],
            }
          : j
      )
    );
    setReviewTarget(null);
    setReason('');
  };

  // JOB-10: Save Sponsored Promotion Controls
  const handleSaveSponsored = () => {
    const updatedConfig = {
      isSponsored: sponsoredEnabled,
      startDate: 'Oct 16, 2026',
      expirationDate: 'Oct 30, 2026',
      duration: sponsoredDuration,
      impressionCap: sponsoredImpressionCap,
      impressionsServed: job.sponsoredConfig?.impressionsServed ?? 0,
      dailyBudget: sponsoredDailyBudget,
    };
    const auditRecord = {
      decision: sponsoredEnabled ? 'Sponsored Promotion Activated' : 'Sponsored Promotion Paused',
      date: 'Just now',
      reviewer: 'Monetization Admin Anita',
      note: `Promotion parameters configured: duration ${sponsoredDuration}, cap ${sponsoredImpressionCap.toLocaleString()} impressions, budget ${sponsoredDailyBudget}`,
    };
    setJobsList((prev) =>
      prev.map((j) =>
        j.id === job.id
          ? {
              ...j,
              sponsoredConfig: updatedConfig,
              moderationHistory: [auditRecord, ...(j.moderationHistory || [])],
            }
          : j
      )
    );
    setSponsoredSavedToast(true);
    setTimeout(() => setSponsoredSavedToast(false), 3000);
  };

  // JOB-4: ATS Feed Error Log Download
  const handleDownloadAtsErrorLog = () => {
    const feed = job.atsFeed;
    if (!feed) return;
    const logContent = {
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      atsProvider: feed.provider,
      lastSyncTimestamp: feed.lastSync,
      syncStatus: feed.status,
      errors: feed.syncErrors,
      fieldMappings: feed.fieldMappings,
      exportedAt: new Date().toISOString(),
      exportAuthor: 'Super Admin Anita',
    };
    const blob = new Blob([JSON.stringify(logContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ats-sync-error-${job.id}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JOB-4: ATS Feed Trigger Re-sync
  const handleTriggerResync = () => {
    setIsResyncing(true);
    setTimeout(() => {
      setIsResyncing(false);
      setJobsList((prev) =>
        prev.map((j) =>
          j.id === job.id && j.atsFeed
            ? {
                ...j,
                atsFeed: {
                  ...j.atsFeed,
                  status: 'Synchronized',
                  lastSync: 'Just now (Re-synced)',
                  syncErrors: [],
                },
                moderationHistory: [
                  {
                    decision: 'ATS Feed Re-synced',
                    date: 'Just now',
                    reviewer: 'Super Admin Anita',
                    note: `Simulated re-sync with ${j.atsFeed.provider} completed successfully. Payloads verified.`,
                  },
                  ...(j.moderationHistory || []),
                ],
              }
            : j
        )
      );
      setSyncFeedbackToast('ATS feed synchronized successfully. Field mappings reconciled.');
      setTimeout(() => setSyncFeedbackToast(null), 3500);
    }, 900);
  };

  // JOB-4: Save Field Override
  const handleSaveFieldOverride = () => {
    if (!editOverrideModal) return;
    const { sourceField } = editOverrideModal;
    setJobsList((prev) =>
      prev.map((j) =>
        j.id === job.id && j.atsFeed
          ? {
              ...j,
              atsFeed: {
                ...j.atsFeed,
                fieldMappings: j.atsFeed.fieldMappings.map((fm) =>
                  fm.sourceField === sourceField
                    ? { ...fm, targetField: overrideValue || fm.targetField, status: 'Overridden' }
                    : fm
                ),
              },
            }
          : j
      )
    );
    setEditOverrideModal(null);
    setOverrideValue('');
  };

  // JOB-14: Add Moderator Audit Note
  const handleAddModeratorNote = () => {
    if (!auditNoteText.trim()) return;
    const auditRecord = {
      decision: 'Compliance Moderator Note',
      date: 'Just now',
      reviewer: 'Compliance Admin Anita',
      note: auditNoteText.trim(),
    };
    setJobsList((prev) =>
      prev.map((j) =>
        j.id === job.id
          ? {
              ...j,
              moderationHistory: [auditRecord, ...(j.moderationHistory || [])],
            }
          : j
      )
    );
    setAuditNoteText('');
  };

  return (
    <div className="space-y-6">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/jobs"
          data-testid="link-back-to-jobs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          Back to Jobs
        </Link>
        <span className="text-[10px] font-mono text-muted-foreground">Job ID: {job.id}</span>
      </div>

      {/* Main Header Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Briefcase size={22} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl truncate">
                  {job.title}
                </h1>
                {job.flagged && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold text-rose-700">
                    <ShieldAlert size={11} /> Flagged
                  </span>
                )}
                <StatusPill value={job.status} />
                {job.sponsoredConfig?.isSponsored && (
                  <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 flex items-center gap-1">
                    <Award size={12} className="text-amber-600" /> Sponsored Boost
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-1 truncate">
                <span className="font-semibold text-foreground">{job.company}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} className="text-muted-foreground" />
                  {job.location} ({job.workMode})
                </span>
                <span>·</span>
                <span>Posted {job.posted}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              data-testid="button-approve-job"
              onClick={() => handleReviewAction('approve')}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-[11px] font-bold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
            >
              <CheckCircle2 size={14} /> Approve
            </button>
            <button
              type="button"
              data-testid="button-reject-job"
              onClick={() => handleReviewAction('reject')}
              className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-[11px] font-bold text-white hover:bg-rose-700 transition-colors shadow-2xs"
            >
              <XCircle size={14} /> Reject
            </button>
            <button
              type="button"
              data-testid="button-request-edits-job"
              onClick={() => handleReviewAction('request-edits')}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-[11px] font-bold text-foreground hover:bg-muted transition-colors"
            >
              <Edit3 size={14} className="text-amber-600" /> Request Edits
            </button>
          </div>
        </div>
      </div>

      {/* 1. Quick Stats Strip */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Applicants
          </div>
          <div className="font-display text-lg font-extrabold text-foreground">
            {job.applicants} Total
          </div>
          <div className="text-[10px] text-muted-foreground">Submissions received</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
            Screening
          </div>
          <div className="font-display text-lg font-extrabold text-foreground">
            {screeningCount} Active
          </div>
          <div className="text-[10px] text-muted-foreground">Resume review queue</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
            Interviews
          </div>
          <div className="font-display text-lg font-extrabold text-foreground">
            {interviewCount} Scheduled
          </div>
          <div className="text-[10px] text-muted-foreground">In interview rounds</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            Offered
          </div>
          <div className="font-display text-lg font-extrabold text-foreground">
            {offeredCount} Offers
          </div>
          <div className="text-[10px] text-muted-foreground">Accepted or pending</div>
        </div>
      </section>

      {/* 2. Moderation Controls Summary */}
      <section className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/20 p-5 space-y-2 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert size={15} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Moderation & Quality Status
            </h3>
          </div>
          <span className="text-[11px] font-medium text-muted-foreground">
            Current Status: <strong className="text-foreground">{job.status}</strong>
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Job listings must adhere to fair-hiring rules, transparent compensation disclosures, and non-discriminatory requirements before going live.
        </p>
      </section>

      {/* 3. Compensation & Listing Overview */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
        <div className="flex items-center gap-2">
          <FileText size={15} className="text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Listing Metadata & Terms
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-xl bg-muted/30 p-3 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Compensation</span>
            <div className="font-semibold text-foreground mt-0.5 truncate">
              {job.salaryRange || 'Competitive LPA'}
            </div>
          </div>
          <div className="rounded-xl bg-muted/30 p-3 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Work Mode</span>
            <div className="font-semibold text-foreground mt-0.5">{job.workMode}</div>
          </div>
          <div className="rounded-xl bg-muted/30 p-3 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Employment Type</span>
            <div className="font-semibold text-foreground mt-0.5">{job.type}</div>
          </div>
          <div className="rounded-xl bg-muted/30 p-3 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Date Posted</span>
            <div className="font-semibold text-foreground mt-0.5">{job.posted}</div>
          </div>
        </div>
      </section>

      {/* 4. Applicant Pipeline Funnel */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={15} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Candidate Funnel Pipeline
            </h3>
          </div>
          <span className="font-mono text-xs font-bold text-foreground">
            {job.applicants} Candidates Total
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <div className="rounded-xl bg-muted/30 p-3 border border-border/50 text-center">
            <div className="text-[10px] text-muted-foreground font-semibold">Applied</div>
            <div className="font-mono text-base font-extrabold text-foreground mt-0.5">
              {appliedCount}
            </div>
          </div>
          <div className="rounded-xl bg-blue-50/70 p-3 border border-blue-200/70 text-center">
            <div className="text-[10px] text-blue-700 font-semibold">Screening</div>
            <div className="font-mono text-base font-extrabold text-blue-800 mt-0.5">
              {screeningCount}
            </div>
          </div>
          <div className="rounded-xl bg-purple-50/70 p-3 border border-purple-200/70 text-center">
            <div className="text-[10px] text-purple-700 font-semibold">Interview</div>
            <div className="font-mono text-base font-extrabold text-purple-800 mt-0.5">
              {interviewCount}
            </div>
          </div>
          <div className="rounded-xl bg-emerald-50/70 p-3 border border-emerald-200/70 text-center">
            <div className="text-[10px] text-emerald-700 font-semibold">Offered</div>
            <div className="font-mono text-base font-extrabold text-emerald-800 mt-0.5">
              {offeredCount}
            </div>
          </div>
          <div className="rounded-xl bg-rose-50/70 p-3 border border-rose-200/70 text-center col-span-2 sm:col-span-1">
            <div className="text-[10px] text-rose-700 font-semibold">Rejected</div>
            <div className="font-mono text-base font-extrabold text-rose-800 mt-0.5">
              {rejectedCount}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Job Description */}
      {job.description && (
        <section className="rounded-2xl border border-border bg-card p-5 space-y-2.5 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Role Description
          </h3>
          <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </section>
      )}

      {/* 6. Responsibilities & Requirements */}
      {job.responsibilities && job.responsibilities.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Key Responsibilities
          </h3>
          <ul className="space-y-1.5 text-xs text-foreground/90 list-disc pl-5 leading-relaxed">
            {job.responsibilities.map((resp, idx) => (
              <li key={idx}>{resp}</li>
            ))}
          </ul>
        </section>
      )}

      {job.requirements && job.requirements.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Qualifications & Experience Required
          </h3>
          <ul className="space-y-1.5 text-xs text-foreground/90 list-disc pl-5 leading-relaxed">
            {job.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </section>
      )}

      {/* 7. Benefits & Perks */}
      {job.benefits && job.benefits.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Benefits & Offerings
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {job.benefits.map((benefit, idx) => (
              <span
                key={idx}
                className="rounded-lg bg-emerald-50 border border-emerald-200/70 px-3 py-1.5 text-[11px] font-semibold text-emerald-800"
              >
                {benefit}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 8. Sponsored / Featured Promotion Controls (JOB-10) */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Award size={16} className="text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Sponsored & Featured Promotion Controls (JOB-10)
            </h3>
          </div>
          {sponsoredSavedToast && (
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
              <Check size={13} /> Promotion settings saved
            </span>
          )}
        </div>

        <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                data-testid="checkbox-toggle-sponsored"
                checked={sponsoredEnabled}
                onChange={(e) => setSponsoredEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer"
              />
              <span className="text-xs font-bold text-foreground">
                Activate Marketplace Promotion (Pinned to Category Top & Digest Emails)
              </span>
            </label>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
                sponsoredEnabled
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {sponsoredEnabled ? 'Promotion Active' : 'Standard Organic Listing'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border/50">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Duration
              </label>
              <select
                data-testid="select-sponsored-duration"
                value={sponsoredDuration}
                onChange={(e) => setSponsoredDuration(e.target.value)}
                className="h-9 w-full rounded-xl border border-border bg-card px-2.5 text-xs font-medium outline-none focus:border-primary"
              >
                <option value="7D">7 Days</option>
                <option value="14D">14 Days</option>
                <option value="30D">30 Days</option>
                <option value="Custom">Custom Schedule</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Impression Cap
              </label>
              <input
                type="number"
                data-testid="input-impression-cap"
                value={sponsoredImpressionCap}
                onChange={(e) => setSponsoredImpressionCap(parseInt(e.target.value, 10) || 1000)}
                className="h-9 w-full rounded-xl border border-border bg-card px-2.5 text-xs font-mono font-medium outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Daily Budget
              </label>
              <input
                type="text"
                data-testid="input-daily-budget"
                value={sponsoredDailyBudget}
                onChange={(e) => setSponsoredDailyBudget(e.target.value)}
                className="h-9 w-full rounded-xl border border-border bg-card px-2.5 text-xs font-medium outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-border/50 flex-wrap gap-2">
            <div className="text-[11px] text-muted-foreground">
              Impressions Served: <strong className="text-foreground">{job.sponsoredConfig?.impressionsServed ?? 0}</strong> / {sponsoredImpressionCap.toLocaleString()} (Cap)
            </div>
            <button
              type="button"
              data-testid="button-save-sponsored-promotion"
              onClick={handleSaveSponsored}
              className="rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:opacity-90 transition-opacity"
            >
              Save Promotion Parameters
            </button>
          </div>
        </div>
      </section>

      {/* 9. ATS Feed Synchronization & Field Mapping (JOB-4) */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <RefreshCw size={15} className={`text-primary ${isResyncing ? 'animate-spin' : ''}`} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              ATS Feed Synchronization & Error Resolution (JOB-4)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="button-download-ats-log"
              onClick={handleDownloadAtsErrorLog}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-[11px] font-bold text-foreground hover:bg-muted transition-colors shadow-2xs"
            >
              <Download size={13} className="text-primary" /> Download Sync Error Log
            </button>
            <button
              type="button"
              data-testid="button-trigger-ats-resync"
              disabled={isResyncing}
              onClick={handleTriggerResync}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-[11px] font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50 shadow-2xs"
            >
              <RefreshCw size={13} className={isResyncing ? 'animate-spin' : ''} />
              {isResyncing ? 'Re-syncing Feed…' : 'Trigger Feed Re-sync'}
            </button>
          </div>
        </div>

        {syncFeedbackToast && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-medium flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={15} className="text-emerald-600" />
            {syncFeedbackToast}
          </div>
        )}

        {/* ATS Details */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="rounded-xl bg-muted/30 p-3 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">ATS Integration</span>
            <div className="font-bold text-foreground mt-0.5">{job.atsFeed?.provider || 'Workday API'}</div>
          </div>
          <div className="rounded-xl bg-muted/30 p-3 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Feed Status</span>
            <div className="mt-0.5">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  job.atsFeed?.status === 'Synchronized'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {job.atsFeed?.status || 'Sync Warning'}
              </span>
            </div>
          </div>
          <div className="rounded-xl bg-muted/30 p-3 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Last Ingestion</span>
            <div className="font-medium text-foreground mt-0.5">{job.atsFeed?.lastSync || 'Today, 10:00 AM'}</div>
          </div>
        </div>

        {/* Sync Errors List */}
        {job.atsFeed?.syncErrors && job.atsFeed.syncErrors.length > 0 && (
          <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
              <AlertTriangle size={14} /> Active Feed Sync Errors ({job.atsFeed.syncErrors.length}):
            </div>
            <ul className="space-y-1 text-[11px] text-rose-700 list-disc pl-5">
              {job.atsFeed.syncErrors.map((err, idx) => (
                <li key={idx}>
                  <code className="bg-rose-100 px-1 py-0.2 rounded font-mono font-bold mr-1">{err.code}</code>
                  {err.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Field Mappings Table */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Source Payload Field Mappings & Overrides:
          </div>
          <div className="rounded-xl border border-border/70 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-muted/40 text-[9px] font-bold text-muted-foreground uppercase">
                  <th className="p-2.5">ATS Source Field</th>
                  <th className="p-2.5">JobRisers Target Field</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {(job.atsFeed?.fieldMappings || [
                  { sourceField: 'job_title_external', targetField: 'title', status: 'Mapped' },
                  { sourceField: 'location_subdivision_code', targetField: 'location', status: 'Mapped' },
                  { sourceField: 'rem_tax_code_v2', targetField: 'workMode', status: 'Mapping Warning' },
                  { sourceField: 'salary_grade_lpa', targetField: 'salaryRange', status: 'Mapping Warning' },
                ]).map((fm, idx) => (
                  <tr key={idx} className="hover:bg-muted/20">
                    <td className="p-2.5 font-mono text-[11px] font-medium">{fm.sourceField}</td>
                    <td className="p-2.5 font-semibold text-foreground">{fm.targetField}</td>
                    <td className="p-2.5">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                          fm.status === 'Mapped'
                            ? 'bg-emerald-50 text-emerald-700'
                            : fm.status === 'Overridden'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {fm.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        type="button"
                        data-testid={`button-override-field-${fm.sourceField}`}
                        onClick={() => {
                          setEditOverrideModal({ sourceField: fm.sourceField, targetField: fm.targetField });
                          setOverrideValue(fm.targetField);
                        }}
                        className="rounded-lg border border-border px-2 py-1 text-[10px] font-bold text-foreground hover:bg-card transition-colors"
                      >
                        Edit Override
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 10. Chronological Moderation Audit Trail (JOB-14) */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Chronological Moderation Audit Trail ({(job.moderationHistory || []).length})
            </h3>
          </div>
          <span className="text-[10px] text-muted-foreground">Immutable listing decision history</span>
        </div>

        {/* Add Moderator Audit Note */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            data-testid="input-job-audit-note"
            value={auditNoteText}
            onChange={(e) => setAuditNoteText(e.target.value)}
            placeholder="Log an internal compliance or moderation note for this listing…"
            className="h-9 flex-1 rounded-xl border border-border bg-card px-3 text-xs outline-none focus:border-primary"
          />
          <button
            type="button"
            data-testid="button-add-job-audit-note"
            disabled={!auditNoteText.trim()}
            onClick={handleAddModeratorNote}
            className="rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50 shadow-2xs"
          >
            Log Note
          </button>
        </div>

        <div className="space-y-2.5 pt-1">
          {(job.moderationHistory || []).map((item, idx) => (
            <div key={idx} className="rounded-xl bg-muted/20 p-3 border border-border/50 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">{item.decision}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{item.date}</span>
              </div>
              <div className="text-[11px] text-primary font-medium">Reviewer: {item.reviewer}</div>
              <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Review Modal for Reject / Request Edits */}
      <Modal
        isOpen={Boolean(reviewTarget)}
        onClose={() => setReviewTarget(null)}
        title={decision === 'reject' ? 'Reject Job Listing' : 'Request Listing Edits'}
        subtitle={`Action for ${reviewTarget?.title} at ${reviewTarget?.company}`}
        dataTestId="modal-review-action"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setReviewTarget(null)}
              className="rounded-xl border border-border px-4 py-2 text-[11px] font-bold text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              data-testid="button-confirm-review-action"
              onClick={submitReview}
              className={`rounded-xl px-4 py-2 text-[11px] font-bold text-white shadow-sm transition-opacity hover:opacity-90 ${
                decision === 'reject' ? 'bg-rose-600' : 'bg-primary'
              }`}
            >
              Confirm {decision === 'reject' ? 'Rejection' : 'Request'}
            </button>
          </div>
        }
      >
        <div className="space-y-3 py-1">
          <label className="block text-[11px] font-bold text-foreground">
            Internal reason & employer feedback notes:
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why this listing is being rejected or what revisions are required from the employer…"
            className="w-full rounded-xl border border-border bg-card p-3 text-xs outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 leading-relaxed"
          />
        </div>
      </Modal>

      {/* Edit Field Mapping Override Modal (JOB-4) */}
      <Modal
        isOpen={Boolean(editOverrideModal)}
        onClose={() => setEditOverrideModal(null)}
        title="Override ATS Field Mapping"
        subtitle={`Manually override the target schema mapping for ${editOverrideModal?.sourceField}.`}
        maxWidth="max-w-[420px]"
        dataTestId="modal-edit-ats-override"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setEditOverrideModal(null)}
              className="rounded-xl border border-border px-4 py-2 text-[11px] font-bold text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              data-testid="button-confirm-save-override"
              onClick={handleSaveFieldOverride}
              className="rounded-xl bg-primary px-4 py-2 text-[11px] font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
            >
              Save Override
            </button>
          </div>
        }
      >
        <div className="space-y-3 py-1 text-xs">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Source Payload Key:</span>
            <div className="font-mono font-bold text-foreground mt-0.5">{editOverrideModal?.sourceField}</div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-foreground mb-1">
              Target JobRisers Schema Field:
            </label>
            <input
              type="text"
              data-testid="input-override-target-field"
              value={overrideValue}
              onChange={(e) => setOverrideValue(e.target.value)}
              className="h-9 w-full rounded-xl border border-border bg-card px-3 text-xs outline-none focus:border-primary"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
