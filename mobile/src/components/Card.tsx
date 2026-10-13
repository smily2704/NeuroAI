/**
 * Card — the standard elevated surface (website `.content-card` / `.stat-card`
 * adapted for native). StatCard mirrors the website dashboard stat tiles.
 *
 * LAYOUT NOTE (bug fix): Card renders exactly ONE element — a View, or a
 * Pressable when `onPress` is set — and that element carries the full style
 * array. A previous version wrapped the styled View in a style-less Pressable;
 * inside a wrapping flex row that made the Pressable the layout child, so
 * percentage widths (e.g. grid cards) resolved against a collapsed parent and
 * text wrapped one character per line.
 */

import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { radius, shadows, spacing } from '@/theme/tokens';
import { useTokens } from '@/theme/ThemeProvider';
import { AppText } from './AppText';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  /** Overrides the default padding (spacing.lg) when `padded` is true. */
  padding?: number;
  accent?: 'none' | 'accent' | 'highlight';
  onPress?: () => void;
  accessibilityLabel?: string;
}

export function Card({
  children,
  style,
  padded = true,
  padding,
  accent = 'none',
  onPress,
  accessibilityLabel,
}: CardProps) {
  const { colors } = useTokens();
  const accentBar =
    accent === 'accent' ? colors.accent : accent === 'highlight' ? colors.highlight : undefined;

  const cardStyle: StyleProp<ViewStyle> = [
    styles.card,
    {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      shadowColor: colors.shadowColor,
    },
    padded && (padding !== undefined ? { padding } : styles.padded),
    accentBar ? styles.accented : null,
    accentBar ? { borderLeftColor: accentBar } : null,
    style,
  ];

  if (!onPress) {
    return (
      <View style={cardStyle} accessibilityLabel={accessibilityLabel}>
        {children}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [cardStyle, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  caption?: string;
  accent?: 'accent' | 'highlight';
  /** Renders the value in a muted tone for neutral states (e.g. "—"). */
  valueTone?: 'default' | 'muted';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function StatCard({
  icon,
  label,
  value,
  caption,
  accent = 'accent',
  valueTone = 'default',
  onPress,
  style,
}: StatCardProps) {
  const { colors } = useTokens();
  const tint = accent === 'highlight' ? colors.highlightText : colors.accentText;
  const tintSoft = accent === 'highlight' ? colors.highlightSoft : colors.accentSoft;

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`${label}: ${value}`}
      style={style}
      padding={spacing.md}
    >
      <View style={styles.statRow}>
        <View style={[styles.statIcon, { backgroundColor: tintSoft }]}>
          <Ionicons name={icon} size={16} color={tint} />
        </View>
        <AppText variant="caption" tone="muted" style={styles.statLabel}>
          {label}
        </AppText>
      </View>
      <AppText
        variant="h1"
        tone={valueTone === 'muted' ? 'faint' : 'default'}
        style={styles.statValue}
      >
        {value}
      </AppText>
      {caption ? (
        <AppText variant="caption" tone="faint" numberOfLines={2} style={styles.statCaption}>
          {caption}
        </AppText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    maxWidth: '100%',
    ...shadows.card,
  },
  padded: { padding: spacing.lg },
  pressed: { opacity: 0.85 },
  accented: { borderLeftWidth: 4 },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  statIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: { flex: 1, minWidth: 0, fontWeight: '700' },
  statValue: { marginBottom: 2, fontVariant: ['tabular-nums'] },
  statCaption: { marginTop: 2 },
});
