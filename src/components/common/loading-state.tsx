// =============================================================
// Gatepoint — Loading State Component (v3)
// Redesigned: polished, on-brand, accessible
// =============================================================

import { Skeleton } from '@/components/ui/skeleton';

/**
 * Full-page loading spinner.
 * Used as a fallback for Suspense boundaries and page loads.
 */
export function PageLoading() {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative size-9">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        </div>
        <p className="text-xs font-medium text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}

/**
 * Card-level loading skeleton.
 * Used within sections to show content is loading.
 */
export function CardLoading({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border bg-card p-6"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <Skeleton className="mb-4 h-4 w-2/5 rounded" />
          <Skeleton className="mb-2.5 h-3 w-full rounded" />
          <Skeleton className="h-3 w-3/5 rounded" />
        </div>
      ))}
    </div>
  );
}

/**
 * Table-level loading skeleton.
 * Used within data tables to show content is loading.
 */
export function TableLoading({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="border-b bg-muted/30 px-4">
        <Skeleton className="my-3 h-4 w-full" />
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-4 py-3.5">
            <Skeleton
              className="h-4 w-full rounded"
              style={{ animationDelay: `${i * 50}ms` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
