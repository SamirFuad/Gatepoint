'use server';

import { redirect } from 'next/navigation';
import { createAuthService } from '../services/supabase-auth-service';

/**
 * Server action to initiate Google OAuth sign-in.
 * Redirects the browser to Google's consent screen.
 */
export async function googleSignInAction() {
  const authService = createAuthService();
  const result = await authService.signInWithOAuth('google');

  if (result.error || !result.data) {
    redirect('/login?error=oauth_failed');
  }

  redirect(result.data.url);
}
