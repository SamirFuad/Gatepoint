import Link from 'next/link';
import Image from 'next/image';
import { landingPageConfigSchema } from '@/features/landing-pages/schemas/landing-page-schemas';
import { registrationUnavailable } from '@/features/registrations/lib/registration-availability';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  CalendarDays,
  CheckCheck,
  MapPin,
  QrCode,
} from 'lucide-react';
import { PublicRegistrationForm } from '@/features/registrations/components/public-registration-form';
import { createLandingPageService } from '@/features/landing-pages/services/supabase-landing-page-service';
import { createRegistrationFormService } from '@/features/registration-forms/services/supabase-registration-form-service';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Reserve Your Place' };
export default async function PublicRegisterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const eventResult =
    await createLandingPageService().getPublishedEventBySlug(slug);
  if (eventResult.error || !eventResult.data) notFound();
  const event = eventResult.data;
  const unavailable = registrationUnavailable(event);
  if (unavailable)
    return (
      <main className="site-container py-16">
        <div className="empty-state">
          <span className="empty-state-icon">
            <CalendarDays size={25} />
          </span>
          <h1 className="text-3xl">{unavailable}</h1>
          <p>
            Visit the event page for the latest details and contact information.
          </p>
          <Link
            href={'/public/events/' + slug}
            className="gp-button gp-button-dark"
          >
            <ArrowLeft size={16} />
            Back to event
          </Link>
        </div>
      </main>
    );
  const coverImage = landingPageConfigSchema.safeParse(event.landingPageConfig)
    .data?.coverImage;
  const formResult = await createRegistrationFormService().getByEventId(
    event.id
  );
  if (formResult.error || !formResult.data || !formResult.data.isActive)
    return (
      <main className="site-container py-16">
        <div className="empty-state">
          <span className="empty-state-icon">
            <CalendarDays size={25} />
          </span>
          <h1 className="text-3xl">The invitation isn’t open just yet.</h1>
          <p>
            This event’s registration form is not active. Please check back
            soon.
          </p>
          <Link
            href={'/public/events/' + slug}
            className="gp-button gp-button-dark"
          >
            <ArrowLeft size={16} />
            Back to event
          </Link>
        </div>
      </main>
    );
  return (
    <main className="site-container py-12 sm:py-16">
      <Link href={'/public/events/' + slug} className="event-back">
        <ArrowLeft size={14} />
        Back to event
      </Link>
      <div className="registration-layout">
        <aside className="registration-story">
          {coverImage && (
            <div className="registration-story-cover">
              <Image
                src={coverImage.url}
                alt={coverImage.alt || event.title}
                fill
                sizes="(max-width:650px) 100vw, 40vw"
                unoptimized={!coverImage.url.startsWith('/')}
              />
            </div>
          )}
          <span className="event-tile-type capitalize">
            {event.eventType.replaceAll('_', ' ')}
          </span>
          <h1>
            You belong
            <br />
            in the room.
          </h1>
          <h2>{event.title}</h2>
          <div className="registration-meta">
            <p>
              <CalendarDays size={17} />
              {new Date(event.startsAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                timeZone: event.timezone,
              })}
            </p>
            <p>
              <MapPin size={17} />
              {event.venueName ?? 'Venue to be announced'}
            </p>
          </div>
          <div className="registration-promise">
            <QrCode size={27} strokeWidth={1.3} />
            <p>
              Your place. Your personal pass.
              <br />
              <span>
                Complete your registration to receive your event confirmation.
              </span>
            </p>
          </div>
          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCheck size={16} />
            One step closer to a great experience.
          </span>
        </aside>
        <div className="registration-form">
          <PublicRegistrationForm event={event} form={formResult.data} />
        </div>
      </div>
    </main>
  );
}
