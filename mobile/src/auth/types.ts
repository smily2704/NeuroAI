/**
 * Auth contracts.
 *
 * The screens only know this interface, so swapping the demonstration
 * adapter for a real backend adapter (JWT login against the FastAPI
 * backend) requires no screen changes.
 */

export type AuthRole = 'doctor';

export interface AppSession {
  /** Distinguishes demo sessions from future backend sessions. */
  kind: 'demo';
  displayName: string;
  email: string;
  role: AuthRole;
  createdAt: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthAdapter {
  /** Stable identifier surfaced in the Settings screen. */
  readonly id: 'demo' | 'api';
  /** Honest description of what this adapter actually does. */
  readonly description: string;
  /** Restore a previously persisted session, if any. */
  restore(): Promise<AppSession | null>;
  /** Authenticate. Implementations must not pretend to verify credentials. */
  signIn(credentials: SignInCredentials): Promise<AppSession>;
  /** Clear any persisted session. */
  signOut(): Promise<void>;
}
