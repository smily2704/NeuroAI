/**
 * DEMO LOGIN SCREEN.
 *
 * This screen does NOT authenticate anyone against any server. It validates
 * that the fields are filled, creates a clearly-labelled local demo session,
 * and stores it in Expo SecureStore so the navigation flow can be exercised.
 *
 * Real backend authentication is a later phase (see src/auth/apiAdapter.ts).
 */

import * as React from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { useAuth } from '@/auth/AuthProvider';
import { AppText } from '@/components/AppText';
import { Disclaimer, MockBanner, NoticeBox } from '@/components/Banner';
import { Button } from '@/components/Button';
import { TextField } from '@/components/Inputs';
import { spacing, radius } from '@/theme/tokens';
import { useTokens } from '@/theme/ThemeProvider';

const DEMO_EMAIL = 'demo.doctor@neuroai.local';
const DEMO_PASSWORD = 'demo-password';

export default function LoginScreen() {
  const { colors } = useTokens();
  const { signIn, adapter } = useAuth();

  const [email, setEmail] = React.useState(DEMO_EMAIL);
  const [password, setPassword] = React.useState(DEMO_PASSWORD);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSignIn() {
    setError(null);
    setSubmitting(true);
    try {
      await signIn({ email, password });
      // On success the auth gate redirects to the dashboard.
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Unable to start the demo session.';
      setError(message);
      Alert.alert('Demo login', message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.brandRow}>
          <View style={[styles.logo, { backgroundColor: colors.primaryPressed }]}>
            <AppText variant="h2" tone="onPrimary">
              N
            </AppText>
          </View>
          <AppText variant="h1">
            NeuroAI
            <AppText variant="h1" tone="highlight">
              .
            </AppText>
          </AppText>
        </View>

        <AppText variant="eyebrow" tone="muted" style={styles.eyebrow}>
          NEONATAL EEG INTELLIGENCE
        </AppText>
        <AppText variant="display" style={styles.heading}>
          Better insights,{`\n`}
          <AppText variant="display" tone="accent">
            gentler care.
          </AppText>
        </AppText>
        <AppText variant="body" tone="muted" style={styles.intro}>
          An AI-assisted workspace for neonatal EEG review, clinical reporting and care-team
          collaboration.
        </AppText>

        <MockBanner what="a local demonstration login" />

        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadowColor },
          ]}
        >
          <AppText variant="eyebrow" tone="muted">
            DEMO LOGIN
          </AppText>
          <AppText variant="h2" style={styles.cardHeading}>
            Enter the demo experience
          </AppText>

          <TextField
            label="Email address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="you@example.com"
          />
          <View style={styles.spacer} />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="off"
            placeholder="Any value is accepted"
          />

          {error ? (
            <AppText variant="small" tone="danger" style={styles.error}>
              {error}
            </AppText>
          ) : null}

          <Button
            label="Enter the demo doctor experience"
            icon="log-in-outline"
            onPress={handleSignIn}
            loading={submitting}
            style={styles.button}
          />

          <NoticeBox tone="warning" title="No real authentication">
            Credentials are not verified and no server is contacted. This screen exists to
            demonstrate navigation only. {adapter.description}
          </NoticeBox>
        </View>

        <Disclaimer />
        <AppText variant="caption" tone="faint" center>
          Not a certified medical device. Do not use real patient data in this preview.
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: { marginTop: spacing.sm },
  heading: { marginTop: spacing.xs },
  intro: { marginBottom: spacing.md },
  card: {
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    marginTop: spacing.sm,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  cardHeading: { marginBottom: spacing.sm },
  spacer: { height: spacing.sm },
  error: { fontWeight: '600' },
  button: { marginTop: spacing.md, marginBottom: spacing.xs },
});
