'use server';

import { revalidatePath } from 'next/cache';
import { createLandingPageService } from './services/supabase-landing-page-service';
import { landingPageConfigSchema } from './schemas/landing-page-schemas';

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

export async function updateLandingPageAction(
  eventId: string,
  _state: LandingPageActionState,
  formData: FormData
): Promise<LandingPageActionState> {
  const parsed = landingPageConfigSchema.safeParse({
    headline: formData.get('headline'),
    subheadline: formData.get('subheadline'),
    accentColor: formData.get('accentColor'),
    agenda: formData.get('agenda'),
    venueNote: formData.get('venueNote'),
    contactEmail: formData.get('contactEmail'),
    agendaItems: parseAgendaItems(formData.get('agendaItems')),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const service = createLandingPageService();
  const result = await service.updateConfig(eventId, parsed.data);

  if (result.error) {
    return { message: result.error.message };
  }

  revalidatePath(`/events/${eventId}/landing-page`);
  return { success: true, message: 'Landing page updated.' };
}
