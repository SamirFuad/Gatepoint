'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  ChevronRight,
  Compass,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Settings,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { logoutAction } from '@/features/auth/actions';
import { Brand } from '@/components/brand';
import { AccountMenu } from './account-menu';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';

export function DashboardShell({
  children,
  hasOrganization,
  workspaceName = 'Personal workspace',
}: {
  children: React.ReactNode;
  hasOrganization: boolean;
  workspaceName?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const mainLinks = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    ...(hasOrganization
      ? [{ href: '/events', label: 'My events', icon: CalendarDays }]
      : []),
    { href: '/public/events', label: 'Explore events', icon: Compass },
    ...(!hasOrganization
      ? [{ href: '/events/new', label: 'Create an event', icon: Plus }]
      : []),
  ];
  const teamLinks = [
    { href: '/organization/members', label: 'Team members', icon: Users },
    {
      href: '/organization/settings',
      label: 'Workspace settings',
      icon: Settings,
    },
  ];
  const pageNames: Record<string, string> = {
    dashboard: 'Overview',
    events: 'Events',
    new: 'Create event',
    settings: 'Settings',
    members: 'Team members',
    organization: 'Organization',
    'create-organization': 'Create workspace',
    attendees: 'Attendees',
    registrations: 'Registrations',
    'qr-codes': 'QR codes',
    'landing-page': 'Event page',
  };
  const segments = pathname.split('/').filter(Boolean);
  const crumbs = segments.map(
    (segment) => pageNames[segment] ?? 'Event details'
  );
  const renderLinks = (links: typeof mainLinks) =>
    links.map((item) => {
      const active =
        pathname === item.href ||
        (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
      return (
        <Link
          key={item.href}
          href={item.href}
          aria-current={active ? 'page' : undefined}
          onClick={() => setOpen(false)}
        >
          <item.icon size={17} />
          <span>{item.label}</span>
          {active && <ChevronRight size={13} />}
        </Link>
      );
    });
  const sidebar = (
    <>
      <Link className="sidebar-brand" href="/" aria-label="Gatepoint home">
        <Brand />
      </Link>
      <div className="workspace-switcher">
        <div className="workspace-avatar">
          <Building2 size={17} />
        </div>
        <div className="min-w-0">
          <strong className="truncate">{workspaceName}</strong>
          <span>
            {hasOrganization
              ? 'Organization workspace'
              : 'Your space to connect'}
          </span>
        </div>
      </div>
      <p className="sidebar-section-label">Your workspace</p>
      <nav className="workspace-nav" aria-label="Workspace navigation">
        {renderLinks(mainLinks)}
      </nav>
      {hasOrganization && (
        <>
          <p className="sidebar-section-label">Organization</p>
          <nav className="workspace-nav" aria-label="Organization navigation">
            {renderLinks(teamLinks)}
          </nav>
        </>
      )}
      <div className="sidebar-bottom">
        <div className="sidebar-note">
          <Sparkles size={22} strokeWidth={1.2} />
          <p>
            Good things happen
            <br />
            when people come together.
          </p>
          <Link href="/events/new" onClick={() => setOpen(false)}>
            Create your next event <ArrowUpRight size={15} />
          </Link>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="sidebar-logout">
            <LogOut size={16} />
            Sign out
          </button>
        </form>
      </div>
    </>
  );
  return (
    <div className="workspace-shell">
      <a href="#workspace-content" className="skip-link">
        Skip to content
      </a>
      <aside className="workspace-sidebar desktop-sidebar">{sidebar}</aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="mobile-sidebar"
        >
          <SheetTitle className="sr-only">Workspace navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Navigate your Gatepoint workspace
          </SheetDescription>
          <div className="workspace-sidebar">{sidebar}</div>
          <SheetClose
            className="mobile-sidebar-close"
            aria-label="Close navigation"
          >
            <X size={18} />
          </SheetClose>
        </SheetContent>
      </Sheet>
      <div className="workspace-body">
        <header className="workspace-header">
          <button
            type="button"
            className="workspace-mobile-toggle"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={19} />
          </button>
          <nav className="workspace-breadcrumb" aria-label="Breadcrumb">
            <Link href="/dashboard">Workspace</Link>
            {crumbs.map((crumb, i) => (
              <span key={i} className="inline-flex items-center gap-2">
                {i === 0 ? <ChevronRight size={12} /> : <span>/</span>}
                {i === crumbs.length - 1 ? (
                  <span aria-current="page">{crumb}</span>
                ) : (
                  <Link
                    href={
                      segments[i] === 'organization'
                        ? '/organization/settings'
                        : '/' + segments.slice(0, i + 1).join('/')
                    }
                  >
                    {crumb}
                  </Link>
                )}
              </span>
            ))}
          </nav>
          <div className="workspace-header-actions">
            <AccountMenu />
            <Link href="/public/events">
              Explore events <ArrowUpRight size={14} />
            </Link>
            <Link
              href={
                hasOrganization
                  ? '/organization/settings'
                  : '/create-organization'
              }
              className="workspace-avatar"
              aria-label={
                hasOrganization
                  ? 'Workspace settings'
                  : 'Create an organization'
              }
            >
              <Building2 size={16} />
            </Link>
          </div>
        </header>
        <main id="workspace-content" className="workspace-main">
          {children}
        </main>
      </div>
    </div>
  );
}
