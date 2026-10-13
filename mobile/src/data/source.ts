/**
 * Data-source switch.
 *
 * The whole app reads repositories from '@/data/repositories', which is the
 * ONLY place that decides where data comes from. Today it is 'mock'.
 *
 * When the FastAPI backend is integrated (a later phase), this file gains a
 * 'live' branch that calls the endpoints that already exist in
 * Frontend/backend/app/main.py. No endpoint is called anywhere in the app
 * today, and no endpoint is invented.
 */

export const DATA_SOURCE = 'mock' as const;

export type DataSource = typeof DATA_SOURCE;

/** Human-readable description used in the Settings screen. */
export const DATA_SOURCE_DESCRIPTION =
  'Demonstration data only. The NeuroAI backend is not connected to this build; no network requests are made.';
