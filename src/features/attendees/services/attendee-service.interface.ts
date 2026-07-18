import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types';
import type { Registration } from '@/features/registrations/services/registration-service.interface';

export type Attendee = Registration;

export interface IAttendeeService {
  listByEvent(
    eventId: string,
    pagination: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Attendee>>>;
}

