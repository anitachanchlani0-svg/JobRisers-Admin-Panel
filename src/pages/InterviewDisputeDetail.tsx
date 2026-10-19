import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldAlert,
  Clock,
  User,
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { adminInterviewDisputes, type AdminInterviewDispute } from '@/mock-data';
import { StatusPill } from '@/components/ui';

export function InterviewDisputeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [disputesList, setDisputesList] = useState<AdminInterviewDispute[]>(adminInterviewDisputes);
  const [resolutionNote, setResolutionNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const dispute = disputesList.find((d) => d.id === id) || disputesList[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleResolve = (decision: 'Uphold & Refund' | 'Dismiss Dispute' | 'Mark Under Review') => {
    const statusMap = {
      'Uphold & Refund': 'Resolved',
      'Dismiss Dispute': 'Dismissed',
      'Mark Under Review': 'Under Review',
    } as const;

    setDisputesList((prev) =>
      prev.map((d) =>
        d.id === dispute.id
          ? {
              ...d,
              status: statusMap[decision],
            }
          : d
      )
    );
    showToast(`Dispute #${dispute.id} updated: ${decision}. Actions recorded in immutable audit log.`);
  };

  if (!dispute) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/interviews"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Back to Interviews
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-base font-bold text-foreground">Dispute Case Not Found</h2>
          <p className="text-xs text-muted-foreground mt-1">No dispute matching case reference "{id}".</p>
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

      {/* 1. Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/interviews"
          data-testid="link-back-to-interviews"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          Back to Interviews & Escalations
        </Link>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
            Case: #{dispute.id}
          </span>
          <span className="rounded-md bg-rose-50 border border-rose-200 text-rose-700 px-2 py-0.5 text-[10px] font-bold">
            SLA: {dispute.slaRemaining}
          </span>
        </div>
      </div>

      {/* 2. Header Workspace Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
                <ShieldAlert size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl truncate">
                    Case #{dispute.id}: {dispute.reason}
                  </h1>
                  <StatusPill value={dispute.status} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Filed by <strong>{dispute.filingParty} ({dispute.filerName})</strong> on {dispute.filingDate}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Linked Interview:</span>
            <Link
              to={`/admin/interviews/${dispute.interviewId}`}
              className="font-mono font-bold text-primary hover:underline bg-primary/10 px-2 py-1 rounded-lg"
            >
              {dispute.interviewId} &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Dispute Details & Casework Resolution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Dispute Statement & Evidence */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <FileText size={15} className="text-primary" />
              Dispute Statement & Evidence Dossier
            </h2>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 text-xs leading-relaxed text-rose-950 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-rose-800">
                <AlertTriangle size={14} /> Filer's Official Grievance Statement:
              </div>
              <p>{dispute.evidenceDetails || 'The candidate failed to join the video room within the 15-minute grace period. No advance notice or technical failure notification was dispatched.'}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-border bg-muted/20">
                <span className="text-muted-foreground block text-[10px] uppercase font-bold">Filing Timestamp</span>
                <span className="font-semibold text-foreground">{dispute.filingDate}</span>
              </div>
              <div className="p-3.5 rounded-xl border border-border bg-muted/20">
                <span className="text-muted-foreground block text-[10px] uppercase font-bold">Resolution SLA Deadline</span>
                <span className="font-semibold text-rose-600">{dispute.slaRemaining} remaining</span>
              </div>
            </div>
          </div>

          {/* Casework Resolution Form */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Clock size={15} className="text-primary" />
              Administrative Mediation & Resolution Decision
            </h2>

            <div>
              <label className="text-[11px] font-bold block mb-1 text-foreground">
                Casework Resolution Notes & Statutory Reason *
              </label>
              <textarea
                rows={3}
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Log internal caseworker findings, attendance logs cross-examination, and justification..."
                className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => handleResolve('Mark Under Review')}
                className="rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
              >
                <RotateCcw size={14} />
                Flag Under Extended Review
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleResolve('Dismiss Dispute')}
                  className="rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
                >
                  <XCircle size={14} />
                  Dismiss Dispute (Release Payout)
                </button>
                <button
                  type="button"
                  onClick={() => handleResolve('Uphold & Refund')}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition-colors flex items-center gap-1.5"
                >
                  <DollarSign size={14} />
                  Uphold Dispute & Issue Refund
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Involver Parties */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <User size={13} className="text-primary" /> Filer Party
            </span>
            <div>
              <div className="font-extrabold text-base text-foreground">{dispute.filerName}</div>
              <div className="text-[11px] font-semibold text-primary">{dispute.filingParty}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Building2 size={13} className="text-primary" /> Accused Party
            </span>
            <div>
              <div className="font-extrabold text-base text-foreground">{dispute.accusedName}</div>
              <div className="text-[11px] font-semibold text-muted-foreground">{dispute.accusedRole}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
