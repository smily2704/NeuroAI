/**
 * Report list (demonstration).
 *
 * Reports mirror the backend's report records, which are generated with
 * model outputs unavailable. Nothing here has been produced by an analysis.
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Badge } from '@/components/Badge';
import { MockBanner, NoticeBox } from '@/components/Banner';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/States';
import { repositories } from '@/data/repositories';
import { useAsync } from '@/hooks/useAsync';
import { radius, spacing } from '@/theme/tokens';
import { useTokens } from '@/theme/ThemeProvider';

export default function ReportsScreen() {
  const { colors } = useTokens();
  const { data, loading, error, reload } = useAsync(() => repositories.reports.list());

  return (
    <Screen
      eyebrow="CLINICAL WORKSPACE"
      title="Reports"
      subtitle="Browse generated report records and preview them natively."
    >
      <MockBanner what="sample report records" />

      {loading ? (
        <LoadingState title="Loading reports…" />
      ) : error ? (
        <ErrorState
          title="Reports could not be loaded"
          description={error}
          actionLabel="Try again"
          onAction={reload}
        />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon="document-text-outline"
          title="No reports yet"
          description="Report records will appear here once report generation is connected."
        />
      ) : (
        <View style={styles.list}>
          {data.map((report) => (
            <Card
              key={report.id}
              onPress={() =>
                router.push({ pathname: '/reports/[reportId]', params: { reportId: String(report.id) } })
              }
              accessibilityLabel={`Open report ${report.title}`}
            >
              <View style={styles.row}>
                <View style={[styles.icon, { backgroundColor: colors.accentSoft }]}>
                  <Ionicons name="document-text-outline" size={20} color={colors.accentText} />
                </View>
                <View style={styles.flex}>
                  <AppText variant="bodyStrong" numberOfLines={2}>
                    {report.title}
                  </AppText>
                  <AppText variant="caption" tone="muted">
                    {report.patientName} · {report.recordingFilename}
                  </AppText>
                  <View style={styles.metaRow}>
                    <AppText variant="caption" tone="faint">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </AppText>
                    <Badge label="Model outputs unavailable" tone="warning" />
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
              </View>
            </Card>
          ))}

          <NoticeBox tone="info" title="Export formats">
            CSV and JSON export of analysis metadata are supported by the backend and will be added
            to the app during the backend-integration phase.
          </NoticeBox>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { gap: spacing.sm, marginTop: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  icon: {
    width: 42,
    height: 42,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 6, flexWrap: 'wrap' },
});
