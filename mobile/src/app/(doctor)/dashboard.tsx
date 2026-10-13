/**
 * Doctor dashboard (compact, premium medical-research layout).
 *
 * Order: compact header + settings action → demonstration-data notice →
 * overview + upload action → 2×2 statistic cards → analysis-engine status
 * panel → recent patients.
 *
 * All figures are demonstration values (MockBanner is mandatory here).
 * Candidate events never display fabricated counts: `detected_seizure_events`
 * is null in the backend contract and is rendered as a neutral "—" state.
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAuth } from '@/auth/AuthProvider';
import { AppText } from '@/components/AppText';
import { Badge } from '@/components/Badge';
import { Disclaimer, MockBanner, NoticeBox } from '@/components/Banner';
import { Button } from '@/components/Button';
import { Card, StatCard } from '@/components/Card';
import { SectionHeader } from '@/components/Layout';
import { Screen } from '@/components/Screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/States';
import { StatusPanel } from '@/components/StatusPanel';
import { repositories } from '@/data/repositories';
import { useAsync } from '@/hooks/useAsync';
import { radius, spacing } from '@/theme/tokens';
import { useTokens } from '@/theme/ThemeProvider';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardScreen() {
  const { colors } = useTokens();
  const { session } = useAuth();
  const { data, loading, error, reload } = useAsync(() => repositories.dashboard.get());

  const displayName = session?.displayName ?? 'Clinician';
  const firstName = displayName.split(' ')[0];

  return (
    <Screen
      eyebrow="CLINICAL WORKSPACE"
      title={`${greeting()}, ${firstName}`}
      subtitle="Neonatal EEG dashboard"
      titleVariant="h2"
      headerRight={
        <Pressable
          onPress={() => router.push('/settings')}
          accessibilityRole="button"
          accessibilityLabel="Open settings"
          style={({ pressed }) => [
            styles.headerAction,
            { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Ionicons name="settings-outline" size={18} color={colors.primaryPressed} />
        </Pressable>
      }
    >
      <MockBanner what="sample dashboard statistics" compact />

      {loading ? (
        <LoadingState title="Loading dashboard…" description="Preparing demonstration statistics." />
      ) : error ? (
        <ErrorState title="Dashboard unavailable" description={error} actionLabel="Try again" onAction={reload} />
      ) : data ? (
        <>
          {/* Overview — informative but compact */}
          <Card accent="accent" padding={spacing.lg} style={styles.overview}>
            <AppText variant="eyebrow" tone="muted">
              DASHBOARD OVERVIEW
            </AppText>
            <AppText variant="h3" style={styles.overviewHeading}>
              Neonatal EEG workspace
            </AppText>
            <AppText variant="small" tone="muted">
              Review recordings and manage patient information from one place.
            </AppText>
            <Button
              label="Upload EEG"
              icon="cloud-upload-outline"
              size="sm"
              fullWidth={false}
              onPress={() => router.push('/eeg')}
              style={styles.overviewButton}
            />
          </Card>

          {/* Statistics — balanced 2×2 grid */}
          <View style={styles.statGrid}>
            <StatCard
              icon="people-outline"
              label="Total patients"
              value={String(data.totalPatients)}
              caption="Demonstration records."
              style={styles.statCard}
            />
            <StatCard
              icon="pulse-outline"
              label="EEG recordings"
              value={String(data.totalRecordings)}
              accent="highlight"
              caption="Demonstration files."
              style={styles.statCard}
            />
            <StatCard
              icon="analytics-outline"
              label="Completed analyses"
              value={String(data.analysesCompleted)}
              caption="None have been run."
              style={styles.statCard}
            />
            <StatCard
              icon="flash-outline"
              label="Candidate events"
              value="—"
              valueTone="muted"
              accent="highlight"
              caption="Not shown until model integration."
              style={styles.statCard}
            />
          </View>

          {/* Analysis engine — honest availability state */}
          <View style={styles.panelSpacing}>
            <StatusPanel
              title="Analysis engine"
              statusLabel="Not connected"
              message="Real seizure analysis will be available after model integration."
              onAction={() => router.push('/analysis')}
              actionLabel="Open analysis status"
            />
          </View>

          {/* Scientific integrity — kept accessible in one compact line */}
          <NoticeBox tone="info">
            Seizure probabilities, events and localisation are never displayed unless a connected
            model actually provides them.
          </NoticeBox>

          {/* Recent patients */}
          <SectionHeader
            title="Recent patients"
            caption="Most recent sample records."
            right={
              <Pressable onPress={() => router.push('/patients')} accessibilityRole="link" hitSlop={8}>
                <AppText variant="small" tone="accent" style={styles.link}>
                  See all
                </AppText>
              </Pressable>
            }
          />
          {data.recentPatients.length === 0 ? (
            <EmptyState
              title="No patients yet"
              description="Sample patients will appear here once records exist."
              icon="people-outline"
            />
          ) : (
            <View style={styles.patientList}>
              {data.recentPatients.map((patient) => (
                <Card
                  key={patient.id}
                  padded={false}
                  onPress={() =>
                    router.push({ pathname: '/patients/[patientId]', params: { patientId: String(patient.id) } })
                  }
                  accessibilityLabel={`Open profile of ${patient.name}`}
                >
                  <View style={styles.patientRow}>
                    <View style={[styles.avatar, { backgroundColor: colors.accentSoft }]}>
                      <AppText variant="small" tone="accent" style={styles.avatarText}>
                        {patient.name.slice(0, 1)}
                      </AppText>
                    </View>
                    <View style={styles.patientText}>
                      <AppText variant="bodyStrong" numberOfLines={1}>
                        {patient.name}
                      </AppText>
                      <AppText variant="caption" tone="muted" numberOfLines={1}>
                        {patient.patientId} · {patient.hospitalUnit ?? 'Unit not recorded'}
                        {patient.ageDays !== null ? ` · ${patient.ageDays} days` : ''}
                      </AppText>
                    </View>
                    <Badge label={patient.status} tone={patient.status === 'Active' ? 'success' : 'neutral'} />
                    <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
                  </View>
                </Card>
              ))}
            </View>
          )}

          <Disclaimer />
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerAction: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overview: { marginTop: spacing.sm, gap: spacing.xs },
  overviewHeading: { marginTop: 2 },
  overviewButton: { marginTop: spacing.sm, alignSelf: 'flex-start' },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  statCard: { flexBasis: '47%', flexGrow: 1, flexShrink: 1, minWidth: 0 },
  panelSpacing: { marginTop: spacing.md },
  link: { fontWeight: '700' },
  patientList: { gap: spacing.sm },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  patientText: { flex: 1, minWidth: 0 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontWeight: '800' },
});
