import type { Database } from '@/types/database.types';
import type { CreateRegistrationData } from '../services/registration-service.interface';

type RegistrationInsert =
  Database['public']['Tables']['registrations']['Insert'];
type InsertResult<T> = {
  data: T | null;
  error: { code?: string; message: string } | null;
};

export async function insertRegistration<T>(
  insert: (payload: RegistrationInsert) => PromiseLike<InsertResult<T>>,
  data: CreateRegistrationData,
  confirmationNumber: string
): Promise<InsertResult<T>> {
  const payload: RegistrationInsert = {
    event_id: data.eventId,
    organization_id: data.organizationId,
    form_id: data.formId,
    confirmation_number: confirmationNumber,
    email: data.email,
    full_name: data.fullName,
    status: 'confirmed',
    // Removed/empty phone questions must not depend on a database phone column.
    ...(data.phone ? { phone: data.phone } : {}),
  };
  const result = await insert(payload);
  if (
    data.phone &&
    result.error?.code === 'PGRST204' &&
    /Could not find the 'phone' column of 'registrations'/.test(
      result.error.message
    )
  ) {
    // Older deployments may not yet have the optional column. The failed request
    // inserted nothing. Preserve the number in metadata and custom responses.
    const { phone, ...compatible } = payload;
    return insert({ ...compatible, metadata: { phone: phone! } });
  }
  return result;
}

export function registrationPhone(row: {
  phone?: string | null;
  metadata: unknown;
}) {
  const metadata = row.metadata;
  const fallback =
    metadata && typeof metadata === 'object' && 'phone' in metadata
      ? metadata.phone
      : null;
  return row.phone ?? (typeof fallback === 'string' ? fallback : null);
}
