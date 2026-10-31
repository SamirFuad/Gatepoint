'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { useAuthUser } from '@/components/providers/auth-provider';

export function CreateEventLink(
  props: Omit<ComponentProps<typeof Link>, 'href'>
) {
  const user = useAuthUser();
  return <Link {...props} href={user ? '/events/new' : '/register'} />;
}
