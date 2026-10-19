import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  Building2,
  FileText,
  MessageSquare,
  Lock,
  XCircle,
} from 'lucide-react';
import { initialAdminSafetyIncidentReports, type AdminSafetyIncidentReport } from '@/mock-data';
import { StatusPill } from '@/components/ui/StatusPill';

export function TrustSafetyReportDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const report = useMemo(() => {
    return initialAdminSafetyIncidentReports.find((r) => r.id === id || r.caseId === id) || initialAdminSafetyIncidentReports[0];
  }, [id]);

  const [activeReport, setActiveReport] = useState<AdminSafetyIncidentReport>(report);
  const [resolutionAction, setResolutionAction] = useState<'Dismiss' | 'Warning' | 'Take Down' | 'Suspend' | null>(null);
  const [justification, setJustification] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleExecuteAction = () => {
    if (!resolutionAction) return;

    let newStatus: 'Resolved' | 'Suspended' = 'Resolved';
    let outcome: 'Dismissed' | 'Warning Issued' | 'Content Removed' | 'Account Suspended' | 'Thread Locked' = 'Dismissed';

    if (resolutionAction === 'Dismiss') {
      newStatus = 'Resolved';
      outcome = 'Dismissed';
    } else if (resolutionAction === 'Warning') {
      newStatus = 'Resolved';
      outcome = 'Warning Issued';
    } else if (resolutionAction === 'Take Down') {
      newStatus = 'Resolved';
      outcome = 'Content Removed';
    } else if (resolutionAction === 'Suspend') {
      newStatus = 'Suspended';
      outcome = 'Account Suspended';
    }

    const note = justification.trim() || `Action: ${resolutionAction} executed by Admin.`;
    const now = 'Just now';

    const updatedTimeline = [
      ...activeReport.timeline,
      {
        event: `Resolution: ${outcome}`,
        actor: 'Trust & Safety Moderator',
        timestamp: now,
        note,
      },
    ];

    if (activeReport.entityType === 'Conversation' || activeReport.reporterNotified) {
      updatedTimeline.push({
        event: `Reporter notification dispatched to ${activeReport.reporterEmail}`,
        actor: 'System Notice Mailer',
        timestamp: now,
        note: `Notice: "Your report ${activeReport.caseId} has been resolved with action: ${outcome}."`,
      });
    }

    const updatedCase: AdminSafetyIncidentReport = {
      ...activeReport,
      status: newStatus,
      actionOutcome: outcome,
      resolutionNote: note,
      timeline: updatedTimeline,
      reporterNotified: true,
      slaStatus: 'Within SLA',
    };

    setActiveReport(updatedCase);
    setResolutionAction(null);
    setJustification('');
    showToast(`Case ${updatedCase.caseId} resolved with action: ${outcome}.`);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-primary/30 bg-card p-3.5 shadow-2xl text-xs animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
          <span className="font-semibold text-foreground">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/trust-safety')}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Return to Trust & Safety"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                TRUST & SAFETY &bull; CASEWORK INVESTIGATION
              </span>
              <span className="text-[10px] text-muted-foreground">&bull; TNS-1 / TNS-4</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Incident Case: {activeReport.caseId}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
              activeReport.severity === 'Critical'
                ? 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-950/40 dark:text-red-300'
                : activeReport.severity === 'High'
                ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300'
                : 'bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-950/40 dark:text-blue-300'
            }`}
          >
            {activeReport.severity} Severity
          </span>
          <StatusPill value={activeReport.status} />
        </div>
      </div>

      {/* Entity Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Target Under Review</span>
            <div className="text-base font-extrabold text-foreground">{activeReport.entityName}</div>
            <div className="text-xs text-muted-foreground">
              Entity Type: <span className="font-semibold text-foreground">{activeReport.entityType}</span> &bull; ID: <span className="font-mono">{activeReport.entityId}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Assigned Caseworker</span>
            <div className="text-sm font-bold text-foreground">{activeReport.assignedAdmin}</div>
            <div className="text-[11px] text-emerald-600 font-semibold">{activeReport.slaStatus}</div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground mb-1">Violation Description</label>
          <div className="p-3.5 rounded-xl border border-border bg-background text-xs text-foreground/90 leading-relaxed">
            {activeReport.description}
          </div>
        </div>

        {/* Evidence Highlights */}
        {activeReport.evidenceSnippets && activeReport.evidenceSnippets.length > 0 && (
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Flagged Evidence & Excerpts</label>
            <div className="space-y-1.5">
              {activeReport.evidenceSnippets.map((snippet, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-rose-200 bg-rose-50/60 p-3 text-xs font-mono text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200"
                >
                  "{snippet}"
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reporter Information Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Reporter Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground block text-[11px]">Submitted By</span>
            <span className="font-bold text-foreground">{activeReport.reporter}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Reporter Email</span>
            <span className="font-mono text-foreground">{activeReport.reporterEmail}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Notification State</span>
            <span className={`font-semibold ${activeReport.reporterNotified ? 'text-emerald-600' : 'text-amber-600'}`}>
              {activeReport.reporterNotified ? '✓ Resolution Notice Sent' : 'Pending Resolution'}
            </span>
          </div>
        </div>
      </div>

      {/* Casework Timeline */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Casework Timeline & Audit Log</h3>
        <div className="space-y-3 border-l-2 border-border pl-4 ml-1">
          {activeReport.timeline.map((item, idx) => (
            <div key={idx} className="relative text-xs">
              <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">{item.event}</span>
                <span className="text-[10px] text-muted-foreground">{item.timestamp}</span>
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Actor: {item.actor}</div>
              {item.note && (
                <div className="text-[11px] text-foreground/80 italic mt-1 bg-muted/40 p-2 rounded-lg">
                  "{item.note}"
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Enforcement Justification Dialog */}
      {resolutionAction && (
        <div className="rounded-2xl border-2 border-primary/40 bg-card p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-primary" />
            <h3 className="text-sm font-bold text-foreground">
              Confirm Enforcement: {resolutionAction}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Please record a formal casework note for why {resolutionAction} is the appropriate measure under platform Trust & Safety policies.
          </p>
          <textarea
            rows={3}
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="Enter reason note (e.g. Confirmed unverified advance fee request violating Section 4.2)..."
            className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setResolutionAction(null)}
              className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExecuteAction}
              className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 shadow-sm"
            >
              Confirm & Apply {resolutionAction}
            </button>
          </div>
        </div>
      )}

      {/* Action Toolbar */}
      {!resolutionAction && activeReport.status !== 'Resolved' && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Take Casework Action</h3>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setResolutionAction('Dismiss')}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Dismiss Report
              </button>
              <button
                type="button"
                onClick={() => setResolutionAction('Warning')}
                className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300"
              >
                Issue Formal Warning
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setResolutionAction('Take Down')}
                className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-700 transition-colors shadow-sm cursor-pointer"
              >
                Take Down Content
              </button>
              <button
                type="button"
                onClick={() => setResolutionAction('Suspend')}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
              >
                Suspend Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => navigate('/admin/trust-safety')}
          className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          Return to Trust & Safety
        </button>
      </div>
    </div>
  );
}
