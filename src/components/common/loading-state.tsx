// =============================================================
// Gatepoint — Loading State Component
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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading...</p>
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
        <div key={i} className="rounded-lg border p-6">
          <Skeleton className="mb-4 h-4 w-3/4" />
          <Skeleton className="mb-2 h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
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
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
