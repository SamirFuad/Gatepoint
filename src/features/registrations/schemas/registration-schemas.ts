import { z } from 'zod';
import { REGISTRATION_STATUS } from '@/lib/constants';

export const publicRegistrationSchema = z.object({
  eventId: z.string().uuid(),
  organizationId: z.string().uuid(),
  formId: z.string().uuid(),
  email: z.string().trim().email('Enter a valid email address.'),
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name is required.')
    .max(120, 'Name must be 120 characters or fewer.'),
});

export const updateRegistrationStatusSchema = z.object({
  registrationId: z.string().uuid(),
  status: z.enum([
    REGISTRATION_STATUS.PENDING,
    REGISTRATION_STATUS.CONFIRMED,
    REGISTRATION_STATUS.CANCELLED,
    REGISTRATION_STATUS.WAITLISTED,
    REGISTRATION_STATUS.CHECKED_IN,
  ]),
});

export type PublicRegistrationInput = z.infer<
  typeof publicRegistrationSchema
>;

