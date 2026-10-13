/**
 * Button — primary / secondary / ghost / danger variants with loading and
 * disabled states. Mirrors the website's primary/secondary/text buttons.
 */

import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { radius, spacing } from '@/theme/tokens';
import { useTokens } from '@/theme/ThemeProvider';
import { AppText } from './AppText';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'sm';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = true,
  style,
}: ButtonProps) {
  const { colors } = useTokens();
  const isDisabled = disabled || loading;

  const palette = {
    primary: { bg: colors.primaryPressed, fg: colors.onPrimary, border: 'transparent' },
    secondary: { bg: colors.surface, fg: colors.primaryPressed, border: colors.borderStrong },
    ghost: { bg: 'transparent', fg: colors.primaryPressed, border: 'transparent' },
    danger: { bg: colors.dangerSoft, fg: colors.danger, border: colors.danger },
  }[variant];

  const verticalPadding = size === 'sm' ? spacing.sm : spacing.md + 2;

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          paddingVertical: verticalPadding,
          opacity: isDisabled ? 0.55 : pressed ? 0.85 : 1,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="small" color={palette.fg} />
        ) : icon ? (
          <Ionicons name={icon} size={size === 'sm' ? 15 : 17} color={palette.fg} />
        ) : null}
        <AppText
          style={[styles.label, { color: palette.fg, fontSize: size === 'sm' ? 13.5 : 15 }]}
        >
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { alignSelf: 'stretch' },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  label: { fontWeight: '700' },
});
