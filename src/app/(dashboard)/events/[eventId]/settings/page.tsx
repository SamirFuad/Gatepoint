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
    <div className="mx-auto w-full max-w-4xl animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Event Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Configure details for {result.data.title}.
        </p>
        <div className="mt-5 h-px bg-border" />
      </div>
      <EventSettingsForm event={result.data} />
    </div>
  );
}
