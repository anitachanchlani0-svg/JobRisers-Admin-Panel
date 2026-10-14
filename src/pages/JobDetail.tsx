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
    setJobsList((prev) =>
      prev.map((j) => (j.id === reviewTarget.id ? { ...j, status: newStatus } : j))
    );
    setReviewTarget(null);
    setReason('');
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

      {/* 8. Moderation History & Audit Trail */}
      {job.moderationHistory && job.moderationHistory.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Moderation Audit Trail ({job.moderationHistory.length})
            </h3>
          </div>
          <div className="space-y-2.5">
            {job.moderationHistory.map((item, idx) => (
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
      )}

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
    </div>
  );
}
