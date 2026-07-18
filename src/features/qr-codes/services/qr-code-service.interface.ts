import type { ApiResponse } from '@/types';

export type QRCodeRecord = {
  id: string;
  registrationId: string;
  eventId: string;
  organizationId: string;
  code: string;
  qrImageUrl: string | null;
  isUsed: boolean;
  usedAt: string | null;
  createdAt: string;
};

export interface IQRCodeService {
  generateForRegistration(
    registrationId: string
  ): Promise<ApiResponse<QRCodeRecord>>;

  getByRegistrationId(
    registrationId: string
  ): Promise<ApiResponse<QRCodeRecord>>;

  listByEvent(eventId: string): Promise<ApiResponse<QRCodeRecord[]>>;
}

