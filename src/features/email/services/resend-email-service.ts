import { Resend } from 'resend';
import type { ApiError, ApiResponse } from '@/types';
import type {
  EmailResult,
  IEmailService,
  QRDeliveryEmailData,
  RegistrationConfirmationEmailData,
} from './email-service.interface';

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? 'Gatepoint';
const defaultFrom = process.env.RESEND_FROM_EMAIL ?? 'Gatepoint <onboarding@resend.dev>';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(value));
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function toApiError(error: unknown): ApiError {
  if (error && typeof error === 'object' && 'message' in error) {
    return { message: String(error.message) };
  }

  return { message: 'Unable to send email.' };
}

function renderShell(title: string, body: string) {
  return `
    <div style="font-family: Arial, sans-serif; color: #18181b; line-height: 1.5; max-width: 640px; margin: 0 auto; padding: 24px;">
      <p style="font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #2563eb;">${appName}</p>
      <h1 style="font-size: 24px; margin: 0 0 20px;">${escapeHtml(title)}</h1>
      ${body}
      <p style="border-top: 1px solid #e4e4e7; color: #71717a; font-size: 12px; margin-top: 28px; padding-top: 16px;">
        This message was sent by ${appName}.
      </p>
    </div>
  `;
}

function renderRegistrationConfirmation(data: RegistrationConfirmationEmailData) {
  const eventTitle = escapeHtml(data.event.title);
  const attendeeName = escapeHtml(data.registration.fullName);
  const confirmationNumber = escapeHtml(data.registration.confirmationNumber);
  const eventTime = escapeHtml(formatDate(data.event.startsAt));

  return renderShell(
    `You're registered for ${eventTitle}`,
    `
      <p>Hi ${attendeeName},</p>
      <p>Your registration for <strong>${eventTitle}</strong> is confirmed.</p>
      <div style="background: #f4f4f5; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0 0 8px;"><strong>Confirmation number:</strong> ${confirmationNumber}</p>
        <p style="margin: 0;"><strong>Starts:</strong> ${eventTime}</p>
      </div>
      <p>
        <a href="${escapeHtml(data.registrationUrl)}" style="background: #2563eb; border-radius: 6px; color: #ffffff; display: inline-block; font-weight: 700; padding: 10px 14px; text-decoration: none;">
          View event details
        </a>
      </p>
    `
  );
}

function renderQRCodeDelivery(data: QRDeliveryEmailData) {
  const eventTitle = escapeHtml(data.event.title);
  const attendeeName = escapeHtml(data.registration.fullName);
  const qrCode = escapeHtml(data.qrCode.code);

  return renderShell(
    `Your check-in QR code for ${eventTitle}`,
    `
      <p>Hi ${attendeeName},</p>
      <p>Your QR code for <strong>${eventTitle}</strong> is ready. Present it at check-in.</p>
      <div style="background: #f4f4f5; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
        ${
          data.qrCode.qrImageUrl
            ? `<img src="${escapeHtml(data.qrCode.qrImageUrl)}" alt="QR code" width="220" height="220" style="display: inline-block;" />`
            : ''
        }
        <p style="font-family: monospace; margin: 12px 0 0;">${qrCode}</p>
      </div>
      <p>
        <a href="${escapeHtml(data.checkInUrl)}" style="background: #2563eb; border-radius: 6px; color: #ffffff; display: inline-block; font-weight: 700; padding: 10px 14px; text-decoration: none;">
          Open QR code
        </a>
      </p>
    `
  );
}

function textRegistrationConfirmation(data: RegistrationConfirmationEmailData) {
  return [
    `Hi ${data.registration.fullName},`,
    '',
    `Your registration for ${data.event.title} is confirmed.`,
    `Confirmation number: ${data.registration.confirmationNumber}`,
    `Starts: ${formatDate(data.event.startsAt)}`,
    '',
    `Event details: ${data.registrationUrl}`,
  ].join('\n');
}

function textQRCodeDelivery(data: QRDeliveryEmailData) {
  return [
    `Hi ${data.registration.fullName},`,
    '',
    `Your QR code for ${data.event.title} is ready.`,
    `QR code: ${data.qrCode.code}`,
    `Open QR code: ${data.checkInUrl}`,
  ].join('\n');
}

export class ResendEmailService implements IEmailService {
  private resend: Resend | null;

  constructor() {
    this.resend = process.env.RESEND_API_KEY
      ? new Resend(process.env.RESEND_API_KEY)
      : null;
  }

  async sendRegistrationConfirmation(
    data: RegistrationConfirmationEmailData
  ): Promise<ApiResponse<EmailResult>> {
    return this.send({
      to: data.registration.email,
      subject: `Registration confirmed: ${data.event.title}`,
      html: renderRegistrationConfirmation(data),
      text: textRegistrationConfirmation(data),
    });
  }

  async sendQRCodeDelivery(
    data: QRDeliveryEmailData
  ): Promise<ApiResponse<EmailResult>> {
    return this.send({
      to: data.registration.email,
      subject: `Your QR code for ${data.event.title}`,
      html: renderQRCodeDelivery(data),
      text: textQRCodeDelivery(data),
    });
  }

  private async send(message: {
    to: string;
    subject: string;
    html: string;
    text: string;
  }): Promise<ApiResponse<EmailResult>> {
    if (!this.resend || !process.env.RESEND_API_KEY) {
      return { data: { id: null, skipped: true }, error: null };
    }

    const { data, error } = await this.resend.emails.send({
      from: defaultFrom,
      ...message,
    });

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    return { data: { id: data?.id ?? null, skipped: false }, error: null };
  }
}

export function createEmailService(): IEmailService {
  return new ResendEmailService();
}
