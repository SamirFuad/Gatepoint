'use server';

import { revalidatePath } from 'next/cache';
import { createEventService } from '@/features/events/services/supabase-event-service';
import { createRegistrationFormService } from './services/supabase-registration-form-service';
import {
  deleteFieldSchema,
  formFieldSchema,
  parseOptions,
  registrationFormSchema,
} from './schemas/registration-form-schemas';

export type RegistrationFormActionState = {
  errors?: Record<string, string[] | undefined>;
  message?: string;
  success?: boolean;
};

const initialError = 'Something went wrong. Please try again.';

async function getEvent(eventId: string) {
  const eventService = createEventService();
  const result = await eventService.getById(eventId);

  if (result.error || !result.data) {
    return {
      event: null,
      error: result.error?.message ?? 'Event not found.',
    };
  }

  return { event: result.data, error: null };
}

export async function upsertRegistrationFormAction(
  eventId: string,
  _state: RegistrationFormActionState,
  formData: FormData
): Promise<RegistrationFormActionState> {
  const parsed = registrationFormSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    isActive: formData.get('isActive') === 'on',
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { event, error } = await getEvent(eventId);

  if (error || !event) {
    return { message: error ?? initialError };
  }

  const service = createRegistrationFormService();
  const result = await service.upsertForEvent(event.id, event.organizationId, {
    title: parsed.data.title,
    description: parsed.data.description || null,
    isActive: parsed.data.isActive ?? true,
  });

  if (result.error) {
    return { message: result.error.message || initialError };
  }

  revalidatePath(`/events/${eventId}/registrations`);
  return { success: true, message: 'Registration form saved.' };
}

export async function addFormFieldAction(
  eventId: string,
  _state: RegistrationFormActionState,
  formData: FormData
): Promise<RegistrationFormActionState> {
  const parsed = formFieldSchema.safeParse({
    formId: formData.get('formId'),
    fieldType: formData.get('fieldType'),
    label: formData.get('label'),
    placeholder: formData.get('placeholder'),
    isRequired: formData.get('isRequired') === 'on',
    optionsText: formData.get('optionsText'),
    sortOrder: formData.get('sortOrder'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  if (!parsed.data.formId) {
    return { message: 'Save the registration form before adding fields.' };
  }

  const service = createRegistrationFormService();
  const result = await service.addField(parsed.data.formId, {
    fieldType: parsed.data.fieldType,
    label: parsed.data.label,
    placeholder: parsed.data.placeholder || null,
    isRequired: parsed.data.isRequired ?? false,
    options: parseOptions(parsed.data.optionsText),
    sortOrder: parsed.data.sortOrder ?? 0,
  });

  if (result.error) {
    return { message: result.error.message || initialError };
  }

  revalidatePath(`/events/${eventId}/registrations`);
  return { success: true, message: 'Field added.' };
}

export async function updateFormFieldAction(
  eventId: string,
  _state: RegistrationFormActionState,
  formData: FormData
): Promise<RegistrationFormActionState> {
  const parsed = formFieldSchema.safeParse({
    fieldId: formData.get('fieldId'),
    fieldType: formData.get('fieldType'),
    label: formData.get('label'),
    placeholder: formData.get('placeholder'),
    isRequired: formData.get('isRequired') === 'on',
    optionsText: formData.get('optionsText'),
    sortOrder: formData.get('sortOrder'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  if (!parsed.data.fieldId) {
    return { message: 'Field is missing.' };
  }

  const service = createRegistrationFormService();
  const result = await service.updateField(parsed.data.fieldId, {
    fieldType: parsed.data.fieldType,
    label: parsed.data.label,
    placeholder: parsed.data.placeholder || null,
    isRequired: parsed.data.isRequired ?? false,
    options: parseOptions(parsed.data.optionsText),
    sortOrder: parsed.data.sortOrder ?? 0,
  });

  if (result.error) {
    return { message: result.error.message || initialError };
  }

  revalidatePath(`/events/${eventId}/registrations`);
  return { success: true, message: 'Field updated.' };
}

export async function deleteFormFieldAction(
  eventId: string,
  _state: RegistrationFormActionState,
  formData: FormData
): Promise<RegistrationFormActionState> {
  const parsed = deleteFieldSchema.safeParse({
    fieldId: formData.get('fieldId'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const service = createRegistrationFormService();
  const result = await service.deleteField(parsed.data.fieldId);

  if (result.error) {
    return { message: result.error.message || initialError };
  }

  revalidatePath(`/events/${eventId}/registrations`);
  return { success: true, message: 'Field deleted.' };
}

