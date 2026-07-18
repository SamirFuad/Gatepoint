import type { Event } from '@/features/events/services/event-service.interface';
import type { QRCodeRecord } from '@/features/qr-codes/services/qr-code-service.interface';
import type { Registration } from '@/features/registrations/services/registration-service.interface';
import type { ApiResponse } from '@/types';

export type EmailResult = {
  id: string | null;
  skipped: boolean;
};

export type RegistrationConfirmationEmailData = {
  event: Event;
  registration: Registration;
  registrationUrl: string;
};

export type QRDeliveryEmailData = {
  event: Event;
  registration: Registration;
  qrCode: QRCodeRecord;
  checkInUrl: string;
};

export interface IEmailService {
  sendRegistrationConfirmation(
    data: RegistrationConfirmationEmailData
  ): Promise<ApiResponse<EmailResult>>;

  sendQRCodeDelivery(
    data: QRDeliveryEmailData
  ): Promise<ApiResponse<EmailResult>>;
}
