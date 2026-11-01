'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';

import { checkSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore(state => state.setUser);
  const clearIsAuthenticated = useAuthStore(state => state.clearIsAuthenticated);

  useEffect(() => {
    let active = true;

    const verifySession = async () => {
      try {
        const session = await checkSession();

        if (!session.success) {
          if (active) clearIsAuthenticated();
          return;
        }

        const user = await getMe();

        if (active) {
          setUser(user);
        }
      } catch {
        if (active) {
          clearIsAuthenticated();
        }
      }
    };

    void verifySession();

    return () => {
      active = false;
    };
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>;
}
