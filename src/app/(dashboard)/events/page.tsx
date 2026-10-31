import Link from 'next/link';
import { CalendarDays, Clock, Compass, Plus, Users, ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { EmptyState } from '@/components/common/empty-state';
import { cn } from '@/lib/utils';
import { createOrganizationService } from '@/features/organizations/services/supabase-organization-service';
import { createEventService } from '@/features/events/services/supabase-event-service';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Events',
};

// Status badge with semantic colors
function EventStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, string> = {
    published: 'status-published',
    draft: 'status-draft',
    cancelled: 'status-cancelled',
  };
  const cls = statusMap[status.toLowerCase()] ?? 'bg-muted text-muted-foreground border-border';
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
        cls
      )}
    >
      {status}
    </span>
  );
}

// Event type label
function EventTypeTag({ type }: { type?: string | null }) {
  if (!type) return null;
  return (
    <span className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
      {type}
    </span>
  );
}

export default async function EventsPage() {
  const organizationService = createOrganizationService();
  const organizationsResult = await organizationService.getUserOrganizations();

  if (organizationsResult.error) {
    throw new Error(organizationsResult.error.message);
  }

  const organization = organizationsResult.data?.[0];

  // No organization yet
  if (!organization) {
    return (
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 py-8 animate-fade-in-up">
        <div className="relative rounded-xl border bg-card p-8 overflow-hidden">
          {/* Subtle dot grid background */}
          <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Events
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight">
              <span className="text-gradient">Host an Event</span>
            </h1>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              You haven&apos;t created an event yet. Gatepoint will create a personal workspace
              automatically when you publish your first event.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/events/new"
                className={cn(buttonVariants({ size: 'lg' }), 'gap-2 glow-cobalt')}
              >
                <Plus className="size-4" />
                Create an Event
              </Link>
              <Link
                href="/public/events"
                className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'gap-2')}
              >
                <Compass className="size-4" />
                Browse Events
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const eventService = createEventService();
  const eventsResult = await eventService.list(
    organization.id,
    { page: 1, pageSize: 20 },
    undefined,
    { column: 'starts_at', direction: 'asc' }
  );

  if (eventsResult.error) {
    throw new Error(eventsResult.error.message);
  }

  const events = eventsResult.data?.data ?? [];

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 animate-fade-in-up">
      {/* Page header */}
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {organization.name}
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight">Events</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {events.length > 0
                ? `${events.length} event${events.length !== 1 ? 's' : ''} in this workspace`
                : 'Create and manage events for your organization.'}
            </p>
          </div>
          <Link
            href="/events/new"
            className={cn(buttonVariants({ size: 'lg' }), 'shrink-0 gap-2 glow-cobalt')}
          >
            <Plus className="size-4" />
            New Event
          </Link>
        </div>
        {/* Thin divider */}
        <div className="mt-5 h-px bg-border" />
      </div>

      {/* Events list */}
      {events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No events yet"
          description="Create your first event to start collecting registrations."
          actionLabel="Create Event"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="group relative overflow-hidden rounded-lg border bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:-translate-y-[1px]"
            >
              {/* Top accent gradient line */}
              <div className="h-[1px] w-full bg-gradient-to-r from-primary/60 via-primary/20 to-transparent" />

              <div className="p-5">
                {/* Title row with status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                      {event.title}
                    </h2>
                  </div>
                  <EventStatusBadge status={event.status} />
                </div>

                {/* Structured metadata row */}
                <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3 shrink-0" />
                    <span className="font-mono tabular-nums">
                      {new Date(event.startsAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </span>
                  {typeof (event as Record<string, unknown>).type === 'string' ? (
                    <EventTypeTag type={String((event as Record<string, unknown>).type)} />
                  ) : null}
                </div>

                {event.description && (
                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {event.description}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="size-3" />
                    {event.maxAttendees
                      ? `Up to ${event.maxAttendees} attendees`
                      : 'No capacity limit'}
                  </div>
                  {/* Animated view arrow */}
                  <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground/40 transition-all duration-200 group-hover:gap-1.5 group-hover:text-primary">
                    <span className="hidden text-[11px] opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:inline">
                      View
                    </span>
                    <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
