import { notFound } from 'next/navigation';
import { createEventService } from '@/features/events/services/supabase-event-service';
import { createRegistrationService } from '@/features/registrations/services/supabase-registration-service';
import { createQRCodeService } from '@/features/qr-codes/services/supabase-qr-code-service';
import { QRCodeTable } from '@/features/qr-codes/components/qr-code-table';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'QR Codes',
};

export default async function QRCodesPage({
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

  const registrationService = createRegistrationService();
  const registrationsResult = await registrationService.listByEvent(eventId, {
    page: 1,
    pageSize: 100,
  });

  if (registrationsResult.error) {
    throw new Error(registrationsResult.error.message);
  }

  const qrCodeService = createQRCodeService();
  const qrCodesResult = await qrCodeService.listByEvent(eventId);

  if (qrCodesResult.error) {
    throw new Error(qrCodesResult.error.message);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">QR codes</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Generate QR passes for {eventResult.data.title}.
        </p>
      </div>
      <QRCodeTable
        eventId={eventId}
        registrations={registrationsResult.data?.data ?? []}
        qrCodes={qrCodesResult.data ?? []}
      />
    </div>
  );
}

