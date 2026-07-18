import { notFound } from 'next/navigation';
import { EventSettingsForm } from '@/features/events/components/event-forms';
import { createEventService } from '@/features/events/services/supabase-event-service';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Event Settings',
};

export default async function EventSettingsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const eventService = createEventService();
  const result = await eventService.getById(eventId);

  if (result.error || !result.data) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <EventSettingsForm event={result.data} />
    </div>
  );
}

