import Link from 'next/link';
import { type LucideIcon, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
};
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      {Icon && (
        <span className="empty-state-icon">
          <Icon className="size-6" strokeWidth={1.4} />
        </span>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel &&
        (actionHref ? (
          <Link href={actionHref} className="gp-button gp-button-dark">
            {actionLabel}
            <ArrowUpRight size={15} />
          </Link>
        ) : onAction ? (
          <Button onClick={onAction}>{actionLabel}</Button>
        ) : null)}
    </div>
  );
}
