'use server';

import { revalidatePath } from 'next/cache';
import { createLandingPageService } from './services/supabase-landing-page-service';
import { landingPageConfigSchema } from './schemas/landing-page-schemas';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { eventIdSchema } from '@/features/events/schemas/event-schemas';
import {
  validateImageFile,
  matchesImageSignature,
  isEventImageUrl,
} from './lib/event-media';
import type { EventImage } from './schemas/landing-page-schemas';

export type LandingPageActionState = {
  errors?: Record<string, string[] | undefined>;
  message?: string;
  success?: boolean;
};

function parseAgendaItems(raw: FormDataEntryValue | null) {
  if (!raw || typeof raw !== 'string') {
    return undefined;
  }

  try {
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // ignore
  }

  return undefined;
}

function parseImageJson(value: FormDataEntryValue | null, fallback: unknown) {
  if (typeof value !== 'string' || !value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return 'invalid-image-data';
  }
}

export async function uploadEventImageAction(
  eventId: string,
  formData: FormData
): Promise<{ image?: EventImage; error?: string }> {
  if (!eventIdSchema.safeParse({ eventId }).success)
    return { error: 'This event could not be found.' };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Sign in again to upload images.' };
  const { data: canManage, error: permissionError } = await supabase.rpc(
    'can_manage_event',
    { target_event_id: eventId }
  );
  if (permissionError || !canManage)
    return {
      error: 'You need organizer access to change images for this event.',
    };
  const file = formData.get('image');
  if (!(file instanceof File)) return { error: 'Choose an image to upload.' };
  const validation = validateImageFile(file);
  if (validation) return { error: validation };
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!matchesImageSignature(bytes, file.type))
    return { error: 'This file is not a valid JPG, PNG, or WebP image.' };
  const extension =
    file.type === 'image/jpeg'
      ? 'jpg'
      : file.type === 'image/png'
        ? 'png'
        : 'webp';
  const path = eventId + '/' + crypto.randomUUID() + '.' + extension;
  try {
    // Storage writes are server-managed after the caller's event role is verified.
    const storage = createAdminClient().storage.from('event-images');
    const { error } = await storage.upload(path, bytes, {
      contentType: file.type,
      cacheControl: '31536000',
      upsert: false,
    });
    if (error)
      return { error: 'We couldn’t upload this image. Please try again.' };
    return {
      image: { url: storage.getPublicUrl(path).data.publicUrl, alt: '' },
    };
  } catch {
    return {
      error:
        'Image storage is unavailable. Please try again or contact your workspace owner.',
    };
  }
}

export async function updateLandingPageAction(
  eventId: string,
  _state: LandingPageActionState,
  formData: FormData
): Promise<LandingPageActionState> {
  if (!eventIdSchema.safeParse({ eventId }).success)
    return { message: 'This event could not be found.' };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { message: 'Sign in again to save this event page.' };
  const { data: canManage, error: permissionError } = await supabase.rpc(
    'can_manage_event',
    { target_event_id: eventId }
  );
  if (permissionError || !canManage)
    return { message: 'You need organizer access to change this event page.' };
  const parsed = landingPageConfigSchema.safeParse({
    headline: formData.get('headline'),
    subheadline: formData.get('subheadline'),
    accentColor: formData.get('accentColor'),
    agenda: formData.get('agenda'),
    venueNote: formData.get('venueNote'),
    contactEmail: formData.get('contactEmail'),
    agendaItems: parseAgendaItems(formData.get('agendaItems')),
    coverImage: parseImageJson(formData.get('coverImage'), null),
    galleryImages: parseImageJson(formData.get('galleryImages'), []),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const images = [parsed.data.coverImage, ...parsed.data.galleryImages].filter(
    (image): image is EventImage => Boolean(image)
  );
  if (
    images.some(
      (image) =>
        !isEventImageUrl(
          image.url,
          eventId,
          process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
        )
    )
  ) {
    return {
      message:
        'Choose images uploaded for this event, or an Ethiopian image from the library.',
    };
  }

  const service = createLandingPageService();
  const result = await service.updateConfig(eventId, parsed.data);

  if (result.error) {
    return { message: result.error.message };
  }

  revalidatePath(`/events/${eventId}/landing-page`);
  revalidatePath('/public/events');
  revalidatePath('/events');
  revalidatePath('/public/events/[slug]', 'page');
  revalidatePath('/public/events/[slug]/register', 'page');
  return { success: true, message: 'Landing page updated.' };
}
