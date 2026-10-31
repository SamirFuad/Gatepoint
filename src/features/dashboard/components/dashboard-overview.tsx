import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Compass,
  Plus,
  QrCode,
  Users,
  UserCheck,
} from 'lucide-react';
import { EmptyState } from '@/components/common/empty-state';
import type { Organization } from '@/features/organizations/services/organization-service.interface';
import type { OrganizerDashboard } from '../services/dashboard-service.interface';
function Status({ value }: { value: string }) {
  return (
    <span
      className={
        'rounded-full px-2.5 py-1 text-[10px] capitalize status-' + value
      }
    >
      {value.replaceAll('_', ' ')}
    </span>
  );
}
export function DashboardWelcome() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <div className="dashboard-greeting">
        <div>
          <p className="greeting-label">Your personal workspace</p>
          <h1>A little space for big ideas.</h1>
          <p>Welcome to Gatepoint. Your next connection starts here.</p>
        </div>
      </div>
      <div className="welcome-panel">
        <div className="welcome-copy">
          <h2>
            Find your people.
            <br />
            <span>Or bring them together.</span>
          </h2>
          <p>
            Explore a gathering that inspires you, or create one of your own.
            We’ll help you take care of the details.
          </p>
          <div>
            <Link href="/public/events" className="gp-button gp-button-lime">
              Explore events
              <Compass size={17} />
            </Link>
            <Link href="/events/new" className="gp-button gp-button-lime">
              Create an event
              <Plus size={17} />
            </Link>
          </div>
          <Link href="/create-organization" className="text-link">
            Set up an organization
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="welcome-art">
          <Image
            src="/images/addis-conference.jpg"
            alt="Delegates meeting at a conference in Addis Ababa"
            fill
            sizes="30vw"
          />
        </div>
      </div>
      <div className="welcome-actions">
        {[
          {
            icon: CalendarDays,
            title: 'Your next gathering',
            text: 'Create an event page that feels like you, with the details your guests need.',
            href: '/events/new',
          },
          {
            icon: Compass,
            title: 'Find your inspiration',
            text: 'Discover upcoming events and meet people who share your interests.',
            href: '/public/events',
          },
          {
            icon: Users,
            title: 'Better, together',
            text: 'Give your team a shared workspace to plan and manage events.',
            href: '/create-organization',
          },
        ].map((item) => (
          <Link href={item.href} key={item.title}>
            <item.icon size={25} strokeWidth={1.4} />
            <h2>{item.title}</h2>
            <p>{item.text}</p>
            <span className="text-link">
              Get started
              <ArrowUpRight size={15} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
export function DashboardOverview({
  organization,
  dashboard,
}: {
  organization: Pick<Organization, 'id' | 'name'>;
  dashboard: OrganizerDashboard;
}) {
  const stats = [
    {
      label: 'Total events',
      value: dashboard.stats.totalEvents,
      icon: CalendarDays,
      description: 'Across your workspace',
    },
    {
      label: 'Published',
      value: dashboard.stats.publishedEvents,
      icon: CheckCircle2,
      description: 'Ready to welcome guests',
    },
    {
      label: 'Registrations',
      value: dashboard.stats.totalRegistrations,
      icon: Users,
      description: 'People coming together',
    },
    {
      label: 'Checked in',
      value: dashboard.stats.checkedInAttendees,
      icon: UserCheck,
      description: 'Arrivals recorded',
    },
    {
      label: 'QR codes',
      value: dashboard.stats.totalQrCodes,
      icon: QrCode,
      description: 'Unique event passes',
    },
  ];
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <div className="dashboard-greeting">
        <div>
          <p className="greeting-label">{organization.name}</p>
          <h1>Good things are coming together.</h1>
          <p>Here’s what’s happening across your events.</p>
        </div>
        <Link href="/events/new" className="gp-button gp-button-dark">
          <Plus size={17} />
          Create an event
        </Link>
      </div>
      <div className="dashboard-stats">
        {stats.map((stat) => (
          <div key={stat.label} className="dashboard-stat">
            <div>
              <span>{stat.label}</span>
              <stat.icon size={16} strokeWidth={1.5} />
            </div>
            <strong>{stat.value.toLocaleString()}</strong>
            <p>{stat.description}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="flex items-center justify-between gap-3 border-b px-6 py-5">
            <div>
              <h2 className="text-base">On the horizon</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Your upcoming events
              </p>
            </div>
            <Link href="/events" className="text-link">
              View all
              <ArrowUpRight size={16} />
            </Link>
          </div>
          {!dashboard.upcomingEvents.length ? (
            <EmptyState
              icon={CalendarDays}
              title="A new beginning awaits."
              description="Create and publish your next event. We’ll keep the details together here."
              actionLabel="Create an event"
              actionHref="/events/new"
            />
          ) : (
            <div className="divide-y">
              {dashboard.upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  href={'/events/' + event.id}
                  className="flex items-center gap-4 px-6 py-5 transition-colors hover:bg-muted/50"
                >
                  <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-lg bg-accent">
                    <strong className="text-lg leading-none">
                      {new Date(event.startsAt).getDate()}
                    </strong>
                    <span className="mt-1 text-[10px]">
                      {new Date(event.startsAt).toLocaleDateString('en-US', {
                        month: 'short',
                      })}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm">{event.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {event.registrationCount} registered
                      {event.maxAttendees
                        ? ' / ' + event.maxAttendees + ' places'
                        : ''}
                    </p>
                  </div>
                  <Status value={event.status} />
                  <ArrowUpRight className="hidden size-4 shrink-0 text-muted-foreground sm:block" />
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b px-6 py-5">
            <div>
              <h2 className="text-base">New connections</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Latest registrations
              </p>
            </div>
            <Users size={18} className="text-muted-foreground" />
          </div>
          {!dashboard.recentRegistrations.length ? (
            <EmptyState
              icon={Users}
              title="Your guest list starts here."
              description="Share a published event. New registrations will appear as people join."
            />
          ) : (
            <div className="divide-y">
              {dashboard.recentRegistrations.map((registration) => (
                <div key={registration.id} className="flex gap-3 px-6 py-5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-primary">
                    {registration.fullName
                      .split(' ')
                      .map((p) => p[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-medium">
                        {registration.fullName}
                      </p>
                      <Status value={registration.status} />
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {registration.eventTitle}
                    </p>
                    <p className="mt-1.5 text-[10px] text-muted-foreground">
                      {new Date(registration.registeredAt).toLocaleDateString(
                        'en-US',
                        { month: 'short', day: 'numeric', year: 'numeric' }
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="dashboard-banner">
        <div>
          <h2>Make the next one memorable.</h2>
          <p>A new idea, a new audience, a new reason to come together.</p>
        </div>
        <Link href="/events/new" className="text-link">
          Start planning
          <ArrowUpRight size={17} />
        </Link>
      </div>
    </section>
  );
}
