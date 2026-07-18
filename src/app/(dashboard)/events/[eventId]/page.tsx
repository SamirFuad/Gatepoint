import Link from 'next/link';
import {
  CalendarDays,
  ClipboardList,
  ExternalLink,
  MapPin,
  QrCode,
  Settings,
  Users,
} from 'lucide-react';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  cancelEventAction,
  publishEventAction,
} from '@/features/events/actions';
import { createEventService } from '@/features/events/services/supabase-event-service';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Event Detail',
};

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const eventService = createEventService();
  const result = await eventService.getById(eventId);

  if (result.error || !result.data) {
    notFound();
  }

  const event = result.data;

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{event.status}</Badge>
            {event.isPublished ? <Badge>Published</Badge> : null}
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            {event.title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            {event.description ?? 'No description yet.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/events/${event.id}/landing-page`}
            className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}
          >
            <ExternalLink />
            Landing page
          </Link>
          <Link
            href={`/events/${event.id}/registrations`}
            className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}
          >
            <ClipboardList />
            Form
          </Link>
          <Link
            href={`/events/${event.id}/attendees`}
            className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}
          >
            <Users />
            Attendees
          </Link>
          <Link
            href={`/events/${event.id}/qr-codes`}
            className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}
          >
            <QrCode />
            QR codes
          </Link>
          <Link
            href={`/events/${event.id}/settings`}
            className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}
          >
            <Settings />
            Settings
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-5">
          <CalendarDays className="mb-3 size-5 text-primary" />
          <div className="text-sm font-medium">Schedule</div>
          <div className="mt-2 text-sm text-muted-foreground">
            {new Date(event.startsAt).toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date(event.endsAt).toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <MapPin className="mb-3 size-5 text-primary" />
          <div className="text-sm font-medium">Venue</div>
          <div className="mt-2 text-sm text-muted-foreground">
            {event.venueName ?? 'Not set'}
          </div>
          <div className="text-sm text-muted-foreground">
            {event.venueAddress ?? ''}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <div className="text-sm font-medium">Registrations</div>
          <div className="mt-3 text-3xl font-semibold">
            {event.registrationCount ?? 0}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {event.maxAttendees
              ? `of ${event.maxAttendees} capacity`
              : 'unlimited capacity'}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <form action={publishEventAction}>
          <input type="hidden" name="eventId" value={event.id} />
          <Button type="submit" disabled={event.status === 'published'}>
            Publish
          </Button>
        </form>
        <form action={cancelEventAction}>
          <input type="hidden" name="eventId" value={event.id} />
          <Button
            type="submit"
            variant="outline"
            disabled={event.status === 'cancelled'}
          >
            Cancel
          </Button>
        </form>
      </div>
    </section>
  );
}
