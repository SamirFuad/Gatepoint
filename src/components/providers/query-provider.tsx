// =============================================================
// Gatepoint — TanStack Query Provider
// =============================================================
// Wraps the app with QueryClientProvider for server state management.
// Must be a Client Component because it uses React context.
// =============================================================

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

/**
 * Provides TanStack Query context to the entire application.
 *
 * Configuration:
 * - staleTime: 60s — data is considered fresh for 1 minute
 * - retry: 1 — retry failed requests once
 * - refetchOnWindowFocus: false — don't refetch when user tabs back
 *
 * These defaults balance UX (no excessive loading spinners)
 * with data freshness (reasonable staleness window).
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0, // Don't retry mutations (could cause duplicates)
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
