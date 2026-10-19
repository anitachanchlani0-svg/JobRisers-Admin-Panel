import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  Send,
  Sliders,
  Check,
} from 'lucide-react';
import { initialAdminJobAlerts, type AdminJobAlertQuery } from '@/mock-data';
import { StatusPill } from '@/components/ui';

export function JobAlertDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [alertsList, setAlertsList] = useState<AdminJobAlertQuery[]>(initialAdminJobAlerts);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const alert = alertsList.find((a) => a.id === id) || alertsList[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleStatus = () => {
    const nextStatus = alert.status === 'Active' ? 'Paused' : 'Active';
    setAlertsList((prev) =>
      prev.map((a) => (a.id === alert.id ? { ...a, status: nextStatus } : a))
    );
    showToast(`Alert query "${alert.title}" is now ${nextStatus}.`);
  };

  const handleTestDispatch = () => {
    showToast(`Test dispatch triggered for ${alert.title}. Synthesizing candidate match test.`);
  };

  if (!alert) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/communication"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Back to Communication
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-base font-bold text-foreground">Job Alert Not Found</h2>
          <p className="text-xs text-muted-foreground mt-1">No job alert matching query identifier "{id}".</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-primary/30 bg-card p-3 shadow-2xl text-xs font-semibold animate-in slide-in-from-bottom-2">
          <CheckCircle2 size={16} className="text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/communication"
          data-testid="link-back-to-communication"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          Back to Communication Operations
        </Link>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
            Alert Ref: {alert.id}
          </span>
          <span className="rounded-md bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-bold">
            {alert.channel}
          </span>
        </div>
      </div>

      {/* 2. Primary Header Workspace Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Bell size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl truncate">
                    {alert.title}
                  </h1>
                  <StatusPill value={alert.status} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  <MapPin size={12} />
                  <span>{alert.location}</span>
                  <span>&bull;</span>
                  <span>Target Role: <strong>{alert.role}</strong></span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestDispatch}
              className="rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
            >
              <Send size={13} />
              Simulate Test Run
            </button>
            <button
              type="button"
              onClick={handleToggleStatus}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                alert.status === 'Active'
                  ? 'border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {alert.status === 'Active' ? <Pause size={13} /> : <Play size={13} />}
              {alert.status === 'Active' ? 'Pause Alert Query' : 'Resume Alert Query'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-muted-foreground">Active Subscribers</div>
          <div className="mt-1 text-2xl font-black text-foreground">{alert.subscribersCount.toLocaleString()}</div>
          <p className="text-[10px] text-muted-foreground mt-0.5">Matching candidates enrolled</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-muted-foreground">Delivery Success Rate</div>
          <div className="mt-1 text-2xl font-black text-emerald-600">{alert.sendSuccessRate.toFixed(1)}%</div>
          <p className="text-[10px] text-muted-foreground mt-0.5">SES & FCM provider status</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-muted-foreground">Dispatch Frequency</div>
          <div className="mt-1 text-2xl font-black text-foreground">{alert.frequency}</div>
          <p className="text-[10px] text-muted-foreground mt-0.5">Cron trigger cadence</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-muted-foreground">Recent Failures</div>
          <div className="mt-1 text-2xl font-black text-rose-600">{alert.failuresCount}</div>
          <p className="text-[10px] text-muted-foreground mt-0.5">Suppressed or bounced</p>
        </div>
      </div>

      {/* 4. Query & Delivery Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Sliders size={15} className="text-primary" />
            Query Matching Rules & Taxonomy
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 rounded-xl border border-border bg-muted/20">
              <span className="text-muted-foreground">Role Taxonomy Match</span>
              <span className="font-bold text-foreground">{alert.role}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl border border-border bg-muted/20">
              <span className="text-muted-foreground">Geographic Scope</span>
              <span className="font-bold text-foreground">{alert.location}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl border border-border bg-muted/20">
              <span className="text-muted-foreground">Multi-channel Transport</span>
              <span className="font-bold text-primary">{alert.channel}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl border border-border bg-muted/20">
              <span className="text-muted-foreground">Last Dispatched At</span>
              <span className="font-semibold text-foreground">{alert.lastRun}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Clock size={15} className="text-primary" />
            Automated Delivery SLA & Throttling
          </h2>
          <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
            <p>
              Job alert queries automatically compile newly indexed jobs matching candidate filters over the selected cadence ({alert.frequency.toLowerCase()}).
            </p>
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-950 text-xs">
              <strong>Spam Prevention & Consent Safeguard:</strong> This alert query complies with DPDP Act 2023. Candidates can opt-out at any time via their profile notification settings or 1-click email unsubscribe.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
