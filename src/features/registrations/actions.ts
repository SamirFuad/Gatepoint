'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createEmailService } from '@/features/email/services/resend-email-service';
import { createEventService } from '@/features/events/services/supabase-event-service';
import { createQRCodeService } from '@/features/qr-codes/services/supabase-qr-code-service';
import { createRegistrationFormService } from '@/features/registration-forms/services/supabase-registration-form-service';
import { FIELD_TYPES } from '@/lib/constants';
import { registrationUnavailable } from './lib/registration-availability';
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

function normalizePhone(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const normalized = value.replace(/\D/g, '');
  return normalized || undefined;
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

  const eventCheck = await createEventService().getBySlug(slug);
  if (
    eventCheck.error ||
    !eventCheck.data ||
    eventCheck.data.id !== parsed.data.eventId
  )
    return { message: 'This event is not available for registration.' };
  const unavailable = registrationUnavailable(eventCheck.data);
  if (unavailable) return { message: unavailable };

  const formService = createRegistrationFormService();
  const formResult = await formService.getByEventId(parsed.data.eventId);

  if (formResult.error || !formResult.data || !formResult.data.isActive) {
    return { message: 'Registration form is not available.' };
  }

  if (
    formResult.data.id !== parsed.data.formId ||
    formResult.data.organizationId !== parsed.data.organizationId
  ) {
    return { message: 'Registration form details are invalid.' };
  }

  const fieldIds = new Set(formResult.data.fields.map((field) => field.id));
  const responses = collectResponses(formData).filter((response) =>
    fieldIds.has(response.fieldId)
  );
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

  const phoneFieldIds = new Set(
    formResult.data.fields
      .filter((field) => field.fieldType === FIELD_TYPES.PHONE)
      .map((field) => field.id)
  );
  const phone = normalizePhone(
    responses.find((response) => phoneFieldIds.has(response.fieldId))?.value
  );

  const registrationService = createRegistrationService();
  const result = await registrationService.create({
    eventId: formResult.data.eventId,
    organizationId: formResult.data.organizationId,
    formId: formResult.data.id,
    email: parsed.data.email,
    phone,
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

  let emailFailed = false;

  if (eventResult.data) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const registrationUrl = `${appUrl}/public/events/${slug}`;
    const emailService = createEmailService();

    const emailResult = await emailService.sendRegistrationConfirmation({
      event: eventResult.data,
      registration: result.data,
      registrationUrl,
      qrCode: qrResult.data ?? undefined,
      checkInUrl: qrResult.data
        ? `${appUrl}/qr/${qrResult.data.code}`
        : undefined,
    });

    if (emailResult.error) {
      console.error(
        'Unable to send registration email:',
        emailResult.error.message
      );
      emailFailed = true;
    }

    if (qrResult.error) {
      console.error(
        'Unable to generate registration QR code:',
        qrResult.error.message
      );
    }
  } else {
    emailFailed = true;
  }

  const searchParams = new URLSearchParams({
    confirmation: result.data.confirmationNumber,
  });

  if (emailFailed) {
    searchParams.set('email', 'failed');
  }

  if (qrResult.data?.code) {
    searchParams.set('qr', qrResult.data.code);
  }

  redirect(
    `/public/events/${slug}/register/success?${searchParams.toString()}`
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
