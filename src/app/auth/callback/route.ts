// =============================================================
// Gatepoint — OAuth Callback Route Handler
// =============================================================
// Handles the redirect from Supabase OAuth providers (e.g. Google).
// Exchanges the authorization code for a session, then redirects
// the user to the signed-in dashboard.
//
// URL: /auth/callback?code=<code>
// =============================================================

import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL('/dashboard', origin));
    }

    // The message is available in Vercel Function Logs without exposing
    // Supabase implementation details to the browser.
    console.error('Supabase OAuth callback failed:', error.message);
  }

  // If code is missing or exchange failed, redirect to login with error
  return NextResponse.redirect(
    new URL('/login?error=auth_callback_failed', origin)
  );
}
