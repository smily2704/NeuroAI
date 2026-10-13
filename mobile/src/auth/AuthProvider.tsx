/**
 * AuthProvider — session state for the whole app.
 *
 * The adapter is selected from APP_ENV.authMode, so switching from the
 * labelled demo login to the real backend later means changing one config
 * value and implementing the api adapter — no screen changes.
 */

import { APP_ENV } from '@/config/env';
import * as React from 'react';

import { apiAdapter } from './apiAdapter';
import { demoAdapter } from './demoAdapter';
import { AppSession, AuthAdapter, SignInCredentials } from './types';

export type AuthStatus = 'restoring' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  status: AuthStatus;
  session: AppSession | null;
  adapter: AuthAdapter;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

const activeAdapter: AuthAdapter = APP_ENV.authMode === 'api' ? apiAdapter : demoAdapter;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = React.useState<AuthStatus>('restoring');
  const [session, setSession] = React.useState<AppSession | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    activeAdapter
      .restore()
      .then((restored) => {
        if (cancelled) return;
        setSession(restored);
        setStatus(restored ? 'authenticated' : 'unauthenticated');
      })
      .catch(() => {
        if (cancelled) return;
        setSession(null);
        setStatus('unauthenticated');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = React.useCallback(async (credentials: SignInCredentials) => {
    const next = await activeAdapter.signIn(credentials);
    setSession(next);
    setStatus('authenticated');
  }, []);

  const signOut = React.useCallback(async () => {
    await activeAdapter.signOut();
    setSession(null);
    setStatus('unauthenticated');
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({ status, session, adapter: activeAdapter, signIn, signOut }),
    [status, session, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>.');
  }
  return context;
}
