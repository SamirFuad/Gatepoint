// =============================================================
// Gatepoint — Error State Component
// =============================================================

import { AlertCircle } from 'lucide-react';
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
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center">
      <div className="mb-4 rounded-full bg-destructive/10 p-3">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      <p className="mb-4 max-w-sm text-sm text-muted-foreground">
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
