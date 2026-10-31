// =============================================================
// Gatepoint — Empty State Component (v3)
// Redesigned: distinctive, purposeful, accessible
// =============================================================

import { type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

/**
 * Reusable empty state component.
 * Shows when a list or section has no data.
 *
 * @example
 * <EmptyState
 *   icon={Calendar}
 *   title="No events yet"
 *   description="Create your first event to get started."
 *   actionLabel="Create Event"
 *   onAction={() => router.push('/events/new')}
 * />
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/10 p-8 text-center transition-colors">
      {Icon && (
        <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-accent/80 ring-1 ring-primary/10">
          <Icon className="size-5 text-primary" />
        </div>
      )}
      <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-[280px] text-[13px] leading-relaxed text-muted-foreground">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-5 glow-cobalt" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
