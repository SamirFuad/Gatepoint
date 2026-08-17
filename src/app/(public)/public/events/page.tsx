import Link from 'next/link';
import { CalendarDays, MapPin } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createEventService } from '@/features/events/services/supabase-event-service';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Explore Events',
};

export default async function PublicEventsPage() {
  const result = await createEventService().listPublished();

  if (result.error) {
    throw new Error(result.error.message);
  }

  const events = result.data ?? [];

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Gatepoint events</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Explore upcoming events
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Discover published events and register in a few steps.
            </p>
          </div>
          <Link
            href="/register"
            className={cn(buttonVariants({ variant: 'outline' }), 'w-fit')}
          >
            Create an account
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <CalendarDays className="mx-auto size-6 text-primary" />
            <h2 className="mt-4 font-medium">No upcoming events</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Check back soon for newly published events.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/public/events/${event.slug}`}
                className="rounded-lg border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <p className="text-sm font-medium text-primary">
                  {event.eventType.replaceAll('_', ' ')}
                </p>
                <h2 className="mt-2 text-lg font-semibold">{event.title}</h2>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                  {event.description ?? 'Event details coming soon.'}
                </p>
                <div className="mt-5 space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-primary" />
                    {new Date(event.startsAt).toLocaleString()}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="size-4 text-primary" />
                    {event.venueName ?? 'Venue to be announced'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
