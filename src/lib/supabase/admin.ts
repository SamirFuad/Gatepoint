// =============================================================
// Gatepoint — Supabase Admin Client
// =============================================================
// Creates a Supabase client with the service_role key.
// This client BYPASSES all RLS policies.
//
// ⚠️ SECURITY WARNING:
// - NEVER import this on the client side
// - NEVER expose the service_role key to the browser
// - Only use in Server Actions, Route Handlers, or Edge Functions
// - Use ONLY when you need to bypass RLS (e.g., system operations)
// =============================================================

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase admin client that bypasses RLS.
 *
 * USE WITH EXTREME CAUTION.
 *
 * Valid use cases:
 * - Creating records on behalf of users during registration
 * - System-level operations (cleanup, migrations)
 * - Generating QR codes for new registrations
 *
 * Invalid use cases:
 * - Anything a regular user-scoped client can do
 * - Reading data that should be filtered by RLS
 *
 * @example
 * // In a Server Action only:
 * const adminClient = createAdminClient();
 * await adminClient.from('qr_codes').insert({ ... });
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL. ' +
        'The admin client can only be used on the server.'
    );
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
