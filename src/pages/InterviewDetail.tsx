import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  User,
  Building2,
  CheckCircle2,
  Copy,
  ExternalLink,
  RotateCcw,
  AlertCircle,
  FileText,
  Briefcase,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { adminInterviews, type AdminInterviewRecord } from '@/mock-data';
import { StatusPill } from '@/components/ui';

export function InterviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [interviewsList, setInterviewsList] = useState<AdminInterviewRecord[]>(adminInterviews);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reschedule form state
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleDateTime, setRescheduleDateTime] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');

  const interview = interviewsList.find((i) => i.id === id) || interviewsList[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyLink = () => {
    if (interview?.meetingLink) {
      navigator.clipboard?.writeText(interview.meetingLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleStatusChange = (newStatus: AdminInterviewRecord['status']) => {
    setInterviewsList((prev) =>
      prev.map((i) => (i.id === interview.id ? { ...i, status: newStatus } : i))
    );
    showToast(`Interview status updated to "${newStatus}".`);
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleDateTime.trim()) return;
    setInterviewsList((prev) =>
      prev.map((i) =>
        i.id === interview.id
          ? {
              ...i,
              dateTime: rescheduleDateTime,
              status: 'Rescheduled',
              notes: `${i.notes || ''} [Reschedule Note: ${rescheduleReason || 'Admin updated timing'}]`,
            }
          : i
      )
    );
    setIsRescheduling(false);
    setRescheduleDateTime('');
    setRescheduleReason('');
    showToast('Interview successfully rescheduled. Notifications dispatched to both parties.');
  };

  if (!interview) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/interviews"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Back to Interviews
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-base font-bold text-foreground">Interview not found</h2>
          <p className="text-xs text-muted-foreground mt-1">No interview matching identifier "{id}".</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-primary/30 bg-card p-3 shadow-2xl text-xs font-semibold animate-in slide-in-from-bottom-2">
          <CheckCircle2 size={16} className="text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/interviews"
          data-testid="link-back-to-interviews"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          Back to Interviews
        </Link>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
            Interview Ref: {interview.id}
          </span>
          <span className="rounded-md bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-bold">
            {interview.format}
          </span>
        </div>
      </div>

      {/* 2. Primary Header Workspace Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Video size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl truncate">
                    {interview.jobTitle}
                  </h1>
                  <StatusPill value={interview.status} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Interview coordination between <strong>{interview.candidateName}</strong> and <strong>{interview.companyName}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Status Control */}
          <div className="flex flex-wrap items-center gap-2">
            {(['Confirmed', 'Completed', 'Cancelled'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => handleStatusChange(st)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  interview.status === st
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'border border-border bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                Mark {st}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsRescheduling(!isRescheduling)}
              className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
            >
              <RotateCcw size={13} />
              {isRescheduling ? 'Cancel Reschedule' : 'Reschedule Slot'}
            </button>
          </div>
        </div>
      </div>

      {/* Reschedule Drawer Form if triggered */}
      {isRescheduling && (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-primary">
            <RotateCcw size={16} />
            <span>Administrative Reschedule Tool</span>
          </div>
          <form onSubmit={handleConfirmReschedule} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold block mb-1 text-foreground">
                New Date, Time & Zone *
              </label>
              <input
                type="text"
                required
                value={rescheduleDateTime}
                onChange={(e) => setRescheduleDateTime(e.target.value)}
                placeholder="e.g. Oct 20, 2026 · 03:00 PM IST"
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold block mb-1 text-foreground">
                Reschedule Reason / Dispatch Note
              </label>
              <input
                type="text"
                value={rescheduleReason}
                onChange={(e) => setRescheduleReason(e.target.value)}
                placeholder="e.g. Employer requested 24h postponement due to interviewer conflict"
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsRescheduling(false)}
                className="rounded-xl border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90"
              >
                Confirm & Dispatch Update
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Main Details 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Session Info & Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Schedule & Meeting Room Card */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Calendar size={15} className="text-primary" />
              Interview Schedule & Virtual Room
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                <span className="text-muted-foreground font-medium">Scheduled Timestamp</span>
                <div className="text-sm font-bold text-foreground">{interview.dateTime}</div>
                <div className="text-[11px] text-muted-foreground">{interview.timezone}</div>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                <span className="text-muted-foreground font-medium">Duration & Platform</span>
                <div className="text-sm font-bold text-foreground">{interview.duration}</div>
                <div className="text-[11px] text-muted-foreground">{interview.provider} ({interview.format})</div>
              </div>
            </div>

            {/* Meeting Link Bar */}
            <div className="p-4 rounded-xl border border-border bg-muted/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Video Meeting Room</span>
                <span className="font-mono text-xs text-foreground truncate block">{interview.meetingLink || 'No link generated'}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
                >
                  {copiedLink ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  {copiedLink ? 'Copied' : 'Copy Room Link'}
                </button>
                {interview.meetingLink && (
                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-1.5"
                  >
                    <ExternalLink size={13} />
                    Open Room
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Interviewer Notes & Briefing Card */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <FileText size={15} className="text-primary" />
              Interviewer Briefing & Operational Notes
            </h2>
            <div className="p-4 rounded-xl border border-border bg-muted/20 text-xs leading-relaxed text-foreground">
              {interview.notes || 'No specific administrative briefing notes logged for this interview session.'}
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
              <span>Host Lead: <strong>{interview.interviewerName}</strong> ({interview.interviewerTitle})</span>
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <ShieldCheck size={13} /> Encrypted Platform Audit Active
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Participant Context */}
        <div className="space-y-6">
          {/* Candidate Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <User size={13} className="text-primary" /> Candidate
              </span>
              <Link
                to={`/admin/candidates/${interview.candidateId}`}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                Profile &rarr;
              </Link>
            </div>
            <div>
              <div className="font-extrabold text-base text-foreground">{interview.candidateName}</div>
              <div className="text-[11px] font-mono text-muted-foreground">ID: {interview.candidateId}</div>
            </div>
            <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Screening Status</span>
              <span className="font-semibold text-emerald-600">Passed ATS</span>
            </div>
          </div>

          {/* Employer Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Building2 size={13} className="text-primary" /> Hiring Employer
              </span>
              <Link
                to={`/admin/employers/${interview.companyId}`}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                Account &rarr;
              </Link>
            </div>
            <div>
              <div className="font-extrabold text-base text-foreground">{interview.companyName}</div>
              <div className="text-[11px] font-mono text-muted-foreground">ID: {interview.companyId}</div>
            </div>
            <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Verification Standing</span>
              <span className="font-semibold text-primary">Verified Employer</span>
            </div>
          </div>

          {/* Job Listing Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Briefcase size={13} className="text-primary" /> Job Listing
              </span>
              <Link
                to={`/admin/jobs/${interview.jobId}`}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                Job &rarr;
              </Link>
            </div>
            <div>
              <div className="font-extrabold text-sm text-foreground">{interview.jobTitle}</div>
              <div className="text-[11px] font-mono text-muted-foreground">ID: {interview.jobId}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
