/**
 * Waveform rendering (react-native-svg).
 *
 * The renderer is deliberately isolated behind two small components so it
 * can be swapped for a Skia implementation later without touching screens:
 *
 *   WaveformChart         — one channel, pure SVG path rendering
 *   WaveformChannelList   — labelled stack of channels (what screens use)
 *
 * IMPORTANT: the samples passed in are MOCK traces (see mockWaveform.ts).
 * They are not patient recordings, and the components label them as such
 * through the accessibility text.
 */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';

import { AppText } from '@/components/AppText';
import { spacing } from '@/theme/tokens';
import { useTokens } from '@/theme/ThemeProvider';

const LABEL_WIDTH = 46;

interface WaveformChartProps {
  samples: number[];
  /** Width in density-independent points available for the trace. */
  width: number;
  height?: number;
  /** Vertical scale multiplier (1 = ±120 µV fills the row). */
  gain?: number;
  channelName: string;
}

/** Builds an envelope path (min/max per pixel column) for dense EEG traces. */
function buildTracePath(samples: number[], width: number, height: number, gain: number): string {
  if (samples.length < 2 || width < 4) return '';
  const columns = Math.max(2, Math.floor(width));
  const perColumn = samples.length / columns;
  const mid = height / 2;
  const usable = mid - 3;
  const fullScaleMicrovolts = 120 / Math.max(0.2, gain);

  const toY = (value: number): number => {
    const normalised = value / fullScaleMicrovolts;
    const y = mid - normalised * usable;
    return Math.min(height - 1.5, Math.max(1.5, y));
  };

  let path = '';
  for (let column = 0; column < columns; column += 1) {
    const start = Math.floor(column * perColumn);
    const end = Math.min(samples.length, Math.max(start + 1, Math.floor((column + 1) * perColumn)));
    let min = Infinity;
    let max = -Infinity;
    for (let i = start; i < end; i += 1) {
      const value = samples[i];
      if (value < min) min = value;
      if (value > max) max = value;
    }
    if (!Number.isFinite(min) || !Number.isFinite(max)) continue;
    const x = column;
    path += `${column === 0 ? 'M' : 'L'}${x.toFixed(1)},${toY(max).toFixed(1)}`;
    path += `L${x.toFixed(1)},${toY(min).toFixed(1)}`;
  }
  return path;
}

export function WaveformChart({
  samples,
  width,
  height = 54,
  gain = 1,
  channelName,
}: WaveformChartProps) {
  const { colors } = useTokens();
  const path = React.useMemo(
    () => buildTracePath(samples, width, height, gain),
    [samples, width, height, gain],
  );
  const mid = height / 2;

  return (
    <View
      style={[styles.chart, { height, borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}
      accessibilityRole="image"
      accessibilityLabel={`Demonstration waveform trace for channel ${channelName}. Mock data, not a patient recording.`}
    >
      <Svg width={Math.max(1, width)} height={height}>
        {/* Zero line + guides */}
        <Line x1={0} y1={mid} x2={width} y2={mid} stroke={colors.chartGrid} strokeWidth={1} />
        <Line
          x1={0}
          y1={height - 1}
          x2={width}
          y2={height - 1}
          stroke={colors.border}
          strokeWidth={1}
        />
        <Path
          d={path}
          stroke={colors.chartTrace}
          strokeWidth={1.3}
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

export interface WaveformChannelData {
  name: string;
  samples: number[];
}

interface WaveformChannelListProps {
  channels: WaveformChannelData[];
  /** Full width of the waveform panel (label + trace). */
  width: number;
  height?: number;
  gain?: number;
}

export function WaveformChannelList({
  channels,
  width,
  height = 54,
  gain = 1,
}: WaveformChannelListProps) {
  const { colors } = useTokens();
  const traceWidth = Math.max(40, width - LABEL_WIDTH - spacing.sm);

  return (
    <View style={styles.list}>
      {channels.map((channel, index) => (
        <View key={channel.name} style={styles.row}>
          <View style={styles.labelWrap}>
            <AppText
              variant="caption"
              style={[styles.label, { color: index % 2 === 0 ? colors.chartTrace : colors.chartTraceAlt }]}
            >
              {channel.name}
            </AppText>
          </View>
          <WaveformChart
            samples={channel.samples}
            width={traceWidth}
            height={height}
            gain={gain}
            channelName={channel.name}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  labelWrap: { width: LABEL_WIDTH, alignItems: 'flex-end' },
  label: { fontWeight: '700' },
  chart: {
    borderWidth: 1,
    borderRadius: 6,
    overflow: 'hidden',
  },
});
