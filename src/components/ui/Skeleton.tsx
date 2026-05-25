export function SkeletonCard() {
  return (
    <div className="rounded-card p-4 shadow-card bg-warm-50 dark:bg-warm-800/50 space-y-3">
      <div className="flex gap-3">
        <div className="skeleton h-14 w-14 rounded-card shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
