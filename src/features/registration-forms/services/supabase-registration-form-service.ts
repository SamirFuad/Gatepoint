import { createClient } from '@/lib/supabase/server';
import type { ApiError, ApiResponse } from '@/types';
import type { Database, Json } from '@/types/database.types';
import type {
  FormField,
  IRegistrationFormService,
  RegistrationForm,
  RegistrationFormWithFields,
  UpsertFormFieldData,
  UpsertRegistrationFormData,
} from './registration-form-service.interface';

type RegistrationFormRow =
  Database['public']['Tables']['registration_forms']['Row'];
type FormFieldRow = Database['public']['Tables']['form_fields']['Row'];

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

function toOptions(value: Json): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

function toRegistrationForm(row: RegistrationFormRow): RegistrationForm {
  return {
    id: row.id,
    eventId: row.event_id,
    organizationId: row.organization_id,
    title: row.title,
    description: row.description,
    isActive: row.is_active,
    settings: toObject(row.settings),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toFormField(row: FormFieldRow): FormField {
  return {
    id: row.id,
    formId: row.form_id,
    fieldType: row.field_type,
    label: row.label,
    placeholder: row.placeholder,
    isRequired: row.is_required,
    options: toOptions(row.options),
    validationRules: toObject(row.validation_rules),
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

export class SupabaseRegistrationFormService
  implements IRegistrationFormService
{
  async getByEventId(
    eventId: string
  ): Promise<ApiResponse<RegistrationFormWithFields>> {
    const supabase = await createClient();
    const { data: form, error } = await supabase
      .from('registration_forms')
      .select('*')
      .eq('event_id', eventId)
      .maybeSingle();

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    if (!form) {
      return { data: null, error: { message: 'Registration form not found.' } };
    }

    const { data: fields, error: fieldsError } = await supabase
      .from('form_fields')
      .select('*')
      .eq('form_id', form.id)
      .order('sort_order', { ascending: true });

    if (fieldsError) {
      return { data: null, error: toApiError(fieldsError) };
    }

    return {
      data: {
        ...toRegistrationForm(form),
        fields: fields.map(toFormField),
      },
      error: null,
    };
  }

  async upsertForEvent(
    eventId: string,
    organizationId: string,
    data: UpsertRegistrationFormData
  ): Promise<ApiResponse<RegistrationForm>> {
    const supabase = await createClient();
    const { data: form, error } = await supabase
      .from('registration_forms')
      .upsert(
        {
          event_id: eventId,
          organization_id: organizationId,
          title: data.title,
          description: data.description ?? null,
          is_active: data.isActive ?? true,
        },
        { onConflict: 'event_id' }
      )
      .select()
      .single();

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    return { data: toRegistrationForm(form), error: null };
  }

  async addField(
    formId: string,
    data: UpsertFormFieldData
  ): Promise<ApiResponse<FormField>> {
    const supabase = await createClient();
    const { data: field, error } = await supabase
      .from('form_fields')
      .insert({
        form_id: formId,
        field_type: data.fieldType,
        label: data.label,
        placeholder: data.placeholder ?? null,
        is_required: data.isRequired ?? false,
        options: (data.options ?? []) as Json,
        validation_rules: (data.validationRules ?? {}) as Json,
        sort_order: data.sortOrder ?? 0,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    return { data: toFormField(field), error: null };
  }

  async updateField(
    fieldId: string,
    data: UpsertFormFieldData
  ): Promise<ApiResponse<FormField>> {
    const supabase = await createClient();
    const { data: field, error } = await supabase
      .from('form_fields')
      .update({
        field_type: data.fieldType,
        label: data.label,
        placeholder: data.placeholder ?? null,
        is_required: data.isRequired ?? false,
        options: (data.options ?? []) as Json,
        validation_rules: (data.validationRules ?? {}) as Json,
        sort_order: data.sortOrder ?? 0,
      })
      .eq('id', fieldId)
      .select()
      .single();

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    return { data: toFormField(field), error: null };
  }

  async deleteField(fieldId: string): Promise<ApiResponse<null>> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('form_fields')
      .delete()
      .eq('id', fieldId);

    return { data: null, error: error ? toApiError(error) : null };
  }
}

export function createRegistrationFormService(): IRegistrationFormService {
  return new SupabaseRegistrationFormService();
}

