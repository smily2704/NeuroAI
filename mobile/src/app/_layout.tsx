/**
 * Root layout — providers, splash, and the authentication gate.
 *
 * The gate only redirects between the demo login and the doctor tabs; it
 * performs no network activity.
 */

import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from '@/auth/AuthProvider';
import { AppText } from '@/components/AppText';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {
  // Splash handling is best-effort.
});

function BrandMark() {
  const { theme } = useTheme();
  const colors = theme.colors;
  return (
    <View style={styles.center}>
      <View style={[styles.logo, { backgroundColor: colors.primaryPressed }]}>
        <AppText variant="h1" tone="onPrimary" style={styles.logoLetter}>
          N
        </AppText>
      </View>
      <AppText variant="h2">
        NeuroAI
        <AppText variant="h2" tone="highlight">
          .
        </AppText>
      </AppText>
      <AppText variant="caption" tone="muted" center style={styles.tagline}>
        Neonatal EEG analysis — demonstration build
      </AppText>
    </View>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const { theme } = useTheme();
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    if (status === 'restoring') return;
    const onLoginScreen = segments[0] === 'login';
    if (status === 'unauthenticated' && !onLoginScreen) {
      router.replace('/login');
    } else if (status === 'authenticated' && onLoginScreen) {
      router.replace('/dashboard');
    }
  }, [status, segments, router]);

  if (status === 'restoring') {
    return (
      <View style={[styles.splash, { backgroundColor: theme.colors.background }]}>
        <BrandMark />
        <ActivityIndicator color={theme.colors.primaryPressed} style={styles.spinner} />
      </View>
    );
  }

  return <>{children}</>;
}

function ThemedChrome() {
  const { theme } = useTheme();
  return (
    <>
      <StatusBar style={theme.name === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(doctor)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  React.useEffect(() => {
    SplashScreen.hideAsync().catch(() => {
      // Best-effort; the splash may already be hidden.
    });
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AuthGate>
            <ThemedChrome />
          </AuthGate>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  center: { alignItems: 'center', gap: spacing.sm },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  logoLetter: { fontSize: 34 },
  tagline: { maxWidth: 240 },
  spinner: { marginTop: spacing.lg },
});
