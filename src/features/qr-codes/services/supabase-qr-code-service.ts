import QRCode from 'qrcode';
import { customAlphabet } from 'nanoid';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import type { ApiError, ApiResponse } from '@/types';
import type { Database } from '@/types/database.types';
import type {
  IQRCodeService,
  QRCodeRecord,
} from './qr-code-service.interface';

type QRCodeRow = Database['public']['Tables']['qr_codes']['Row'];

const qrAlphabet = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 16);

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
}

function toApiError(error: {
  message: string;
  code?: string;
  status?: number;
}): ApiError {
  return {
    message: error.message,
    code: error.code,
    status: error.status,
  };
}

function toQRCode(row: QRCodeRow): QRCodeRecord {
  return {
    id: row.id,
    registrationId: row.registration_id,
    eventId: row.event_id,
    organizationId: row.organization_id,
    code: row.code,
    qrImageUrl: row.qr_image_url,
    isUsed: row.is_used,
    usedAt: row.used_at,
    createdAt: row.created_at,
  };
}

export class SupabaseQRCodeService implements IQRCodeService {
  async generateForRegistration(
    registrationId: string
  ): Promise<ApiResponse<QRCodeRecord>> {
    let supabase: ReturnType<typeof createAdminClient>;

    try {
      supabase = createAdminClient();
    } catch (error) {
      return {
        data: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : 'Unable to generate a QR code.',
        },
      };
    }

    const { data: existing, error: existingError } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('registration_id', registrationId)
      .maybeSingle();

    if (existingError) {
      return { data: null, error: toApiError(existingError) };
    }

    if (existing) {
      return { data: toQRCode(existing), error: null };
    }

    const { data: registration, error: registrationError } = await supabase
      .from('registrations')
      .select('id, event_id, organization_id, confirmation_number')
      .eq('id', registrationId)
      .single();

    if (registrationError) {
      return { data: null, error: toApiError(registrationError) };
    }

    const code = `QR-${qrAlphabet()}`;
    const payload = `${appUrl()}/qr/${code}`;
    const qrImageUrl = await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 360,
    });

    const { data, error } = await supabase
      .from('qr_codes')
      .insert({
        registration_id: registration.id,
        event_id: registration.event_id,
        organization_id: registration.organization_id,
        code,
        qr_image_url: qrImageUrl,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    return { data: toQRCode(data), error: null };
  }

  async getByRegistrationId(
    registrationId: string
  ): Promise<ApiResponse<QRCodeRecord>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('registration_id', registrationId)
      .maybeSingle();

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    if (!data) {
      return { data: null, error: { message: 'QR code not found.' } };
    }

    return { data: toQRCode(data), error: null };
  }

  async listByEvent(eventId: string): Promise<ApiResponse<QRCodeRecord[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    return { data: data.map(toQRCode), error: null };
  }
}

export function createQRCodeService(): IQRCodeService {
  return new SupabaseQRCodeService();
}

