import { notFound } from 'next/navigation';
import { createEventService } from '@/features/events/services/supabase-event-service';
import { EventOverview } from '@/features/events/components/event-overview';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Event Overview' };
export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const result = await createEventService().getById(eventId);
  if (result.error || !result.data) notFound();
  return <EventOverview event={result.data} />;
}
