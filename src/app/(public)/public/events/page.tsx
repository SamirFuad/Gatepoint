import Image from 'next/image';
import { EventLoadError } from '@/components/events/event-load-error';
import { EventExplorer } from '@/components/events/event-explorer';
import { createEventService } from '@/features/events/services/supabase-event-service';
import { landingPageConfigSchema } from '@/features/landing-pages/schemas/landing-page-schemas';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Explore Events' };
export default async function PublicEventsPage() {
  const result = await createEventService().listPublished();

  return (
    <main className="site-container">
      <section className="discovery-heading">
        <div>
          <p className="eyebrow">Discover / Connect / Belong</p>
          <h1>
            Find your people.
            <br />
            <span>
              Make a little room
              <br />
              for possibility.
            </span>
          </h1>
          <p>
            Ideas worth sharing. People worth meeting. Discover what’s happening
            and be part of something.
          </p>
        </div>
        <div className="discovery-art">
          <Image
            src="/images/addis-ababa.jpg"
            alt="Aerial view of Addis Ababa, Ethiopia"
            fill
            preload
            sizes="(max-width: 650px) 100vw, 40vw"
          />
          <span>Your next connection starts here.</span>
        </div>
      </section>
      <>
        {result.error ? (
          <EventLoadError />
        ) : (
          <EventExplorer
            events={(result.data ?? []).map(
              ({
                id,
                slug,
                title,
                description,
                eventType,
                startsAt,
                venueName,
                timezone,
                landingPageConfig,
              }) => ({
                id,
                slug,
                title,
                description,
                eventType,
                startsAt,
                venueName,
                timezone,
                coverImage:
                  landingPageConfigSchema.safeParse(landingPageConfig).data
                    ?.coverImage ?? null,
              })
            )}
          />
        )}
      </>
    </main>
  );
}
