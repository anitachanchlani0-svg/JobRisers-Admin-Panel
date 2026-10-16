import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  ListFilter,
  Calendar,
  SlidersHorizontal,
  ShieldAlert,
  CreditCard,
  Download,
  AlertTriangle,
  Megaphone,
  Briefcase,
  Building2,
  Check,
  ChevronDown,
  Layers,
  Sparkles,
  Info,
  X,
} from 'lucide-react';
import {
  adminActivities,
  adminOverview,
  adminInterviewDisputes,
  type AdminActivity,
} from '@/mock-data';
import { EmptyState, EmptyInline, Modal } from '@/components/ui';

const dashboardSections = ['Overview', 'Moderation queue summary', 'System health'];
export type DateRangeOption = 'Today' | '7D' | '30D' | '90D' | 'YTD' | 'Custom';
export type AdminRoleScope =
  | 'Super Admin'
  | 'Trust & Safety Admin'
  | 'Operations Admin'
  | 'Billing Admin'
  | 'Talent Ops Admin';

export function Overview() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(dashboardSections[0]);
  const data = adminOverview;

  // -------------------------------------------------------------
  // DSH-2: INTERACTIVE DATE RANGE SELECTOR
  // -------------------------------------------------------------
  const [dateRange, setDateRange] = useState<DateRangeOption>('7D');

  // Scale metrics based on active date range
  const metricsData = useMemo(() => {
    if (!data?.metrics) return [];
    const multiplierMap: Record<DateRangeOption, number> = {
      Today: 0.18,
      '7D': 1.0,
      '30D': 3.8,
      '90D': 10.5,
      YTD: 24.0,
      Custom: 1.5,
    };
    const mult = multiplierMap[dateRange];

    return data.metrics.map((metric) => {
      // Numerical base extraction
      const numMatch = metric.value.match(/[\d,.]+/);
      if (!numMatch) return metric;
      const originalNum = parseFloat(numMatch[0].replace(/,/g, ''));
      const scaled = Math.round(originalNum * mult);
      const prefix = metric.value.startsWith('₹') ? '₹' : '';
      const suffix = metric.value.endsWith('L') ? 'L' : metric.value.endsWith('%') ? '%' : '';
      const formattedValue = `${prefix}${scaled.toLocaleString()}${suffix}`;

      return {
        ...metric,
        value: metric.value.includes('%') ? metric.value : formattedValue,
        periodLabel:
          dateRange === 'Today'
            ? 'vs. yesterday'
            : dateRange === '7D'
            ? 'vs. previous 7 days'
            : dateRange === '30D'
            ? 'vs. previous 30 days'
            : dateRange === '90D'
            ? 'vs. previous quarter'
            : dateRange === 'YTD'
            ? 'vs. previous year'
            : 'custom window',
      };
    });
  }, [data?.metrics, dateRange]);

  // -------------------------------------------------------------
  // DSH-3: ACTIVITY TREND CONTROLS (SERIES TOGGLE & INTERVAL)
  // -------------------------------------------------------------
  const [activeSeries, setActiveSeries] = useState<{
    signups: boolean;
    jobs: boolean;
    applications: boolean;
  }>({
    signups: true,
    jobs: true,
    applications: true,
  });
  const [trendInterval, setTrendInterval] = useState<'Daily' | 'Weekly'>('Daily');

  const trendData = useMemo(() => {
    if (!data?.trend) return [];
    if (trendInterval === 'Weekly') {
      // Group points into 2 aggregated weekly buckets
      return [
        {
          label: 'Week 1-2',
          signups: (data.trend[0]?.signups || 40) + (data.trend[1]?.signups || 45),
          jobs: (data.trend[0]?.jobs || 15) + (data.trend[1]?.jobs || 20),
          applications: (data.trend[0]?.applications || 120) + (data.trend[1]?.applications || 140),
        },
        {
          label: 'Week 3-4',
          signups: (data.trend[2]?.signups || 55) + (data.trend[3]?.signups || 60),
          jobs: (data.trend[2]?.jobs || 25) + (data.trend[3]?.jobs || 30),
          applications: (data.trend[2]?.applications || 180) + (data.trend[3]?.applications || 210),
        },
      ];
    }
    return data.trend.slice(-7);
  }, [data?.trend, trendInterval]);

  const maxTrend = useMemo(() => {
    return Math.max(
      1,
      ...trendData.flatMap((p) => [
        activeSeries.signups ? p.signups : 0,
        activeSeries.jobs ? p.jobs : 0,
        activeSeries.applications ? p.applications : 0,
      ])
    );
  }, [trendData, activeSeries]);

  // -------------------------------------------------------------
  // DSH-7: ROLE-AWARE DASHBOARD SCOPES
  // -------------------------------------------------------------
  const [activeRoleScope, setActiveRoleScope] = useState<AdminRoleScope>('Super Admin');

  // -------------------------------------------------------------
  // DSH-9: PLATFORM INCIDENT / MAINTENANCE BANNER
  // -------------------------------------------------------------
  const [incidentBanner, setIncidentBanner] = useState<{
    enabled: boolean;
    severity: 'Info' | 'Warning' | 'Critical';
    message: string;
  }>({
    enabled: true,
    severity: 'Warning',
    message:
      'Scheduled Platform Maintenance: Automated ATS XML sync feeds will pause tonight 02:00–04:00 AM IST for database optimization.',
  });
  const [incidentModalOpen, setIncidentModalOpen] = useState(false);
  const [incidentForm, setIncidentForm] = useState(incidentBanner);

  // -------------------------------------------------------------
  // DSH-10: EXECUTIVE SNAPSHOT EXPORT
  // -------------------------------------------------------------
  const handleExportSnapshot = () => {
    const lines = [
      'JobRisers Admin Executive Snapshot Report',
      `Generated: ${new Date().toISOString()}`,
      `Date Range: ${dateRange}`,
      `Role Scope: ${activeRoleScope}`,
      '',
      '--- Top-Line Metrics ---',
      'Metric,Value,Trend,Period',
      ...metricsData.map((m) => `"${m.label}","${m.value}","${m.change}","${m.periodLabel}"`),
      '',
      '--- Active Review Queues ---',
      'Queue,Count,Tone',
      ...(data.queues || []).map((q) => `"${q.label}",${q.count},"${q.tone}"`),
      '',
      '--- Monetization Snapshot ---',
      'Total MRR,₹18.40 Lakhs',
      'Active Subscriptions,48 Accounts',
      'Job Credits Consumed (30D),412 Credits',
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `JobRisers_Executive_Snapshot_${dateRange}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // -------------------------------------------------------------
  // DSH-12: HIGH-PRIORITY DISPUTE ESCALATION STRIP
  // -------------------------------------------------------------
  const urgentDispute = adminInterviewDisputes.find((d) => d.status === 'Open') || adminInterviewDisputes[0];

  // Center Action Modal
  const [actionModal, setActionModal] = useState<{
    title: string;
    subtitle: string;
    actionText: string;
    tone: string;
  } | null>(null);

  const handleQueueClick = (label: string) => {
    const normalized = label.toLowerCase();
    if (normalized.includes('job')) {
      navigate('/jobs');
    } else if (normalized.includes('employer')) {
      navigate('/employers');
    } else if (normalized.includes('candidate')) {
      navigate('/candidates');
    } else if (normalized.includes('application')) {
      navigate('/applications');
    } else if (normalized.includes('safety') || normalized.includes('report')) {
      navigate('/trust-safety');
    } else if (normalized.includes('support') || normalized.includes('ticket')) {
      navigate('/support');
    } else {
      setActionModal({
        title: `Queue: ${label}`,
        subtitle: 'Detailed View',
        actionText: 'Open Queue',
        tone: 'primary',
      });
    }
  };

  if (!data) {
    return (
      <EmptyState
        title="No marketplace overview yet"
        detail="Metrics and review queues will appear here when available."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* DSH-9: INCIDENT / MAINTENANCE BANNER */}
      {/* ======================================================== */}
      {incidentBanner.enabled && (
        <div
          data-testid="banner-incident-alert"
          className={`rounded-2xl border p-4 shadow-sm flex items-start justify-between gap-3 ${
            incidentBanner.severity === 'Critical'
              ? 'bg-rose-50 border-rose-300 text-rose-950'
              : incidentBanner.severity === 'Warning'
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : 'bg-blue-50 border-blue-300 text-blue-950'
          }`}
        >
          <div className="flex items-start gap-3">
            <Megaphone
              size={18}
              className={`shrink-0 mt-0.5 ${
                incidentBanner.severity === 'Critical'
                  ? 'text-rose-600'
                  : incidentBanner.severity === 'Warning'
                  ? 'text-amber-600'
                  : 'text-blue-600'
              }`}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/70 shadow-2xs">
                  {incidentBanner.severity} Notice (DSH-9)
                </span>
                <span className="text-xs font-bold">Platform Broadcast</span>
              </div>
              <p className="text-xs mt-1 leading-relaxed opacity-90">{incidentBanner.message}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setIncidentForm(incidentBanner);
                setIncidentModalOpen(true);
              }}
              className="text-[11px] font-bold underline hover:opacity-80 px-2 py-1"
            >
              Configure
            </button>
            <button
              onClick={() => setIncidentBanner((prev) => ({ ...prev, enabled: false }))}
              aria-label="Dismiss banner"
              className="p-1 text-muted-foreground hover:text-foreground rounded-lg"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DSH-12: HIGH-PRIORITY DISPUTE ESCALATION STRIP */}
      {/* ======================================================== */}
      {urgentDispute && (
        <div
          data-testid="card-dispute-escalation-strip"
          className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm">
              <ShieldAlert size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-rose-950">
                  Priority Dispute Escalation (DSH-12)
                </span>
                <span className="rounded-full bg-rose-100 text-rose-800 px-2 py-0.5 text-[9px] font-bold border border-rose-200">
                  SLA: 4h Remaining
                </span>
                <span className="text-[10px] font-mono text-rose-700">Case ID: {urgentDispute.id}</span>
              </div>
              <p className="text-xs text-rose-800 mt-0.5">
                <strong>{urgentDispute.candidateName}</strong> filed a dispute against{' '}
                <strong>{urgentDispute.employerName}</strong> ({urgentDispute.reason}).
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/interviews')}
            className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-2xs shrink-0"
          >
            Mediate Dispute
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* CONTROLS HEADER: DSH-2 DATE RANGE & DSH-7 ROLE SCOPE */}
      {/* ======================================================== */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* DSH-2 Date Range Buttons */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-1.5">
              <Calendar size={13} className="text-primary" /> Active Time Window (DSH-2)
            </div>
            <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-border bg-muted/30 p-1 no-scrollbar">
              {(['Today', '7D', '30D', '90D', 'YTD', 'Custom'] as DateRangeOption[]).map((r) => (
                <button
                  key={r}
                  data-testid={`button-date-range-${r.toLowerCase()}`}
                  onClick={() => setDateRange(r)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                    dateRange === r
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* DSH-7 Role-Aware Scope Selector */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-1.5">
              <SlidersHorizontal size={13} className="text-primary" /> Role Dashboard Scope (DSH-7)
            </div>
            <select
              data-testid="select-role-scope"
              value={activeRoleScope}
              onChange={(e) => setActiveRoleScope(e.target.value as AdminRoleScope)}
              className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground outline-none focus:border-primary shadow-2xs"
            >
              <option value="Super Admin">Super Admin (All Workspaces)</option>
              <option value="Trust & Safety Admin">Trust & Safety Admin (Risk & Casework)</option>
              <option value="Operations Admin">Operations Admin (Directory & Pipeline)</option>
              <option value="Billing Admin">Billing Admin (MRR & Invoices)</option>
              <option value="Talent Ops Admin">Talent Ops Admin (Placements & Interviews)</option>
            </select>
          </div>
        </div>

        {/* ======================================================== */}
        {/* DSH-8: QUICK ACTIONS BAR */}
        {/* ======================================================== */}
        <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
              Quick Actions (DSH-8):
            </span>
            <button
              onClick={() => navigate('/employers')}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground hover:border-primary hover:text-primary transition-colors shadow-2xs"
            >
              <Building2 size={13} className="text-primary" /> Verify Employer
            </button>
            <button
              onClick={() => navigate('/jobs')}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground hover:border-primary hover:text-primary transition-colors shadow-2xs"
            >
              <Briefcase size={13} className="text-primary" /> Approve Job
            </button>
            <button
              onClick={() => {
                setIncidentForm(incidentBanner);
                setIncidentModalOpen(true);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground hover:border-primary hover:text-primary transition-colors shadow-2xs"
            >
              <Megaphone size={13} className="text-amber-600" /> Broadcast Alert
            </button>
          </div>

          {/* DSH-10 Export Snapshot */}
          <button
            onClick={handleExportSnapshot}
            data-testid="button-export-snapshot"
            className="flex items-center gap-1.5 rounded-lg bg-muted hover:bg-muted/80 px-3 py-1.5 text-xs font-bold text-foreground transition-colors shadow-2xs"
          >
            <Download size={13} /> Export Snapshot (CSV) (DSH-10)
          </button>
        </div>
      </div>

      {/* Top Navigation Sub-Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-border no-scrollbar">
        {dashboardSections.map((section) => (
          <button
            key={section}
            onClick={() => setSelected(section)}
            aria-pressed={selected === section}
            className={`whitespace-nowrap border-b-2 px-3.5 py-2.5 text-[11px] font-bold transition-colors ${
              selected === section
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      {selected !== dashboardSections[0] ? (
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 overflow-x-auto">
          {selected === 'Moderation queue summary' && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold">Moderation Queue Summary</h2>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-4 rounded-xl border border-border bg-muted/30">
                  <p className="text-sm text-muted-foreground font-semibold">Jobs Pending</p>
                  <p className="text-2xl font-bold text-amber-600 mt-2">42</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-muted/30">
                  <p className="text-sm text-muted-foreground font-semibold">Average Turnaround</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-2">1.8 hrs</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-muted/30">
                  <p className="text-sm text-muted-foreground font-semibold">Auto-approved (24h)</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">128</p>
                </div>
              </div>
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.12em] text-muted-foreground uppercase">
                    <th className="py-3 px-2">QUEUE ITEM</th>
                    <th className="py-3 px-2">TYPE</th>
                    <th className="py-3 px-2">SUBMITTED</th>
                    <th className="py-3 px-2">RISK SCORE</th>
                    <th className="py-3 px-2">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/75">
                  <tr className="hover:bg-[#fbfaff]">
                    <td className="py-4 px-2 text-[12px] font-bold">Data Platform Engineer</td>
                    <td className="py-4 px-2 text-xs text-muted-foreground font-medium">Job Listing</td>
                    <td className="py-4 px-2 text-xs text-muted-foreground font-medium">2 hrs ago</td>
                    <td className="py-4 px-2 text-xs text-rose-600 font-bold">High (Suspicious Links)</td>
                    <td className="py-4 px-2">
                      <button
                        onClick={() => navigate('/jobs')}
                        className="border border-border hover:border-primary hover:text-primary transition-colors text-[11px] font-bold px-3 py-1.5 rounded-lg"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#fbfaff]">
                    <td className="py-4 px-2 text-[12px] font-bold">Cloudframe Account</td>
                    <td className="py-4 px-2 text-xs text-muted-foreground font-medium">Employer Verification</td>
                    <td className="py-4 px-2 text-xs text-muted-foreground font-medium">3 hrs ago</td>
                    <td className="py-4 px-2 text-xs text-amber-600 font-bold">Medium</td>
                    <td className="py-4 px-2">
                      <button
                        onClick={() => navigate('/employers')}
                        className="border border-border hover:border-primary hover:text-primary transition-colors text-[11px] font-bold px-3 py-1.5 rounded-lg"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {selected === 'System health' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold">System Health & API Status (DSH-5)</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-border rounded-xl">
                  <h3 className="text-sm font-semibold mb-2">Core Services</h3>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-[12px] font-medium">Database (PostgreSQL)</span>
                    <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Operational
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-[12px] font-medium">Search (Elasticsearch)</span>
                    <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Operational
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-[12px] font-medium">Cache (Redis)</span>
                    <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Operational
                    </span>
                  </div>
                </div>
                <div className="p-4 border border-border rounded-xl">
                  <h3 className="text-sm font-semibold mb-2">External Integrations (Simulated)</h3>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-[12px] font-medium">Payment Gateway (Stripe)</span>
                    <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Operational
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-[12px] font-medium">Email Delivery (SES)</span>
                    <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Operational
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-[12px] font-medium">Storage (S3)</span>
                    <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Operational
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-5 border border-rose-200 rounded-xl bg-rose-50/30 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-rose-800 mb-1">Recent Errors (Last 24h)</h3>
                  <p className="text-[11px] font-medium text-rose-600">
                    12 failed email deliveries • 3 payment failures • 1 API rate limit hit
                  </p>
                </div>
                <button
                  onClick={() =>
                    setActionModal({
                      title: 'Error Logs',
                      subtitle: 'Filtered view (Last 24h)',
                      actionText: 'Export Logs',
                      tone: 'primary',
                    })
                  }
                  className="bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 transition-colors text-[11px] font-bold px-4 py-2 rounded-lg shadow-sm"
                >
                  View Detailed Logs
                </button>
              </div>
            </div>
          )}
        </section>
      ) : (
        <>
          {/* Top Metric Cards (DSH-1 & DSH-2 Dynamic Scaling) */}
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Marketplace metrics">
            {metricsData.map((metric, index) => (
              <article
                key={metric.label}
                data-testid={`metric-card-${index}`}
                className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-[0_2px_12px_rgba(37,35,80,.025)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] font-semibold text-muted-foreground leading-tight line-clamp-2">
                    {metric.label}
                  </p>
                  <span
                    className={`shrink-0 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${
                      metric.direction === 'up'
                        ? 'bg-emerald-50 text-emerald-700'
                        : metric.direction === 'down'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {metric.direction === 'up' ? (
                      <ArrowUpRight size={12} />
                    ) : metric.direction === 'down' ? (
                      <ArrowDownRight size={12} />
                    ) : null}
                    {metric.change}
                  </span>
                </div>
                <div className="mt-3.5 sm:mt-4 font-display text-[26px] sm:text-[29px] font-extrabold tracking-[-.04em]">
                  {metric.value}
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground truncate">{metric.periodLabel}</div>
                <div
                  className={`absolute bottom-0 left-0 h-[2px] w-full ${
                    index % 2 ? 'bg-[#dcd4f6]' : 'bg-primary/45'
                  }`}
                />
              </article>
            ))}
          </section>

          {/* DSH-11: EXECUTIVE REVENUE & MONETIZATION WIDGET */}
          <div
            data-testid="card-monetization-widget"
            className="rounded-2xl border border-border bg-gradient-to-r from-card via-card to-primary/[0.04] p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CreditCard size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">
                    Marketplace Monetization Standing (DSH-11)
                  </h3>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[9px] font-bold">
                    +18% MoM
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Monthly Recurring Revenue (MRR) & Active Employer Subscription Run-Rate.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="text-left">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Current MRR
                </div>
                <div className="font-display text-lg font-extrabold text-foreground">₹18.40 Lakhs</div>
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Paid Employers
                </div>
                <div className="font-display text-lg font-extrabold text-foreground">48 Tiers</div>
              </div>
              <button
                onClick={() => navigate('/employer-billing')}
                className="rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-bold text-foreground hover:border-primary hover:text-primary transition-colors shadow-2xs"
              >
                Manage Billing →
              </button>
            </div>
          </div>

          {/* DSH-3: ACTIVITY TREND CHART & CONTROLS */}
          <section className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(330px,.9fr)]">
            <article className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-[14px] font-bold">Marketplace Activity Trend (DSH-3)</h2>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Interactive volume tracking for candidate signups, job listings, and applications
                  </p>
                </div>

                {/* Interval switch */}
                <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-0.5">
                  {(['Daily', 'Weekly'] as const).map((interval) => (
                    <button
                      key={interval}
                      onClick={() => setTrendInterval(interval)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${
                        trendInterval === interval
                          ? 'bg-card text-foreground shadow-2xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {interval}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bar Chart Container */}
              <div className="mt-7 flex h-[210px] items-end justify-between gap-2 border-b border-border pb-1 sm:gap-4 lg:gap-6 max-w-4xl mx-auto w-full">
                {trendData.map((point, index) => (
                  <div
                    key={`${point.label}-${index}`}
                    className="group flex h-full min-w-0 flex-1 flex-col justify-end items-center max-w-[80px]"
                  >
                    <div className="mb-2 flex h-full items-end justify-center gap-1 sm:gap-1.5 w-full">
                      {activeSeries.signups && (
                        <div
                          title={`Signups: ${point.signups}`}
                          className="bg-primary w-full max-w-[12px] sm:max-w-[16px] xl:max-w-[18px] rounded-t-[3px] opacity-85 transition-opacity group-hover:opacity-100"
                          style={{ height: `${Math.max(4, (point.signups / maxTrend) * 100)}%` }}
                        />
                      )}
                      {activeSeries.jobs && (
                        <div
                          title={`Jobs: ${point.jobs}`}
                          className="bg-[#a99adf] w-full max-w-[12px] sm:max-w-[16px] xl:max-w-[18px] rounded-t-[3px] opacity-85 transition-opacity group-hover:opacity-100"
                          style={{ height: `${Math.max(4, (point.jobs / maxTrend) * 100)}%` }}
                        />
                      )}
                      {activeSeries.applications && (
                        <div
                          title={`Applications: ${point.applications}`}
                          className="bg-[#95c9bd] w-full max-w-[12px] sm:max-w-[16px] xl:max-w-[18px] rounded-t-[3px] opacity-85 transition-opacity group-hover:opacity-100"
                          style={{ height: `${Math.max(4, (point.applications / maxTrend) * 100)}%` }}
                        />
                      )}
                    </div>
                    <div className="truncate text-center text-[9px] font-medium text-muted-foreground">
                      {point.label}
                    </div>
                  </div>
                ))}
                {!trendData.length && (
                  <div className="flex w-full items-center justify-center text-xs text-muted-foreground">
                    No trend data for this period.
                  </div>
                )}
              </div>

              {/* DSH-3 Series Toggles */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40">
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveSeries((prev) => ({ ...prev, signups: !prev.signups }))
                    }
                    className={`flex items-center gap-2 text-[11px] font-bold px-2 py-1 rounded-lg border transition-all ${
                      activeSeries.signups
                        ? 'border-primary/40 bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground opacity-50'
                    }`}
                  >
                    <span className="h-2 w-2 rounded-sm bg-primary" /> Signups
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSeries((prev) => ({ ...prev, jobs: !prev.jobs }))}
                    className={`flex items-center gap-2 text-[11px] font-bold px-2 py-1 rounded-lg border transition-all ${
                      activeSeries.jobs
                        ? 'border-[#a99adf]/40 bg-[#a99adf]/10 text-indigo-700'
                        : 'border-border text-muted-foreground opacity-50'
                    }`}
                  >
                    <span className="h-2 w-2 rounded-sm bg-[#a99adf]" /> Jobs
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveSeries((prev) => ({ ...prev, applications: !prev.applications }))
                    }
                    className={`flex items-center gap-2 text-[11px] font-bold px-2 py-1 rounded-lg border transition-all ${
                      activeSeries.applications
                        ? 'border-[#95c9bd]/40 bg-[#95c9bd]/10 text-teal-800'
                        : 'border-border text-muted-foreground opacity-50'
                    }`}
                  >
                    <span className="h-2 w-2 rounded-sm bg-[#95c9bd]" /> Applications
                  </button>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Click series pills to toggle visibility
                </span>
              </div>
            </article>

            {/* Review Queues Panel */}
            <article className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[14px] font-bold">Review Queues (DSH-4)</h2>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Items awaiting administrative decision
                  </p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0ecfc] text-primary">
                  <ListFilter size={16} />
                </div>
              </div>
              <div className="mt-4 divide-y divide-border/80">
                {(data.queues ?? []).map((queue) => {
                  const tone: Record<string, string> = {
                    blue: 'bg-sky-100 text-sky-700',
                    violet: 'bg-violet-100 text-violet-700',
                    amber: 'bg-amber-100 text-amber-800',
                    red: 'bg-rose-100 text-rose-700',
                    green: 'bg-emerald-100 text-emerald-700',
                  };
                  return (
                    <div
                      key={queue.label}
                      className="flex items-center gap-3 py-3.5 cursor-pointer hover:bg-muted/30 transition-colors px-2 -mx-2 rounded-lg"
                      onClick={() => handleQueueClick(queue.label)}
                    >
                      <span
                        className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-1.5 font-mono-ui text-[11px] font-semibold ${
                          tone[queue.tone] ?? tone.violet
                        }`}
                      >
                        {queue.count}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] font-semibold">{queue.label}</div>
                        <div className="mt-0.5 truncate text-[10px] text-muted-foreground">
                          {queue.description}
                        </div>
                      </div>
                      <CheckCircle2 size={15} className="text-muted-foreground/50" />
                    </div>
                  );
                })}
                {!data.queues?.length && <EmptyInline text="No open review queues." />}
              </div>
            </article>
          </section>

          {/* Recent Activity Audit Stream */}
          <ActivityPanel items={adminActivities} />
        </>
      )}

      {/* DSH-9 Configure Incident Banner Modal */}
      {incidentModalOpen && (
        <Modal
          isOpen={incidentModalOpen}
          onClose={() => setIncidentModalOpen(false)}
          title="Platform Incident & Maintenance Broadcast (DSH-9)"
          subtitle="Publish a global high-visibility banner alert to administrators and platform users."
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <button
                onClick={() => setIncidentModalOpen(false)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIncidentBanner(incidentForm);
                  setIncidentModalOpen(false);
                }}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90"
              >
                Save & Broadcast Banner
              </button>
            </div>
          }
        >
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">Banner Active Status</label>
              <input
                type="checkbox"
                checked={incidentForm.enabled}
                onChange={(e) => setIncidentForm({ ...incidentForm, enabled: e.target.checked })}
                className="h-4 w-4 accent-primary"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-foreground">Alert Severity Level</label>
              <select
                value={incidentForm.severity}
                onChange={(e) =>
                  setIncidentForm({
                    ...incidentForm,
                    severity: e.target.value as 'Info' | 'Warning' | 'Critical',
                  })
                }
                className="mt-1 h-9 w-full rounded-xl border border-border bg-background px-3 text-xs font-medium text-foreground outline-none focus:border-primary"
              >
                <option value="Info">Info (General Announcement)</option>
                <option value="Warning">Warning (Scheduled Maintenance)</option>
                <option value="Critical">Critical (Service Disruption)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-foreground">Broadcast Message Text</label>
              <textarea
                value={incidentForm.message}
                onChange={(e) => setIncidentForm({ ...incidentForm, message: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-xs font-medium text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={Boolean(actionModal)}
        onClose={() => setActionModal(null)}
        title={actionModal?.title}
        subtitle={actionModal?.subtitle}
        maxWidth="max-w-[400px]"
        footer={
          <>
            <button
              onClick={() => setActionModal(null)}
              className="rounded-xl border border-border px-4 py-2.5 text-[11px] font-bold hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setActionModal(null)}
              className={`rounded-xl px-4 py-2.5 text-[11px] font-bold text-white transition hover:opacity-90 ${
                actionModal?.tone === 'rose'
                  ? 'bg-rose-600'
                  : actionModal?.tone === 'green'
                  ? 'bg-emerald-600'
                  : 'bg-primary'
              }`}
            >
              {actionModal?.actionText}
            </button>
          </>
        }
      />
    </div>
  );
}

function ActivityPanel({ items }: { items: AdminActivity[] }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-[14px] font-bold">Recent Administrative Activity (DSH-6)</h2>
          <p className="mt-1 text-[11px] text-muted-foreground">
            A live verifiable audit trail of admin actions
          </p>
        </div>
        <Activity size={17} className="text-muted-foreground/70" />
      </div>
      {items.length ? (
        <div className="divide-y divide-border/75">
          {items.slice(0, 6).map((item) => (
            <ActivityRow key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyInline text="No administrative activity recorded yet." />
      )}
    </section>
  );
}

function ActivityRow({ item }: { item: AdminActivity }) {
  const dot: Record<string, string> = {
    blue: 'bg-sky-500',
    violet: 'bg-violet-500',
    amber: 'bg-amber-500',
    red: 'bg-rose-500',
    green: 'bg-emerald-500',
  };
  return (
    <div data-testid={`activity-${item.id}`} className="flex items-center gap-3 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-foreground">
        {item.actor
          .split(' ')
          .map((part) => part[0])
          .slice(0, 2)
          .join('')}
      </div>
      <div className="min-w-0 flex-1 text-[11px] leading-relaxed">
        <span className="font-semibold">{item.actor}</span>{' '}
        <span className="text-muted-foreground">{item.action}</span>{' '}
        <span className="font-semibold">{item.target}</span>
      </div>
      <span className={`h-2 w-2 shrink-0 rounded-full ${dot[item.tone] ?? 'bg-primary'}`} />
      <time className="shrink-0 text-[10px] text-muted-foreground">{item.time}</time>
    </div>
  );
}

