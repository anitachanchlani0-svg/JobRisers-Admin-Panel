interface StatusPillProps {
  value: string;
}

export function StatusPill({ value }: StatusPillProps) {
  const lower = value.toLowerCase();
  const classes = lower.includes('active') || lower === 'verified' || lower === 'live'
    ? 'bg-emerald-50 text-emerald-700'
    : lower.includes('pending') || lower.includes('review') || lower.includes('info') || lower === 'draft'
    ? 'bg-amber-50 text-amber-800'
    : lower.includes('reject') || lower.includes('suspend') || lower.includes('removed')
    ? 'bg-rose-50 text-rose-700'
    : 'bg-muted text-muted-foreground';
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-1 text-[9px] font-semibold ${classes}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />{value}
    </span>
  );
}