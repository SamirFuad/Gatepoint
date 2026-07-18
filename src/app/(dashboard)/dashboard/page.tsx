import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Plus,
  QrCode,
  Ticket,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { EmptyState } from '@/components/common/empty-state';
import { cn } from '@/lib/utils';
import { createDashboardService } from '@/features/dashboard/services/supabase-dashboard-service';
import { createOrganizationService } from '@/features/organizations/services/supabase-organization-service';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const service = createOrganizationService();
  const result = await service.getUserOrganizations();

  if (result.error) {
    throw new Error(result.error.message);
  }

  if (!result.data?.length) {
    redirect('/create-organization');
  }

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

  const stats = [
    {
      label: 'Total events',
      value: dashboard.stats.totalEvents,
      icon: CalendarDays,
    },
    {
      label: 'Published',
      value: dashboard.stats.publishedEvents,
      icon: CheckCircle2,
    },
    {
      label: 'Registrations',
      value: dashboard.stats.totalRegistrations,
      icon: Users,
    },
    {
      label: 'QR codes',
      value: dashboard.stats.totalQrCodes,
      icon: QrCode,
    },
  ];

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Gatepoint</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            {organization.name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Track event performance, recent registrations, and upcoming
            schedules across your workspace.
          </p>
        </div>
        <Link
          href="/events/new"
          className={cn(buttonVariants({ size: 'lg' }), 'gap-2')}
        >
          <Plus />
          New event
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <stat.icon className="size-4 text-primary" />
            </div>
            <p className="mt-4 text-3xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h2 className="font-medium">Upcoming events</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Next events sorted by start date.
              </p>
            </div>
            <CalendarClock className="size-5 text-primary" />
          </div>
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
                  className="block p-5 transition-colors hover:bg-muted/50"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {new Date(event.startsAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{event.status}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {event.registrationCount}
                        {event.maxAttendees ? ` / ${event.maxAttendees}` : ''}{' '}
                        registered
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h2 className="font-medium">Recent activity</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Latest attendee registrations.
              </p>
            </div>
            <Ticket className="size-5 text-primary" />
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
                <div key={registration.id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-medium">{registration.fullName}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {registration.email}
                      </p>
                    </div>
                    <Badge variant="outline">{registration.status}</Badge>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {registration.eventTitle}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(registration.registeredAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
