import Link from 'next/link';
import { ArrowUpRight, Compass } from 'lucide-react';
import { Brand } from '@/components/brand';
export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-16 text-center">
      <Link href="/" aria-label="Gatepoint home">
        <Brand />
      </Link>
      <div className="empty-state-icon mt-14 mb-5">
        <Compass size={27} strokeWidth={1.3} />
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        404 / A different direction
      </p>
      <h1 className="text-4xl font-medium">Let’s find your way back.</h1>
      <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
        This page may have moved, or the event is no longer available. There’s
        still plenty to discover.
      </p>
      <Link href="/" className="gp-button gp-button-dark mt-8">
        Back to Gatepoint
        <ArrowUpRight size={17} />
      </Link>
      <Link href="/public/events" className="text-link mt-3">
        Explore events
        <ArrowUpRight size={16} />
      </Link>
    </main>
  );
}
