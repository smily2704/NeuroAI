/**
 * Loading / empty / error primitives — every data screen uses one of these
 * three states so failures and empty collections always look deliberate.
 */

import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { radius, spacing } from '@/theme/tokens';
import { useTokens } from '@/theme/ThemeProvider';
import { AppText } from './AppText';
import { Button } from './Button';

interface StateProps {
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  actionLabel?: string;
  onAction?: () => void;
}

interface LoadingStateProps {
  title?: string;
  description?: string;
}

export function LoadingState({ title = 'Loading…', description }: LoadingStateProps) {
  const { colors } = useTokens();
  return (
    <View style={styles.container} accessibilityRole="progressbar">
      <ActivityIndicator size="large" color={colors.primaryPressed} />
      <AppText variant="bodyStrong" center style={styles.titleSpacing}>
        {title}
      </AppText>
      {description ? (
        <AppText variant="small" tone="muted" center>
          {description}
        </AppText>
      ) : null}
    </View>
  );
}

export function EmptyState({ title, description, icon = 'file-tray-outline', actionLabel, onAction }: StateProps) {
  const { colors } = useTokens();
  return (
    <View style={styles.container}>
      <View style={[styles.iconBubble, { backgroundColor: colors.surfaceSunken }]}>
        <Ionicons name={icon} size={26} color={colors.textMuted} />
      </View>
      <AppText variant="h3" center style={styles.titleSpacing}>
        {title}
      </AppText>
      {description ? (
        <AppText variant="small" tone="muted" center>
          {description}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} fullWidth={false} variant="secondary" style={styles.action} />
      ) : null}
    </View>
  );
}

export function ErrorState({ title, description, icon = 'alert-circle-outline', actionLabel, onAction }: StateProps) {
  const { colors } = useTokens();
  return (
    <View style={styles.container} accessibilityRole="alert">
      <View style={[styles.iconBubble, { backgroundColor: colors.dangerSoft }]}>
        <Ionicons name={icon} size={26} color={colors.danger} />
      </View>
      <AppText variant="h3" center style={styles.titleSpacing}>
        {title}
      </AppText>
      {description ? (
        <AppText variant="small" tone="muted" center>
          {description}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} fullWidth={false} style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  iconBubble: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSpacing: { marginTop: spacing.xs },
  action: { marginTop: spacing.md, minWidth: 180 },
});
