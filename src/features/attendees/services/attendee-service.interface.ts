import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types';
import type { Registration } from '@/features/registrations/services/registration-service.interface';

export type Attendee = Registration;

export interface IAttendeeService {
  listByEvent(
    eventId: string,
    pagination: PaginationParams,
    search?: string
  ): Promise<ApiResponse<PaginatedResponse<Attendee>>>;

  /** Fetch all attendees for an event (no pagination, for export). */
  listAllByEvent(eventId: string): Promise<ApiResponse<Attendee[]>>;
}
