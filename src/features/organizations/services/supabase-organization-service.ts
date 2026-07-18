import { createClient } from '@/lib/supabase/server';
import type {
  ApiError,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from '@/types';
import type { Database } from '@/types/database.types';
import type { Role } from '@/lib/constants';
import type {
  CreateOrganizationData,
  IOrganizationService,
  Organization,
  OrganizationMember,
  UpdateOrganizationData,
} from './organization-service.interface';

type OrganizationRow = Database['public']['Tables']['organizations']['Row'];
type MemberRow = Database['public']['Tables']['organization_members']['Row'] & {
  profiles:
    | {
        full_name: string | null;
        email: string;
        avatar_url: string | null;
      }
    | {
        full_name: string | null;
        email: string;
        avatar_url: string | null;
      }[]
    | null;
};

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

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function toOrganization(row: OrganizationRow): Organization {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    logoUrl: row.logo_url,
    website: row.website,
    settings:
      row.settings && typeof row.settings === 'object' && !Array.isArray(row.settings)
        ? row.settings
        : {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toMember(row: MemberRow): OrganizationMember {
  const profile = Array.isArray(row.profiles)
    ? row.profiles[0]
    : row.profiles;

  return {
    id: row.id,
    userId: row.user_id,
    organizationId: row.organization_id,
    role: row.role,
    joinedAt: row.joined_at,
    user: {
      fullName: profile?.full_name ?? null,
      email: profile?.email ?? '',
      avatarUrl: profile?.avatar_url ?? null,
    },
  };
}

export class SupabaseOrganizationService
  implements IOrganizationService
{
  async create(
    data: CreateOrganizationData
  ): Promise<ApiResponse<Organization>> {
    const supabase = await createClient();
    const slug = data.slug ? slugify(data.slug) : slugify(data.name);

    const { data: organization, error } = await supabase.rpc(
      'create_organization_with_owner',
      {
        organization_name: data.name,
        organization_slug: slug,
        organization_description: data.description ?? null,
        organization_website: data.website ?? null,
      }
    );

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    return { data: toOrganization(organization), error: null };
  }

  async getById(id: string): Promise<ApiResponse<Organization>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    return { data: toOrganization(data), error: null };
  }

  async getBySlug(slug: string): Promise<ApiResponse<Organization>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    return { data: toOrganization(data), error: null };
  }

  async update(
    id: string,
    data: UpdateOrganizationData
  ): Promise<ApiResponse<Organization>> {
    const supabase = await createClient();
    const { data: organization, error } = await supabase
      .from('organizations')
      .update({
        name: data.name,
        slug: data.slug ? slugify(data.slug) : undefined,
        description: data.description,
        website: data.website,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    return { data: toOrganization(organization), error: null };
  }

  async delete(id: string): Promise<ApiResponse<null>> {
    const supabase = await createClient();
    const { error } = await supabase.from('organizations').delete().eq('id', id);

    return { data: null, error: error ? toApiError(error) : null };
  }

  async getUserOrganizations(): Promise<ApiResponse<Organization[]>> {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      return { data: null, error: toApiError(userError) };
    }

    if (!user) {
      return { data: null, error: { message: 'Authentication required.' } };
    }

    const { data, error } = await supabase
      .from('organization_members')
      .select('organizations(*)')
      .eq('user_id', user.id)
      .order('joined_at', { ascending: true });

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    const organizations = data
      .flatMap((row) => row.organizations ?? [])
      .map((organization) => toOrganization(organization));

    return { data: organizations, error: null };
  }

  async getMembers(
    organizationId: string,
    pagination: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<OrganizationMember>>> {
    const supabase = await createClient();
    const from = (pagination.page - 1) * pagination.pageSize;
    const to = from + pagination.pageSize - 1;

    const { data, error, count } = await supabase
      .from('organization_members')
      .select(
        'id, organization_id, user_id, role, joined_at, updated_at, profiles(full_name, email, avatar_url)',
        { count: 'exact' }
      )
      .eq('organization_id', organizationId)
      .order('joined_at', { ascending: true })
      .range(from, to);

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    const total = count ?? 0;

    return {
      data: {
        data: (data as MemberRow[]).map(toMember),
        total,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: Math.ceil(total / pagination.pageSize),
      },
      error: null,
    };
  }

  async inviteMember(
    organizationId: string,
    email: string,
    role: Role
  ): Promise<ApiResponse<OrganizationMember>> {
    const supabase = await createClient();
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (profileError) {
      return {
        data: null,
        error: {
          message:
            'No Gatepoint user was found for that email. Ask them to register first.',
        },
      };
    }

    const { data, error } = await supabase
      .from('organization_members')
      .insert({
        organization_id: organizationId,
        user_id: profile.id,
        role,
      })
      .select(
        'id, organization_id, user_id, role, joined_at, updated_at, profiles(full_name, email, avatar_url)'
      )
      .single();

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    return { data: toMember(data as MemberRow), error: null };
  }

  async updateMemberRole(
    memberId: string,
    role: Role
  ): Promise<ApiResponse<OrganizationMember>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('organization_members')
      .update({ role })
      .eq('id', memberId)
      .select(
        'id, organization_id, user_id, role, joined_at, updated_at, profiles(full_name, email, avatar_url)'
      )
      .single();

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    return { data: toMember(data as MemberRow), error: null };
  }

  async removeMember(memberId: string): Promise<ApiResponse<null>> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('organization_members')
      .delete()
      .eq('id', memberId);

    return { data: null, error: error ? toApiError(error) : null };
  }

  async isSlugAvailable(slug: string): Promise<ApiResponse<boolean>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', slugify(slug))
      .maybeSingle();

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    return { data: data === null, error: null };
  }
}

export function createOrganizationService(): IOrganizationService {
  return new SupabaseOrganizationService();
}

