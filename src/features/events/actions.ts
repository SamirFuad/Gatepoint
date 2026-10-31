'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createOrganizationService } from '@/features/organizations/services/supabase-organization-service';
import { createClient } from '@/lib/supabase/server';
import { createEventService } from './services/supabase-event-service';
import {
  eventIdSchema,
  eventSchema,
  updateEventSchema,
} from './schemas/event-schemas';
import { eventDateTimeToIso } from './lib/event-dates';

export type EventActionState = {
  errors?: Record<string, string[] | undefined>;
  message?: string;
  success?: boolean;
};

const initialError = 'Something went wrong. Please try again.';

function optionalIsoDate(value: string | number | undefined, timeZone: string) {
  if (!value || typeof value !== 'string') {
    return undefined;
  }

  return eventDateTimeToIso(value, timeZone);
}

function eventSchedule(data: {
  startsAt: string;
  endsAt: string;
  timezone: string;
  registrationOpensAt?: string | number;
  registrationClosesAt?: string | number;
}) {
  return {
    startsAt: eventDateTimeToIso(data.startsAt, data.timezone),
    endsAt: eventDateTimeToIso(data.endsAt, data.timezone),
    registrationOpensAt: optionalIsoDate(
      data.registrationOpensAt,
      data.timezone
    ),
    registrationClosesAt: optionalIsoDate(
      data.registrationClosesAt,
      data.timezone
    ),
  };
}

async function getCurrentOrganizationId() {
  const organizationService = createOrganizationService();
  const organizations = await organizationService.getUserOrganizations();

  if (organizations.error) {
    return { organizationId: null, error: organizations.error.message };
  }

  const existingOrganizationId = organizations.data?.[0]?.id;

  if (existingOrganizationId) {
    return { organizationId: existingOrganizationId, error: null };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { organizationId: null, error: 'Authentication required.' };
  }

  const fullName =
    typeof user.user_metadata.full_name === 'string'
      ? user.user_metadata.full_name.trim()
      : '';
  const personalWorkspace = await organizationService.create({
    name: fullName ? `${fullName.slice(0, 80)}'s events` : 'My events',
    slug: `personal-${user.id.slice(0, 8)}`,
  });

  if (personalWorkspace.error || !personalWorkspace.data) {
    return {
      organizationId: null,
      error:
        personalWorkspace.error?.message ??
        'Unable to create a personal event workspace.',
    };
  }

  return { organizationId: personalWorkspace.data.id, error: null };
}

export async function createEventAction(
  _state: EventActionState,
  formData: FormData
): Promise<EventActionState> {
  const parsed = eventSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    eventType: formData.get('eventType'),
    venueName: formData.get('venueName'),
    venueAddress: formData.get('venueAddress'),
    timezone: formData.get('timezone'),
    startsAt: formData.get('startsAt'),
    endsAt: formData.get('endsAt'),
    registrationOpensAt: formData.get('registrationOpensAt'),
    registrationClosesAt: formData.get('registrationClosesAt'),
    maxAttendees: formData.get('maxAttendees'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { organizationId, error } = await getCurrentOrganizationId();

  if (error || !organizationId) {
    return { message: error ?? 'Create an organization before adding events.' };
  }

  const service = createEventService();
  let schedule: ReturnType<typeof eventSchedule>;
  try {
    schedule = eventSchedule(parsed.data);
  } catch {
    return {
      message:
        'Check the dates and timezone. Enter a valid local time for each date.',
    };
  }
  const result = await service.create(organizationId, {
    title: parsed.data.title,
    slug: parsed.data.slug || undefined,
    description: parsed.data.description || undefined,
    eventType: parsed.data.eventType,
    venueName: parsed.data.venueName || undefined,
    venueAddress: parsed.data.venueAddress || undefined,
    timezone: parsed.data.timezone,
    ...schedule,
    maxAttendees:
      typeof parsed.data.maxAttendees === 'number'
        ? parsed.data.maxAttendees
        : undefined,
  });

  if (result.error) {
    return { message: result.error.message || initialError };
  }

  redirect(`/events/${result.data?.id}`);
}

export async function updateEventAction(
  eventId: string,
  _state: EventActionState,
  formData: FormData
): Promise<EventActionState> {
  const id = eventIdSchema.safeParse({ eventId });

  if (!id.success) {
    return { message: 'Invalid event.' };
  }

  const parsed = updateEventSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    eventType: formData.get('eventType'),
    venueName: formData.get('venueName'),
    venueAddress: formData.get('venueAddress'),
    timezone: formData.get('timezone'),
    startsAt: formData.get('startsAt'),
    endsAt: formData.get('endsAt'),
    registrationOpensAt: formData.get('registrationOpensAt'),
    registrationClosesAt: formData.get('registrationClosesAt'),
    maxAttendees: formData.get('maxAttendees'),
    status: formData.get('status'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const service = createEventService();
  let schedule: ReturnType<typeof eventSchedule>;
  try {
    schedule = eventSchedule(parsed.data);
  } catch {
    return {
      message:
        'Check the dates and timezone. Enter a valid local time for each date.',
    };
  }
  const result = await service.update(id.data.eventId, {
    title: parsed.data.title,
    slug: parsed.data.slug || undefined,
    description: parsed.data.description || null,
    eventType: parsed.data.eventType,
    status: parsed.data.status,
    venueName: parsed.data.venueName || null,
    venueAddress: parsed.data.venueAddress || null,
    timezone: parsed.data.timezone,
    ...schedule,
    registrationOpensAt: schedule.registrationOpensAt ?? null,
    registrationClosesAt: schedule.registrationClosesAt ?? null,
    maxAttendees:
      typeof parsed.data.maxAttendees === 'number'
        ? parsed.data.maxAttendees
        : null,
    isPublished: parsed.data.status === 'published',
  });

  if (result.error) {
    return { message: result.error.message || initialError };
  }

  revalidatePath(`/events/${id.data.eventId}`);
  revalidatePath(`/events/${id.data.eventId}/settings`);
  return { success: true, message: 'Event updated.' };
}

export async function publishEventAction(
  formData: FormData
): Promise<EventActionState> {
  const id = eventIdSchema.safeParse({ eventId: formData.get('eventId') });

  if (!id.success) {
    return { message: 'This event could not be found.' };
  }

  const service = createEventService();
  const result = await service.publish(id.data.eventId);
  if (result.error) return { message: result.error.message };
  revalidatePath('/events');
  revalidatePath(`/events/${id.data.eventId}`);
  revalidatePath('/public/events');
  return {
    success: true,
    message: 'Your event is published and ready to share.',
  };
}

export async function cancelEventAction(
  formData: FormData
): Promise<EventActionState> {
  const id = eventIdSchema.safeParse({ eventId: formData.get('eventId') });

  if (!id.success) {
    return { message: 'This event could not be found.' };
  }

  const service = createEventService();
  const result = await service.cancel(id.data.eventId);
  if (result.error) return { message: result.error.message };
  revalidatePath('/events');
  revalidatePath(`/events/${id.data.eventId}`);
  revalidatePath('/public/events');
  return { success: true, message: 'Your event has been cancelled.' };
}

export async function deleteEventAction(formData: FormData) {
  const id = eventIdSchema.safeParse({ eventId: formData.get('eventId') });

  if (!id.success) {
    return;
  }

  const service = createEventService();
  await service.delete(id.data.eventId);
  revalidatePath('/events');
  redirect('/events');
}
