'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Plus,
  Search,
  Users,
} from 'lucide-react';
import type { Event } from '@/features/events/services/event-service.interface';
import { EmptyState } from '@/components/common/empty-state';
type ManagedEvent = Pick<
  Event,
  | 'id'
  | 'title'
  | 'eventType'
  | 'status'
  | 'startsAt'
  | 'venueName'
  | 'description'
  | 'registrationCount'
  | 'maxAttendees'
  | 'timezone'
>;
export function EventManager({ events }: { events: ManagedEvent[] }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const filtered = events.filter(
    (event) =>
      (status === 'all' || event.status === status) &&
      [event.title, event.venueName]
        .join(' ')
        .toLowerCase()
        .includes(query.trim().toLowerCase())
  );
  return (
    <div>
      <div className="manager-toolbar">
        <div className="explorer-filters" aria-label="Filter events by status">
          {['all', 'published', 'draft', 'cancelled', 'completed'].map(
            (item) => (
              <button
                type="button"
                key={item}
                className="capitalize"
                onClick={() => setStatus(item)}
                aria-pressed={item === status}
              >
                {item === 'all' ? 'All events' : item}
              </button>
            )
          )}
        </div>
        <label className="event-search">
          <Search size={16} />
          <span className="sr-only">Search your events</span>
          <input
            type="search"
            placeholder="Find an event…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <p className="explorer-count mb-5" role="status">
        {filtered.length} {filtered.length === 1 ? 'event' : 'events'} in this
        view
      </p>
      {!filtered.length ? (
        <EmptyState
          icon={CalendarDays}
          title={
            events.length
              ? 'No events in this view.'
              : 'Your next great event starts here.'
          }
          description={
            events.length
              ? 'Try another search or status filter.'
              : 'Create your first event, then invite your audience. We’ll keep the details organized.'
          }
          actionLabel={events.length ? undefined : 'Create an event'}
          actionHref="/events/new"
        />
      ) : (
        <div className="managed-event-list">
          {filtered.map((event) => (
            <Link
              key={event.id}
              href={'/events/' + event.id}
              className="managed-event"
            >
              <div className="managed-event-date">
                <strong>
                  {new Date(event.startsAt).toLocaleDateString('en-US', {
                    day: '2-digit',
                    timeZone: event.timezone,
                  })}
                </strong>
                <span>
                  {new Date(event.startsAt).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                    timeZone: event.timezone,
                  })}
                </span>
              </div>
              <div className="managed-event-info">
                <span className="capitalize text-[10px] text-muted-foreground">
                  {event.eventType.replaceAll('_', ' ')}
                </span>
                <h2>{event.title}</h2>
                <p>
                  <MapPin size={12} />
                  {event.venueName ?? 'Venue to be announced'}
                </p>
              </div>
              <span className={'managed-event-status status-' + event.status}>
                {event.status}
              </span>
              <div className="managed-event-guests">
                <Users size={15} />
                <span>
                  {event.registrationCount ?? 0}
                  <span className="text-muted-foreground">
                    {event.maxAttendees ? ' / ' + event.maxAttendees : ''}
                  </span>
                </span>
                <small>registered</small>
              </div>
              <ArrowUpRight
                size={18}
                className="shrink-0 text-muted-foreground"
              />
            </Link>
          ))}
        </div>
      )}
      <Link href="/events/new" className="text-link mt-5">
        <Plus size={16} />
        Start something new
      </Link>
    </div>
  );
}
