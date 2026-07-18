'use server';

import { redirect } from 'next/navigation';
import { createAuthService } from './services/supabase-auth-service';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
} from './schemas/auth-schemas';

export type AuthActionState = {
  errors?: Record<string, string[] | undefined>;
  message?: string;
  success?: boolean;
};

const initialError = 'Something went wrong. Please try again.';

function safeRedirectPath(value: FormDataEntryValue | null) {
  if (typeof value !== 'string') {
    return '/dashboard';
  }

  if (!value.startsWith('/') || value.startsWith('//')) {
    return '/dashboard';
  }

  return value;
}

export async function loginAction(
  _state: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    redirectTo: safeRedirectPath(formData.get('redirectTo')),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const authService = createAuthService();
  const result = await authService.login(parsed.data);

  if (result.error) {
    return { message: result.error.message || initialError };
  }

  redirect(parsed.data.redirectTo || '/dashboard');
}

export async function registerAction(
  _state: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const authService = createAuthService();
  const result = await authService.register({
    email: parsed.data.email,
    password: parsed.data.password,
    fullName: parsed.data.fullName,
  });

  if (result.error) {
    return { message: result.error.message || initialError };
  }

  redirect(`/verify-email?email=${encodeURIComponent(parsed.data.email)}`);
}

export async function forgotPasswordAction(
  _state: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get('email'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const authService = createAuthService();
  const result = await authService.requestPasswordReset(parsed.data.email);

  if (result.error) {
    return { message: result.error.message || initialError };
  }

  return {
    success: true,
    message: 'Check your email for a password reset link.',
  };
}

export async function resetPasswordAction(
  _state: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const authService = createAuthService();
  const result = await authService.resetPassword(parsed.data.password);

  if (result.error) {
    return { message: result.error.message || initialError };
  }

  redirect('/login?reset=success');
}

export async function resendVerificationAction(
  _state: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = resendVerificationSchema.safeParse({
    email: formData.get('email'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const authService = createAuthService();
  const result = await authService.resendVerification(parsed.data.email);

  if (result.error) {
    return { message: result.error.message || initialError };
  }

  return {
    success: true,
    message: 'Verification email sent.',
  };
}

export async function logoutAction() {
  const authService = createAuthService();
  await authService.logout();
  redirect('/login');
}

