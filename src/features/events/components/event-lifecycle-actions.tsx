'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Check, Globe, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ConfirmSubmit } from '@/components/common/confirm-submit';
import { publishEventAction, cancelEventAction } from '../actions';
export function EventLifecycleActions({
  eventId,
  status,
}: {
  eventId: string;
  status: string;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  const router = useRouter();
  function submit(
    event: React.FormEvent<HTMLFormElement>,
    operation: 'publish' | 'cancel'
  ) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setMessage('');
    startTransition(async () => {
      try {
        const result = await (operation === 'publish'
          ? publishEventAction(data)
          : cancelEventAction(data));
        setMessage(result.message ?? '');
        setFailed(!result.success);
        if (result.success) router.refresh();
      } catch {
        setFailed(true);
        setMessage('This change didn’t go through. Please try again.');
      }
    });
  }
  return (
    <div className="event-lifecycle">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={'/events/' + eventId + '/preview'}
          className="text-link mr-2"
        >
          Preview
          <ArrowUpRight size={15} />
        </Link>
        <form onSubmit={(event) => submit(event, 'publish')}>
          <input type="hidden" name="eventId" value={eventId} />
          <Button type="submit" disabled={pending || status === 'published'}>
            {pending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : status === 'published' ? (
              <Check size={16} />
            ) : (
              <Globe size={16} />
            )}{' '}
            {status === 'published' ? 'Published' : 'Publish event'}
          </Button>
        </form>
        <form onSubmit={(event) => submit(event, 'cancel')}>
          <input type="hidden" name="eventId" value={eventId} />
          <ConfirmSubmit
            title="Cancel this event?"
            description="Your event will stop accepting public registrations. Existing attendee records remain in your workspace. You can publish it again from here."
            confirmLabel="Cancel event"
            disabled={pending || status === 'cancelled'}
          >
            Cancel event
          </ConfirmSubmit>
        </form>
      </div>
      {message && (
        <p
          className={
            'mt-3 text-xs ' + (failed ? 'text-destructive' : 'text-primary')
          }
          role="status"
        >
          {message}
        </p>
      )}
    </div>
  );
}
