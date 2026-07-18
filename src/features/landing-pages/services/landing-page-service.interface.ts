import type { ApiResponse } from '@/types';
import type { Event } from '@/features/events/services/event-service.interface';
import type { LandingPageConfig } from '../schemas/landing-page-schemas';

export interface ILandingPageService {
  getConfig(eventId: string): Promise<ApiResponse<LandingPageConfig>>;

  updateConfig(
    eventId: string,
    config: LandingPageConfig
  ): Promise<ApiResponse<LandingPageConfig>>;

  getPublishedEventBySlug(slug: string): Promise<ApiResponse<Event>>;
}

