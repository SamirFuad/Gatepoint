'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Copy, Share2, ExternalLink } from 'lucide-react';
export function EventShare({ slug, title }: { slug: string; title: string }) {
  const [message, setMessage] = useState('');
  const path = '/public/events/' + encodeURIComponent(slug);
  const url = () => new URL(path, window.location.origin).href;
  async function copy() {
    try {
      await navigator.clipboard.writeText(url());
      setMessage('Event link copied.');
    } catch {
      setMessage('Open the event page and copy its address to share.');
    }
  }
  async function share() {
    try {
      if (navigator.share) await navigator.share({ title, url: url() });
      else await copy();
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError'))
        setMessage('Sharing could not open. Use Copy link instead.');
    }
  }
  return (
    <section
      className="rounded-xl border bg-card p-5 space-y-3"
      aria-label="Share published event"
    >
      <h2 className="font-medium">Your event is ready to share</h2>
      <p className="text-sm text-muted-foreground">
        Guests can open this public page and register. Your organizer workspace
        stays private.
      </p>
      <Link
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm underline break-all"
      >
        {path}
      </Link>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={copy} variant="outline">
          <Copy size={16} />
          Copy link
        </Button>
        <Button type="button" onClick={share} variant="outline">
          <Share2 size={16} />
          Share event
        </Button>
        <Link
          href={path}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link"
        >
          Open public page
          <ExternalLink size={15} />
        </Link>
      </div>
      {message && (
        <p role="status" className="text-xs">
          {message}
        </p>
      )}
    </section>
  );
}
