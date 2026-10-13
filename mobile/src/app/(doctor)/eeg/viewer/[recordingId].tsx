/**
 * EEG waveform viewer (demonstration).
 *
 * Renders MOCK traces generated on-device (src/features/eeg/mockWaveform).
 * No EDF/CSV file is read, no signal is processed, and nothing shown here is
 * a patient recording. The rendering layer (react-native-svg) is isolated in
 * src/features/eeg/WaveformChart.tsx so it can be replaced later.
 *
 * Future: real windows of samples will come from a backend endpoint that
 * does not exist yet.
 */

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Badge, Chip } from '@/components/Badge';
import { Disclaimer, MockBanner, NoticeBox } from '@/components/Banner';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { DetailRow, SectionHeader } from '@/components/Layout';
import { Screen } from '@/components/Screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/States';
import { repositories } from '@/data/repositories';
import { generateMockTrace, seedFor } from '@/features/eeg/mockWaveform';
import { WaveformChannelList } from '@/features/eeg/WaveformChart';
import { useAsync } from '@/hooks/useAsync';
import { radius, spacing } from '@/theme/tokens';
import { useTokens } from '@/theme/ThemeProvider';

const WINDOW_OPTIONS = [2, 5, 10] as const;

function formatClock(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds - minutes * 60;
  return `${minutes}:${rest.toFixed(1).padStart(4, '0')}`;
}

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

