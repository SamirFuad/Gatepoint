'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCcw, Unplug } from 'lucide-react';
export function EventLoadError() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <div className="empty-state mb-16" role="status">
      <span className="empty-state-icon">
        <Unplug size={25} strokeWidth={1.3} />
      </span>
      <h3>We couldn’t bring the events together.</h3>
      <p>
        The event service is temporarily unavailable. Please try again in a
        moment.
      </p>
      <button
        type="button"
        className="gp-button gp-button-dark disabled:opacity-50"
        disabled={pending}
        onClick={() => startTransition(() => router.refresh())}
      >
        <RefreshCcw size={15} className={pending ? 'animate-spin' : ''} />
        {pending ? 'Trying again…' : 'Try again'}
      </button>
    </div>
  );
}
