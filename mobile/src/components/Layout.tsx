/**
 * ProgressBar — determinate progress bar used by the demonstration EEG
 * upload flow. Also exports SectionHeader and DetailRow, small layout
 * helpers shared by profile/detail screens.
 */

import { StyleSheet, View } from 'react-native';

import { radius, spacing } from '@/theme/tokens';
import { useTokens } from '@/theme/ThemeProvider';
import { AppText } from './AppText';

interface ProgressBarProps {
  progress: number; // 0..1
  label?: string;
}

export function ProgressBar({ progress, label }: ProgressBarProps) {
  const { colors } = useTokens();
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <View style={styles.progressWrapper}>
      <View style={[styles.progressTrack, { backgroundColor: colors.surfaceSunken }]}>
        <View
          style={[
            styles.progressFill,
            { width: `${clamped * 100}%`, backgroundColor: colors.primaryPressed },
          ]}
        />
      </View>
      <AppText variant="caption" tone="muted">
        {label ?? `${Math.round(clamped * 100)}%`}
      </AppText>
    </View>
  );
}

interface SectionHeaderProps {
  title: string;
  caption?: string;
  right?: React.ReactNode;
}

export function SectionHeader({ title, caption, right }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.flex}>
        <AppText variant="h3">{title}</AppText>
        {caption ? (
          <AppText variant="small" tone="muted">
            {caption}
          </AppText>
        ) : null}
      </View>
      {right}
    </View>
  );
}

interface DetailRowProps {
  label: string;
  value?: string | null;
  /** Rendered instead of the value when the value is missing. */
  unavailableText?: string;
}

export function DetailRow({ label, value, unavailableText = 'Not available' }: DetailRowProps) {
  const { colors } = useTokens();
  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  return (
    <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
      <AppText variant="small" tone="muted" style={styles.detailLabel}>
        {label}
      </AppText>
      <AppText
        variant="small"
        style={[
          styles.detailValue,
          !hasValue && { fontWeight: '400' as const, color: colors.textFaint },
        ]}
        numberOfLines={3}
      >
        {hasValue ? String(value) : unavailableText}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  progressWrapper: { gap: 6 },
  progressTrack: {
    height: 8,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    marginTop: spacing.xl,
  },
  detailRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  detailLabel: { flex: 1 },
  detailValue: { flex: 1.3, fontWeight: '600', textAlign: 'right' },
});
