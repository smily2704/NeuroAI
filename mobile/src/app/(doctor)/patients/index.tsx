/**
 * Patient list with search.
 *
 * Search runs over the demonstration dataset only. Patient creation is
 * intentionally not offered: it requires the backend (which is not
 * connected), and its create endpoint is currently broken upstream.
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { MockBanner, NoticeBox } from '@/components/Banner';
import { SearchInput } from '@/components/Inputs';
import { Screen } from '@/components/Screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/States';
import { repositories } from '@/data/repositories';
import type { PatientSummary } from '@/data/types';
import { useAsync } from '@/hooks/useAsync';
import { radius, spacing } from '@/theme/tokens';
import { useTokens } from '@/theme/ThemeProvider';

export default function PatientListScreen() {
  const [query, setQuery] = React.useState('');
  const { data, loading, error, reload } = useAsync(() => repositories.patients.list());

  const rows = React.useMemo(() => {
    if (!data) return [];
    const needle = query.trim().toLowerCase();
    if (!needle) return data;
    return data.filter(
      (patient) =>
        patient.name.toLowerCase().includes(needle) ||
        patient.patientId.toLowerCase().includes(needle) ||
        (patient.hospitalUnit ?? '').toLowerCase().includes(needle),
    );
  }, [data, query]);

  const header = (
    <View style={styles.headerBlock}>
      <MockBanner what="sample patient records" compact />
      <SearchInput value={query} onChangeText={setQuery} placeholder="Search by name, patient ID or unit…" />
      <AppText variant="caption" tone="muted">
        {loading
          ? 'Loading patients…'
          : `${rows.length} of ${data?.length ?? 0} sample patients shown`}
      </AppText>
      <NoticeBox tone="info" title="Adding patients">
        Creating new patients requires the backend integration phase. This build only browses
        demonstration records.
      </NoticeBox>
    </View>
  );

  return (
    <Screen
      eyebrow="CLINICAL WORKSPACE"
      title="Patients"
      subtitle="Browse and search patient records."
      scroll={false}
      contentStyle={styles.screenContent}
    >
      {loading ? (
        <View style={styles.inlineState}>
          <LoadingState title="Loading patients…" />
        </View>
      ) : error ? (
        <View style={styles.inlineState}>
          <ErrorState title="Patients could not be loaded" description={error} actionLabel="Try again" onAction={reload} />
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={header}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <PatientRow patient={item} />}
          ListEmptyComponent={
            query ? (
              <EmptyState
                title="No matching patients"
                description={`Nothing in the demonstration dataset matches “${query}”.`}
                icon="search-outline"
                actionLabel="Clear search"
                onAction={() => setQuery('')}
              />
            ) : (
              <EmptyState title="No patients" description="The demonstration dataset is empty." icon="people-outline" />
            )
          }
        />
      )}
    </Screen>
  );
}

function PatientRow({ patient }: { patient: PatientSummary }) {
  const { colors } = useTokens();
  return (
    <Card
      padded={false}
      style={styles.rowCard}
      onPress={() =>
        router.push({ pathname: '/patients/[patientId]', params: { patientId: String(patient.id) } })
      }
      accessibilityLabel={`Open profile of ${patient.name}, patient ID ${patient.patientId}`}
    >
      <View style={styles.row}>
        <View style={[styles.avatar, { backgroundColor: colors.accentSoft }]}>
          <AppText variant="h3" tone="accent">
            {patient.name.slice(0, 1)}
          </AppText>
        </View>
        <View style={styles.flex}>
          <AppText variant="bodyStrong" numberOfLines={1}>
            {patient.name}
          </AppText>
          <View style={styles.metaRow}>
            <AppText variant="caption" tone="muted">
              {patient.patientId}
            </AppText>
            <Badge label={patient.status} tone={patient.status === 'Active' ? 'success' : 'neutral'} />
          </View>
          <AppText variant="caption" tone="faint" numberOfLines={1}>
            {[patient.hospitalUnit, patient.gestationalAge ? `GA ${patient.gestationalAge}` : null, patient.ageDays !== null ? `${patient.ageDays} days old` : null]
              .filter(Boolean)
              .join(' · ')}
          </AppText>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screenContent: { paddingHorizontal: 0 },
  inlineState: { paddingHorizontal: spacing.lg },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.sm },
  headerBlock: { gap: spacing.sm, paddingBottom: spacing.md },
  rowCard: { borderRadius: radius.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 2 },
});
