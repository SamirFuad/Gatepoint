'use client';
import Link from 'next/link';
import { ArrowLeft, RefreshCcw, Unplug } from 'lucide-react';
export default function AppError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[65vh] w-full max-w-lg flex-col items-center justify-center gap-5 p-8 text-center">
      <div className="empty-state-icon">
        <Unplug size={26} />
      </div>
      <h1 className="text-3xl font-medium">A little interruption.</h1>
      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
        We couldn’t load this part of your event experience. Please try again in
        a moment.
      </p>
      <button
        type="button"
        className="gp-button gp-button-dark"
        onClick={unstable_retry}
      >
        <RefreshCcw size={16} />
        Try again
      </button>
      <Link href="/" className="text-link">
        <ArrowLeft size={15} />
        Back to home
      </Link>
    </main>
  );
}
