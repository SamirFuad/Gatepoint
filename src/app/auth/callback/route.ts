// =============================================================
// Gatepoint — OAuth Callback Route Handler
// =============================================================
// Handles the redirect from Supabase OAuth providers (e.g. Google).
// Exchanges the authorization code for a session, then redirects
// the user to the dashboard or a specified path.
//
// URL: /auth/callback?code=<code>&next=<redirect_path>
// =============================================================

import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  // Validate the redirect path to prevent open redirect attacks
  const safePath = next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(safePath, origin));
    }
  }

  // If code is missing or exchange failed, redirect to login with error
  return NextResponse.redirect(
    new URL('/login?error=auth_callback_failed', origin)
  );
}
