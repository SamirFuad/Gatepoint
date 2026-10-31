'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { EventImage } from '@/features/landing-pages/schemas/landing-page-schemas';
import {
  ArrowUpRight,
  CalendarDays,
  Compass,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import type { Event } from '@/features/events/services/event-service.interface';

type PublicEventSummary = Pick<
  Event,
  | 'id'
  | 'slug'
  | 'title'
  | 'description'
  | 'eventType'
  | 'startsAt'
  | 'venueName'
  | 'timezone'
> & { coverImage?: EventImage | null };

export function EventExplorer({ events }: { events: PublicEventSummary[] }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const types = [...new Set(events.map((event) => event.eventType))];
  const filtered = events.filter(
    (event) =>
      (type === 'all' || event.eventType === type) &&
      [event.title, event.description, event.venueName]
        .join(' ')
        .toLowerCase()
        .includes(query.trim().toLowerCase())
  );
  return (
    <div className="event-explorer">
      <div className="explorer-toolbar">
        <h2 className="text-xl font-medium">Find your next gathering</h2>
        <label className="event-search">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">Search events</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by event or venue"
          />
        </label>
      </div>
      <div className="explorer-filters" aria-label="Filter by event type">
        <button
          type="button"
          aria-pressed={type === 'all'}
          onClick={() => setType('all')}
        >
          All events
        </button>
        {types.map((item) => (
          <button
            type="button"
            key={item}
            aria-pressed={type === item}
            className="capitalize"
            onClick={() => setType(item)}
          >
            {item.replaceAll('_', ' ')}
          </button>
        ))}
      </div>
      <p className="explorer-count" role="status">
        {filtered.length} {filtered.length === 1 ? 'event' : 'events'}
        {query || type !== 'all' ? ' found' : ' to explore'}
      </p>
      {filtered.length ? (
        <div className="event-grid">
          {filtered.map((event) => {
            const date = new Date(event.startsAt);
            return (
              <Link
                href={`/public/events/${event.slug}`}
                key={event.id}
                className="event-tile"
              >
                <div
                  className={
                    'event-tile-art' + (event.coverImage ? ' has-cover' : '')
                  }
                >
                  {event.coverImage && (
                    <Image
                      src={event.coverImage.url}
                      alt={event.coverImage.alt || ''}
                      fill
                      sizes="(max-width:650px) 100vw, 33vw"
                      unoptimized={!event.coverImage.url.startsWith('/')}
                    />
                  )}
                  <div className="event-tile-date">
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
                  <Compass aria-hidden="true" />
                </div>
                <div className="event-tile-body">
                  <span className="event-tile-type capitalize">
                    {event.eventType.replaceAll('_', ' ')}
                  </span>
                  <h2>{event.title}</h2>
                  <p className="line-clamp-2">
                    {event.description ??
                      'A new opportunity to come together. View the event for details.'}
                  </p>
                  <div className="event-tile-meta">
                    <MapPin size={14} />
                    <span>{event.venueName ?? 'Venue to be announced'}</span>
                  </div>
                  <div className="event-tile-meta">
                    <CalendarDays size={14} />
                    <span>
                      {date.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                        timeZone: event.timezone,
                      })}
                    </span>
                  </div>
                  <span className="event-tile-link">
                    Discover this event
                    <ArrowUpRight size={17} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="empty-state mt-6">
          <span className="empty-state-icon">
            <CalendarDays size={24} strokeWidth={1.3} />
          </span>
          <h3>
            {events.length
              ? 'No events match just yet.'
              : 'The next great gathering is on its way.'}
          </h3>
          <p>
            {events.length
              ? 'Try another search or choose a different event type.'
              : 'Check back for upcoming events, or bring people together with an event of your own.'}
          </p>
          {events.length ? (
            <button
              type="button"
              className="gp-button gp-button-dark"
              onClick={() => {
                setQuery('');
                setType('all');
              }}
            >
              <X size={15} />
              Clear filters
            </button>
          ) : (
            <Link href="/events/new" className="gp-button gp-button-dark">
              Create an event
              <ArrowUpRight size={16} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
