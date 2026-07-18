// =============================================================
// Gatepoint — Supabase Middleware Helper
// =============================================================
// Creates a Supabase client for use in Next.js middleware.
// Handles cookie-based session refresh on every request.
// =============================================================

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Updates the Supabase auth session by refreshing the token
 * on every request via middleware.
 *
 * This is critical for:
 * - Keeping the auth session alive
 * - Refreshing expired tokens transparently
 * - Setting secure cookies on the response
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Guard: If Supabase is not configured yet, skip session refresh.
  // This allows the dev server to run before Supabase setup (Step 3).
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return { supabaseResponse, user: null };
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do NOT use getSession() here.
  // getSession() reads from cookies which could be tampered with.
  // getUser() actually validates the JWT against Supabase Auth.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabaseResponse, user };
}
