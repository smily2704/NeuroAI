/**
 * Small SecureStore-backed key/value helper for non-sensitive UI
 * preferences (theme choice, last used tab, …).
 *
 * SecureStore values are limited to ~2 KB, which is far more than any
 * preference stored here requires. On web (used only for quick local
 * previews) SecureStore is unavailable, so we fall back to localStorage,
 * and finally to an in-memory map so the app never crashes.
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const PREFIX = 'neuroai.';

const memoryStore = new Map<string, string>();

function canUseSecureStore(): boolean {
  return Platform.OS !== 'web';
}

export async function getPreference(key: string): Promise<string | null> {
  const storageKey = `${PREFIX}${key}`;
  try {
    if (canUseSecureStore()) {
      return await SecureStore.getItemAsync(storageKey);
    }
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(storageKey);
    }
  } catch {
    // Fall through to the in-memory store.
  }
  return memoryStore.get(storageKey) ?? null;
}

export async function setPreference(key: string, value: string): Promise<void> {
  const storageKey = `${PREFIX}${key}`;
  try {
    if (canUseSecureStore()) {
      await SecureStore.setItemAsync(storageKey, value);
      return;
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(storageKey, value);
      return;
    }
  } catch {
    // Fall through to the in-memory store.
  }
  memoryStore.set(storageKey, value);
}

export async function removePreference(key: string): Promise<void> {
  const storageKey = `${PREFIX}${key}`;
  try {
    if (canUseSecureStore()) {
      await SecureStore.deleteItemAsync(storageKey);
      return;
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(storageKey);
      return;
    }
  } catch {
    // Fall through to the in-memory store.
  }
  memoryStore.delete(storageKey);
}
