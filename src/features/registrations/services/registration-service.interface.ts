import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types';
import type { RegistrationStatus } from '@/lib/constants';

export type Registration = {
  id: string;
  eventId: string;
  organizationId: string;
  formId: string;
  confirmationNumber: string;
  email: string;
  fullName: string;
  status: RegistrationStatus;
  metadata: Record<string, unknown>;
  registeredAt: string;
  cancelledAt: string | null;
  checkedInAt: string | null;
};

export type RegistrationResponse = {
  id: string;
  registrationId: string;
  fieldId: string;
  value: string | null;
};

export type RegistrationWithResponses = Registration & {
  responses: RegistrationResponse[];
};

export type CreateRegistrationData = {
  eventId: string;
  organizationId: string;
  formId: string;
  email: string;
  fullName: string;
  responses: Array<{
    fieldId: string;
    value: string;
  }>;
};

export interface IRegistrationService {
  create(
    data: CreateRegistrationData
  ): Promise<ApiResponse<RegistrationWithResponses>>;

  getById(id: string): Promise<ApiResponse<RegistrationWithResponses>>;

  listByEvent(
    eventId: string,
    pagination: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Registration>>>;

  updateStatus(
    id: string,
    status: RegistrationStatus
  ): Promise<ApiResponse<Registration>>;
}

