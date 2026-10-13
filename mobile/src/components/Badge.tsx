/**
 * Badge — small status pill (GOOD / WARNING / POOR quality, file format,
 * availability states, …). Chip — selectable pill used for channel toggles
 * and filters.
 */

import { Pressable, StyleSheet, View } from 'react-native';

import { radius, spacing, ThemeColors } from '@/theme/tokens';
import { useTokens } from '@/theme/ThemeProvider';
import { AppText, Tone } from './AppText';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'mock';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  icon?: React.ReactNode;
}

function badgePalette(colors: ThemeColors, tone: BadgeTone): { bg: string; fg: Tone } {
  switch (tone) {
    case 'info':
      return { bg: colors.accentSoft, fg: 'accent' };
    case 'success':
      return { bg: colors.successSoft, fg: 'success' };
    case 'warning':
      return { bg: colors.warningSoft, fg: 'warning' };
    case 'danger':
      return { bg: colors.dangerSoft, fg: 'danger' };
    case 'mock':
      return { bg: colors.mockSoft, fg: 'mock' };
    default:
      return { bg: colors.surfaceSunken, fg: 'muted' };
  }
}

export function Badge({ label, tone = 'neutral', icon }: BadgeProps) {
  const { colors } = useTokens();
  const palette = badgePalette(colors, tone);
  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }]}>
      {icon}
      <AppText variant="caption" tone={palette.fg} style={styles.badgeText}>
        {label}
      </AppText>
    </View>
  );
}

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

/** Selectable chip (channel selection, time windows, filters). */
export function Chip({ label, selected, onPress }: ChipProps) {
  const { colors } = useTokens();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? colors.primaryPressed : colors.surface,
          borderColor: selected ? colors.primaryPressed : colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <AppText
        variant="small"
        style={{
          color: selected ? colors.onPrimary : colors.text,
          fontWeight: selected ? '700' : '500',
        }}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  badgeText: { fontWeight: '700' },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
