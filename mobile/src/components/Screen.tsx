/**
 * Screen — standard page frame: safe-area, optional scrolling, and the
 * eyebrow / title / subtitle header used across the app (mirrors the
 * website top-bar, adapted for portrait phones).
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as React from 'react';
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { spacing } from '@/theme/tokens';
import { useTokens } from '@/theme/ThemeProvider';
import { AppText } from './AppText';

interface ScreenProps {
  children: React.ReactNode;
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  /** Renders a back button that pops the navigation stack. */
  showBack?: boolean;
  /** Non-scrolling screens (e.g. lists using FlatList) render children as-is. */
  scroll?: boolean;
  /** Header action rendered inline beside the title (never overlaps it). */
  headerRight?: React.ReactNode;
  /** Smaller title for compact headers (e.g. the dashboard greeting). */
  titleVariant?: 'h1' | 'h2';
  contentStyle?: StyleProp<ViewStyle>;
  /** Extra bottom padding for scrollable content (default XXL). */
  contentPaddingBottom?: number;
}

export function Screen({
  children,
  title,
  eyebrow,
  subtitle,
  showBack,
  scroll = true,
  headerRight,
  titleVariant = 'h1',
  contentStyle,
  contentPaddingBottom = spacing.xxxl,
}: ScreenProps) {
  const { colors } = useTokens();

  const header =
    title || eyebrow || subtitle || headerRight || showBack ? (
      <View style={styles.header}>
        {showBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/dashboard'))}
            style={({ pressed }) => [
              styles.backButton,
              { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons name="chevron-back" size={16} color={colors.primaryPressed} />
            <AppText variant="small" tone="primary" style={{ fontWeight: '700' }}>
              Back
            </AppText>
          </Pressable>
        ) : null}

        {/* Title row: text block + inline action. The action sits in the flex
            row (not absolutely positioned), so it can never overlap a
            wrapping multi-line title. */}
        <View style={styles.titleRow}>
          <View style={styles.headerText}>
            {eyebrow ? (
              <AppText variant="eyebrow" tone="muted">
                {eyebrow.toUpperCase()}
              </AppText>
            ) : null}
            {title ? (
              <AppText variant={titleVariant} style={styles.title}>
                {title}
              </AppText>
            ) : null}
            {subtitle ? (
              <AppText variant="small" tone="muted" style={styles.subtitle}>
                {subtitle}
              </AppText>
            ) : null}
          </View>
          {headerRight ? (
            <View style={styles.headerRight}>{headerRight}</View>
          ) : null}
        </View>
      </View>
    ) : null;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {header}
      {scroll ? (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: contentPaddingBottom },
            contentStyle,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  headerText: { flex: 1, minWidth: 0, gap: 2 },
  headerRight: { flexShrink: 0, alignItems: 'flex-end' },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    borderWidth: 1,
  },
  title: { marginTop: 2 },
  subtitle: { marginTop: 2 },
  scrollContent: { paddingHorizontal: spacing.lg },
});
