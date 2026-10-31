// =============================================================
// Gatepoint — Auth Layout
// =============================================================
// Layout for authentication pages (login, register, etc.)
// Centered card design with no header/footer.
// =============================================================

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center hero-bg p-4">
      {/* Soft pulsing radial glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-3xl animate-pulse" />
      </div>

      {/* Back to home */}
      <Link
        href="/"
        className="absolute left-4 top-4 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:left-6 sm:top-6"
      >
        <ArrowLeft className="size-4" />
        Back to home
      </Link>

      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}
