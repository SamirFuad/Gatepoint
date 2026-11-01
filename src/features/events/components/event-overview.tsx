import { CalendarDays, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { EventLifecycleActions } from './event-lifecycle-actions';
import { EventShare } from './event-share';
import type { Event } from '../services/event-service.interface';
function DetailStatusBadge({
  status,
  isPublished,
}: {
  status: string;
  isPublished?: boolean;
}) {
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
      {isPublished && status !== 'published' && (
        <Badge variant="default" className="text-[10px]">
          Published
        </Badge>
      )}
    </div>
  );
}

export function EventOverview({ event }: { event: Event }) {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 animate-fade-in-up">
      {/* Page header */}
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <DetailStatusBadge
              status={event.status}
              isPublished={event.isPublished}
            />
            <h1 className="mt-3 text-2xl font-bold tracking-tight">
              {event.title}
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              {event.description ?? 'No description yet.'}
            </p>
          </div>

          <EventLifecycleActions eventId={event.id} status={event.status} />
        </div>
        <div className="mt-5 h-px bg-border" />
      </div>
      {event.isPublished && event.status === 'published' && (
        <EventShare slug={event.slug} title={event.title} />
      )}
      {/* Event essentials */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card-stat p-5 pt-6">
          <CalendarDays className="mb-3 size-5 text-primary" />
          <div className="text-sm font-semibold">Schedule</div>
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60">
                From
              </span>
              <span className="font-mono text-xs tabular-nums">
                {new Date(event.startsAt).toLocaleString('en-US', {
                  timeZone: event.timezone,
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60">
                To
              </span>
              <span className="font-mono text-xs tabular-nums">
                {new Date(event.endsAt).toLocaleString('en-US', {
                  timeZone: event.timezone,
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {event.timezone.replaceAll('_', ' ')}
          </p>
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