export default function WaveformViewerScreen() {
  const { colors } = useTokens();
  const params = useLocalSearchParams<{ recordingId: string }>();
  const recordingId = Number(params.recordingId);

  const { data: recording, loading, error } = useAsync(
    () => repositories.recordings.get(recordingId),
    [recordingId],
  );

  const [windowSeconds, setWindowSeconds] = React.useState<number>(5);
  const [startSeconds, setStartSeconds] = React.useState<number>(0);
  const [selection, setSelection] = React.useState<{ recordingId: number; channels: string[] } | null>(
    null,
  );
  const [gain, setGain] = React.useState(1);
  const [panelWidth, setPanelWidth] = React.useState(0);

  const durationSeconds = recording?.durationSeconds ?? 60;
  const maxStart = Math.max(0, durationSeconds - windowSeconds);
  /** Derived clamp — avoids resetting state from an effect. */
  const start = Math.min(startSeconds, maxStart);

  const activeSelection = React.useMemo(() => {
    if (!recording) return [];
    if (selection && selection.recordingId === recording.id) return selection.channels;
    return recording.channels;
  }, [recording, selection]);

  const visibleChannels = React.useMemo(() => {
    if (!recording) return [];
    return recording.channels
      .filter((name) => activeSelection.includes(name))
      .map((name) => ({
        name,
        samples: generateMockTrace({
          seed: seedFor(recording.id + Math.round(start), name),
          sampleRateHz: recording.samplingRateHz ?? 256,
          durationSeconds: windowSeconds,
        }),
      }));
  }, [recording, activeSelection, start, windowSeconds]);

  function toggleChannel(name: string) {
    if (!recording) return;
    const current = activeSelection;
    const next = current.includes(name)
      ? current.filter((item) => item !== name)
      : [...current, name];
    setSelection({ recordingId: recording.id, channels: next });
  }

  function selectChannels(channels: string[]) {
    if (!recording) return;
    setSelection({ recordingId: recording.id, channels });
  }

  if (loading) {
    return (
      <Screen showBack title="Waveform viewer">
        <LoadingState title="Loading recording…" />
      </Screen>
    );
  }

  if (error || !recording) {
    return (
      <Screen showBack title="Waveform viewer">
        <ErrorState
          title="Recording unavailable"
          description={error ?? 'This demonstration recording could not be found.'}
          actionLabel="Go back"
          onAction={() => (router.canGoBack() ? router.back() : router.replace('/eeg'))}
        />
      </Screen>
    );
  }

  return (
    <Screen
      showBack
      eyebrow="EEG VIEWER"
      title={recording.filename}
      subtitle={`${recording.format} · ${recording.channels.length} channels · ${
        recording.samplingRateHz ?? 'unknown'
      } Hz`}
    >
      <MockBanner what="a simulated waveform generated on this device" />

      <NoticeBox tone="warning" title="Not a patient recording">
        The traces below are synthetic demonstration signals. No EEG file has been opened or
        processed, and these waveforms must never be interpreted clinically.
      </NoticeBox>

      {/* Controls */}
      <Card style={styles.controls}>
        <AppText variant="eyebrow" tone="muted">
          TIME NAVIGATION
        </AppText>
        <View style={styles.timeRow}>
          <IconButton
            icon="chevron-back"
            label="Previous window"
            disabled={start <= 0}
            onPress={() => setStartSeconds(Math.max(0, start - windowSeconds))}
          />
          <View style={styles.timeLabelWrap}>
            <AppText variant="bodyStrong" style={styles.timeLabel}>
              {formatClock(start)} – {formatClock(Math.min(durationSeconds, start + windowSeconds))}
            </AppText>
            <AppText variant="caption" tone="muted">
              of {formatClock(durationSeconds)} total · window {windowSeconds}s
            </AppText>
          </View>
          <IconButton
            icon="chevron-forward"
            label="Next window"
            disabled={start >= maxStart}
            onPress={() => setStartSeconds(Math.min(maxStart, start + windowSeconds))}
          />
        </View>

        <View style={styles.controlGroup}>
          <AppText variant="caption" tone="muted">
            Window
          </AppText>
          <View style={styles.chipRow}>
            {WINDOW_OPTIONS.map((option) => (
              <Chip
                key={option}
                label={`${option} s`}
                selected={windowSeconds === option}
                onPress={() => setWindowSeconds(option)}
              />
            ))}
          </View>
        </View>

        <View style={styles.controlGroup}>
          <AppText variant="caption" tone="muted">
            Amplitude scale
          </AppText>
          <View style={styles.chipRow}>
            <IconButton
              icon="remove"
              label="Decrease amplitude"
              small
              onPress={() => setGain((value) => Math.max(0.5, Number((value - 0.25).toFixed(2))))}
            />
            <Badge label={`×${gain.toFixed(2)}`} tone="neutral" />
            <IconButton
              icon="add"
              label="Increase amplitude"
              small
              onPress={() => setGain((value) => Math.min(3, Number((value + 0.25).toFixed(2))))}
            />
          </View>
        </View>
      </Card>

      {/* Channels */}
      <SectionHeader
        title="Channels"
        caption={`${activeSelection.length} of ${recording.channels.length} selected`}
      />
      <View style={styles.chipRow}>
        <Chip label="All" selected={activeSelection.length === recording.channels.length} onPress={() => selectChannels(recording.channels)} />
        <Chip label="None" selected={activeSelection.length === 0} onPress={() => selectChannels([])} />
        {recording.channels.map((channel) => (
          <Chip
            key={channel}
            label={channel}
            selected={activeSelection.includes(channel)}
            onPress={() => toggleChannel(channel)}
          />
        ))}
      </View>

      {/* Waveform */}
      <SectionHeader title="Waveform" caption="Scroll through the fictional recording one window at a time." />
      <Card
        padded={false}
        style={styles.waveformCard}
      >
        <View
          style={styles.waveformPanel}
          onLayout={(event) => setPanelWidth(event.nativeEvent.layout.width)}
        >
          {activeSelection.length === 0 ? (
            <EmptyState
              icon="eye-off-outline"
              title="No channels selected"
              description="Select at least one channel to draw its demonstration trace."
            />
          ) : panelWidth <= 0 ? (
            <LoadingState title="Preparing waveform…" />
          ) : (
            <WaveformChannelList
              channels={visibleChannels}
              width={panelWidth}
              gain={gain}
              height={54}
            />
          )}
        </View>
        <View style={[styles.waveformFooter, { borderTopColor: colors.border }]}>
          <AppText variant="caption" tone="muted" style={styles.flex}>
            Demonstration trace · generated on-device · not a patient recording
          </AppText>
          <AppText variant="caption" tone="faint">
            1 grid row ≈ 120 µV
          </AppText>
        </View>
      </Card>

      {/* Recording metadata */}
      <SectionHeader title="Recording metadata" caption="As stored in the demonstration dataset." />
      <Card padded={false} style={styles.metaCard}>
        <View style={styles.metaInner}>
          <DetailRow label="Filename" value={recording.filename} />
          <DetailRow label="Format" value={recording.format} />
          <DetailRow label="Sampling rate" value={recording.samplingRateHz ? `${recording.samplingRateHz} Hz` : null} />
          <DetailRow label="Channels" value={String(recording.channels.length)} />
          <DetailRow label="Samples" value={recording.sampleCount.toLocaleString()} />
          <DetailRow
            label="Duration"
            value={recording.durationSeconds ? `${Math.round(recording.durationSeconds / 60)} min` : null}
          />
          <DetailRow label="File size" value={formatBytes(recording.sizeBytes)} />
          <DetailRow label="Recorded at" value={new Date(recording.createdAt).toLocaleString()} />
        </View>
      </Card>

      <Button
        label="Analysis status for this recording"
        icon="information-circle-outline"
        variant="secondary"
        onPress={() =>
          router.push({ pathname: '/analysis', params: { recordingId: String(recording.id) } })
        }
        style={styles.analysisButton}
      />

      <Disclaimer text="Waveform review supports clinical judgement. It is not a diagnosis and no automated detection has been run." />
    </Screen>
  );
}

function IconButton({
  icon,
  label,
  onPress,
  disabled,
  small,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  small?: boolean;
}) {
  const { colors } = useTokens();
  const size = small ? 34 : 44;
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: Boolean(disabled) }}
      hitSlop={4}
      style={({ pressed }) => [
        styles.iconButton,
        {
          width: size,
          height: size,
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
        },
      ]}
    >
      <Ionicons name={icon} size={small ? 16 : 20} color={colors.primaryPressed} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  controls: { marginTop: spacing.md, gap: spacing.md },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  timeLabelWrap: { flex: 1, alignItems: 'center' },
  timeLabel: { fontVariant: ['tabular-nums'], textAlign: 'center' },
  controlGroup: { gap: 6 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, alignItems: 'center' },
  waveformCard: { borderRadius: radius.lg },
  waveformPanel: { padding: spacing.md },
  waveformFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  metaCard: { borderRadius: radius.lg },
  metaInner: { paddingHorizontal: spacing.lg, paddingVertical: spacing.xs },
  analysisButton: { marginTop: spacing.lg },
  iconButton: {
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
