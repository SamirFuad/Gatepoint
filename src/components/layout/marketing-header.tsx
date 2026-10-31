// =============================================================
// Gatepoint — Marketing Site Header
// =============================================================

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
];

export function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary shadow-sm transition-shadow group-hover:shadow-md">
            <Building2 className="size-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold tracking-tight">Gatepoint</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/public/events"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4 decoration-2 decoration-primary/0 hover:decoration-primary/40"
          >
            Explore events
          </Link>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4 decoration-2 decoration-primary/0 hover:decoration-primary/40"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' })
            )}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className={cn(buttonVariants({ size: 'sm' }), 'px-5 glow-cobalt')}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'overflow-hidden border-t transition-all duration-300 ease-in-out md:hidden',
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 border-t-0 opacity-0'
        )}
      >
        <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
          <Link
            href="/public/events"
            className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            Explore events
          </Link>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-4">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'w-full justify-center'
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className={cn(
                buttonVariants(),
                'w-full justify-center'
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
