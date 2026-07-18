import Link from 'next/link';
import { CalendarDays, Plus } from 'lucide-react';
import { redirect } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/empty-state';
import { cn } from '@/lib/utils';
import { createOrganizationService } from '@/features/organizations/services/supabase-organization-service';
import { createEventService } from '@/features/events/services/supabase-event-service';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Events',
};

export default async function EventsPage() {
  const organizationService = createOrganizationService();
  const organizationsResult = await organizationService.getUserOrganizations();

  if (organizationsResult.error) {
    throw new Error(organizationsResult.error.message);
  }

  const organization = organizationsResult.data?.[0];

  if (!organization) {
    redirect('/create-organization');
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
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Events</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create and manage events for {organization.name}.
          </p>
        </div>
        <Link
          href="/events/new"
          className={cn(buttonVariants({ size: 'lg' }), 'gap-2')}
        >
          <Plus />
          New event
        </Link>
      </div>

      {events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No events yet"
          description="Create your first event to start collecting registrations."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="rounded-lg border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-medium">{event.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(event.startsAt).toLocaleString()}
                  </p>
                </div>
                <Badge variant="secondary">{event.status}</Badge>
              </div>
              <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
                {event.description ?? 'No description yet.'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
