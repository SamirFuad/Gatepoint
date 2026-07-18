import Link from 'next/link';
import {
  Building2,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
} from 'lucide-react';
import { logoutAction } from '@/features/auth/actions';
import { Button } from '@/components/ui/button';

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
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

function NavLinks() {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
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
}: {
  children: React.ReactNode;
}) {
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
          <NavLinks />
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
            >
              <Menu />
            </Button>
            <div>
              <div className="text-sm font-semibold">Workspace</div>
              <div className="text-xs text-muted-foreground">
                Manage events and registrations
              </div>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <LogoutButton />
          </div>
        </header>

        <div className="border-b bg-background px-4 py-2 md:hidden">
          <NavLinks />
        </div>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

