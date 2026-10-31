'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  CalendarDays,
  Compass,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Users,
  X,
} from 'lucide-react';
import { logoutAction } from '@/features/auth/actions';
import { Button } from '@/components/ui/button';

const ATTENDEE_NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    shortcut: '⌘D',
  },
  {
    href: '/public/events',
    label: 'Browse Events',
    icon: Compass,
    shortcut: '⌘E',
  },
  {
    href: '/events/new',
    label: 'Create Event',
    icon: Plus,
  },
];

const ORGANIZER_NAV_ITEMS = [
  ...ATTENDEE_NAV_ITEMS.slice(0, 2),
  {
    href: '/events',
    label: 'Events',
    icon: CalendarDays,
  },
  {
    href: '/organization/settings',
    label: 'Settings',
    icon: Settings,
    shortcut: '⌘,',
  },
  {
    href: '/organization/members',
    label: 'Members',
    icon: Users,
  },
];

function NavLinks({
  hasOrganization,
  onNavigate,
}: {
  hasOrganization: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const navItems = hasOrganization ? ORGANIZER_NAV_ITEMS : ATTENDEE_NAV_ITEMS;

  return (
    <nav className="flex flex-col gap-0.5">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/dashboard' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`group relative flex h-9 items-center gap-2.5 rounded-md px-3 text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-accent text-accent-foreground before:absolute before:inset-y-1.5 before:left-0 before:w-[2px] before:rounded-full before:bg-primary'
                : 'text-muted-foreground hover:bg-muted hover:pl-3.5 hover:text-foreground'
            }`}
          >
            <item.icon className={`size-4 shrink-0 transition-colors duration-150 ${isActive ? 'text-primary' : ''}`} />
            <span className="flex-1">{item.label}</span>
            {'shortcut' in item && item.shortcut && (
              <kbd className="hidden text-[10px] font-medium text-muted-foreground/50 lg:inline-block">
                {item.shortcut}
              </kbd>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button
        type="submit"
        variant="ghost"
        className="w-full justify-start gap-2.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <LogOut className="size-4 shrink-0" />
        Sign out
      </Button>
    </form>
  );
}

function SidebarContent({
  hasOrganization,
  onNavigate,
}: {
  hasOrganization: boolean;
  onNavigate?: () => void;
}) {
  return (
    <>
      {/* Accent top line */}
      <div
        className="h-[2px] shrink-0"
        style={{
          background: 'linear-gradient(90deg, #4F6BFF 0%, #7C8FFF 50%, #4F6BFF 100%)',
        }}
      />

      {/* Logo / Brand */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary shadow-sm transition-opacity duration-200 hover:opacity-80">
          <Building2 className="size-[18px] text-primary-foreground" />
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight text-foreground">Gatepoint</div>
          <div className="mt-0.5 text-[10px] font-medium leading-none text-muted-foreground">
            {hasOrganization ? 'Workspace' : 'Personal'}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-2 px-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            Navigation
          </span>
        </div>
        <NavLinks hasOrganization={hasOrganization} onNavigate={onNavigate} />
      </div>

      {/* Sidebar Footer */}
      <div className="shrink-0 border-t px-3 py-3">
        {/* User avatar placeholder */}
        <div className="mb-2 flex items-center gap-2.5 px-3 py-1.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
            GP
          </div>
          <div className="text-xs font-medium text-muted-foreground">Gatepoint User</div>
        </div>
        <LogoutButton />
      </div>
    </>
  );
}

function Breadcrumb({ hasOrganization }: { hasOrganization: boolean }) {
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);
  const crumbs = segments.map((seg) => {
    return seg
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  });

  return (
    <div className="hidden items-center gap-1.5 text-sm md:flex">
      <span className="text-muted-foreground/60">{hasOrganization ? 'Workspace' : 'Personal'}</span>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="text-muted-foreground/40">/</span>
          <span className={i === crumbs.length - 1 ? 'font-medium text-foreground' : 'text-muted-foreground'}>
            {crumb}
          </span>
        </span>
      ))}
    </div>
  );
}

export function DashboardShell({
  children,
  hasOrganization,
}: {
  children: React.ReactNode;
  hasOrganization: boolean;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r bg-card md:flex">
        <SidebarContent hasOrganization={hasOrganization} />
      </aside>

      {/* Mobile overlay */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r bg-card/95 backdrop-blur-md transition-transform duration-250 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute right-3 top-3 z-10">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation"
            className="size-8"
          >
            <X className="size-4" />
          </Button>
        </div>
        <SidebarContent
          hasOrganization={hasOrganization}
          onNavigate={() => setMobileNavOpen(false)}
        />
      </aside>

      {/* Main content area */}
      <div className="md:pl-60">
        {/* Top header bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-card/90 px-4 backdrop-blur-md md:px-6">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 transition-colors duration-150 hover:bg-accent md:hidden"
            aria-label="Open navigation"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="size-4" />
          </Button>

          {/* Breadcrumb page indicator */}
          <Breadcrumb hasOrganization={hasOrganization} />

          <div className="ml-auto flex items-center gap-2">
            {/* Search shortcut hint */}
            <button
              type="button"
              className="hidden items-center gap-2 rounded-md border border-border/60 bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground md:flex"
              aria-label="Search"
            >
              <Search className="size-3.5" />
              <span>Search…</span>
              <kbd className="ml-1 rounded border border-border/80 bg-background px-1.5 py-0.5 text-[10px] font-medium">
                ⌘K
              </kbd>
            </button>

            <div className="hidden md:block">
              <LogoutButton />
            </div>
          </div>
        </header>

        {/* Page content — animated wrapper with responsive padding */}
        <main className="animate-fade-in-up p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
