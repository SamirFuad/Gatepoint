// =============================================================
// Gatepoint — Next.js Proxy (formerly Middleware)
// =============================================================
// Runs on EVERY matching request before it reaches the page.
//
// Responsibilities:
// 1. Refresh Supabase auth session (keep tokens alive)
// 2. Protect dashboard routes (redirect unauthenticated users)
// 3. Redirect authenticated users away from auth pages
//
// NOTE: Next.js 16 renamed "middleware" to "proxy".
// The file is proxy.ts and exports a function named "proxy".
// =============================================================

import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { redirectWithSession } from '@/lib/supabase/session-response';

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/events',
  '/organization',
  '/create-organization',
];

// Routes only for unauthenticated users
const AUTH_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

/**
 * Checks if the current path matches any of the given route prefixes.
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Refresh session and get user
  const { supabaseResponse, user } = await updateSession(request);

  // --- Protected Routes ---
  if (matchesRoute(pathname, PROTECTED_ROUTES)) {
    if (!user) {
      // Not authenticated → redirect to login
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectTo', pathname);
      return redirectWithSession(url, supabaseResponse);
    }

    // User is authenticated → allow access
    return supabaseResponse;
  }

  // --- Auth Routes ---
  if (matchesRoute(pathname, AUTH_ROUTES)) {
    if (user) {
      // Already authenticated → redirect to dashboard
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return redirectWithSession(url, supabaseResponse);
    }

    // Not authenticated → allow access to auth pages
    return supabaseResponse;
  }

  // Default: allow through
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
