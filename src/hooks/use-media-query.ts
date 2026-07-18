// =============================================================
// Gatepoint — useMediaQuery Hook
// =============================================================
// Tracks whether a CSS media query matches.
// Useful for responsive behavior in JavaScript.
// =============================================================

'use client';

import { useSyncExternalStore } from 'react';

/**
 * Returns true if the given media query matches.
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', onStoreChange);

      return () => {
        mediaQuery.removeEventListener('change', onStoreChange);
      };
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
