import { WorkspacePageHeader } from '@/components/layout/workspace-page-header';
import { notFound } from 'next/navigation';
import { createEventService } from '@/features/events/services/supabase-event-service';
import { RegistrationTable } from '@/features/registrations/components/registration-table';
import { createAttendeeService } from '@/features/attendees/services/supabase-attendee-service';
import { AttendeeToolbar } from '@/features/attendees/components/attendee-toolbar';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Attendees',
};

export default async function AttendeesPage({
  params,
  searchParams,
}: {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ search?: string }>;
}) {
  const { eventId } = await params;
  const { search } = await searchParams;
  const eventService = createEventService();
  const eventResult = await eventService.getById(eventId);

  if (eventResult.error || !eventResult.data) {
    notFound();
  }

  const attendeeService = createAttendeeService();
  const attendeesResult = await attendeeService.listByEvent(
    eventId,
    { page: 1, pageSize: 100 },
    search
  );

  if (attendeesResult.error) {
    throw new Error(attendeesResult.error.message);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 animate-fade-in-up">
      <WorkspacePageHeader
        title="Your guest list"
        description="Every connection, in one place. Review registrations and keep your team informed."
      />
      <AttendeeToolbar eventId={eventId} initialSearch={search} />
      <RegistrationTable
        eventId={eventId}
        registrations={attendeesResult.data?.data ?? []}
      />
    </div>
  );
}
