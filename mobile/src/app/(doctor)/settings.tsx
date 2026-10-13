/**
 * Settings — appearance, demo session, data source status and about.
 *
 * The theme preference is persisted in Expo SecureStore; the session card
 * shows exactly what kind of session exists (a local demo session).
 */

import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { useAuth } from '@/auth/AuthProvider';
import { AppText } from '@/components/AppText';
import { Badge, Chip } from '@/components/Badge';
import { Disclaimer, MockBanner, NoticeBox } from '@/components/Banner';
import { Button } from '@/components/Button';
import { Card, StatCard } from '@/components/Card';
import { SectionHeader } from '@/components/Layout';
import { Screen } from '@/components/Screen';
import { APP_ENV } from '@/config/env';
import { DATA_SOURCE, DATA_SOURCE_DESCRIPTION } from '@/data/source';
import { useTheme } from '@/theme/ThemeProvider';
import { ThemePreference, radius, spacing } from '@/theme/tokens';

const PREFERENCE_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export default function SettingsScreen() {
  const { preference, setScheme, theme } = useTheme();
  const { session, signOut, adapter } = useAuth();

  function confirmSignOut() {
    Alert.alert(
      'Sign out of the demo?',
      'This clears the local demonstration session stored on this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: () => {
            signOut().catch(() => {
              // Session state is re-derived on next launch; nothing else to do.
            });
          },
        },
      ],
    );
  }

  return (
    <Screen eyebrow="PREFERENCES" title="Settings" subtitle="Appearance, session and app information.">
      <MockBanner what="local app preferences" />

      {/* Appearance */}
      <SectionHeader title="Appearance" caption="Light and dark themes follow the NeuroAI palette." />
      <Card>
        <View style={styles.chipRow}>
          {PREFERENCE_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              selected={preference === option.value}
              onPress={() => setScheme(option.value)}
            />
          ))}
        </View>
        <AppText variant="caption" tone="muted" style={styles.hint}>
          Current theme: {theme.name}. The preference is stored in Expo SecureStore on this device.
        </AppText>
      </Card>

      {/* Session */}
      <SectionHeader title="Session" />
      <Card>
        <View style={styles.sessionRow}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.accentSoft }]}>
            <Ionicons name="person-outline" size={20} color={theme.colors.accentText} />
          </View>
          <View style={styles.flex}>
            <AppText variant="bodyStrong">{session?.displayName ?? 'Not signed in'}</AppText>
            <AppText variant="caption" tone="muted">
              {session?.email ?? '—'}
            </AppText>
          </View>
          <Badge label="DEMO SESSION" tone="mock" />
        </View>

        <NoticeBox tone="warning" title="Local demonstration session">
          {adapter.description} No credentials were verified, no token was issued by a server, and
          no personal data leaves this device.
        </NoticeBox>

        <Button
          label="Sign out of demo"
          icon="log-out-outline"
          variant="secondary"
          onPress={confirmSignOut}
          style={styles.signOut}
        />
      </Card>

      {/* Data source */}
      <SectionHeader title="Data source" />
      <Card>
        <View style={styles.sourceRow}>
          <AppText variant="bodyStrong" style={styles.flex}>
            Backend connection
          </AppText>
          <Badge label={`SOURCE: ${DATA_SOURCE.toUpperCase()}`} tone="mock" />
        </View>
        <AppText variant="small" tone="muted">
          {DATA_SOURCE_DESCRIPTION}
        </AppText>
        <View style={styles.sourceDetails}>
          <AppText variant="caption" tone="faint">
            API base URL: {APP_ENV.apiBaseUrl ?? 'not configured'}
          </AppText>
          <AppText variant="caption" tone="faint">
            Authentication mode: {APP_ENV.authMode}
          </AppText>
        </View>
      </Card>

      {/* Integrity */}
      <SectionHeader title="Scientific boundary" />
      <Card>
        <View style={styles.integrityRow}>
          <Ionicons name="shield-checkmark-outline" size={20} color={theme.colors.success} />
          <AppText variant="bodyStrong" style={styles.flex}>
            No model outputs are shown
          </AppText>
        </View>
        <AppText variant="small" tone="muted">
          The seizure-detection model is not connected to this build. Seizure probabilities, events,
          burden, confidence values and channel-level localisation are never generated or displayed.
        </AppText>
      </Card>

      {/* About */}
      <SectionHeader title="About" />
      <View style={styles.statGrid}>
        <StatCard icon="phone-portrait-outline" label="Build" value="1.0.0" caption={APP_ENV.buildLabel} style={styles.statCard} />
        <StatCard icon="construct-outline" label="Platform" value="React Native" accent="highlight" caption="Expo SDK 57 · Expo Router" style={styles.statCard} />
      </View>

      <NoticeBox tone="info" title="Not a certified medical device">
        NeuroAI supports clinical review; it does not independently diagnose medical conditions.
        Do not enter real patient data into this preview build.
      </NoticeBox>

      <Disclaimer />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  hint: { marginTop: spacing.md },
  sessionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOut: { marginTop: spacing.md },
  sourceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  sourceDetails: { marginTop: spacing.sm, gap: 2 },
  integrityRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    maxWidth: '100%',
  },
  statCard: { flexBasis: '47%', flexGrow: 1, flexShrink: 1, minWidth: 0 },
});
