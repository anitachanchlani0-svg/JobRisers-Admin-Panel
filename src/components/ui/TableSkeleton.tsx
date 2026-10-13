export function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card p-5" aria-label="Loading records">
      <div className="skeleton h-8 w-full" />
      <div className="mt-4 space-y-4">
        {[1, 2, 3, 4, 5].map((n) => <div key={n} className="skeleton h-11 w-full" />)}
      </div>
    </div>
  );
}