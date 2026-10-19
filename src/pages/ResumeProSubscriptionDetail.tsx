import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Calendar,
  CreditCard,
  User,
  ShieldCheck,
  Zap,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { initialAdminCandidateSubscriptions, type AdminCandidateSubscription } from '@/mock-data';
import { StatusPill } from '@/components/ui/StatusPill';

export function ResumeProSubscriptionDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const sub = useMemo(() => {
    return initialAdminCandidateSubscriptions.find((s) => s.id === id) || initialAdminCandidateSubscriptions[0];
  }, [id]);

  const [subscription, setSubscription] = useState<AdminCandidateSubscription>(sub);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleIndexing = () => {
    const updated = {
      ...subscription,
      priorityRecruiterIndexing: !subscription.priorityRecruiterIndexing,
    };
    setSubscription(updated);
    showToast(
      `Priority recruiter indexing ${updated.priorityRecruiterIndexing ? 'enabled' : 'disabled'} for ${subscription.candidateName}.`
    );
  };

  const handleEntitlementChange = (key: string, val: boolean) => {
    const updated = {
      ...subscription,
      entitlements: {
        ...subscription.entitlements,
        [key]: val,
      },
    };
    setSubscription(updated);
    showToast(`Entitlement "${key}" updated.`);
  };

  const handleAction = (action: 'grant' | 'extend' | 'cancel' | 'restore') => {
    let updated = { ...subscription };
    if (action === 'grant') {
      updated.planName = 'JobRisers Pro Annual';
      updated.status = 'Active';
      showToast(`Manual Pro access granted to ${subscription.candidateName}.`);
    } else if (action === 'extend') {
      const parts = subscription.renewalDate.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      const nextDate = new Date(year, month, day);
      nextDate.setDate(nextDate.getDate() + 30);
      updated.renewalDate = nextDate.toISOString().split('T')[0];
      showToast(`Subscription extended +30 days for ${subscription.candidateName} (New Renewal: ${updated.renewalDate}).`);
    } else if (action === 'cancel') {
      updated.status = 'Cancelled';
      showToast(`Subscription cancelled for ${subscription.candidateName}. Access will terminate at period end.`);
    } else if (action === 'restore') {
      updated.status = 'Active';
      showToast(`Subscription restored to Active standing for ${subscription.candidateName}.`);
    }
    setSubscription(updated);
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
            onClick={() => navigate('/admin/resume-pro')}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Return to Resume Pro"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                RESUME PRO &bull; SUBSCRIPTION CASEWORK
              </span>
              <span className="text-[10px] text-muted-foreground">&bull; PRO-4 / PRO-17</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Manage Subscriber: {subscription.candidateName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusPill value={subscription.status} />
          <span className="rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs font-mono text-muted-foreground">
            {subscription.id}
          </span>
        </div>
      </div>

      {/* Subscriber Profile Banner */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-black text-lg">
              {subscription.candidateName.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="text-base font-bold text-foreground">{subscription.candidateName}</div>
              <div className="text-xs text-muted-foreground">{subscription.candidateEmail}</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-muted-foreground">Active Plan</div>
            <div className="text-sm font-extrabold text-foreground">{subscription.planName}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
          <div>
            <span className="text-muted-foreground block text-[11px]">Payment Gateway</span>
            <span className="font-bold text-foreground">{subscription.gateway}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Billing Currency</span>
            <span className="font-bold text-foreground">{subscription.currency}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Next Renewal Date</span>
            <span className="font-bold text-foreground font-mono">{subscription.renewalDate}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Lifetime Spend</span>
            <span className="font-bold text-foreground">${subscription.lifetimeValueUsd.toFixed(2)} USD</span>
          </div>
        </div>
      </div>

      {/* Spotlight Recruiter Indexing Toggle (PRO-17) */}
      <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-foreground">Priority Recruiter Indexing Spotlight (PRO-17)</h2>
          </div>
          <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
            When enabled, candidate's parsed resume vectors receive a priority weighting boost in talent network queries and employer candidate recommendations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggleIndexing}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            subscription.priorityRecruiterIndexing
              ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {subscription.priorityRecruiterIndexing ? '✓ Spotlight Active' : 'Spotlight Disabled'}
        </button>
      </div>

      {/* Feature Entitlements Matrix */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 border-b border-border pb-3">
          <ShieldCheck size={18} className="text-primary" />
          <h2 className="text-sm font-bold text-foreground">Plan Entitlements Override</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {Object.entries(subscription.entitlements).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background"
            >
              <div>
                <span className="font-semibold text-foreground capitalize block">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {value ? 'Feature enabled on account' : 'Disabled / restricted'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleEntitlementChange(key, e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Operational Actions */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-foreground">Administrative Casework Actions</h2>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleAction('grant')}
            className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Manual Grant Pro Access
          </button>

          <button
            type="button"
            onClick={() => handleAction('extend')}
            className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Extend Renewal +30 Days
          </button>

          {subscription.status !== 'Cancelled' ? (
            <button
              type="button"
              onClick={() => handleAction('cancel')}
              className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300"
            >
              Cancel Subscription
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleAction('restore')}
              className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              Restore Subscription
            </button>
          )}
        </div>
      </div>

      {/* Back button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => navigate('/admin/resume-pro')}
          className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          Return to Subscriptions
        </button>
      </div>
    </div>
  );
}
