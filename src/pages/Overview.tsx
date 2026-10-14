import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowDownRight, ArrowUpRight, CheckCircle2, Clock3, ListFilter } from 'lucide-react';
import { adminActivities, adminOverview, type AdminActivity } from '@/mock-data';
import { EmptyState, EmptyInline, Modal } from '@/components/ui';

const dashboardSections = ['Overview', 'Moderation queue summary', 'System health'];

export function Overview() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(dashboardSections[0]);
  const data = adminOverview;
  
  // Generic Action Modal for Dashboard interactions
  const [actionModal, setActionModal] = useState<{ title: string; subtitle: string; actionText: string; tone: string } | null>(null);

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
      setActionModal({ title: `Queue: ${label}`, subtitle: 'Detailed View', actionText: 'Open Queue', tone: 'primary' });
    }
  };

  if (!data) return <EmptyState title="No marketplace overview yet" detail="Metrics and review queues will appear here when available." />;

  const maxTrend = Math.max(1, ...(data.trend ?? []).flatMap((point) => [point.signups, point.jobs, point.applications]));

  return (
    <div className="space-y-5">
      <div className="mt-5 flex gap-1 overflow-x-auto border-b border-border no-scrollbar">
        {dashboardSections.map((section) => (
          <button key={section} onClick={() => setSelected(section)} aria-pressed={selected === section} className={`whitespace-nowrap border-b-2 px-3.5 py-2.5 text-[11px] font-bold transition-colors ${selected === section ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {section}
          </button>
        ))}
      </div>
      
      {selected !== dashboardSections[0] ? (
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 mt-5 overflow-x-auto">
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
                <thead><tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.12em] text-muted-foreground uppercase"><th className="py-3 px-2">QUEUE ITEM</th><th className="py-3 px-2">TYPE</th><th className="py-3 px-2">SUBMITTED</th><th className="py-3 px-2">RISK SCORE</th><th className="py-3 px-2">ACTION</th></tr></thead>
                <tbody className="divide-y divide-border/75">
                  <tr className="hover:bg-[#fbfaff]"><td className="py-4 px-2 text-[12px] font-bold">Data Platform Engineer</td><td className="py-4 px-2 text-xs text-muted-foreground font-medium">Job Listing</td><td className="py-4 px-2 text-xs text-muted-foreground font-medium">2 hrs ago</td><td className="py-4 px-2 text-xs text-rose-600 font-bold">High (Suspicious Links)</td><td className="py-4 px-2"><button onClick={() => navigate('/jobs')} className="border border-border hover:border-primary hover:text-primary transition-colors text-[11px] font-bold px-3 py-1.5 rounded-lg">Review</button></td></tr>
                  <tr className="hover:bg-[#fbfaff]"><td className="py-4 px-2 text-[12px] font-bold">Cloudframe Account</td><td className="py-4 px-2 text-xs text-muted-foreground font-medium">Employer Verification</td><td className="py-4 px-2 text-xs text-muted-foreground font-medium">3 hrs ago</td><td className="py-4 px-2 text-xs text-amber-600 font-bold">Medium</td><td className="py-4 px-2"><button onClick={() => navigate('/employers')} className="border border-border hover:border-primary hover:text-primary transition-colors text-[11px] font-bold px-3 py-1.5 rounded-lg">Review</button></td></tr>
                </tbody>
              </table>
            </div>
          )}
          {selected === 'System health' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold">System Health & API Status</h2>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 border border-border rounded-xl">
                    <h3 className="text-sm font-semibold mb-2">Core Services</h3>
                    <div className="flex justify-between items-center py-3 border-b border-border/50"><span className="text-[12px] font-medium">Database (PostgreSQL)</span><span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Operational</span></div>
                    <div className="flex justify-between items-center py-3 border-b border-border/50"><span className="text-[12px] font-medium">Search (Elasticsearch)</span><span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Operational</span></div>
                    <div className="flex justify-between items-center py-3"><span className="text-[12px] font-medium">Cache (Redis)</span><span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Operational</span></div>
                 </div>
                 <div className="p-4 border border-border rounded-xl">
                    <h3 className="text-sm font-semibold mb-2">External Integrations</h3>
                    <div className="flex justify-between items-center py-3 border-b border-border/50"><span className="text-[12px] font-medium">Payment Gateway (Stripe)</span><span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Operational</span></div>
                    <div className="flex justify-between items-center py-3 border-b border-border/50"><span className="text-[12px] font-medium">Email Delivery (SES)</span><span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Operational</span></div>
                    <div className="flex justify-between items-center py-3"><span className="text-[12px] font-medium">Storage (S3)</span><span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Operational</span></div>
                 </div>
              </div>
              <div className="p-5 border border-rose-200 rounded-xl bg-rose-50/30 flex justify-between items-center">
                 <div>
                   <h3 className="text-sm font-bold text-rose-800 mb-1">Recent Errors (Last 24h)</h3>
                   <p className="text-[11px] font-medium text-rose-600">12 failed email deliveries • 3 payment failures • 1 API rate limit hit</p>
                 </div>
                 <button onClick={() => setActionModal({ title: 'Error Logs', subtitle: 'Filtered view (Last 24h)', actionText: 'Export Logs', tone: 'primary' })} className="bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 transition-colors text-[11px] font-bold px-4 py-2 rounded-lg shadow-sm">View Detailed Logs</button>
              </div>
            </div>
          )}
        </section>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 mt-5" aria-label="Marketplace metrics">
            {(data.metrics ?? []).map((metric, index) => (
              <article key={metric.label} data-testid={`metric-card-${index}`} className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-[0_2px_12px_rgba(37,35,80,.025)] transition-transform duration-200 hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] font-semibold text-muted-foreground leading-tight line-clamp-2">{metric.label}</p>
                  <span className={`shrink-0 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${metric.direction === 'up' ? 'bg-emerald-50 text-emerald-700' : metric.direction === 'down' ? 'bg-rose-50 text-rose-700' : 'bg-muted text-muted-foreground'}`}>
                    {metric.direction === 'up' ? <ArrowUpRight size={12} /> : metric.direction === 'down' ? <ArrowDownRight size={12} /> : null}{metric.change}
                  </span>
                </div>
                <div className="mt-3.5 sm:mt-4 font-display text-[26px] sm:text-[29px] font-extrabold tracking-[-.04em]">{metric.value}</div>
                <div className="mt-1 text-[10px] text-muted-foreground truncate">Compared with previous period</div>
                <div className={`absolute bottom-0 left-0 h-[2px] w-full ${index % 2 ? 'bg-[#dcd4f6]' : 'bg-primary/45'}`} />
              </article>
            ))}
          </section>
          <section className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(330px,.9fr)]">
            <article className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-[14px] font-bold">Marketplace activity</h2>
                  <p className="mt-1 text-[11px] text-muted-foreground">New signups, job listings and applications</p>
                </div>
              </div>
              <div className="mt-7 flex h-[210px] items-end justify-between gap-2 border-b border-border pb-1 sm:gap-4 lg:gap-6 max-w-4xl mx-auto w-full">
                {(data.trend ?? []).slice(-7).map((point, index) => (
                  <div key={`${point.label}-${index}`} className="group flex h-full min-w-0 flex-1 flex-col justify-end items-center max-w-[80px]">
                    <div className="mb-2 flex h-full items-end justify-center gap-1 sm:gap-1.5 w-full">
                      {[['signups', point.signups, 'bg-primary'], ['jobs', point.jobs, 'bg-[#a99adf]'], ['applications', point.applications, 'bg-[#95c9bd]']].map(([key, value, color]) => (
                        <div key={String(key)} title={`${key}: ${value}`} className={`${color} w-full max-w-[12px] sm:max-w-[16px] xl:max-w-[18px] rounded-t-[3px] opacity-85 transition-opacity group-hover:opacity-100`} style={{ height: `${Math.max(3, Number(value) / maxTrend * 100)}%` }} />
                      ))}
                    </div>
                    <div className="truncate text-center text-[9px] font-medium text-muted-foreground">{point.label}</div>
                  </div>
                ))}
                {!data.trend?.length && <div className="flex w-full items-center justify-center text-xs text-muted-foreground">No trend data for this period.</div>}
              </div>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {[['Signups', 'bg-primary'], ['Jobs', 'bg-[#a99adf]'], ['Applications', 'bg-[#95c9bd]']].map(([label, color]) => (
                  <div key={label} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className={`h-2 w-2 rounded-sm ${color}`} />{label}
                  </div>
                ))}
              </div>
            </article>
            <article className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[14px] font-bold">Review queues</h2>
                  <p className="mt-1 text-[11px] text-muted-foreground">Items awaiting a decision</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0ecfc] text-primary"><ListFilter size={16} /></div>
              </div>
              <div className="mt-4 divide-y divide-border/80">
                {(data.queues ?? []).map((queue) => {
                  const tone: Record<string, string> = { blue: 'bg-sky-100 text-sky-700', violet: 'bg-violet-100 text-violet-700', amber: 'bg-amber-100 text-amber-800', red: 'bg-rose-100 text-rose-700', green: 'bg-emerald-100 text-emerald-700' };
                  return (
                    <div key={queue.label} className="flex items-center gap-3 py-3.5 cursor-pointer hover:bg-muted/30 transition-colors px-2 -mx-2 rounded-lg" onClick={() => handleQueueClick(queue.label)}>
                      <span className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-1.5 font-mono-ui text-[11px] font-semibold ${tone[queue.tone] ?? tone.violet}`}>{queue.count}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] font-semibold">{queue.label}</div>
                        <div className="mt-0.5 truncate text-[10px] text-muted-foreground">{queue.description}</div>
                      </div>
                      <CheckCircle2 size={15} className="text-muted-foreground/50" />
                    </div>
                  );
                })}
                {!data.queues?.length && <EmptyInline text="No open review queues." />}
              </div>
            </article>
          </section>
          <ActivityPanel items={adminActivities} />
        </>
      )}

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
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-[14px] font-bold">Recent activity</h2>
          <p className="mt-1 text-[11px] text-muted-foreground">A live trail of administrative actions</p>
        </div>
        <Activity size={17} className="text-muted-foreground/70" />
      </div>
      {items.length ? (
        <div className="divide-y divide-border/75">{items.slice(0, 6).map((item) => <ActivityRow key={item.id} item={item} />)}</div>
      ) : (
        <EmptyInline text="No administrative activity recorded yet." />
      )}
    </section>
  );
}

function ActivityRow({ item }: { item: AdminActivity }) {
  const dot: Record<string, string> = { blue: 'bg-sky-500', violet: 'bg-violet-500', amber: 'bg-amber-500', red: 'bg-rose-500', green: 'bg-emerald-500' };
  return (
    <div data-testid={`activity-${item.id}`} className="flex items-center gap-3 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-foreground">{item.actor.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
      <div className="min-w-0 flex-1 text-[11px] leading-relaxed"><span className="font-semibold">{item.actor}</span> <span className="text-muted-foreground">{item.action}</span> <span className="font-semibold">{item.target}</span></div>
      <span className={`h-2 w-2 shrink-0 rounded-full ${dot[item.tone] ?? 'bg-primary'}`} />
      <time className="shrink-0 text-[10px] text-muted-foreground">{item.time}</time>
    </div>
  );
}
