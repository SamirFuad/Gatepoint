import { EventNavigation } from '@/components/events/event-navigation';
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
export default async function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const client = await createClient();
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error || !user) redirect('/login');
  const { data: allowed, error: permissionError } = await client.rpc(
    'can_manage_event',
    { target_event_id: eventId }
  );
  if (permissionError || !allowed) notFound();
  return (
    <div className="mx-auto w-full max-w-6xl">
      <EventNavigation eventId={eventId} />
      {children}
    </div>
  );
}
