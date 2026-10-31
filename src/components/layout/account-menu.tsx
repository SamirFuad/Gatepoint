'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { ChevronDown, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuthUser } from '@/components/providers/auth-provider';
import { profileInitials, profileName } from '@/features/auth/lib/auth-profile';
import { logoutAction } from '@/features/auth/actions';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export function AccountMenu() {
  const user = useAuthUser();
  const [pending, startTransition] = useTransition();
  if (!user) return null;
  const name = profileName(user);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="account-trigger"
        aria-label={`Account: ${name}. Signed in`}
      >
        <span className="account-initials" aria-hidden="true">
          {profileInitials(user)}
        </span>
        <span className="account-identity">
          <small>Signed in</small>
          <strong>{name}</strong>
        </span>
        <ChevronDown size={13} aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="account-menu">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <span className="account-menu-name">{name}</span>
            <span className="account-menu-email">{user.email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/dashboard" />}>
            <LayoutDashboard size={16} />
            My workspace
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await logoutAction();
              })
            }
          >
            <LogOut size={16} />
            {pending ? 'Signing out…' : 'Sign out'}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
