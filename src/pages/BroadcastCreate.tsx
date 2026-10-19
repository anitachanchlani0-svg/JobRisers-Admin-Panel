import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  Sparkles,
  Bell,
  Eye,
  CheckCircle2,
  Calendar,
  Layers,
  Save,
} from 'lucide-react';
import { initialAdminBroadcasts, type AdminBroadcastCampaign } from '@/mock-data';

export function BroadcastCreatePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [targetSegment, setTargetSegment] = useState<AdminBroadcastCampaign['targetSegment']>('All Candidates');
  const [classification, setClassification] = useState<AdminBroadcastCampaign['classification']>('Product Update');
  const [channels, setChannels] = useState<('Email' | 'In-App' | 'Push')[]>(['Email', 'In-App']);
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [scheduledAt, setScheduledAt] = useState('2026-10-28 14:00');
  const [previewTab, setPreviewTab] = useState<'Email' | 'In-App' | 'Push'>('Email');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleToggleChannel = (ch: 'Email' | 'In-App' | 'Push') => {
    if (channels.includes(ch)) {
      if (channels.length > 1) {
        setChannels(channels.filter((c) => c !== ch));
      }
    } else {
      setChannels([...channels, ch]);
    }
  };

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Campaign title is required';
    if (!subject.trim()) newErrors.subject = 'Subject or push title is required';
    if (!messageBody.trim()) newErrors.messageBody = 'Message body cannot be empty';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newCampaign: AdminBroadcastCampaign = {
      id: `bc-${Date.now()}`,
      title: title.trim(),
      channels,
      targetSegment,
      classification,
      scheduledAt,
      status: 'Scheduled',
      subject: subject.trim(),
      messageBody: messageBody.trim(),
      recipientCount: targetSegment === 'All Candidates' ? 89000 : 14200,
      deliveryRate: 0.0,
      openRate: 0.0,
    };

    initialAdminBroadcasts.unshift(newCampaign);
    navigate('/admin/communication');
  };

  return (
    <div className="space-y-6">
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
        <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
          Broadcast Campaign Studio
        </span>
      </div>

      {/* 2. Header Workspace Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Send size={20} />
          </div>
          <div>
            <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
              Compose Outbound Broadcast Campaign
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Draft announcements, configure target audience segments, and schedule cross-channel dispatch.
            </p>
          </div>
        </div>
      </div>

      {/* 3. 2-Column Composer & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Form Configuration */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Layers size={15} className="text-primary" />
            Campaign Configuration
          </h2>

          <form onSubmit={handleSchedule} className="space-y-4 text-xs">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Campaign Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: '' });
                }}
                placeholder="e.g. Q4 Platform Upgrade & New ATS Features"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              />
              {errors.title && <p className="text-[11px] text-rose-600 mt-1">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Target Audience
                </label>
                <select
                  value={targetSegment}
                  onChange={(e) => setTargetSegment(e.target.value as any)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="All Candidates">All Candidates (89,000)</option>
                  <option value="All Employers">All Employers (3,200)</option>
                  <option value="Pro Users">JobRisers Pro Users (14,200)</option>
                  <option value="City: Bengaluru">Candidates in Bengaluru</option>
                  <option value="City: Mumbai">Candidates in Mumbai</option>
                  <option value="Category: Engineering">Engineering Candidates</option>
                  <option value="Category: Design">Design Candidates</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Classification (COM-10)
                </label>
                <select
                  value={classification}
                  onChange={(e) => setClassification(e.target.value as any)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="Product Update">Product Update (Informational / System)</option>
                  <option value="Marketing Promotion">Marketing Promotion (Requires Opt-in)</option>
                </select>
              </div>
            </div>

            {/* Channels Checklist */}
            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5">
                Dispatch Transport Channels
              </label>
              <div className="flex gap-4 text-xs">
                {(['Email', 'In-App', 'Push'] as const).map((ch) => (
                  <label key={ch} className="flex items-center gap-1.5 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={channels.includes(ch)}
                      onChange={() => handleToggleChannel(ch)}
                      className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                    />
                    <span>{ch}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Subject / Push Title *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  if (errors.subject) setErrors({ ...errors, subject: '' });
                }}
                placeholder="Subject line for email and push notification header..."
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              />
              {errors.subject && <p className="text-[11px] text-rose-600 mt-1">{errors.subject}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Message Body *
              </label>
              <textarea
                rows={5}
                value={messageBody}
                onChange={(e) => {
                  setMessageBody(e.target.value);
                  if (errors.messageBody) setErrors({ ...errors, messageBody: '' });
                }}
                placeholder="Compose announcement copy..."
                className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:outline-none focus:border-primary"
              />
              {errors.messageBody && <p className="text-[11px] text-rose-600 mt-1">{errors.messageBody}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Scheduled Dispatch Date & Time
              </label>
              <input
                type="text"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                placeholder="YYYY-MM-DD HH:mm"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-border">
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
                <Send size={14} />
                Schedule Broadcast Campaign
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Simulator Preview */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Eye size={15} className="text-primary" />
              Live Channel Preview
            </h2>
            <div className="flex items-center gap-1">
              {(['Email', 'In-App', 'Push'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setPreviewTab(tab)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    previewTab === tab
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {previewTab === 'Email' && (
            <div className="rounded-xl border border-border bg-white text-slate-900 p-6 shadow-sm space-y-3">
              <div className="border-b pb-3 text-xs space-y-1 text-slate-600">
                <div>From: <strong className="text-slate-900">JobRisers Platform &lt;alerts@jobrisers.com&gt;</strong></div>
                <div>To: <span className="font-mono text-primary font-semibold">{targetSegment}</span></div>
                <div>Subject: <strong className="text-slate-900">{subject || 'Enter subject line...'}</strong></div>
              </div>

              <div className="py-3 text-xs leading-relaxed text-slate-800 whitespace-pre-line min-h-[120px]">
                {messageBody || 'Announcement copy preview will render here in real-time...'}
              </div>

              <div className="border-t pt-3 text-[10px] text-slate-400 space-y-1">
                <div>JobRisers Inc. · 42 Indiranagar 100ft Rd, Bengaluru, KA 560038</div>
                <div>
                  You received this because you are subscribed to {classification}.{' '}
                  <span className="text-primary underline cursor-pointer">1-Click Unsubscribe</span>
                </div>
              </div>
            </div>
          )}

          {previewTab === 'In-App' && (
            <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex items-start gap-3">
              <Bell size={20} className="text-primary shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <h4 className="text-xs font-bold text-foreground">{subject || 'Notification Header'}</h4>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {messageBody || 'In-app notification banner message preview.'}
                </p>
              </div>
            </div>
          )}

          {previewTab === 'Push' && (
            <div className="max-w-sm mx-auto p-4 rounded-2xl border border-border bg-slate-900 text-white shadow-xl space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-bold flex items-center gap-1">
                  <Sparkles size={11} className="text-primary" /> JobRisers
                </span>
                <span>now</span>
              </div>
              <div className="text-xs font-bold text-white">{subject || 'Notification Title'}</div>
              <div className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                {messageBody || 'Push alert text body preview.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
