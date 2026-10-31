// =============================================================
// Gatepoint — Error State Component (v3)
// Redesigned: refined, on-brand, accessible
// =============================================================

import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

/**
 * Reusable error state component.
 * Shows when a data fetch or operation fails.
 *
 * @example
 * <ErrorState
 *   message="Failed to load events. Please try again."
 *   onRetry={() => refetch()}
 * />
 */
export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-destructive/15 bg-destructive/[0.03] p-8 text-center">
      <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-destructive/10 ring-1 ring-destructive/10">
        <AlertCircle className="size-5 text-destructive" />
      </div>
      <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-[300px] text-[13px] leading-relaxed text-muted-foreground">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-5 gap-1.5"
        >
          <RefreshCcw className="size-3.5" />
          Try again
        </Button>
      )}
    </div>
  );
}
