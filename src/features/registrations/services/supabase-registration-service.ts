import { customAlphabet } from 'nanoid';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import type {
  ApiError,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from '@/types';
import type { Database, Json } from '@/types/database.types';
import type { RegistrationStatus } from '@/lib/constants';
import type {
  CreateRegistrationData,
  IRegistrationService,
  Registration,
  RegistrationResponse,
  RegistrationWithResponses,
} from './registration-service.interface';

type RegistrationRow = Database['public']['Tables']['registrations']['Row'];
type RegistrationResponseRow =
  Database['public']['Tables']['registration_responses']['Row'];

const confirmationAlphabet = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 8);

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

function toObject(value: Json): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value
    : {};
}

function toRegistration(row: RegistrationRow): Registration {
  return {
    id: row.id,
    eventId: row.event_id,
    organizationId: row.organization_id,
    formId: row.form_id,
    confirmationNumber: row.confirmation_number,
    email: row.email,
    fullName: row.full_name,
    status: row.status,
    metadata: toObject(row.metadata),
    registeredAt: row.registered_at,
    cancelledAt: row.cancelled_at,
    checkedInAt: row.checked_in_at,
  };
}

function toResponse(row: RegistrationResponseRow): RegistrationResponse {
  return {
    id: row.id,
    registrationId: row.registration_id,
    fieldId: row.field_id,
    value: row.value,
  };
}

function createConfirmationNumber() {
  return `GP-${confirmationAlphabet()}`;
}

export class SupabaseRegistrationService implements IRegistrationService {
  async create(
    data: CreateRegistrationData
  ): Promise<ApiResponse<RegistrationWithResponses>> {
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
              : 'Unable to create a registration.',
        },
      };
    }

    const { data: registration, error } = await supabase
      .from('registrations')
      .insert({
        event_id: data.eventId,
        organization_id: data.organizationId,
        form_id: data.formId,
        confirmation_number: createConfirmationNumber(),
        email: data.email,
        full_name: data.fullName,
        status: 'confirmed',
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    const responsesToInsert = data.responses.map((response) => ({
      registration_id: registration.id,
      field_id: response.fieldId,
      value: response.value,
    }));

    const { data: responses, error: responsesError } =
      responsesToInsert.length > 0
        ? await supabase
            .from('registration_responses')
            .insert(responsesToInsert)
            .select()
        : { data: [], error: null };

    if (responsesError) {
      return { data: null, error: toApiError(responsesError) };
    }

    return {
      data: {
        ...toRegistration(registration),
        responses: responses.map(toResponse),
      },
      error: null,
    };
  }

  async getById(id: string): Promise<ApiResponse<RegistrationWithResponses>> {
    const supabase = await createClient();
    const { data: registration, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    const { data: responses, error: responsesError } = await supabase
      .from('registration_responses')
      .select('*')
      .eq('registration_id', id);

    if (responsesError) {
      return { data: null, error: toApiError(responsesError) };
    }

    return {
      data: {
        ...toRegistration(registration),
        responses: responses.map(toResponse),
      },
      error: null,
    };
  }

  async listByEvent(
    eventId: string,
    pagination: PaginationParams,
    search?: string
  ): Promise<ApiResponse<PaginatedResponse<Registration>>> {
    const supabase = await createClient();
    const from = (pagination.page - 1) * pagination.pageSize;
    const to = from + pagination.pageSize - 1;
    let query = supabase
      .from('registrations')
      .select('*', { count: 'exact' })
      .eq('event_id', eventId);

    if (search && search.trim().length > 0) {
      const term = `%${search.trim()}%`;
      query = query.or(
        `full_name.ilike.${term},email.ilike.${term},confirmation_number.ilike.${term}`
      );
    }

    const { data, error, count } = await query
      .order('registered_at', { ascending: false })
      .range(from, to);

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    const total = count ?? 0;

    return {
      data: {
        data: data.map(toRegistration),
        total,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: Math.ceil(total / pagination.pageSize),
      },
      error: null,
    };
  }

  async listAllByEvent(
    eventId: string
  ): Promise<ApiResponse<Registration[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('event_id', eventId)
      .order('registered_at', { ascending: false });

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    return { data: data.map(toRegistration), error: null };
  }

  async updateStatus(
    id: string,
    status: RegistrationStatus
  ): Promise<ApiResponse<Registration>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('registrations')
      .update({
        status,
        cancelled_at: status === 'cancelled' ? new Date().toISOString() : null,
        checked_in_at: status === 'checked_in' ? new Date().toISOString() : null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    return { data: toRegistration(data), error: null };
  }
}

export function createRegistrationService(): IRegistrationService {
  return new SupabaseRegistrationService();
}

