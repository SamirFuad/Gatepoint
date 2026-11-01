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
  LayoutGrid,
  List,
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
  const [sort, setSort] = useState('soonest');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const types = [...new Set(events.map((event) => event.eventType))];
  const filtered = events
    .filter(
      (event) =>
        (type === 'all' || event.eventType === type) &&
        [event.title, event.description, event.venueName]
          .join(' ')
          .toLowerCase()
          .includes(query.trim().toLowerCase())
    )
    .sort((a, b) =>
      sort === 'title'
        ? a.title.localeCompare(b.title)
        : new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
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
      <div className="explorer-results-bar">
        <p className="explorer-count" role="status" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'event' : 'events'}
          {query || type !== 'all' ? ' found' : ' to explore'}
        </p>
        <div className="explorer-view-controls">
          {(query || type !== 'all') && (
            <button
              className="clear-filters"
              type="button"
              onClick={() => {
                setQuery('');
                setType('all');
              }}
            >
              Clear filters <X size={14} />
            </button>
          )}
          <label className="event-sort">
            <span className="sr-only">Sort events</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="soonest">Soonest first</option>
              <option value="title">Name A–Z</option>
            </select>
          </label>
          <div className="view-switch" role="group" aria-label="Event layout">
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={view === 'grid'}
              onClick={() => setView('grid')}
            >
              <LayoutGrid size={17} />
            </button>
            <button
              type="button"
              aria-label="List view"
              aria-pressed={view === 'list'}
              onClick={() => setView('list')}
            >
              <List size={17} />
            </button>
          </div>
        </div>
      </div>
      {filtered.length ? (
        <div
          className={'event-grid' + (view === 'list' ? ' event-list-view' : '')}
        >
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
                      sizes={
                        view === 'list'
                          ? '(max-width:650px) 100vw, 240px'
                          : '(max-width:650px) 100vw, (max-width:1100px) 50vw, 33vw'
                      }
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
