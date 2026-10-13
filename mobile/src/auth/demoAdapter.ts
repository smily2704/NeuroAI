/**
 * Demo authentication adapter.
 *
 * WHAT THIS ACTUALLY DOES: validates that the fields are filled in,
 * fabricates a clearly-labelled local "demo" session, and persists it in
 * Expo SecureStore. It performs NO network requests, verifies NOTHING,
 * and must never be described as real authentication.
 */

import { getPreference, removePreference, setPreference } from '@/storage/preferences';
import type { AppSession, AuthAdapter, SignInCredentials } from './types';

const SESSION_KEY = 'session';

function isAppSession(value: unknown): value is AppSession {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<AppSession>;
  return candidate.kind === 'demo' && typeof candidate.email === 'string';
}

export const demoAdapter: AuthAdapter = {
  id: 'demo',
  description:
    'Local demonstration login. Credentials are not verified and no server is contacted.',

  async restore(): Promise<AppSession | null> {
    const raw = await getPreference(SESSION_KEY);
    if (!raw) return null;
    try {
      const parsed: unknown = JSON.parse(raw);
      return isAppSession(parsed) ? parsed : null;
    } catch {
      return null;
    }
  },

  async signIn({ email, password }: SignInCredentials): Promise<AppSession> {
    // Simulated latency so the loading state behaves realistically.
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!email.trim()) {
      throw new Error('Enter an email address to continue with the demo.');
    }
    if (!password) {
      throw new Error('Enter a password to continue with the demo.');
    }

    const session: AppSession = {
      kind: 'demo',
      displayName: 'Demo Clinician',
      email: email.trim(),
      role: 'doctor',
      createdAt: new Date().toISOString(),
    };
    await setPreference(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  async signOut(): Promise<void> {
    await removePreference(SESSION_KEY);
  },
};
