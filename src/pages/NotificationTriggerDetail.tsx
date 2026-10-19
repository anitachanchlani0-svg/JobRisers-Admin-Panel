import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  Clock,
  CheckCircle2,
  Sliders,
  Save,
  Check,
  Shield,
  Layers,
} from 'lucide-react';
import { initialAdminNotificationTriggers, type AdminNotificationTriggerRule } from '@/mock-data';

export function NotificationTriggerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [triggersList, setTriggersList] = useState<AdminNotificationTriggerRule[]>(initialAdminNotificationTriggers);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const trigger = triggersList.find((t) => t.id === id) || triggersList[0];

  const [eventName, setEventName] = useState(trigger?.eventName || '');
  const [description, setDescription] = useState(trigger?.description || '');
  const [templateRef, setTemplateRef] = useState(trigger?.templateRef || '');
  const [priority, setPriority] = useState<AdminNotificationTriggerRule['priority']>(trigger?.priority || 'Normal');
  const [rateLimit, setRateLimit] = useState(trigger?.rateLimit || '');
  const [isEnabled, setIsEnabled] = useState(trigger?.isEnabled ?? true);
  const [channels, setChannels] = useState(trigger?.channels || { email: true, inApp: true, push: false, sms: false });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setTriggersList((prev) =>
      prev.map((t) =>
        t.id === trigger.id
          ? {
              ...t,
              eventName,
              description,
              templateRef,
              priority,
              rateLimit,
              isEnabled,
              channels,
            }
          : t
      )
    );
    showToast(`Trigger settings for "${eventName}" saved successfully.`);
  };

  if (!trigger) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/communication"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Back to Communication
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-base font-bold text-foreground">Trigger Rule Not Found</h2>
          <p className="text-xs text-muted-foreground mt-1">No trigger matching identifier "{id}".</p>
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
            Trigger: {trigger.id}
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isEnabled ? 'bg-emerald-50 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
            {isEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>

      {/* 2. Primary Header Workspace Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Sliders size={20} />
            </div>
            <div>
              <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
                Configure Trigger &bull; {trigger.eventName}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Event Key: <code className="font-mono text-primary font-bold">{trigger.eventKey}</code> &bull; Priority: <strong>{trigger.priority}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEnabled(!isEnabled)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
                isEnabled
                  ? 'border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isEnabled ? 'Disable Trigger' : 'Enable Trigger'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Form Configuration Grid */}
      <div className="max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="text-xs font-bold text-foreground block mb-1">
              Trigger Display Name *
            </label>
            <input
              type="text"
              required
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1">
              Operational Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Transactional Template Reference Key
              </label>
              <input
                type="text"
                value={templateRef}
                onChange={(e) => setTemplateRef(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Dispatch Priority Tier
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              >
                <option value="High">High (Immediate SES / FCM Dispatch)</option>
                <option value="Normal">Normal (Queued behind transactional messages)</option>
                <option value="Low">Low (Batch processing digest)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1">
              Throttling & Rate Limit Window
            </label>
            <input
              type="text"
              value={rateLimit}
              onChange={(e) => setRateLimit(e.target.value)}
              placeholder="e.g. Instant (1 per stage move) or Max 1 alert / hour"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {/* Channels Toggles */}
          <div className="pt-2">
            <label className="text-xs font-bold text-foreground block mb-2">
              Transport Channels Activated
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['email', 'inApp', 'push', 'sms'] as const).map((ch) => (
                <label
                  key={ch}
                  className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                    channels[ch]
                      ? 'border-primary bg-primary/5 text-primary font-bold'
                      : 'border-border bg-card text-muted-foreground'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={channels[ch]}
                    onChange={(e) => setChannels({ ...channels, [ch]: e.target.checked })}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="uppercase text-[11px]">{ch}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => navigate('/admin/communication')}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 flex items-center gap-1.5"
            >
              <Save size={14} />
              Save Trigger Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
