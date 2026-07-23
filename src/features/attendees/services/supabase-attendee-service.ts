import { createRegistrationService } from '@/features/registrations/services/supabase-registration-service';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types';
import type { Attendee, IAttendeeService } from './attendee-service.interface';

export class SupabaseAttendeeService implements IAttendeeService {
  async listByEvent(
    eventId: string,
    pagination: PaginationParams,
    search?: string
  ): Promise<ApiResponse<PaginatedResponse<Attendee>>> {
    return createRegistrationService().listByEvent(eventId, pagination, search);
  }

  async listAllByEvent(eventId: string): Promise<ApiResponse<Attendee[]>> {
    return createRegistrationService().listAllByEvent(eventId);
  }
}

export function createAttendeeService(): IAttendeeService {
  return new SupabaseAttendeeService();
}
