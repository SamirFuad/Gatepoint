'use server';

import { redirect } from 'next/navigation';
import { createAuthService } from '../services/supabase-auth-service';

/**
 * Server action to initiate Google OAuth sign-in.
 * Redirects the browser to Google's consent screen.
 */
export async function googleSignInAction(formData: FormData) {
  const redirectTo = formData.get('redirectTo');
  const safePath =
    typeof redirectTo === 'string' &&
    redirectTo.startsWith('/') &&
    !redirectTo.startsWith('//')
      ? redirectTo
      : '/dashboard';

  const authService = createAuthService();
  const result = await authService.signInWithOAuth('google', safePath);

  if (result.error || !result.data) {
    redirect('/login?error=oauth_failed');
  }

  redirect(result.data.url);
}
