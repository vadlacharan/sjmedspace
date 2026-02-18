export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-border bg-card p-0 overflow-hidden">
      <div className="h-48 bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-2/3 rounded bg-muted" />
        <div className="flex gap-2 pt-2">
          <div className="h-5 w-16 rounded-full bg-muted" />
          <div className="h-5 w-16 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
