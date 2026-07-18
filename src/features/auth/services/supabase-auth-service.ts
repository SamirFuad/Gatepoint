import { createClient } from '@/lib/supabase/server';
import type { ApiError, ApiResponse } from '@/types';
import type {
  AuthUser,
  IAuthService,
  LoginCredentials,
  RegisterData,
} from './auth-service.interface';

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
}

function toApiError(error: { message: string; code?: string; status?: number }): ApiError {
  return {
    message: error.message,
    code: error.code,
    status: error.status,
  };
}

function toAuthUser(user: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  email_confirmed_at?: string | null;
}): AuthUser {
  return {
    id: user.id,
    email: user.email ?? '',
    fullName:
      typeof user.user_metadata?.full_name === 'string'
        ? user.user_metadata.full_name
        : null,
    avatarUrl:
      typeof user.user_metadata?.avatar_url === 'string'
        ? user.user_metadata.avatar_url
        : null,
    emailVerified: Boolean(user.email_confirmed_at),
  };
}

export class SupabaseAuthService implements IAuthService {
  async register(data: RegisterData): Promise<ApiResponse<AuthUser>> {
    const supabase = await createClient();
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
        emailRedirectTo: `${appUrl()}/verify-email`,
      },
    });

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    if (!authData.user) {
      return {
        data: null,
        error: { message: 'Unable to create your account.' },
      };
    }

    return { data: toAuthUser(authData.user), error: null };
  }

  async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<AuthUser>> {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    if (!data.user) {
      return {
        data: null,
        error: { message: 'Unable to sign in with those credentials.' },
      };
    }

    return { data: toAuthUser(data.user), error: null };
  }

  async logout(): Promise<ApiResponse<null>> {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    return { data: null, error: error ? toApiError(error) : null };
  }

  async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    if (!data.user) {
      return { data: null, error: { message: 'No authenticated user.' } };
    }

    return { data: toAuthUser(data.user), error: null };
  }

  async requestPasswordReset(email: string): Promise<ApiResponse<null>> {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${appUrl()}/reset-password`,
    });

    return { data: null, error: error ? toApiError(error) : null };
  }

  async resetPassword(newPassword: string): Promise<ApiResponse<null>> {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    return { data: null, error: error ? toApiError(error) : null };
  }

  async resendVerification(email: string): Promise<ApiResponse<null>> {
    const supabase = await createClient();
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${appUrl()}/verify-email`,
      },
    });

    return { data: null, error: error ? toApiError(error) : null };
  }
}

export function createAuthService(): IAuthService {
  return new SupabaseAuthService();
}

