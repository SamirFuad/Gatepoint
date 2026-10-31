import { notFound } from 'next/navigation';
import { EventPass } from '@/features/qr-codes/components/event-pass';
import { createQRCodeService } from '@/features/qr-codes/services/supabase-qr-code-service';
import { createEventService } from '@/features/events/services/supabase-event-service';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Your Event Pass',
  robots: { index: false, follow: false },
};
export default async function QRCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const result = await createQRCodeService().getByCode(code);
  if (result.error || !result.data?.qrImageUrl) notFound();
  const { data: event } = await createEventService().getById(
    result.data.eventId
  );
  return (
    <main>
      <EventPass
        qrImageUrl={result.data.qrImageUrl}
        eventTitle={event?.title}
        eventHref={event ? '/public/events/' + event.slug : undefined}
        standalone
      />
    </main>
  );
}
