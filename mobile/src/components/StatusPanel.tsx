/**
 * StatusPanel — compact status row for background capabilities whose state
 * matters but must not dominate the screen (e.g. the analysis engine).
 *
 * Renders: tinted icon · title + subtle status badge · one short explanation
 * · optional trailing action. It shows honest availability states only — it
 * never displays scores, counts, or predictions.
 */

import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Badge } from './Badge';
import { Card } from './Card';

import { radius, spacing } from '@/theme/tokens';
import { useTokens } from '@/theme/ThemeProvider';
import { AppText } from './AppText';

interface StatusPanelProps {
  title: string;
  statusLabel: string;
  message: string;
  icon?: keyof typeof Ionicons.glyphMap;
  /** Shows a small trailing action (e.g. open the analysis status screen). */
  actionLabel?: string;
  onAction?: () => void;
}

export function StatusPanel({
  title,
  statusLabel,
  message,
  icon = 'hardware-chip-outline',
  actionLabel,
  onAction,
}: StatusPanelProps) {
  const { colors } = useTokens();

  return (
    <Card padding={spacing.md}>
      <View style={styles.row}>
        <View style={[styles.icon, { backgroundColor: colors.surfaceSunken }]}>
          <Ionicons name={icon} size={18} color={colors.textMuted} />
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <AppText variant="bodyStrong" style={styles.title}>
              {title}
            </AppText>
            <Badge label={statusLabel} tone="neutral" />
          </View>
          <AppText variant="caption" tone="muted" style={styles.message}>
            {message}
          </AppText>
        </View>

        {actionLabel && onAction ? (
          <Pressable
            onPress={onAction}
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
            hitSlop={8}
            style={({ pressed }) => [
              styles.action,
              { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons name="information-circle-outline" size={18} color={colors.primaryPressed} />
          </Pressable>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, minWidth: 0, gap: 3 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  title: { flexShrink: 1 },
  message: {},
  action: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
