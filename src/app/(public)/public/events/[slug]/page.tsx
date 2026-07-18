import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarDays, Mail, MapPin } from 'lucide-react';
import { notFound } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createLandingPageService } from '@/features/landing-pages/services/supabase-landing-page-service';
import {
  defaultLandingPageConfig,
  landingPageConfigSchema,
} from '@/features/landing-pages/schemas/landing-page-schemas';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getPublishedEvent(slug: string) {
  const service = createLandingPageService();
  const result = await service.getPublishedEventBySlug(slug);

  if (result.error || !result.data) {
    return null;
  }

  return result.data;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublishedEvent(slug);

  if (!event) {
    return { title: 'Event not found' };
  }

  const config =
    landingPageConfigSchema.safeParse(event.landingPageConfig).data ??
    defaultLandingPageConfig(event.title);

  return {
    title: config.headline,
    description: config.subheadline || event.description || undefined,
    openGraph: {
      title: config.headline,
      description: config.subheadline || event.description || undefined,
      type: 'website',
    },
  };
}

export default async function PublicEventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getPublishedEvent(slug);

  if (!event) {
    notFound();
  }

  const config =
    landingPageConfigSchema.safeParse(event.landingPageConfig).data ??
    defaultLandingPageConfig(event.title);

  return (
    <main className="min-h-screen bg-background">
      <section
        className="border-b px-4 py-20 text-white sm:px-6 lg:px-8"
        style={{ backgroundColor: config.accentColor }}
      >
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium uppercase tracking-wide opacity-80">
            {event.eventType.replaceAll('_', ' ')}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
            {config.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg opacity-90">
            {config.subheadline || event.description}
          </p>
          <div className="mt-8">
            <Link
              href={`/public/events/${event.slug}/register`}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'bg-white text-foreground hover:bg-white/90'
              )}
            >
              Register
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="rounded-lg border bg-card p-5">
          <CalendarDays className="mb-3 size-5 text-primary" />
          <h2 className="font-medium">When</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {new Date(event.startsAt).toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            {new Date(event.endsAt).toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <MapPin className="mb-3 size-5 text-primary" />
          <h2 className="font-medium">Where</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {event.venueName ?? 'Venue to be announced'}
          </p>
          <p className="text-sm text-muted-foreground">
            {event.venueAddress}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <Mail className="mb-3 size-5 text-primary" />
          <h2 className="font-medium">Contact</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {config.contactEmail || 'Contact details coming soon'}
          </p>
        </div>
      </section>

      {config.agenda || config.venueNote ? (
        <section className="mx-auto grid max-w-5xl gap-6 px-4 pb-16 sm:px-6 md:grid-cols-2 lg:px-8">
          {config.agenda ? (
            <div>
              <h2 className="text-xl font-semibold">Agenda</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                {config.agenda}
              </p>
            </div>
          ) : null}
          {config.venueNote ? (
            <div>
              <h2 className="text-xl font-semibold">Venue notes</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                {config.venueNote}
              </p>
            </div>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}

