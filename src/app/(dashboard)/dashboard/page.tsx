import Link from 'next/link';
import {
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Compass,
  Plus,
  QrCode,
  Ticket,
  UserCheck,
  Users,
  ArrowUpRight,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { EmptyState } from '@/components/common/empty-state';
import { cn } from '@/lib/utils';
import { createDashboardService } from '@/features/dashboard/services/supabase-dashboard-service';
import { createOrganizationService } from '@/features/organizations/services/supabase-organization-service';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dashboard',
};

// Semantic status badge renderer
function StatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, string> = {
    published: 'status-published',
    draft: 'status-draft',
    cancelled: 'status-cancelled',
    confirmed: 'status-confirmed',
  };
  const cls = statusMap[status.toLowerCase()] ?? '';
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize',
        cls
      )}
    >
      {status}
    </span>
  );
}

// Relative time helper (e.g. "2h ago", "3d ago")
function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  return `${Math.floor(diffDay / 30)}mo ago`;
}

// Initials from a full name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default async function DashboardPage() {
  const service = createOrganizationService();
  const result = await service.getUserOrganizations();

  if (result.error) {
    throw new Error(result.error.message);
  }

  // ---- No organization: attendee welcome state ----
  if (!result.data?.length) {
    return (
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 py-8 animate-fade-in-up">
        {/* Welcome header with subtle pattern background */}
        <div className="relative rounded-xl border bg-card p-8 overflow-hidden">
          {/* Subtle dot grid background */}
          <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Welcome to Gatepoint
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">
              Find events or{' '}
              <span className="text-gradient">host your own</span>
            </h1>
            <p className="mt-3 max-w-lg text-base text-muted-foreground">
              Browse published events, register as an attendee, or create an event
              whenever you&apos;re ready. No organization required to get started.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/public/events"
                className={cn(buttonVariants({ size: 'lg' }), 'gap-2 glow-cobalt')}
              >
                <Compass className="size-4" />
                Browse Events
              </Link>
              <Link
                href="/events/new"
                className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'gap-2')}
              >
                <Plus className="size-4" />
                Create an Event
              </Link>
              <Link
                href="/create-organization"
                className={cn(buttonVariants({ size: 'lg', variant: 'ghost' }), 'gap-2')}
              >
                Create an Organization
              </Link>
            </div>
          </div>
        </div>

        {/* Capability highlights */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: CalendarDays, label: 'Event Management', desc: 'Create and manage events with capacity controls' },
            { icon: QrCode, label: 'QR Delivery', desc: 'Automatic QR codes sent to every attendee' },
            { icon: Users, label: 'Team Workspaces', desc: 'Collaborate with your team on shared events' },
          ].map((item) => (
            <div
              key={item.label}
              className="group relative rounded-lg border border-t-[1px] border-t-primary bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-accent transition-transform duration-200 group-hover:scale-110">
                <item.icon className="size-4 text-primary" />
              </div>
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ---- Organizer dashboard ----
  const organization = result.data[0];
  const dashboardResult = await createDashboardService().getOrganizerDashboard(
    organization.id
  );

  if (dashboardResult.error) {
    throw new Error(dashboardResult.error.message);
  }

  const dashboard = dashboardResult.data;

  if (!dashboard) {
    throw new Error('Dashboard data is not available.');
  }

  const statAccentBorders = [
    'border-l-primary',
    'border-l-chart-2',
    'border-l-chart-3',
    'border-l-chart-4',
    'border-l-chart-5',
  ];

  const statIconBgs = [
    'bg-accent',
    'bg-cyan-50 dark:bg-cyan-950/30',
    'bg-emerald-50 dark:bg-emerald-950/30',
    'bg-amber-50 dark:bg-amber-950/30',
    'bg-violet-50 dark:bg-violet-950/30',
  ];

  const statIconColors = [
    'text-primary',
    'text-chart-2',
    'text-chart-3',
    'text-chart-4',
    'text-chart-5',
  ];

  const stats = [
    {
      label: 'Total events',
      value: dashboard.stats.totalEvents,
      icon: CalendarDays,
      description: 'All time',
    },
    {
      label: 'Published',
      value: dashboard.stats.publishedEvents,
      icon: CheckCircle2,
      description: 'Live events',
    },
    {
      label: 'Registrations',
      value: dashboard.stats.totalRegistrations,
      icon: Users,
      description: 'All events',
    },
    {
      label: 'Checked in',
      value: dashboard.stats.checkedInAttendees,
      icon: UserCheck,
      description: 'Verified',
    },
    {
      label: 'QR codes',
      value: dashboard.stats.totalQrCodes,
      icon: QrCode,
      description: 'Distributed',
    },
  ];

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      {/* Page header */}
      <div className="animate-fade-in-up">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Overview
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight">
              {organization.name}
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
              Event performance, registrations, and upcoming schedules.
            </p>
          </div>
          <Link
            href="/events/new"
            className={cn(buttonVariants({ size: 'lg' }), 'shrink-0 gap-2 glow-cobalt')}
          >
            <Plus className="size-4" />
            New Event
          </Link>
        </div>
        {/* Thin divider */}
        <div className="mt-5 h-px bg-border" />
      </div>

      {/* Stats grid */}
      <div className="animate-fade-in-up grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" style={{ animationDelay: '60ms' }}>
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={cn(
              'rounded-lg border border-l-2 bg-card p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
              statAccentBorders[i]
            )}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </p>
              <div className={cn('flex size-7 items-center justify-center rounded-md', statIconBgs[i])}>
                <stat.icon className={cn('size-3.5', statIconColors[i])} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold tabular-nums tracking-tight">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Content panels */}
      <div className="animate-fade-in-up grid gap-5 lg:grid-cols-[1.3fr_0.7fr]" style={{ animationDelay: '120ms' }}>
        {/* Upcoming events */}
        <div className="overflow-hidden rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold">Upcoming Events</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Sorted by start date
              </p>
            </div>
            <div className="flex items-center gap-3">
              <CalendarClock className="size-4 text-muted-foreground" />
              <Link
                href="/events"
                className={cn(
                  buttonVariants({ size: 'sm', variant: 'outline' }),
                  'h-7 gap-1 px-2.5 text-xs font-medium'
                )}
              >
                View all
                <ArrowUpRight className="size-3" />
              </Link>
            </div>
          </div>

          {/* Column header */}
          {dashboard.upcomingEvents.length > 0 && (
            <div className="hidden items-center gap-4 border-b bg-muted/30 px-5 py-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground sm:flex">
              <span className="min-w-0 flex-1">Event</span>
              <span className="w-28 shrink-0 text-right">Date</span>
              <span className="w-20 shrink-0 text-center">Status</span>
              <span className="w-20 shrink-0 text-right">Registrations</span>
            </div>
          )}

          <div className="divide-y">
            {dashboard.upcomingEvents.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="No upcoming events"
                description="Create and publish an event to see it here."
              />
            ) : (
              dashboard.upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group flex items-center justify-between gap-4 border-l-2 border-l-transparent px-5 py-4 transition-all hover:border-l-primary hover:bg-muted/40"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{event.title}</p>
                    {/* Mobile date - visible on small screens */}
                    <p className="mt-0.5 text-xs text-muted-foreground sm:hidden">
                      {new Date(event.startsAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {/* Desktop structured columns */}
                  <span className="hidden w-28 shrink-0 text-right font-mono text-xs text-muted-foreground sm:block">
                    {new Date(event.startsAt).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="flex w-20 shrink-0 justify-center">
                    <StatusBadge status={event.status} />
                  </span>
                  <span className="w-20 shrink-0 whitespace-nowrap text-right text-xs tabular-nums text-muted-foreground">
                    {event.registrationCount}
                    {event.maxAttendees ? ` / ${event.maxAttendees}` : ''}{' '}
                    reg.
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent activity */}
        <div className="overflow-hidden rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold">Recent Activity</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Latest registrations
              </p>
            </div>
            <Ticket className="size-4 text-muted-foreground" />
          </div>
          <div className="divide-y">
            {dashboard.recentRegistrations.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No registrations yet"
                description="New registrations will appear here."
              />
            ) : (
              dashboard.recentRegistrations.map((registration) => (
                <div key={registration.id} className="flex gap-3 px-5 py-4">
                  {/* Timeline-like left border + avatar */}
                  <div className="flex flex-col items-center pt-0.5">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-primary">
                      {getInitials(registration.fullName)}
                    </div>
                    <div className="mt-2 flex-1 w-px bg-border" />
                  </div>
                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {registration.fullName}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {registration.email}
                        </p>
                      </div>
                      <StatusBadge status={registration.status} />
                    </div>
                    <p className="mt-2 truncate text-xs font-medium text-muted-foreground/80">
                      {registration.eventTitle}
                    </p>
                    <p className="mt-0.5 text-[10px] tabular-nums text-muted-foreground/50">
                      {relativeTime(registration.registeredAt)}
                      {' · '}
                      {new Date(registration.registeredAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
