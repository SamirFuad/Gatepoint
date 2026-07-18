// =============================================================
// Gatepoint — Sonner Toast Provider
// =============================================================
// Configures the toast notification system using Sonner.
// =============================================================

'use client';

import { Toaster as SonnerToaster } from 'sonner';

/**
 * Toast notification provider.
 * Uses Sonner for beautiful, accessible toast notifications.
 *
 * Position: bottom-right (standard SaaS convention)
 * Duration: 5 seconds
 */
export function ToastProvider() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        duration: 5000,
        classNames: {
          toast:
            'group border-border bg-background text-foreground shadow-lg',
          description: 'text-muted-foreground',
          actionButton:
            'bg-primary text-primary-foreground',
          cancelButton:
            'bg-muted text-muted-foreground',
        },
      }}
    />
  );
}
