import { EventNavigation } from '@/components/events/event-navigation';
export default async function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  return (
    <div className="mx-auto w-full max-w-6xl">
      <EventNavigation eventId={eventId} />
      {children}
    </div>
  );
}
