import { z } from 'zod';
import { FIELD_TYPES } from '@/lib/constants';

export const formFieldTypeSchema = z.enum([
  FIELD_TYPES.TEXT,
  FIELD_TYPES.EMAIL,
  FIELD_TYPES.PHONE,
  FIELD_TYPES.TEXTAREA,
  FIELD_TYPES.SELECT,
  FIELD_TYPES.MULTI_SELECT,
  FIELD_TYPES.CHECKBOX,
  FIELD_TYPES.RADIO,
  FIELD_TYPES.DATE,
  FIELD_TYPES.NUMBER,
  FIELD_TYPES.URL,
]);

export const registrationFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Form title is required.')
    .max(120, 'Title must be 120 characters or fewer.'),
  description: z
    .string()
    .trim()
    .max(500, 'Description must be 500 characters or fewer.')
    .optional()
    .or(z.literal('')),
  isActive: z.coerce.boolean().optional(),
});

export const formFieldSchema = z.object({
  formId: z.string().uuid().optional(),
  fieldId: z.string().uuid().optional(),
  fieldType: formFieldTypeSchema,
  label: z
    .string()
    .trim()
    .min(2, 'Field label is required.')
    .max(120, 'Label must be 120 characters or fewer.'),
  placeholder: z
    .string()
    .trim()
    .max(160, 'Placeholder must be 160 characters or fewer.')
    .optional()
    .or(z.literal('')),
  isRequired: z.coerce.boolean().optional(),
  optionsText: z.string().trim().optional().or(z.literal('')),
  sortOrder: z.coerce.number().int().min(0).optional(),
});

export const deleteFieldSchema = z.object({
  fieldId: z.string().uuid(),
});

export function parseOptions(optionsText?: string) {
  return (optionsText ?? '')
    .split('\n')
    .map((option) => option.trim())
    .filter(Boolean);
}

export type RegistrationFormInput = z.infer<typeof registrationFormSchema>;
export type FormFieldInput = z.infer<typeof formFieldSchema>;

