/**
 * Backend authentication adapter — RESERVED, NOT IMPLEMENTED.
 *
 * This file exists to show where real authentication will live once the
 * FastAPI backend is connected in a later phase. It intentionally contains
 * no fetch calls and no invented endpoints: when integration happens, this
 * adapter will call the login endpoint that already exists in
 * Frontend/backend/app/main.py (POST /api/auth/login) and store the JWT in
 * Expo SecureStore with its expiry.
 *
 * Until then it fails loudly so no screen can imply that authentication
 * works against a server.
 */

import type { AppSession, AuthAdapter } from './types';

export const apiAdapter: AuthAdapter = {
  id: 'api',
  description: 'Backend login — not configured in this build.',

  async restore(): Promise<AppSession | null> {
    return null;
  },

  async signIn(): Promise<AppSession> {
    throw new Error(
      'Live backend authentication is not configured yet. This build uses the labelled demo login only.',
    );
  },

  async signOut(): Promise<void> {
    // Nothing to clear: no backend session exists.
  },
};
