import type { ApiResponse } from '@/types';
import type { FieldType } from '@/lib/constants';

export type RegistrationForm = {
  id: string;
  eventId: string;
  organizationId: string;
  title: string;
  description: string | null;
  isActive: boolean;
  settings: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type FormField = {
  id: string;
  formId: string;
  fieldType: FieldType;
  label: string;
  placeholder: string | null;
  isRequired: boolean;
  options: string[];
  validationRules: Record<string, unknown>;
  sortOrder: number;
  createdAt: string;
};

export type RegistrationFormWithFields = RegistrationForm & {
  fields: FormField[];
};

export type UpsertRegistrationFormData = {
  title: string;
  description?: string | null;
  isActive?: boolean;
};

export type UpsertFormFieldData = {
  fieldType: FieldType;
  label: string;
  placeholder?: string | null;
  isRequired?: boolean;
  options?: string[];
  validationRules?: Record<string, unknown>;
  sortOrder?: number;
};

export interface IRegistrationFormService {
  getByEventId(
    eventId: string
  ): Promise<ApiResponse<RegistrationFormWithFields>>;

  upsertForEvent(
    eventId: string,
    organizationId: string,
    data: UpsertRegistrationFormData
  ): Promise<ApiResponse<RegistrationForm>>;

  addField(
    formId: string,
    data: UpsertFormFieldData
  ): Promise<ApiResponse<FormField>>;

  updateField(
    fieldId: string,
    data: UpsertFormFieldData
  ): Promise<ApiResponse<FormField>>;

  deleteField(fieldId: string): Promise<ApiResponse<null>>;
}

