'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Brand } from '@/components/brand';
import { AccountMenu } from './account-menu';
import { useAuthUser } from '@/components/providers/auth-provider';
const links = [
  { label: 'The platform', href: '/#features' },
  { label: 'Event services', href: '/#services' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Explore events', href: '/public/events' },
];
export function MarketingHeader() {
  const user = useAuthUser();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          setOpen(false);
          menuButton.current?.focus();
        }
      }}
    >
      <div className="site-container header-inner">
        <Link href="/" aria-label="Gatepoint home">
          <Brand />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className={'header-actions' + (user ? ' has-account' : '')}>
          {user ? (
            <AccountMenu />
          ) : (
            <Link className="sign-in-link" href="/login">
              Sign in
            </Link>
          )}
          <Link
            className="gp-button gp-button-dark header-cta"
            href={user ? '/events/new' : '/register'}
          >
            Create an event <ArrowUpRight size={16} />
          </Link>
          <button
            ref={menuButton}
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-menu"
          className="mobile-site-nav"
          aria-label="Mobile navigation"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
              <ArrowUpRight size={16} />
            </Link>
          ))}
          <Link
            href={user ? '/dashboard' : '/login'}
            onClick={() => setOpen(false)}
          >
            {user ? 'My workspace' : 'Sign in'}
          </Link>
          <Link
            href={user ? '/events/new' : '/register'}
            onClick={() => setOpen(false)}
          >
            Create an event
          </Link>
        </nav>
      )}
    </header>
  );
}
