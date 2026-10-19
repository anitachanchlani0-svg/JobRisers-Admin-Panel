import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  Sparkles,
  Save,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { initialAdminJobAlerts, type AdminJobAlertQuery } from '@/mock-data';

export function JobAlertCreatePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('Remote India');
  const [frequency, setFrequency] = useState<'Instant' | 'Daily' | 'Weekly'>('Daily');
  const [channel, setChannel] = useState<'Email' | 'Push' | 'Email & Push'>('Email & Push');
  const [simulatedSubscribers, setSimulatedSubscribers] = useState(1500);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !role.trim()) return;

    const newAlert: AdminJobAlertQuery = {
      id: `alt-${Date.now()}`,
      title: title.trim(),
      role: role.trim(),
      location: location.trim(),
      subscribersCount: simulatedSubscribers,
      frequency,
      sendSuccessRate: 98.0,
      failuresCount: 0,
      status: 'Active',
      lastRun: 'Scheduled for next cycle',
      channel,
    };

    initialAdminJobAlerts.unshift(newAlert);
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
          New Alert Query Creator
        </span>
      </div>

      {/* 2. Header Workspace Card */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Bell size={20} />
          </div>
          <div>
            <h1 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
              Create Automated Job Alert Query
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Simulate candidate search queries, delivery channels, and automated dispatch cadence.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Form Card */}
      <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-foreground block mb-1">
              Alert Query Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer (React) · Bengaluru"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Target Role Taxonomy *
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Location Scope
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              >
                <option value="Remote India">Remote India</option>
                <option value="Bengaluru, India">Bengaluru, India</option>
                <option value="Mumbai, India">Mumbai, India</option>
                <option value="Pune / Hybrid">Pune / Hybrid</option>
                <option value="Hyderabad, India">Hyderabad, India</option>
                <option value="Delhi NCR">Delhi NCR</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Cadence Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              >
                <option value="Instant">Instant (Real-time upon job indexing)</option>
                <option value="Daily">Daily Digest (08:00 AM IST)</option>
                <option value="Weekly">Weekly Roundup (Monday morning)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Dispatch Transport Channel
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              >
                <option value="Email & Push">Email & Push (Highest Engagement)</option>
                <option value="Email">Email Only (SES Transport)</option>
                <option value="Push">Push Notification Only (FCM/APNs)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1">
              Simulated Initial Candidate Pool Size
            </label>
            <input
              type="number"
              min={10}
              max={100000}
              value={simulatedSubscribers}
              onChange={(e) => setSimulatedSubscribers(Number(e.target.value))}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
            />
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
              Save Alert Query
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
