'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createEmailService } from '@/features/email/services/resend-email-service';
import { createEventService } from '@/features/events/services/supabase-event-service';
import { createRegistrationService } from '@/features/registrations/services/supabase-registration-service';
import { createQRCodeService } from './services/supabase-qr-code-service';

export type QRCodeActionState = {
  errors?: Record<string, string[] | undefined>;
  message?: string;
  success?: boolean;
};

const generateQRCodeSchema = z.object({
  eventId: z.string().uuid(),
  registrationId: z.string().uuid(),
});

export async function generateQRCodeAction(
  _state: QRCodeActionState,
  formData: FormData
): Promise<QRCodeActionState> {
  const parsed = generateQRCodeSchema.safeParse({
    eventId: formData.get('eventId'),
    registrationId: formData.get('registrationId'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const service = createQRCodeService();
  const result = await service.generateForRegistration(
    parsed.data.registrationId
  );

  if (result.error) {
    return { message: result.error.message };
  }

  const [eventResult, registrationResult] = await Promise.all([
    createEventService().getById(parsed.data.eventId),
    createRegistrationService().getById(parsed.data.registrationId),
  ]);

  if (result.data && eventResult.data && registrationResult.data) {
    const checkInUrl = `${
      process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    }/qr/${result.data.code}`;

    await createEmailService().sendQRCodeDelivery({
      event: eventResult.data,
      registration: registrationResult.data,
      qrCode: result.data,
      checkInUrl,
    });
  }

  revalidatePath(`/events/${parsed.data.eventId}/qr-codes`);
  return { success: true, message: 'QR code generated.' };
}
