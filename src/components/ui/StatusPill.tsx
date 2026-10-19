interface StatusPillProps {
  value: string;
}

const EXACT_STATUS_STYLES: Record<string, string> = {
  // Emerald / Success
  active: 'bg-emerald-50 text-emerald-700',
  verified: 'bg-emerald-50 text-emerald-700',
  live: 'bg-emerald-50 text-emerald-700',
  published: 'bg-emerald-50 text-emerald-700',
  resolved: 'bg-emerald-50 text-emerald-700',
  success: 'bg-emerald-50 text-emerald-700',
  operational: 'bg-emerald-50 text-emerald-700',
  offered: 'bg-emerald-50 text-emerald-700',
  completed: 'bg-emerald-50 text-emerald-700',
  confirmed: 'bg-emerald-50 text-emerald-700',
  reviewed: 'bg-emerald-50 text-emerald-700',
  healthy: 'bg-emerald-50 text-emerald-700',
  pinned: 'bg-emerald-50 text-emerald-700',
  paid: 'bg-emerald-50 text-emerald-700',

  // Amber / Warning
  pending: 'bg-amber-50 text-amber-800',
  'pending review': 'bg-amber-50 text-amber-800',
  'under review': 'bg-amber-50 text-amber-800',
  'need info': 'bg-amber-50 text-amber-800',
  'needs approval': 'bg-amber-50 text-amber-800',
  'review suggested': 'bg-amber-50 text-amber-800',
  draft: 'bg-amber-50 text-amber-800',
  paused: 'bg-amber-50 text-amber-800',
  scheduled: 'bg-amber-50 text-amber-800',
  'feedback pending': 'bg-amber-50 text-amber-800',
  open: 'bg-amber-50 text-amber-800',
  monitoring: 'bg-amber-50 text-amber-800',
  investigating: 'bg-amber-50 text-amber-800',
  'needs attention': 'bg-amber-50 text-amber-800',
  'review taxonomy': 'bg-amber-50 text-amber-800',
  visible: 'bg-amber-50 text-amber-800',
  'waiting on customer': 'bg-amber-50 text-amber-800',
  medium: 'bg-amber-50 text-amber-800',
  grandfathered: 'bg-amber-50 text-amber-800',
  'in dispute': 'bg-amber-50 text-amber-800',

  // Rose / Destructive
  inactive: 'bg-rose-50 text-rose-700',
  suspended: 'bg-rose-50 text-rose-700',
  rejected: 'bg-rose-50 text-rose-700',
  'no-show': 'bg-rose-50 text-rose-700',
  cancelled: 'bg-rose-50 text-rose-700',
  removed: 'bg-rose-50 text-rose-700',
  expired: 'bg-rose-50 text-rose-700',
  flagged: 'bg-rose-50 text-rose-700',
  locked: 'bg-rose-50 text-rose-700',
  'action taken': 'bg-emerald-50 text-emerald-700',
  warned: 'bg-amber-50 text-amber-800',
  'high priority': 'bg-rose-50 text-rose-700',
  stuck: 'bg-rose-50 text-rose-700',
  high: 'bg-rose-50 text-rose-700',
  critical: 'bg-rose-50 text-rose-700',
  unresolved: 'bg-rose-50 text-rose-700',
  suppressed: 'bg-rose-50 text-rose-700',
  alert: 'bg-rose-50 text-rose-700',
  failed: 'bg-rose-50 text-rose-700',

  // Blue / Info
  applied: 'bg-blue-50 text-blue-700',
  shortlisted: 'bg-blue-50 text-blue-700',
  screening: 'bg-blue-50 text-blue-700',
  interview: 'bg-blue-50 text-blue-700',
  'in progress': 'bg-blue-50 text-blue-700',
  configured: 'bg-blue-50 text-blue-700',
  logged: 'bg-blue-50 text-blue-700',
  'updated today': 'bg-blue-50 text-blue-700',
  low: 'bg-blue-50 text-blue-700',
  boosted: 'bg-blue-50 text-blue-700',

  // Neutral / Slate
  closed: 'bg-slate-100 text-slate-700',
  dismissed: 'bg-slate-100 text-slate-700',
  archived: 'bg-slate-100 text-slate-700',
  refunded: 'bg-slate-100 text-slate-700',
};

export function StatusPill({ value }: StatusPillProps) {
  const normalized = value.trim().toLowerCase();
  const classes = EXACT_STATUS_STYLES[normalized] ?? 'bg-muted text-muted-foreground';

  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-1 text-[9px] font-semibold ${classes}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />{value}
    </span>
  );
}
