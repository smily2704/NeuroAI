/**
 * AppText — the single typography primitive.
 * All text in the app renders through this component so the type scale and
 * colour tokens stay consistent in light and dark themes.
 */

import { StyleProp, Text, TextProps, TextStyle } from 'react-native';

import { TypographyVariant } from '@/theme/tokens';
import { useTokens } from '@/theme/ThemeProvider';

export type Tone =
  | 'default'
  | 'muted'
  | 'faint'
  | 'onPrimary'
  | 'primary'
  | 'accent'
  | 'highlight'
  | 'success'
  | 'warning'
  | 'danger'
  | 'mock';

interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  tone?: Tone;
  center?: boolean;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

export function AppText({ variant = 'body', tone = 'default', center, style, ...rest }: AppTextProps) {
  const { colors, typography } = useTokens();
  const color: Record<Tone, string> = {
    default: colors.text,
    muted: colors.textMuted,
    faint: colors.textFaint,
    onPrimary: colors.onPrimary,
    primary: colors.primaryPressed,
    accent: colors.accentText,
    highlight: colors.highlightText,
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
    mock: colors.mock,
  };

  return (
    <Text
      {...rest}
      style={[typography[variant], { color: color[tone] }, center && { textAlign: 'center' }, style]}
    />
  );
}
