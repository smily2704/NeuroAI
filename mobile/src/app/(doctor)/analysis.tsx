/**
 * Analysis results screen.
 *
 * This screen is deliberately conservative: it reports that the seizure
 * model is NOT connected and lists every output as unavailable. It cannot
 * display seizure probabilities, candidate events, burden figures, or
 * channel-level scores, because no such values exist in this build.
 *
 * The structure mirrors GET /api/analysis/{recording_id} in the backend,
 * which returns events: [] with the note "Not available from current model".
 */

import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Badge } from '@/components/Badge';
import { Disclaimer, MockBanner, NoticeBox } from '@/components/Banner';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { SectionHeader } from '@/components/Layout';
import { Screen } from '@/components/Screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/States';
import { repositories } from '@/data/repositories';
import { useAsync } from '@/hooks/useAsync';
import { radius, spacing } from '@/theme/tokens';
import { useTokens } from '@/theme/ThemeProvider';

export default function AnalysisScreen() {
  const { colors } = useTokens();
  const params = useLocalSearchParams<{ recordingId?: string }>();

  const query = useAsync(async () => {
    const recording = params.recordingId
      ? await repositories.recordings.get(Number(params.recordingId))
      : await repositories.analysis.latestRecording();
    const analysis = await repositories.analysis.get(recording.id);
    return { recording, analysis };
  }, [params.recordingId]);

  if (query.loading) {
    return (
      <Screen showBack title="Analysis status">
        <LoadingState title="Loading analysis status…" />
      </Screen>
    );
  }

  if (query.error || !query.data) {
    return (
      <Screen showBack title="Analysis status">
        <ErrorState
          title="Analysis status unavailable"
          description={query.error ?? 'No recording is available.'}
          actionLabel="Try again"
          onAction={query.reload}
        />
      </Screen>
    );
  }

  const { recording, analysis } = query.data;

  return (
    <Screen
      showBack
      eyebrow="ANALYSIS"
      title="Analysis status"
      subtitle={recording.filename}
    >
      <MockBanner what="the analysis status screen (no inference has been run)" />

      {/* Headline status */}
      <Card style={[styles.statusCard, { borderColor: colors.danger }]}>
        <View style={styles.statusHeader}>
          <Badge label="MODEL NOT CONNECTED" tone="danger" />
          <AppText variant="caption" tone="muted" style={styles.statusCode}>
            status: {analysis.status}
          </AppText>
        </View>
        <AppText variant="h3" style={styles.statusHeading}>
          Seizure predictions are unavailable
        </AppText>
        <AppText variant="small" tone="muted">
          {analysis.message}
        </AppText>
      </Card>

      {/* What would appear here */}
      <SectionHeader
        title="Analysis outputs"
        caption="Each output is listed with its availability."
      />
      <Card padded={false} style={styles.outputsCard}>
        <View style={styles.outputsInner}>
          {analysis.outputs.map((output) => (
            <View key={output.key} style={[styles.outputRow, { borderBottomColor: colors.border }]}>
              <View style={styles.outputHeader}>
                <AppText variant="bodyStrong" style={styles.flex}>
                  {output.label}
                </AppText>
                <Badge label="UNAVAILABLE" tone="neutral" />
              </View>
              <AppText variant="caption" tone="muted">
                {output.reason}
              </AppText>
            </View>
          ))}
        </View>
      </Card>

      {/* Seizure events — explicit empty state */}
      <SectionHeader title="Seizure events" />
      <Card>
        <EmptyState
          icon="remove-circle-outline"
          title="No events to display"
          description="No candidate events are shown because no model has run on this recording. The backend contract returns an empty list with the note “Not available from current model” — this screen mirrors that exactly."
        />
      </Card>

      {/* Historical analyses */}
      <SectionHeader title="Historical analyses" />
      <Card>
        <EmptyState
          icon="time-outline"
          title="No analysis history yet"
          description="Past analyses will appear here once real inference runs exist. None are fabricated in the meantime."
          actionLabel="View waveform instead"
          onAction={() =>
            router.push({ pathname: '/eeg/viewer/[recordingId]', params: { recordingId: String(recording.id) } })
          }
        />
      </Card>

      {/* Descriptive signal quality (mock) */}
      <SectionHeader
        title="Signal quality (descriptive)"
        caption="Basic rule-based checks from the demonstration dataset."
      />
      <Card padded={false} style={styles.outputsCard}>
        <View style={styles.outputsInner}>
          {recording.signalQuality.map((item) => (
            <View key={item.channel} style={[styles.qualityRow, { borderBottomColor: colors.border }]}>
              <AppText variant="bodyStrong" style={styles.qualityChannel}>
                {item.channel}
              </AppText>
              <View style={styles.flex}>
                <Badge
                  label={item.status}
                  tone={
                    item.status === 'GOOD' ? 'success' : item.status === 'WARNING' ? 'warning' : 'danger'
                  }
                />
                <AppText variant="caption" tone="muted" style={styles.qualityProblem}>
                  {item.problem}
                </AppText>
              </View>
            </View>
          ))}
        </View>
      </Card>

      <NoticeBox tone="info" title="Descriptive only">
        Signal-quality flags describe basic statistics (flatlines, missing samples, amplitude
        ranges). They are not a clinical impedance measurement and not a diagnosis.
      </NoticeBox>

      <View style={styles.actions}>
        <Button
          label="Open waveform viewer"
          variant="secondary"
          icon="pulse-outline"
          onPress={() =>
            router.push({ pathname: '/eeg/viewer/[recordingId]', params: { recordingId: String(recording.id) } })
          }
        />
        <Button label="Back to dashboard" variant="ghost" onPress={() => router.replace('/dashboard')} />
      </View>

      <Disclaimer text="AI-assisted clinical support only. No automated seizure detection has been performed in this build." />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  statusCard: { marginTop: spacing.md, borderWidth: 1.5, gap: spacing.sm },
  statusHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  statusCode: { fontVariant: ['tabular-nums'] },
  statusHeading: { marginTop: spacing.xs },
  outputsCard: { borderRadius: radius.lg },
  outputsInner: { paddingHorizontal: spacing.lg, paddingVertical: spacing.xs },
  outputRow: {
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  outputHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  qualityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  qualityChannel: { width: 46 },
  qualityProblem: { marginTop: 4 },
  actions: { gap: spacing.sm, marginTop: spacing.lg },
});
