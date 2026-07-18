// =============================================================
// Gatepoint — Global Shared Types
// =============================================================
// Types shared across all feature modules.
// Feature-specific types belong in their feature's types/ folder.
// =============================================================

/**
 * Standard API response wrapper.
 * All service methods should return this shape.
 */
export type ApiResponse<T> = {
  data: T | null;
  error: ApiError | null;
};

/**
 * Standard error shape returned by services.
 */
export type ApiError = {
  message: string;
  code?: string;
  status?: number;
};

/**
 * Pagination parameters for list queries.
 */
export type PaginationParams = {
  page: number;
  pageSize: number;
};

/**
 * Paginated response wrapper.
 */
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/**
 * Sort parameters for list queries.
 */
export type SortParams = {
  column: string;
  direction: 'asc' | 'desc';
};

/**
 * Common filter for list queries.
 */
export type FilterParams = {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
};

/**
 * Base entity fields present on all database records.
 */
export type BaseEntity = {
  id: string;
  created_at: string;
  updated_at: string;
};

/**
 * Represents the current user's context within an organization.
 * Used throughout the app to scope operations.
 */
export type OrganizationContext = {
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  role: string;
};
