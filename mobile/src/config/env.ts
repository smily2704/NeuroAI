/**
 * Runtime configuration for the mobile app.
 *
 * Nothing here is used to perform network requests yet — the app ships in
 * demonstration mode. `apiBaseUrl` is reserved for the backend-integration
 * phase (the FastAPI backend documented in Frontend/README.md) and is
 * deliberately left unset so no screen can accidentally call it.
 */

export const APP_ENV = {
  /**
   * Authentication mode:
   *  - 'demo' → local, clearly labelled demo login (current build)
   *  - 'api'  → real backend login (NOT implemented; reserved for the
   *             backend-integration phase)
   */
  authMode: 'demo' as 'demo' | 'api',

  /**
   * Reserved for the backend-integration phase. Until it is set and the
   * 'api' auth adapter is implemented, the app performs no requests.
   */
  apiBaseUrl: null as string | null,

  /** Human-readable build label shown in Settings. */
  buildLabel: 'Development preview (Phase 2B)',
} as const;
