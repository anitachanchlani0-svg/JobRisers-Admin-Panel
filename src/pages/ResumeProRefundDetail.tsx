import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Calendar,
  CreditCard,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  FileCheck2,
  XCircle,
} from 'lucide-react';
import { initialAdminCandidateRefunds, type AdminCandidateRefundRequest } from '@/mock-data';
import { StatusPill } from '@/components/ui/StatusPill';

export function ResumeProRefundDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const refund = useMemo(() => {
    return initialAdminCandidateRefunds.find((r) => r.id === id) || initialAdminCandidateRefunds[0];
  }, [id]);

  const [currentRefund, setCurrentRefund] = useState<AdminCandidateRefundRequest>(refund);
  const [isRejectMode, setIsRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = () => {
    const updated: AdminCandidateRefundRequest = {
      ...currentRefund,
      status: 'Approved',
      approvedDate: new Date().toISOString().split('T')[0],
      refundTransactionId: `tx-ref-${Date.now()}`,
    };
    setCurrentRefund(updated);
    showToast(`Refund of $${currentRefund.amount.toFixed(2)} approved. Credit note generated.`);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Please provide a casework justification for rejecting the refund request.');
      return;
    }
    const updated: AdminCandidateRefundRequest = {
      ...currentRefund,
      status: 'Rejected',
      notes: rejectReason.trim(),
    };
    setCurrentRefund(updated);
    setIsRejectMode(false);
    showToast(`Refund request ${currentRefund.id} rejected.`);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-primary/30 bg-card p-3.5 shadow-2xl text-xs animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
          <span className="font-semibold text-foreground">{toast}</span>
        </div>
      )}

      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/resume-pro')}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Return to Resume Pro"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                RESUME PRO &bull; REFUND CASEWORK
              </span>
              <span className="text-[10px] text-muted-foreground">&bull; PRO-5</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Refund Request: {currentRefund.id}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusPill value={currentRefund.status} />
          <span className="rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs font-mono text-muted-foreground">
            {currentRefund.invoiceId}
          </span>
        </div>
      </div>

      {/* Overview Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="text-sm font-extrabold text-foreground">{currentRefund.candidateName}</div>
            <div className="text-xs text-muted-foreground">{currentRefund.candidateEmail}</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-muted-foreground">Claim Amount</div>
            <div className="text-xl font-black text-foreground">${currentRefund.amount.toFixed(2)} USD</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground block text-[11px]">Request Date</span>
            <span className="font-bold text-foreground font-mono">{currentRefund.requestDate}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Subscription Started</span>
            <span className="font-bold text-foreground font-mono">{currentRefund.subscriptionStartDate}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Associated Invoice</span>
            <span className="font-mono text-primary font-bold">{currentRefund.invoiceId}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Payment Gateway</span>
            <span className="font-bold text-foreground">{currentRefund.gateway}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground mb-1.5">Candidate Stated Reason</label>
          <div className="p-3.5 rounded-xl border border-border bg-background text-xs text-foreground/90 leading-relaxed">
            "{currentRefund.reason}"
          </div>
        </div>
      </div>

      {/* 7-Day Money Back Guarantee Analysis */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck size={20} className="text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-sm font-bold text-foreground">7-Day Money-Back Guarantee Verification (PRO-5)</h2>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          The subscription was initiated on <strong>{currentRefund.subscriptionStartDate}</strong> and the refund ticket was lodged on <strong>{currentRefund.requestDate}</strong>.
        </p>
        <div className="flex items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-foreground">Automated Rule Assessment:</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              currentRefund.eligibilityStatus === 'Eligible'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
            }`}
          >
            ✓ {currentRefund.eligibilityStatus}
          </span>
        </div>
      </div>

      {/* Rejection Form Mode */}
      {isRejectMode && (
        <div className="rounded-2xl border border-rose-300 bg-rose-50/50 p-6 shadow-sm space-y-3 dark:border-rose-900/40 dark:bg-rose-950/20">
          <div className="flex items-center gap-2">
            <XCircle size={18} className="text-rose-600" />
            <h3 className="text-xs font-bold text-rose-800 dark:text-rose-300">
              Casework Rejection Justification
            </h3>
          </div>
          <textarea
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Explain why this request does not qualify under platform terms (e.g. submitted after 7-day guarantee window)..."
            className="w-full rounded-xl border border-rose-300 bg-background p-3 text-xs text-foreground focus:outline-none focus:border-rose-500"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsRejectMode(false)}
              className="rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReject}
              className="rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      )}

      {/* Casework Actions */}
      {currentRefund.status === 'Needs approval' && !isRejectMode && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-foreground">Resolution Actions</h2>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsRejectMode(true)}
              className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300"
            >
              Reject Refund Request...
            </button>
            <button
              type="button"
              onClick={handleApprove}
              className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
            >
              Approve & Issue Credit Note
            </button>
          </div>
        </div>
      )}

      {/* Return button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => navigate('/admin/resume-pro')}
          className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          Return to Refunds
        </button>
      </div>
    </div>
  );
}
