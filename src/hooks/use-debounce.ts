// =============================================================
// Gatepoint — useDebounce Hook
// =============================================================
// Debounces a value by a specified delay.
// Useful for search inputs to prevent excessive API calls.
// =============================================================

'use client';

import { useEffect, useState } from 'react';

/**
 * Debounces a value by the specified delay in milliseconds.
 *
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 300);
 *
 * useEffect(() => {
 *   // This only fires 300ms after the user stops typing
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
