import { createEventService } from '@/features/events/services/supabase-event-service';
import type { ApiError, ApiResponse } from '@/types';
import type { Event } from '@/features/events/services/event-service.interface';
import {
  defaultLandingPageConfig,
  landingPageConfigSchema,
  type LandingPageConfig,
} from '../schemas/landing-page-schemas';
import type { ILandingPageService } from './landing-page-service.interface';

function toApiError(message: string): ApiError {
  return { message };
}

function parseConfig(event: Event): LandingPageConfig {
  const parsed = landingPageConfigSchema.safeParse(event.landingPageConfig);

  if (parsed.success) {
    return parsed.data;
  }

  return defaultLandingPageConfig(event.title);
}

export class SupabaseLandingPageService implements ILandingPageService {
  async getConfig(eventId: string): Promise<ApiResponse<LandingPageConfig>> {
    const eventService = createEventService();
    const result = await eventService.getById(eventId);

    if (result.error || !result.data) {
      return {
        data: null,
        error: result.error ?? toApiError('Event not found.'),
      };
    }

    return { data: parseConfig(result.data), error: null };
  }

  async updateConfig(
    eventId: string,
    config: LandingPageConfig
  ): Promise<ApiResponse<LandingPageConfig>> {
    const eventService = createEventService();
    const parsed = landingPageConfigSchema.safeParse(config);

    if (!parsed.success) {
      return {
        data: null,
        error: toApiError('Landing page config is invalid.'),
      };
    }

    const result = await eventService.update(eventId, {
      landingPageConfig: parsed.data,
    });

    if (result.error || !result.data) {
      return {
        data: null,
        error: result.error ?? toApiError('Event not found.'),
      };
    }

    return { data: parseConfig(result.data), error: null };
  }

  async getPublishedEventBySlug(slug: string): Promise<ApiResponse<Event>> {
    const eventService = createEventService();
    const result = await eventService.getBySlug(slug);

    if (result.error || !result.data) {
      return {
        data: null,
        error: result.error ?? toApiError('Event not found.'),
      };
    }

    if (!result.data.isPublished || result.data.status !== 'published') {
      return { data: null, error: toApiError('Event is not published.') };
    }

    return result;
  }
}

export function createLandingPageService(): ILandingPageService {
  return new SupabaseLandingPageService();
}

