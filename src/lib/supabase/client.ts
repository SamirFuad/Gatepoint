// =============================================================
// Gatepoint — Supabase Browser Client
// =============================================================
// Creates a Supabase client for use in Client Components.
// This client uses the anon key and respects RLS policies.
// NEVER import the admin client from here.
// =============================================================

import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for browser/client-side usage.
 *
 * This client:
 * - Uses the public anon key (safe for browser)
 * - Respects all RLS policies
 * - Manages auth session via cookies
 *
 * @example
 * const supabase = createClient();
 * const { data } = await supabase.from('events').select('*');
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
