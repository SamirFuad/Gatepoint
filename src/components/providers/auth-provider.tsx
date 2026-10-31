'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { authProfile } from '@/features/auth/lib/auth-profile';
import type { AuthUser } from '@/features/auth/services/auth-service.interface';

export const AuthContext = createContext<AuthUser | null>(null);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: AuthUser | null;
}) {
  const [user, setUser] = useState(initialUser);
  useEffect(() => {
    const supabase = createClient();
    // Keep the browser refresh loop active and synchronize sign-in/out across tabs.
    // This state is for display; authorization remains checked on the server.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? authProfile(session.user) : null);
    });
    return () => subscription.unsubscribe();
  }, []);
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export function useAuthUser() {
  return useContext(AuthContext);
}
