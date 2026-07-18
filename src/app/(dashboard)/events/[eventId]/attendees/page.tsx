import { notFound } from 'next/navigation';
import { createEventService } from '@/features/events/services/supabase-event-service';
import { RegistrationTable } from '@/features/registrations/components/registration-table';
import { createAttendeeService } from '@/features/attendees/services/supabase-attendee-service';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Attendees',
};

export default async function AttendeesPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const eventService = createEventService();
  const eventResult = await eventService.getById(eventId);

  if (eventResult.error || !eventResult.data) {
    notFound();
  }

  const attendeeService = createAttendeeService();
  const attendeesResult = await attendeeService.listByEvent(eventId, {
    page: 1,
    pageSize: 100,
  });

  if (attendeesResult.error) {
    throw new Error(attendeesResult.error.message);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Attendees</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Registrations for {eventResult.data.title}.
        </p>
      </div>
      <RegistrationTable
        eventId={eventId}
        registrations={attendeesResult.data?.data ?? []}
      />
    </div>
  );
}

