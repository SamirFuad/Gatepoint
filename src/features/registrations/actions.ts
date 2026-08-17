'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createEmailService } from '@/features/email/services/resend-email-service';
import { createEventService } from '@/features/events/services/supabase-event-service';
import { createQRCodeService } from '@/features/qr-codes/services/supabase-qr-code-service';
import { createRegistrationFormService } from '@/features/registration-forms/services/supabase-registration-form-service';
import { createRegistrationService } from './services/supabase-registration-service';
import {
  publicRegistrationSchema,
  updateRegistrationStatusSchema,
} from './schemas/registration-schemas';

export type RegistrationActionState = {
  errors?: Record<string, string[] | undefined>;
  message?: string;
  success?: boolean;
};

function collectResponses(formData: FormData) {
  const responses: Array<{ fieldId: string; value: string }> = [];

  for (const key of formData.keys()) {
    if (!key.startsWith('field_')) {
      continue;
    }

    const fieldId = key.replace('field_', '');
    const values = formData
      .getAll(key)
      .map((entry) => String(entry))
      .filter(Boolean);

    responses.push({
      fieldId,
      value: values.join(', '),
    });
  }

  return responses;
}

export async function submitPublicRegistrationAction(
  slug: string,
  _state: RegistrationActionState,
  formData: FormData
): Promise<RegistrationActionState> {
  const parsed = publicRegistrationSchema.safeParse({
    eventId: formData.get('eventId'),
    organizationId: formData.get('organizationId'),
    formId: formData.get('formId'),
    email: formData.get('email'),
    fullName: formData.get('fullName'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const formService = createRegistrationFormService();
  const formResult = await formService.getByEventId(parsed.data.eventId);

  if (formResult.error || !formResult.data) {
    return { message: 'Registration form is not available.' };
  }

  if (
    formResult.data.id !== parsed.data.formId ||
    formResult.data.organizationId !== parsed.data.organizationId
  ) {
    return { message: 'Registration form details are invalid.' };
  }

  const responses = collectResponses(formData);
  const missingRequired = formResult.data.fields.find(
    (field) =>
      field.isRequired &&
      !responses.some(
        (response) =>
          response.fieldId === field.id && response.value.trim().length > 0
      )
  );

  if (missingRequired) {
    return { message: `${missingRequired.label} is required.` };
  }

  const registrationService = createRegistrationService();
  const result = await registrationService.create({
    eventId: formResult.data.eventId,
    organizationId: formResult.data.organizationId,
    formId: formResult.data.id,
    email: parsed.data.email,
    fullName: parsed.data.fullName,
    responses,
  });

  if (result.error || !result.data) {
    return {
      message: result.error?.message ?? 'Unable to complete registration.',
    };
  }

  const [eventResult, qrResult] = await Promise.all([
    createEventService().getById(formResult.data.eventId),
    createQRCodeService().generateForRegistration(result.data.id),
  ]);

  if (eventResult.data) {
    const registrationUrl = `${
      process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    }/public/events/${slug}`;
    const emailService = createEmailService();

    await emailService.sendRegistrationConfirmation({
      event: eventResult.data,
      registration: result.data,
      registrationUrl,
    });

    if (qrResult.data) {
      await emailService.sendQRCodeDelivery({
        event: eventResult.data,
        registration: result.data,
        qrCode: qrResult.data,
        checkInUrl: `${
          process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
        }/qr/${qrResult.data.code}`,
      });
    } else if (qrResult.error) {
      console.error(
        'Unable to generate registration QR code:',
        qrResult.error.message
      );
    }
  }

  redirect(
    `/public/events/${slug}/register/success?confirmation=${encodeURIComponent(
      result.data.confirmationNumber
    )}`
  );
}

export async function updateRegistrationStatusAction(
  eventId: string,
  _state: RegistrationActionState,
  formData: FormData
): Promise<RegistrationActionState> {
  const parsed = updateRegistrationStatusSchema.safeParse({
    registrationId: formData.get('registrationId'),
    status: formData.get('status'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const service = createRegistrationService();
  const result = await service.updateStatus(
    parsed.data.registrationId,
    parsed.data.status
  );

  if (result.error) {
    return { message: result.error.message };
  }

  revalidatePath(`/events/${eventId}/attendees`);
  revalidatePath(`/events/${eventId}/registrations`);
  return { success: true, message: 'Registration status updated.' };
}
