'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createOrganizationService } from './services/supabase-organization-service';
import {
  createOrganizationSchema,
  inviteMemberSchema,
  removeMemberSchema,
  updateMemberRoleSchema,
  updateOrganizationSchema,
} from './schemas/organization-schemas';

export type OrganizationActionState = {
  errors?: Record<string, string[] | undefined>;
  message?: string;
  success?: boolean;
};

const initialError = 'Something went wrong. Please try again.';

export async function createOrganizationAction(
  _state: OrganizationActionState,
  formData: FormData
): Promise<OrganizationActionState> {
  const parsed = createOrganizationSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    website: formData.get('website'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const service = createOrganizationService();
  const result = await service.create({
    name: parsed.data.name,
    slug: parsed.data.slug || undefined,
    description: parsed.data.description || undefined,
    website: parsed.data.website || undefined,
  });

  if (result.error) {
    return { message: result.error.message || initialError };
  }

  redirect('/dashboard');
}

export async function updateOrganizationAction(
  organizationId: string,
  _state: OrganizationActionState,
  formData: FormData
): Promise<OrganizationActionState> {
  const parsed = updateOrganizationSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    website: formData.get('website'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const service = createOrganizationService();
  const result = await service.update(organizationId, {
    name: parsed.data.name,
    slug: parsed.data.slug || undefined,
    description: parsed.data.description || null,
    website: parsed.data.website || null,
  });

  if (result.error) {
    return { message: result.error.message || initialError };
  }

  revalidatePath('/organization/settings');
  return { success: true, message: 'Organization updated.' };
}

export async function inviteMemberAction(
  _state: OrganizationActionState,
  formData: FormData
): Promise<OrganizationActionState> {
  const parsed = inviteMemberSchema.safeParse({
    organizationId: formData.get('organizationId'),
    email: formData.get('email'),
    role: formData.get('role'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const service = createOrganizationService();
  const result = await service.inviteMember(
    parsed.data.organizationId,
    parsed.data.email,
    parsed.data.role
  );

  if (result.error) {
    return { message: result.error.message || initialError };
  }

  revalidatePath('/organization/members');
  return { success: true, message: 'Member added.' };
}

export async function updateMemberRoleAction(
  _state: OrganizationActionState,
  formData: FormData
): Promise<OrganizationActionState> {
  const parsed = updateMemberRoleSchema.safeParse({
    memberId: formData.get('memberId'),
    role: formData.get('role'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const service = createOrganizationService();
  const result = await service.updateMemberRole(
    parsed.data.memberId,
    parsed.data.role
  );

  if (result.error) {
    return { message: result.error.message || initialError };
  }

  revalidatePath('/organization/members');
  return { success: true, message: 'Role updated.' };
}

export async function removeMemberAction(
  _state: OrganizationActionState,
  formData: FormData
): Promise<OrganizationActionState> {
  const parsed = removeMemberSchema.safeParse({
    memberId: formData.get('memberId'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const service = createOrganizationService();
  const result = await service.removeMember(parsed.data.memberId);

  if (result.error) {
    return { message: result.error.message || initialError };
  }

  revalidatePath('/organization/members');
  return { success: true, message: 'Member removed.' };
}

