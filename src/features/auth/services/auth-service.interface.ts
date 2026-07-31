// =============================================================
// Gatepoint — Auth Service Interface
// =============================================================
// Defines the contract for authentication operations.
// The UI only depends on this interface, never on Supabase directly.
//
// To migrate to a different auth provider:
// 1. Create a new implementation (e.g., NextAuthService)
// 2. Implement this interface
// 3. Update the service factory
// =============================================================

import type { ApiResponse } from '@/types';

/**
 * Supported OAuth providers.
 */
export type OAuthProvider = 'google';

/**
 * Represents the authenticated user's profile.
 */
export type AuthUser = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
};

/**
 * Credentials for email/password login.
 */
export type LoginCredentials = {
  email: string;
  password: string;
};

/**
 * Data for registering a new user.
 */
export type RegisterData = {
  email: string;
  password: string;
  fullName: string;
};

/**
 * Auth service interface.
 * All authentication operations go through this contract.
 */
export interface IAuthService {
  /** Register a new user with email and password */
  register(data: RegisterData): Promise<ApiResponse<AuthUser>>;

  /** Log in with email and password */
  login(credentials: LoginCredentials): Promise<ApiResponse<AuthUser>>;

  /** Log out the current user */
  logout(): Promise<ApiResponse<null>>;

  /** Get the currently authenticated user */
  getCurrentUser(): Promise<ApiResponse<AuthUser>>;

  /** Send a password reset email */
  requestPasswordReset(email: string): Promise<ApiResponse<null>>;

  /** Reset password using a token */
  resetPassword(newPassword: string): Promise<ApiResponse<null>>;

  /** Resend email verification */
  resendVerification(email: string): Promise<ApiResponse<null>>;

  /** Initiate OAuth sign-in; returns the provider's consent URL */
  signInWithOAuth(
    provider: OAuthProvider,
    redirectTo?: string
  ): Promise<ApiResponse<{ url: string }>>;
}
