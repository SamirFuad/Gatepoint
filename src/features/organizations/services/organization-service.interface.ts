// =============================================================
// Gatepoint — Organization Service Interface
// =============================================================
// Defines the contract for organization operations.
// =============================================================

import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types';
import type { Role } from '@/lib/constants';

/**
 * Represents an organization.
 */
export type Organization = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  website: string | null;
  settings: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

/**
 * Data for creating a new organization.
 */
export type CreateOrganizationData = {
  name: string;
  slug?: string; // Auto-generated from name if not provided
  description?: string;
  website?: string;
};

/**
 * Data for updating an organization.
 */
export type UpdateOrganizationData = Partial<
  Omit<CreateOrganizationData, 'description' | 'website'>
> & {
  description?: string | null;
  website?: string | null;
};

/**
 * Represents a member of an organization.
 */
export type OrganizationMember = {
  id: string;
  userId: string;
  organizationId: string;
  role: Role;
  joinedAt: string;
  user: {
    fullName: string | null;
    email: string;
    avatarUrl: string | null;
  };
};

/**
 * Organization service interface.
 */
export interface IOrganizationService {
  /** Create a new organization */
  create(data: CreateOrganizationData): Promise<ApiResponse<Organization>>;

  /** Get organization by ID */
  getById(id: string): Promise<ApiResponse<Organization>>;

  /** Get organization by slug */
  getBySlug(slug: string): Promise<ApiResponse<Organization>>;

  /** Update an organization */
  update(
    id: string,
    data: UpdateOrganizationData
  ): Promise<ApiResponse<Organization>>;

  /** Delete an organization */
  delete(id: string): Promise<ApiResponse<null>>;

  /** Get organizations for the current user */
  getUserOrganizations(): Promise<ApiResponse<Organization[]>>;

  /** Get members of an organization */
  getMembers(
    organizationId: string,
    pagination: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<OrganizationMember>>>;

  /** Invite a member to an organization */
  inviteMember(
    organizationId: string,
    email: string,
    role: Role
  ): Promise<ApiResponse<OrganizationMember>>;

  /** Update a member's role */
  updateMemberRole(
    memberId: string,
    role: Role
  ): Promise<ApiResponse<OrganizationMember>>;

  /** Remove a member from an organization */
  removeMember(memberId: string): Promise<ApiResponse<null>>;

  /** Check if a slug is available */
  isSlugAvailable(slug: string): Promise<ApiResponse<boolean>>;
}
