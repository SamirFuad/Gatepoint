import { z } from 'zod';
import { ROLES } from '@/lib/constants';

export const slugSchema = z
  .string()
  .trim()
  .min(2, 'Slug must be at least 2 characters.')
  .max(64, 'Slug must be 64 characters or fewer.')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Use lowercase letters, numbers, and single hyphens.'
  );

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Organization name is required.')
    .max(120, 'Name must be 120 characters or fewer.'),
  slug: slugSchema.optional().or(z.literal('')),
  description: z
    .string()
    .trim()
    .max(500, 'Description must be 500 characters or fewer.')
    .optional()
    .or(z.literal('')),
  website: z
    .string()
    .trim()
    .url('Enter a valid website URL.')
    .optional()
    .or(z.literal('')),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();

export const inviteMemberSchema = z.object({
  organizationId: z.string().uuid(),
  email: z.string().trim().email('Enter a valid email address.'),
  role: z.enum([ROLES.ADMIN, ROLES.ORGANIZER, ROLES.STAFF]),
});

export const updateMemberRoleSchema = z.object({
  memberId: z.string().uuid(),
  role: z.enum([ROLES.ADMIN, ROLES.ORGANIZER, ROLES.STAFF]),
});

export const removeMemberSchema = z.object({
  memberId: z.string().uuid(),
});

export type CreateOrganizationInput = z.infer<
  typeof createOrganizationSchema
>;
export type UpdateOrganizationInput = z.infer<
  typeof updateOrganizationSchema
>;

