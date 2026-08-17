// =============================================================
// Gatepoint — Event Service Interface
// =============================================================
// Defines the contract for event management operations.
// =============================================================

import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  FilterParams,
  SortParams,
} from '@/types';
import type { EventStatus, EventType } from '@/lib/constants';

/**
 * Represents an event.
 */
export type Event = {
  id: string;
  organizationId: string;
  createdBy: string;
  title: string;
  slug: string;
  description: string | null;
  eventType: EventType;
  status: EventStatus;
  venueName: string | null;
  venueAddress: string | null;
  timezone: string;
  startsAt: string;
  endsAt: string;
  registrationOpensAt: string | null;
  registrationClosesAt: string | null;
  maxAttendees: number | null;
  settings: Record<string, unknown>;
  landingPageConfig: Record<string, unknown> | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  // Computed fields
  registrationCount?: number;
};

/**
 * Data for creating a new event.
 */
export type CreateEventData = {
  title: string;
  slug?: string;
  description?: string;
  eventType: EventType;
  venueName?: string;
  venueAddress?: string;
  timezone: string;
  startsAt: string;
  endsAt: string;
  registrationOpensAt?: string;
  registrationClosesAt?: string;
  maxAttendees?: number;
};

/**
 * Data for updating an event.
 */
export type UpdateEventData = Partial<
  Omit<
    CreateEventData,
    | 'description'
    | 'venueName'
    | 'venueAddress'
    | 'registrationOpensAt'
    | 'registrationClosesAt'
    | 'maxAttendees'
  >
> & {
  description?: string | null;
  venueName?: string | null;
  venueAddress?: string | null;
  registrationOpensAt?: string | null;
  registrationClosesAt?: string | null;
  maxAttendees?: number | null;
  status?: EventStatus;
  isPublished?: boolean;
  landingPageConfig?: Record<string, unknown>;
  settings?: Record<string, unknown>;
};

/**
 * Event list filters.
 */
export type EventFilters = FilterParams & {
  status?: EventStatus;
  eventType?: EventType;
};

/**
 * Event service interface.
 */
export interface IEventService {
  /** Create a new event */
  create(
    organizationId: string,
    data: CreateEventData
  ): Promise<ApiResponse<Event>>;

  /** Get event by ID */
  getById(id: string): Promise<ApiResponse<Event>>;

  /** Get event by slug (for public pages) */
  getBySlug(slug: string): Promise<ApiResponse<Event>>;

  /** List events available to the public */
  listPublished(): Promise<ApiResponse<Event[]>>;

  /** Update an event */
  update(id: string, data: UpdateEventData): Promise<ApiResponse<Event>>;

  /** Delete an event */
  delete(id: string): Promise<ApiResponse<null>>;

  /** List events for an organization */
  list(
    organizationId: string,
    pagination: PaginationParams,
    filters?: EventFilters,
    sort?: SortParams
  ): Promise<ApiResponse<PaginatedResponse<Event>>>;

  /** Publish an event */
  publish(id: string): Promise<ApiResponse<Event>>;

  /** Cancel an event */
  cancel(id: string): Promise<ApiResponse<Event>>;

  /** Check if a slug is available */
  isSlugAvailable(slug: string): Promise<ApiResponse<boolean>>;
}
