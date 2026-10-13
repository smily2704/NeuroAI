/**
 * Patient profile — demographics, birth details, clinical information and
 * the recordings attached to this (fictional) record.
 */

import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { MockBanner, NoticeBox } from '@/components/Banner';
import { Button } from '@/components/Button';
import { DetailRow, SectionHeader } from '@/components/Layout';
import { Screen } from '@/components/Screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/States';
import { repositories } from '@/data/repositories';
import { useAsync } from '@/hooks/useAsync';
import { radius, spacing } from '@/theme/tokens';
import { useTokens } from '@/theme/ThemeProvider';

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

export default function PatientProfileScreen() {
  const { colors } = useTokens();
  const params = useLocalSearchParams<{ patientId: string }>();
  const patientId = Number(params.patientId);

  const { data, loading, error } = useAsync(
    () => repositories.patients.get(patientId),
    [patientId],
  );

  if (loading) {
    return (
      <Screen showBack title="Patient profile">
        <LoadingState title="Loading patient record…" />
      </Screen>
    );
  }

  if (error || !data) {
    return (
      <Screen showBack title="Patient profile">
        <ErrorState
          title="Record unavailable"
          description={error ?? 'This demonstration record could not be found.'}
          actionLabel="Go back"
          onAction={() => (router.canGoBack() ? router.back() : router.replace('/patients'))}
        />
      </Screen>
    );
  }

  return (
    <Screen
      showBack
      eyebrow="PATIENT RECORD"
      title={data.name}
      subtitle={`${data.patientId} · ${data.status}`}
    >
      <MockBanner what="a fictional patient record" />

      <View style={styles.badgeRow}>
        <Badge label={data.status} tone={data.status === 'Active' ? 'success' : 'neutral'} />
        <Badge label={data.sex ?? 'Sex not recorded'} tone="neutral" />
        {data.gestationalAge ? <Badge label={`GA ${data.gestationalAge}`} tone="info" /> : null}
        {data.ageDays !== null ? <Badge label={`${data.ageDays} days`} tone="info" /> : null}
      </View>

      <SectionHeader title="Overview" caption="Admission and birth details." />
      <Card padded={false} style={styles.card}>
        <View style={styles.cardInner}>
          <DetailRow label="Date of birth" value={data.dateOfBirth} />
          <DetailRow label="Gestational age" value={data.gestationalAge} />
          <DetailRow label="Birth weight" value={data.birthWeightKg !== null ? `${data.birthWeightKg} kg` : null} />
          <DetailRow label="Birth type" value={data.birthType} />
          <DetailRow label="Birth status" value={data.birthStatus} />
          <DetailRow label="Hospital unit" value={data.hospitalUnit} />
          <DetailRow label="Admission date" value={data.admissionDate} />
        </View>
      </Card>

      <SectionHeader title="Clinical information" caption="As entered in the demonstration record." />
      <Card>
        <AppText variant="small" tone="muted">
          {data.clinicalInformation ?? 'No clinical information recorded.'}
        </AppText>
      </Card>

      <SectionHeader
        title="EEG recordings"
        caption={`${data.recordings.length} sample recording${data.recordings.length === 1 ? '' : 's'}.`}
      />
      {data.recordings.length === 0 ? (
        <Card>
          <EmptyState
            icon="pulse-outline"
            title="No recordings"
            description="This sample record has no attached demonstration recordings."
          />
        </Card>
      ) : (
        <View style={styles.recordingList}>
          {data.recordings.map((recording) => (
            <Card
              key={recording.id}
              onPress={() =>
                router.push({
                  pathname: '/eeg/viewer/[recordingId]',
                  params: { recordingId: String(recording.id) },
                })
              }
              accessibilityLabel={`Open waveform viewer for ${recording.filename}`}
            >
              <View style={styles.recordingRow}>
                <View style={[styles.fileIcon, { backgroundColor: colors.accentSoft }]}>
                  <AppText variant="caption" tone="accent" style={styles.fileIconText}>
                    {recording.format}
                  </AppText>
                </View>
                <View style={styles.flex}>
                  <AppText variant="bodyStrong" numberOfLines={1}>
                    {recording.filename}
                  </AppText>
                  <AppText variant="caption" tone="muted">
                    {recording.channels.length} channels · {recording.samplingRateHz ?? '—'} Hz ·{' '}
                    {recording.durationSeconds
                      ? `${Math.round(recording.durationSeconds / 60)} min`
                      : 'duration unknown'}{' '}
                    · {formatBytes(recording.sizeBytes)}
                  </AppText>
                </View>
              </View>
            </Card>
          ))}
          <Button
            label="Open EEG upload"
            variant="secondary"
            icon="cloud-upload-outline"
            onPress={() => router.push('/eeg')}
          />
        </View>
      )}

      <SectionHeader title="Notes and prescriptions" />
      <Card>
        <EmptyState
          icon="document-lock-outline"
          title="Not available in this build"
          description="Doctor notes and prescriptions appear here once the backend integration phase connects the existing endpoints. Nothing is shown because nothing has been recorded."
        />
      </Card>

      <NoticeBox tone="warning" title="Fictional record">
        This patient does not exist. Any resemblance to a real person or record is coincidental.
      </NoticeBox>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xs },
  card: { borderRadius: radius.md },
  cardInner: { paddingHorizontal: spacing.lg, paddingVertical: spacing.xs },
  recordingList: { gap: spacing.sm },
  recordingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  fileIcon: {
    minWidth: 44,
    height: 36,
    paddingHorizontal: 6,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileIconText: { fontWeight: '800' },
});
