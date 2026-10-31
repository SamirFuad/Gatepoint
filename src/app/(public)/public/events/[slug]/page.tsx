import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
} from 'lucide-react';
import { notFound } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createLandingPageService } from '@/features/landing-pages/services/supabase-landing-page-service';
import {
  defaultLandingPageConfig,
  landingPageConfigSchema,
} from '@/features/landing-pages/schemas/landing-page-schemas';
import { createClient } from '@/lib/supabase/server';

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

async function getOrganization(organizationId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('organizations')
    .select('name, slug, description, logo_url, website')
    .eq('id', organizationId)
    .single();

  return data;
}

function formatEventDate(dateString: string) {
  const date = new Date(dateString);
  return {
    weekday: date.toLocaleDateString(undefined, { weekday: 'long' }),
    date: date.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    time: date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
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

  const organization = await getOrganization(event.organizationId);

  const startsAt = formatEventDate(event.startsAt);
  const endsAt = formatEventDate(event.endsAt);

  return (
    <main className="min-h-screen bg-background">
      {/* ── Hero Section ── */}
      <section
        className="relative overflow-hidden border-b px-4 py-24 text-white sm:px-6 sm:py-28 lg:px-8 lg:py-32"
        style={{ backgroundColor: config.accentColor }}
      >
        {/* Subtle pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative mx-auto max-w-4xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider backdrop-blur-sm">
            {event.eventType.replaceAll('_', ' ')}
          </p>

          <h1 className="mt-8 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {config.headline}
          </h1>

          {(config.subheadline || event.description) ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-90 sm:text-xl">
              {config.subheadline || event.description}
            </p>
          ) : null}

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={`/public/events/${event.slug}/register`}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'h-12 gap-2 bg-white px-8 text-sm font-semibold text-foreground shadow-lg hover:bg-white/90 active:scale-[0.98]'
              )}
            >
              Register now
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* Quick date/location summary */}
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm opacity-80">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="size-4" />
              {startsAt.date}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="size-4" />
              {startsAt.time}
            </span>
            {event.venueName ? (
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4" />
                {event.venueName}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      {/* ── Info Cards ── */}
      <section className="mx-auto grid max-w-5xl gap-5 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="card-stat rounded-xl border bg-card p-6">
          <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <CalendarDays className="size-5 text-primary" />
          </div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            When
          </h2>
          <p className="mt-2 font-medium">
            {startsAt.weekday}, {startsAt.date}
          </p>
          <p className="mt-1 font-mono text-sm tabular-nums text-muted-foreground">
            {startsAt.time} — {endsAt.time}
          </p>
        </div>

        <div className="card-stat rounded-xl border bg-card p-6">
          <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <MapPin className="size-5 text-primary" />
          </div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Where
          </h2>
          <p className="mt-2 font-medium">
            {event.venueName ?? 'Venue to be announced'}
          </p>
          {event.venueAddress ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {event.venueAddress}
            </p>
          ) : null}
        </div>

        <div className="card-stat rounded-xl border bg-card p-6">
          <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Mail className="size-5 text-primary" />
          </div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Contact
          </h2>
          <p className="mt-2 font-medium">
            {config.contactEmail || 'Contact details coming soon'}
          </p>
        </div>
      </section>

      {/* ── Organization ── */}
      {organization ? (
        <section className="mx-auto max-w-5xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="rounded-xl border bg-card p-6 sm:p-8">
            <div className="flex items-start gap-5">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {organization.logo_url ? (
                  <Image
                    src={organization.logo_url}
                    alt={organization.name}
                    width={56}
                    height={56}
                    className="size-14 rounded-xl object-cover"
                    unoptimized
                  />
                ) : (
                  <Building2 className="size-7" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Organized by
                </p>
                <h2 className="mt-1 text-lg font-bold">
                  {organization.name}
                </h2>
                {organization.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {organization.description}
                  </p>
                ) : null}
                {organization.website ? (
                  <a
                    href={organization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    <ExternalLink className="size-3.5" />
                    {organization.website.replace(/^https?:\/\//, '')}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Agenda / Venue Notes ── */}
      {config.agenda || config.venueNote ? (
        <section className="mx-auto grid max-w-5xl gap-8 px-4 pb-16 sm:px-6 md:grid-cols-2 lg:px-8">
          {config.agenda ? (
            <div>
              <h2 className="text-lg font-bold">Agenda</h2>
              <div className="mt-1 h-0.5 w-8 rounded-full bg-primary" />
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {config.agenda}
              </p>
            </div>
          ) : null}
          {config.venueNote ? (
            <div>
              <h2 className="text-lg font-bold">Venue notes</h2>
              <div className="mt-1 h-0.5 w-8 rounded-full bg-primary" />
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {config.venueNote}
              </p>
            </div>
          ) : null}
        </section>
      ) : null}

      {/* ── Schedule Timeline ── */}
      {config.agendaItems && config.agendaItems.length > 0 ? (
        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold">Schedule</h2>
          <div className="mt-1 h-0.5 w-8 rounded-full bg-primary" />

          <div className="mt-6 space-y-0">
            {config.agendaItems.map((item, index) => (
              <div
                key={index}
                className="group relative flex gap-5 border-l-2 border-primary/15 py-5 pl-7 transition-colors hover:border-primary/40"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[5px] top-6 size-2 rounded-full bg-primary/30 transition-colors group-hover:bg-primary" />

                <div className="w-20 shrink-0 font-mono text-sm font-medium tabular-nums text-primary">
                  {item.time}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{item.title}</p>
                  {item.speaker ? (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {item.speaker}
                    </p>
                  ) : null}
                  {item.description ? (
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Bottom CTA ── */}
      <section className="border-t bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to attend?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Secure your spot now. Registration is quick and takes less than a
            minute.
          </p>
          <div className="mt-8">
            <Link
              href={`/public/events/${event.slug}/register`}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'h-12 gap-2 px-8 text-sm font-semibold shadow-sm active:scale-[0.98]'
              )}
            >
              Register now
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
