import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  Eye,
  CheckCircle2,
  Calendar,
  Users,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Bell,
  Check,
} from 'lucide-react';
import { initialAdminBroadcasts, type AdminBroadcastCampaign } from '@/mock-data';
import { StatusPill } from '@/components/ui';

export function BroadcastDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [broadcastsList, setBroadcastsList] = useState<AdminBroadcastCampaign[]>(initialAdminBroadcasts);
  const [previewChannelTab, setPreviewChannelTab] = useState<'Email' | 'In-App' | 'Push'>('Email');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const broadcast = broadcastsList.find((b) => b.id === id) || broadcastsList[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCancelBroadcast = () => {
    setBroadcastsList((prev) =>
      prev.map((b) => (b.id === broadcast.id ? { ...b, status: 'Draft' } : b))
    );
    showToast(`Campaign "${broadcast.title}" has been moved to Draft status.`);
  };

  if (!broadcast) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/communication"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Back to Communication
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-base font-bold text-foreground">Broadcast Not Found</h2>
          <p className="text-xs text-muted-foreground mt-1">No campaign matching identifier "{id}".</p>
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
            Campaign Ref: {broadcast.id}
          </span>
          <span className="rounded-md bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-bold">
            {broadcast.classification}
          </span>
        </div>
      </div>

      {/* 2. Primary Header Workspace Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Send size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl truncate">
                    {broadcast.title}
                  </h1>
                  <StatusPill value={broadcast.status} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Scheduled for <strong>{broadcast.scheduledAt}</strong> &bull; Target: <strong>{broadcast.targetSegment}</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {broadcast.status === 'Scheduled' && (
              <button
                type="button"
                onClick={handleCancelBroadcast}
                className="rounded-xl border border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100 px-3.5 py-2 text-xs font-bold transition-colors"
              >
                Cancel Scheduled Dispatch
              </button>
            )}
            <Link
              to="/admin/communication/broadcasts/new"
              className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90"
            >
              + Duplicate as New
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Performance & Transmission Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-muted-foreground">Target Recipients</div>
          <div className="mt-1 text-2xl font-black text-foreground">{broadcast.recipientCount.toLocaleString()}</div>
          <p className="text-[10px] text-muted-foreground mt-0.5">{broadcast.targetSegment}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-muted-foreground">Delivery Rate</div>
          <div className="mt-1 text-2xl font-black text-emerald-600">{broadcast.deliveryRate.toFixed(1)}%</div>
          <p className="text-[10px] text-muted-foreground mt-0.5">SES & In-App delivery</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-muted-foreground">Open / Click Rate</div>
          <div className="mt-1 text-2xl font-black text-primary">{broadcast.openRate.toFixed(1)}%</div>
          <p className="text-[10px] text-muted-foreground mt-0.5">Audience engagement</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-muted-foreground">Active Channels</div>
          <div className="mt-1 text-base font-extrabold text-foreground">{broadcast.channels.join(', ')}</div>
          <p className="text-[10px] text-muted-foreground mt-0.5">Multi-channel routing</p>
        </div>
      </div>

      {/* 4. Multi-Channel Preview Surface */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Eye size={15} className="text-primary" />
            Transmitted Multi-Channel Preview
          </h2>
          <div className="flex items-center gap-1">
            {(['Email', 'In-App', 'Push'] as const).map((channel) => (
              <button
                key={channel}
                type="button"
                onClick={() => setPreviewChannelTab(channel)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                  previewChannelTab === channel
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {channel} View
              </button>
            ))}
          </div>
        </div>

        {/* Email Preview */}
        {previewChannelTab === 'Email' && (
          <div className="rounded-xl border border-border bg-white text-slate-900 p-6 shadow-sm space-y-3 max-w-2xl mx-auto">
            <div className="border-b pb-3 text-xs space-y-1 text-slate-600">
              <div>From: <strong className="text-slate-900">JobRisers Platform &lt;alerts@jobrisers.com&gt;</strong></div>
              <div>To: <span className="font-mono text-primary font-semibold">{broadcast.targetSegment}</span></div>
              <div>Subject: <strong className="text-slate-900">{broadcast.subject}</strong></div>
            </div>

            <div className="py-3 text-xs leading-relaxed text-slate-800 whitespace-pre-line">
              {broadcast.messageBody}
            </div>

            <div className="border-t pt-3 text-[10px] text-slate-400 space-y-1">
              <div>JobRisers Inc. · 42 Indiranagar 100ft Rd, Bengaluru, KA 560038</div>
              <div>
                You received this because you are subscribed to {broadcast.classification}.{' '}
                <span className="text-primary underline cursor-pointer">1-Click Unsubscribe</span>
              </div>
            </div>
          </div>
        )}

        {/* In-App Preview */}
        {previewChannelTab === 'In-App' && (
          <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex items-start gap-3 max-w-xl mx-auto">
            <Bell size={20} className="text-primary shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <h4 className="text-xs font-bold text-foreground">{broadcast.subject}</h4>
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {broadcast.messageBody}
              </p>
            </div>
          </div>
        )}

        {/* Push Notification Preview */}
        {previewTabPush(broadcast)}
      </div>
    </div>
  );
}

function previewTabPush(broadcast: AdminBroadcastCampaign) {
  return (
    <div className="max-w-sm mx-auto p-4 rounded-2xl border border-border bg-slate-900 text-white shadow-xl space-y-1">
      <div className="flex items-center justify-between text-[10px] text-slate-400">
        <span className="font-bold flex items-center gap-1">
          <Sparkles size={11} className="text-primary" /> JobRisers
        </span>
        <span>now</span>
      </div>
      <div className="text-xs font-bold text-white">{broadcast.subject}</div>
      <div className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
        {broadcast.messageBody}
      </div>
    </div>
  );
}
