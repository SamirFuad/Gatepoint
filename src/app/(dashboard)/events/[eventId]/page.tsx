import Link from 'next/link';
import {
  CalendarDays,
  ClipboardList,
  ExternalLink,
  MapPin,
  QrCode,
  Settings,
  Users,
  ArrowRight,
} from 'lucide-react';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

// Status badge with semantic colors
function DetailStatusBadge({ status, isPublished }: { status: string; isPublished?: boolean }) {
  const statusMap: Record<string, string> = {
    published: 'status-published',
    draft: 'status-draft',
    cancelled: 'status-cancelled',
  };
  const cls = statusMap[status.toLowerCase()] ?? '';
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize',
          cls
        )}
      >
        {status}
      </span>
      {isPublished && (
        <Badge variant="default" className="text-[10px]">Published</Badge>
      )}
    </div>
  );
}

const QUICK_ACTIONS = [
  { href: 'landing-page', icon: ExternalLink, label: 'Landing page' },
  { href: 'registrations', icon: ClipboardList, label: 'Form' },
  { href: 'attendees', icon: Users, label: 'Attendees' },
  { href: 'qr-codes', icon: QrCode, label: 'QR codes' },
  { href: 'settings', icon: Settings, label: 'Settings' },
];

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
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 animate-fade-in-up">
      {/* Page header */}
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <DetailStatusBadge status={event.status} isPublished={event.isPublished} />
            <h1 className="mt-3 text-2xl font-bold tracking-tight">
              {event.title}
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              {event.description ?? 'No description yet.'}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <form action={publishEventAction}>
              <input type="hidden" name="eventId" value={event.id} />
              <Button
                type="submit"
                disabled={event.status === 'published'}
                className="glow-cobalt"
              >
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
                Cancel Event
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-5 h-px bg-border" />
      </div>

      {/* Quick navigation links */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={`/events/${event.id}/${action.href}`}
            className="group flex items-center gap-2 rounded-lg border bg-card px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:text-foreground hover:shadow-sm"
          >
            <action.icon className="size-4 shrink-0 text-primary/60 transition-colors group-hover:text-primary" />
            <span className="truncate">{action.label}</span>
            <ArrowRight className="ml-auto size-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-50" />
          </Link>
        ))}
      </div>

      {/* Info cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card-stat p-5 pt-6">
          <CalendarDays className="mb-3 size-5 text-primary" />
          <div className="text-sm font-semibold">Schedule</div>
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60">From</span>
              <span className="font-mono text-xs tabular-nums">{new Date(event.startsAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60">To</span>
              <span className="font-mono text-xs tabular-nums">{new Date(event.endsAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="card-stat p-5 pt-6">
          <MapPin className="mb-3 size-5 text-primary" />
          <div className="text-sm font-semibold">Venue</div>
          <div className="mt-2 text-sm text-muted-foreground">
            {event.venueName ?? 'Not set'}
          </div>
          {event.venueAddress && (
            <div className="text-xs text-muted-foreground/70">
              {event.venueAddress}
            </div>
          )}
        </div>

        <div className="card-stat p-5 pt-6">
          <Users className="mb-3 size-5 text-primary" />
          <div className="text-sm font-semibold">Registrations</div>
          <div className="mt-3 text-3xl font-bold tabular-nums tracking-tight">
            {event.registrationCount ?? 0}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {event.maxAttendees
              ? `of ${event.maxAttendees} capacity`
              : 'unlimited capacity'}
          </div>
        </div>
      </div>
    </section>
  );
}
