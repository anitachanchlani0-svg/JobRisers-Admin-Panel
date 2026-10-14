import React from 'react';
import {
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
import type { AdminJob, ReviewDecision } from '@/mock-data';
import { Drawer, StatusPill } from '@/components/ui';

interface JobDetailDrawerProps {
  job: AdminJob | null;
  isOpen: boolean;
  onClose: () => void;
  onReview: (job: AdminJob, action: ReviewDecision) => void;
}

export function JobDetailDrawer({
  job,
  isOpen,
  onClose,
  onReview,
}: JobDetailDrawerProps) {
  if (!job) return null;

  const appliedCount = job.applicantBreakdown?.applied ?? Math.round(job.applicants * 0.55);
  const screeningCount = job.applicantBreakdown?.screening ?? Math.round(job.applicants * 0.25);
  const interviewCount = job.applicantBreakdown?.interview ?? Math.round(job.applicants * 0.12);
  const offeredCount = job.applicantBreakdown?.offered ?? Math.round(job.applicants * 0.05);
  const rejectedCount = job.applicantBreakdown?.rejected ?? Math.round(job.applicants * 0.03);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      dataTestId="job-detail-drawer"
      title={
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Briefcase size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display text-lg font-bold text-foreground sm:text-xl truncate">
                {job.title}
              </span>
              {job.flagged && (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[9px] font-bold text-rose-700">
                  <ShieldAlert size={11} /> Flagged
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5 truncate">
              <span>{job.company}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin size={11} className="text-muted-foreground" />
                {job.location} ({job.workMode})
              </span>
            </p>
          </div>
        </div>
      }
      badge={<StatusPill value={job.status} />}
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              data-testid="button-drawer-approve-job"
              onClick={() => onReview(job, 'approve')}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-[11px] font-bold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
            >
              <CheckCircle2 size={13} /> Approve
            </button>
            <button
              type="button"
              data-testid="button-drawer-reject-job"
              onClick={() => onReview(job, 'reject')}
              className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-[11px] font-bold text-white hover:bg-rose-700 transition-colors shadow-2xs"
            >
              <XCircle size={13} /> Reject
            </button>
            <button
              type="button"
              data-testid="button-drawer-request-edits-job"
              onClick={() => onReview(job, 'request-edits')}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-[11px] font-bold text-foreground hover:bg-muted transition-colors"
            >
              <Edit3 size={13} className="text-amber-600" /> Request Edits
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2 text-[11px] font-bold text-foreground hover:bg-muted transition-colors"
          >
            Close
          </button>
        </div>
      }
    >
      {/* 1. Quick Stats Strip */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 rounded-xl border border-border/80 bg-muted/30 p-3">
        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Applicants
          </div>
          <div className="font-display text-base font-extrabold text-foreground">
            {job.applicants} Total
          </div>
          <div className="text-[10px] text-muted-foreground">Submissions received</div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
            Screening
          </div>
          <div className="font-display text-base font-extrabold text-foreground">
            {screeningCount} Active
          </div>
          <div className="text-[10px] text-muted-foreground">Resume review queue</div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
            Interviews
          </div>
          <div className="font-display text-base font-extrabold text-foreground">
            {interviewCount} Scheduled
          </div>
          <div className="text-[10px] text-muted-foreground">In interview rounds</div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            Offered
          </div>
          <div className="font-display text-base font-extrabold text-foreground">
            {offeredCount} Offers
          </div>
          <div className="text-[10px] text-muted-foreground">Accepted or pending</div>
        </div>
      </section>

      {/* 2. Moderation Controls Summary */}
      <section className="rounded-xl border border-border/80 bg-gradient-to-br from-card to-muted/20 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert size={14} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Moderation & Quality Status
            </h3>
          </div>
          <span className="text-[11px] font-medium text-muted-foreground">
            Status: <strong className="text-foreground">{job.status}</strong>
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Job listings must adhere to fair-hiring rules, transparent compensation disclosures, and non-discriminatory requirements before going live.
        </p>
      </section>

      {/* 3. Compensation & Listing Overview */}
      <section className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Listing Metadata & Terms
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="rounded-lg bg-muted/30 p-2.5 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Compensation</span>
            <div className="font-semibold text-foreground mt-0.5 truncate">
              {job.salaryRange || 'Competitive LPA'}
            </div>
          </div>
          <div className="rounded-lg bg-muted/30 p-2.5 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Work Mode</span>
            <div className="font-semibold text-foreground mt-0.5">{job.workMode}</div>
          </div>
          <div className="rounded-lg bg-muted/30 p-2.5 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Employment Type</span>
            <div className="font-semibold text-foreground mt-0.5">{job.type}</div>
          </div>
          <div className="rounded-lg bg-muted/30 p-2.5 border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Date Posted</span>
            <div className="font-semibold text-foreground mt-0.5">{job.posted}</div>
          </div>
        </div>
      </section>

      {/* 4. Applicant Pipeline Funnel */}
      <section className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Candidate Funnel Pipeline
            </h3>
          </div>
          <span className="font-mono text-xs font-bold text-foreground">
            {job.applicants} Candidates
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <div className="rounded-lg bg-muted/30 p-2 border border-border/50 text-center">
            <div className="text-[10px] text-muted-foreground font-semibold">Applied</div>
            <div className="font-mono text-sm font-extrabold text-foreground mt-0.5">
              {appliedCount}
            </div>
          </div>
          <div className="rounded-lg bg-blue-50/70 p-2 border border-blue-200/70 text-center">
            <div className="text-[10px] text-blue-700 font-semibold">Screening</div>
            <div className="font-mono text-sm font-extrabold text-blue-800 mt-0.5">
              {screeningCount}
            </div>
          </div>
          <div className="rounded-lg bg-purple-50/70 p-2 border border-purple-200/70 text-center">
            <div className="text-[10px] text-purple-700 font-semibold">Interview</div>
            <div className="font-mono text-sm font-extrabold text-purple-800 mt-0.5">
              {interviewCount}
            </div>
          </div>
          <div className="rounded-lg bg-emerald-50/70 p-2 border border-emerald-200/70 text-center">
            <div className="text-[10px] text-emerald-700 font-semibold">Offered</div>
            <div className="font-mono text-sm font-extrabold text-emerald-800 mt-0.5">
              {offeredCount}
            </div>
          </div>
          <div className="rounded-lg bg-rose-50/70 p-2 border border-rose-200/70 text-center col-span-2 sm:col-span-1">
            <div className="text-[10px] text-rose-700 font-semibold">Rejected</div>
            <div className="font-mono text-sm font-extrabold text-rose-800 mt-0.5">
              {rejectedCount}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Job Description */}
      {job.description && (
        <section className="rounded-xl border border-border/80 bg-card p-4 space-y-2">
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
        <section className="rounded-xl border border-border/80 bg-card p-4 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Key Responsibilities
          </h3>
          <ul className="space-y-1.5 text-xs text-foreground/90 list-disc pl-4 leading-relaxed">
            {job.responsibilities.map((resp, idx) => (
              <li key={idx}>{resp}</li>
            ))}
          </ul>
        </section>
      )}

      {job.requirements && job.requirements.length > 0 && (
        <section className="rounded-xl border border-border/80 bg-card p-4 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Qualifications & Experience Required
          </h3>
          <ul className="space-y-1.5 text-xs text-foreground/90 list-disc pl-4 leading-relaxed">
            {job.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </section>
      )}

      {/* 7. Benefits & Perks */}
      {job.benefits && job.benefits.length > 0 && (
        <section className="rounded-xl border border-border/80 bg-card p-4 space-y-2.5">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Benefits & Offerings
            </h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {job.benefits.map((benefit, idx) => (
              <span
                key={idx}
                className="rounded-lg bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 text-[11px] font-semibold text-emerald-800"
              >
                {benefit}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 8. Moderation History & Audit Trail */}
      {job.moderationHistory && job.moderationHistory.length > 0 && (
        <section className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Moderation Audit Trail ({job.moderationHistory.length})
            </h3>
          </div>
          <div className="space-y-2">
            {job.moderationHistory.map((item, idx) => (
              <div key={idx} className="rounded-lg bg-muted/20 p-2.5 border border-border/50 text-xs space-y-1">
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
    </Drawer>
  );
}
