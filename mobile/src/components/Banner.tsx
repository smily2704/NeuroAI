/**
 * Banners — the integrity/communication primitives of the app.
 *
 * MockBanner MUST be rendered on any screen that shows demonstration data.
 * Disclaimer renders the standing medical-use notice.
 * NoticeBox mirrors the website `.notice-box`.
 */

import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { radius, spacing } from '@/theme/tokens';
import { useTokens } from '@/theme/ThemeProvider';
import { AppText } from './AppText';

interface MockBannerProps {
  /** What the demonstration data represents, e.g. "sample patients". */
  what: string;
  compact?: boolean;
}

/** Amber banner that marks every screen showing non-real data. */
export function MockBanner({ what, compact = false }: MockBannerProps) {
  const { colors } = useTokens();
  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.mock,
        { backgroundColor: colors.mockSoft, borderColor: colors.mockBorder },
        compact && styles.mockCompact,
      ]}
    >
      <Ionicons name="flask-outline" size={compact ? 14 : 17} color={colors.mock} />
      <View style={styles.flex}>
        <AppText variant="caption" tone="mock" style={styles.strong}>
          DEMONSTRATION DATA
        </AppText>
        <AppText variant="caption" tone="mock">
          {compact
            ? `Showing ${what} — not a real patient record, upload, or analysis.`
            : `Showing ${what}. Nothing on this screen comes from a real patient record, upload, or analysis.`}
        </AppText>
      </View>
    </View>
  );
}

interface DisclaimerProps {
  text?: string;
}

/** Standing medical disclaimer (matches the website disclaimer copy). */
export function Disclaimer({ text }: DisclaimerProps) {
  const { colors } = useTokens();
  return (
    <View style={styles.disclaimer}>
      <Ionicons name="information-circle-outline" size={14} color={colors.textFaint} />
      <AppText variant="caption" tone="faint" style={styles.flex}>
        {text ??
          'NeuroAI supports clinical review. It does not independently diagnose medical conditions. All results require review by a qualified healthcare professional.'}
      </AppText>
    </View>
  );
}

interface NoticeBoxProps {
  title?: string;
  children: React.ReactNode;
  tone?: 'info' | 'warning' | 'danger' | 'success';
}

/** Informational block (website `.notice-box`). */
export function NoticeBox({ title, children, tone = 'info' }: NoticeBoxProps) {
  const { colors } = useTokens();
  const palette = {
    info: { bg: colors.accentSoft, border: colors.accent, fg: colors.accentText, icon: 'information-circle-outline' as const },
    warning: { bg: colors.warningSoft, border: colors.warning, fg: colors.warning, icon: 'alert-circle-outline' as const },
    danger: { bg: colors.dangerSoft, border: colors.danger, fg: colors.danger, icon: 'close-circle-outline' as const },
    success: { bg: colors.successSoft, border: colors.success, fg: colors.success, icon: 'checkmark-circle-outline' as const },
  }[tone];

  return (
    <View style={[styles.notice, { backgroundColor: palette.bg, borderColor: palette.border }]}>
      <Ionicons name={palette.icon} size={17} color={palette.fg} style={styles.noticeIcon} />
      <View style={styles.flex}>
        {title ? (
          <AppText variant="small" style={[styles.strong, { color: palette.fg }]}>
            {title}
          </AppText>
        ) : null}
        <AppText variant="small" tone="muted">
          {children}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  strong: { fontWeight: '700' },
  mock: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  mockCompact: { padding: spacing.sm },
  disclaimer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'flex-start',
    marginTop: spacing.md,
  },
  notice: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  noticeIcon: { marginTop: 1 },
});
