'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  Globe,
  QrCode,
  Settings,
  Users,
} from 'lucide-react';
const tabs = [
  { path: '', label: 'Overview', icon: CalendarDays },
  { path: '/landing-page', label: 'Event page', icon: Globe },
  { path: '/registrations', label: 'Registration form', icon: ClipboardList },
  { path: '/attendees', label: 'Attendees', icon: Users },
  { path: '/qr-codes', label: 'QR codes', icon: QrCode },
  { path: '/settings', label: 'Settings', icon: Settings },
];
export function EventNavigation({ eventId }: { eventId: string }) {
  const pathname = usePathname();
  const root = '/events/' + eventId;
  return (
    <div className="event-navigation">
      <Link className="event-back" href="/events">
        <ArrowLeft size={14} />
        All events
      </Link>
      <nav aria-label="Event navigation">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            href={root + tab.path}
            aria-current={pathname === root + tab.path ? 'page' : undefined}
          >
            <tab.icon size={15} />
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
