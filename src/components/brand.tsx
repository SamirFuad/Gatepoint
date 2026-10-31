import { cn } from '@/lib/utils';

export function Brand({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={cn('brand', className)}>
      <svg
        className="brand-mark"
        viewBox="0 0 36 36"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M7 29V14C7 7.925 11.925 3 18 3s11 4.925 11 11v15h-7V14a4 4 0 0 0-8 0v15H7Z"
          fill="currentColor"
        />
        <path d="M17 23h14v6H17z" fill="currentColor" />
      </svg>
      {!compact && (
        <span>
          gatepoint<span className="brand-period">.</span>
        </span>
      )}
    </span>
  );
}
