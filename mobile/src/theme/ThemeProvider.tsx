/**
 * ThemeProvider — resolves the user's theme preference (system | light | dark)
 * into a concrete Theme, and exposes it through React context.
 *
 * The preference is persisted in the app's SecureStore-backed preference
 * store, so it survives app restarts.
 */

import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import * as React from 'react';
import { useColorScheme } from 'react-native';

import { getPreference, setPreference as persistPreference } from '@/storage/preferences';
import { Theme, ThemePreference, themes } from './tokens';

interface ThemeContextValue {
  /** Resolved theme actually used for rendering. */
  theme: Theme;
  /** The user's stored preference. */
  preference: ThemePreference;
  /** Change and persist the preference. */
  setScheme: (preference: ThemePreference) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = React.useState<ThemePreference>('system');

  React.useEffect(() => {
    let cancelled = false;
    getPreference('theme')
      .then((stored) => {
        if (!cancelled && isThemePreference(stored)) setPreferenceState(stored);
      })
      .catch(() => {
        // The preference is cosmetic; ignore read failures and keep the default.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setScheme = React.useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    persistPreference('theme', next).catch(() => {
      // Ignore write failures; the theme falls back to system on next launch.
    });
  }, []);

  const scheme: 'light' | 'dark' =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme: themes[scheme], preference, setScheme }),
    [scheme, preference, setScheme],
  );

  const navTheme = React.useMemo(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: value.theme.colors.primaryPressed,
        background: value.theme.colors.background,
        card: value.theme.colors.surface,
        text: value.theme.colors.text,
        border: value.theme.colors.border,
        notification: value.theme.colors.danger,
      },
    };
  }, [scheme, value.theme.colors]);

  return (
    <ThemeContext.Provider value={value}>
      <NavigationThemeProvider value={navTheme}>{children}</NavigationThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside <ThemeProvider>.');
  }
  return context;
}

/** Convenience hook returning just the resolved theme. */
export function useTokens(): Theme {
  return useTheme().theme;
}
