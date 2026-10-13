import { useState } from 'react';
import { Activity, ArrowDownRight, ArrowUpRight, CheckCircle2, Clock3, ListFilter } from 'lucide-react';
import { adminActivities, adminOverview, type AdminActivity } from '@/mock-data';

const dashboardSections = ['Overview', 'Moderation queue summary', 'System health'];

export function Overview() {
  const [selected, setSelected] = useState(dashboardSections[0]);
  const data = adminOverview;
  
  if (!data) return <EmptyState title="No marketplace overview yet" detail="Metrics and review queues will appear here when available." />;

  const maxTrend = Math.max(1, ...(data.trend ?? []).flatMap((point) => [point.signups, point.jobs, point.applications]));

  return (
    <div className="space-y-5">
      <div className="mt-5 flex gap-1 overflow-x-auto border-b border-border">
        {dashboardSections.map((section) => (
          <button key={section} onClick={() => setSelected(section)} aria-pressed={selected === section} className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-[10px] font-semibold transition-colors ${selected === section ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {section}
          </button>
        ))}
      </div>

      {selected !== dashboardSections[0] ? (
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 mt-5">
          <EmptyState title={`${selected} preview`} detail={`This section displays the ${selected.toLowerCase()} workflow.`} />
        </section>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 mt-5" aria-label="Marketplace metrics">
            {(data.metrics ?? []).map((metric, index) => (
              <article key={metric.label} data-testid={`metric-card-${index}`} className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-[0_2px_12px_rgba(37,35,80,.025)] transition-transform duration-200 hover:-translate-y-0.5">
                <div className="flex items-start justify-between">
                  <p className="text-[11px] font-semibold text-muted-foreground">{metric.label}</p>
                  <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${metric.direction === 'up' ? 'bg-emerald-50 text-emerald-700' : metric.direction === 'down' ? 'bg-rose-50 text-rose-700' : 'bg-muted text-muted-foreground'}`}>
                    {metric.direction === 'up' ? <ArrowUpRight size={12} /> : metric.direction === 'down' ? <ArrowDownRight size={12} /> : null}{metric.change}
                  </span>
                </div>
                <div className="mt-4 font-display text-[29px] font-extrabold tracking-[-.04em]">{metric.value}</div>
                <div className="mt-1 text-[10px] text-muted-foreground">Compared with previous period</div>
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
              <div className="mt-7 flex h-[210px] items-end gap-2 border-b border-border pb-1 sm:gap-3">
                {(data.trend ?? []).slice(-7).map((point, index) => (
                  <div key={`${point.label}-${index}`} className="group flex h-full min-w-0 flex-1 flex-col justify-end">
                    <div className="mb-2 flex h-full items-end justify-center gap-[3px]">
                      {[['signups', point.signups, 'bg-primary'], ['jobs', point.jobs, 'bg-[#a99adf]'], ['applications', point.applications, 'bg-[#95c9bd]']].map(([key, value, color]) => (
                        <div key={String(key)} title={`${key}: ${value}`} className={`${color} w-full max-w-[13px] rounded-t-[3px] opacity-85 transition-opacity group-hover:opacity-100`} style={{ height: `${Math.max(3, Number(value) / maxTrend * 100)}%` }} />
                      ))}
                    </div>
                    <div className="truncate text-center text-[9px] text-muted-foreground">{point.label}</div>
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
                    <div key={queue.label} className="flex items-center gap-3 py-3.5">
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

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/70 p-8 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eeeafd] text-primary"><CheckCircle2 size={19} /></div>
      <h2 className="mt-4 text-[13px] font-bold">{title}</h2>
      <p className="mt-1 max-w-sm text-[11px] leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  );
}

function EmptyInline({ text }: { text: string }) {
  return <div className="flex items-center gap-2 py-5 text-[11px] text-muted-foreground"><CheckCircle2 size={15} className="text-emerald-600" />{text}</div>;
}
