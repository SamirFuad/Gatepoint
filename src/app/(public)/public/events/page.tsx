import Link from 'next/link';
import { CalendarDays, MapPin, ArrowRight } from 'lucide-react';
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
    <main className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Gatepoint events</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Explore upcoming events
            </h1>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
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

        <div className="h-px bg-border" />

        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/10 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-accent/80 ring-1 ring-primary/10">
              <CalendarDays className="size-5 text-primary" />
            </div>
            <h2 className="mt-4 text-sm font-semibold">No upcoming events</h2>
            <p className="mt-1.5 max-w-xs text-[13px] text-muted-foreground">
              Check back soon for newly published events.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/public/events/${event.slug}`}
                className="group relative overflow-hidden rounded-lg border bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:-translate-y-[1px]"
              >
                {/* Top accent */}
                <div className="h-[1px] w-full bg-gradient-to-r from-primary/50 via-primary/15 to-transparent" />

                <div className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    {event.eventType.replaceAll('_', ' ')}
                  </p>
                  <h2 className="mt-2 text-base font-semibold tracking-tight group-hover:text-primary transition-colors">{event.title}</h2>
                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {event.description ?? 'Event details coming soon.'}
                  </p>
                  <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2 text-xs">
                      <CalendarDays className="size-3.5 text-primary/60" />
                      <span className="font-mono tabular-nums">
                        {new Date(event.startsAt).toLocaleString()}
                      </span>
                    </p>
                    <p className="flex items-center gap-2 text-xs">
                      <MapPin className="size-3.5 text-primary/60" />
                      {event.venueName ?? 'Venue to be announced'}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-end">
                    <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground/40 transition-all group-hover:gap-1.5 group-hover:text-primary">
                      <span className="text-[11px] opacity-0 transition-opacity group-hover:opacity-100">View event</span>
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
