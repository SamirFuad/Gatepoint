'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  CalendarDays,
  Compass,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
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
  },
  {
    href: '/public/events',
    label: 'Browse events',
    icon: Compass,
  },
  {
    href: '/events/new',
    label: 'Create an event',
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
  const navItems = hasOrganization ? ORGANIZER_NAV_ITEMS : ATTENDEE_NAV_ITEMS;

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className="flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <item.icon className="size-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="ghost" className="w-full justify-start">
        <LogOut />
        Sign out
      </Button>
    </form>
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
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-background md:flex md:flex-col">
        <div className="flex h-16 items-center gap-2 border-b px-5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="size-5" />
          </div>
          <div>
            <div className="font-semibold leading-none">Gatepoint</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Event workspace
            </div>
          </div>
        </div>
        <div className="flex-1 px-3 py-4">
          <NavLinks hasOrganization={hasOrganization} />
        </div>
        <div className="border-t p-3">
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile nav overlay */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Mobile nav drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r bg-background transition-transform duration-200 ease-in-out md:hidden ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-5">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="size-5" />
            </div>
            <div className="font-semibold leading-none">Gatepoint</div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation"
          >
            <X />
          </Button>
        </div>
        <div className="flex-1 px-3 py-4">
          <NavLinks
            hasOrganization={hasOrganization}
            onNavigate={() => setMobileNavOpen(false)}
          />
        </div>
        <div className="border-t p-3">
          <LogoutButton />
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open navigation"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu />
            </Button>
            <div>
              <div className="text-sm font-semibold">
                {hasOrganization ? 'Workspace' : 'Your account'}
              </div>
              <div className="text-xs text-muted-foreground">
                {hasOrganization
                  ? 'Manage events and registrations'
                  : 'Browse events and manage registrations'}
              </div>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <LogoutButton />
          </div>
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

