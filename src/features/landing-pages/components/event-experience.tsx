import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  CalendarDays,
  Check,
  Clock,
  MapPin,
  QrCode,
  Users,
} from 'lucide-react';
import type { Event } from '@/features/events/services/event-service.interface';
import type { LandingPageConfig } from '../schemas/landing-page-schemas';
import { accentTextColor, ETHIOPIAN_IMAGES } from '../lib/event-media';
import { EventGallery } from './event-gallery';
import { registrationUnavailable } from '@/features/registrations/lib/registration-availability';

export type EventHost = {
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  website?: string | null;
};
export function EventExperience({
  event,
  config,
  host,
  preview = false,
}: {
  event: Event;
  config: LandingPageConfig;
  host?: EventHost | null;
  preview?: boolean;
}) {
  const date = new Date(event.startsAt);
  const dateLabel = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: event.timezone,
  });
  const dayLabel = date.toLocaleDateString('en-US', {
    weekday: 'long',
    timeZone: event.timezone,
  });
  const timeLabel = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: event.timezone,
  });
  const endTime = new Date(event.endsAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: event.timezone,
  });
  const cover = config.coverImage ?? ETHIOPIAN_IMAGES[0];
  const registrationStatus = registrationUnavailable(event);
  const accentStyle = {
    '--event-accent': config.accentColor,
    '--event-on-accent': accentTextColor(config.accentColor),
  } as CSSProperties;
  const action = preview ? (
    <button type="button" className="event-register-button" disabled>
      Registration preview
      <ArrowUpRight size={18} />
    </button>
  ) : registrationStatus ? (
    <span className="event-register-button is-unavailable">
      {registrationStatus}
    </span>
  ) : (
    <Link
      href={'/public/events/' + event.slug + '/register'}
      className="event-register-button"
    >
      Reserve your place
      <ArrowUpRight size={18} />
    </Link>
  );
  return (
    <article
      className={'event-experience' + (preview ? ' is-preview' : '')}
      style={accentStyle}
    >
      {preview && (
        <div className="event-preview-notice">
          <span>Draft preview</span>This is how your guests will experience the
          page. Your event is not published by previewing.
        </div>
      )}
      <section className="event-immersive-hero">
        <Image
          src={cover.url}
          alt={cover.alt || 'Cover image for ' + event.title}
          fill
          priority
          sizes="100vw"
          className="event-cover-image"
          unoptimized={!cover.url.startsWith('/')}
        />
        <div className="event-cover-scrim" />
        <div className="event-hero-top">
          <Link
            href={
              preview
                ? '/events/' + event.id + '/landing-page'
                : '/public/events'
            }
          >
            <ArrowLeft size={16} />
            {preview ? 'Back to editing' : 'Explore gatherings'}
          </Link>
          <span>{event.eventType.replaceAll('_', ' ')}</span>
        </div>
        <div className="event-hero-content">
          <div className="event-hero-date">
            <span>{dayLabel}</span>
            <strong>
              {date.toLocaleDateString('en-US', {
                day: '2-digit',
                timeZone: event.timezone,
              })}
            </strong>
            <span>
              {date.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
                timeZone: event.timezone,
              })}
            </span>
          </div>
          <div>
            <div className="event-hero-host">
              {host?.name ?? 'A Gatepoint gathering'}
            </div>
            <h1>{config.headline}</h1>
            {(config.subheadline || event.description) && (
              <p>{config.subheadline || event.description}</p>
            )}
          </div>
        </div>
        <div className="event-hero-footer">
          <span>
            <MapPin size={15} />
            {event.venueName ?? 'Venue to be announced'}
          </span>
          <span>
            <Clock size={15} />
            {timeLabel} / {event.timezone.replaceAll('_', ' ')}
          </span>
        </div>
      </section>
      <div className="event-experience-body">
        <div className="event-editorial-content">
          <section className="event-about">
            <span className="event-section-icon">
              <Users size={23} strokeWidth={1.4} />
            </span>
            <h2>A reason to come together.</h2>
            <p>
              {event.description ||
                config.subheadline ||
                'Join us for a new opportunity to connect, learn, and share ideas.'}
            </p>
            {config.agenda && (
              <p className="whitespace-pre-line">{config.agenda}</p>
            )}
          </section>
          {Boolean(config.galleryImages.length) && (
            <section className="event-gallery-section">
              <h2>A glimpse of the experience.</h2>
              <p>
                Get to know the people, place, and details behind this
                gathering.
              </p>
              <EventGallery images={config.galleryImages} />
            </section>
          )}
          {Boolean(config.agendaItems?.length) && (
            <section className="event-schedule">
              <div className="event-section-heading">
                <h2>Make time for what matters.</h2>
                <span>The schedule</span>
              </div>
              {config.agendaItems!.map((item, index) => (
                <div key={index} className="event-agenda-row">
                  <time>{item.time}</time>
                  <div>
                    <h3>{item.title}</h3>
                    {item.speaker && <span>{item.speaker}</span>}
                    {item.description && <p>{item.description}</p>}
                  </div>
                  <span className="event-agenda-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              ))}
            </section>
          )}
          <section className="event-venue">
            <MapPin size={26} strokeWidth={1.3} />
            <h2>Meet us here.</h2>
            <h3>{event.venueName ?? 'Venue to be announced'}</h3>
            {event.venueAddress && <p>{event.venueAddress}</p>}
            {config.venueNote && (
              <p className="whitespace-pre-line">{config.venueNote}</p>
            )}
          </section>
          {host && (
            <section className="event-host-profile">
              <div className="event-host-avatar">
                {host.logoUrl ? (
                  <Image
                    src={host.logoUrl}
                    alt=""
                    fill
                    sizes="60px"
                    unoptimized
                  />
                ) : (
                  <Building2 size={26} strokeWidth={1.2} />
                )}
              </div>
              <div>
                <span>Your host</span>
                <h2>{host.name}</h2>
                {host.description && <p>{host.description}</p>}
                {host.website && /^https?:\/\//i.test(host.website) && (
                  <a
                    href={host.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Meet the organization
                    <ArrowUpRight size={15} />
                  </a>
                )}
              </div>
            </section>
          )}
        </div>
        <aside className="event-reservation">
          <div className="event-ticket-top">
            <QrCode size={29} strokeWidth={1.2} />
            <span>
              Your next
              <br />
              great connection.
            </span>
          </div>
          <h2>We’ll save you a place.</h2>
          <dl>
            <div>
              <dt>
                <CalendarDays size={16} />
                When
              </dt>
              <dd>
                {dateLabel}
                <span>
                  {timeLabel} – {endTime}
                </span>
              </dd>
            </div>
            <div>
              <dt>
                <MapPin size={16} />
                Where
              </dt>
              <dd>
                {event.venueName ?? 'Venue to be announced'}
                {event.venueAddress && <span>{event.venueAddress}</span>}
              </dd>
            </div>
            {event.maxAttendees && (
              <div>
                <dt>
                  <Users size={16} />
                  The gathering
                </dt>
                <dd>Up to {event.maxAttendees.toLocaleString()} guests</dd>
              </div>
            )}
          </dl>
          {action}
          <p className="event-ticket-note">
            <Check size={14} />
            Personal registration. Unique QR pass.
          </p>
          {config.contactEmail && (
            <a href={'mailto:' + config.contactEmail} className="event-contact">
              A question for the host?
              <ArrowUpRight size={14} />
            </a>
          )}
        </aside>
      </div>
      <section className="event-closing">
        <span>Good things happen when we gather.</span>
        <h2>
          Be part of
          <br />
          what happens next.
        </h2>
        {action}
      </section>
    </article>
  );
}
