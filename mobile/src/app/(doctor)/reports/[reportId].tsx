/**
 * Report detail + native PDF preview.
 *
 * The preview renders a local HTML document through the operating system's
 * print/PDF pipeline (expo-print). The document is clearly watermarked as a
 * demonstration artefact. No report is downloaded from a server because the
 * backend is not connected.
 */

import * as Print from 'expo-print';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Badge } from '@/components/Badge';
import { Disclaimer, MockBanner, NoticeBox } from '@/components/Banner';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { DetailRow, SectionHeader } from '@/components/Layout';
import { Screen } from '@/components/Screen';
import { ErrorState, LoadingState } from '@/components/States';
import { repositories } from '@/data/repositories';
import { useAsync } from '@/hooks/useAsync';
import { radius, spacing } from '@/theme/tokens';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildPreviewHtml(report: NonNullable<Awaited<ReturnType<typeof repositories.reports.get>>>): string {
  const sections = report.sections
    .map(
      (section) => `
      <h2>${escapeHtml(section.heading)}</h2>
      <p>${escapeHtml(section.body)}</p>`,
    )
    .join('');

  return `
<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  body { font-family: -apple-system, Roboto, Helvetica, Arial, sans-serif; color: #292630; margin: 28px; }
  .watermark { background: #FBF1DC; border: 2px solid #E0C48A; color: #8A5A00; padding: 12px 16px;
               border-radius: 10px; font-weight: 700; text-align: center; letter-spacing: 1px; }
  h1 { font-size: 22px; margin: 22px 0 4px; color: #292630; }
  h2 { font-size: 15px; margin: 20px 0 6px; color: #463653; border-bottom: 1px solid #E1DBE6; padding-bottom: 4px; }
  p { font-size: 13px; line-height: 1.6; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  td { border: 1px solid #E1DBE6; padding: 8px 10px; font-size: 13px; }
  td.label { background: #E8E0F0; width: 42%; font-weight: 600; }
  .disclaimer { margin-top: 26px; font-size: 11px; color: #6A6375; line-height: 1.6; }
  .footer { margin-top: 18px; font-size: 11px; color: #756E7E; }
</style>
</head>
<body>
  <div class="watermark">DEMONSTRATION DOCUMENT — NOT A CLINICAL REPORT</div>
  <h1>${escapeHtml(report.title)}</h1>
  <p>${escapeHtml(report.createdAt ? new Date(report.createdAt).toLocaleString() : '')}</p>
  <table>
    <tr><td class="label">Patient ID</td><td>${escapeHtml(report.patientId)}</td></tr>
    <tr><td class="label">Patient (fictional)</td><td>${escapeHtml(report.patientName)}</td></tr>
    <tr><td class="label">Recording</td><td>${escapeHtml(report.recordingFilename)}</td></tr>
    <tr><td class="label">Recording info</td><td>${escapeHtml(report.recordingInfo)}</td></tr>
    <tr><td class="label">Model status</td><td>${escapeHtml(report.modelStatus)} — no seizure outputs included</td></tr>
    <tr><td class="label">Prepared by</td><td>${escapeHtml(report.author)}</td></tr>
  </table>
  ${sections}
  <p class="disclaimer">${escapeHtml(report.disclaimer)}</p>
  <p class="footer">Generated locally by the NeuroAI mobile preview. This document contains no real patient data.</p>
</body>
</html>`;
}

export default function ReportDetailScreen() {
  const params = useLocalSearchParams<{ reportId: string }>();
  const reportId = Number(params.reportId);

  const { data, loading, error } = useAsync(() => repositories.reports.get(reportId), [reportId]);
  const [previewing, setPreviewing] = React.useState(false);

  async function previewPdf() {
    if (!data) return;
    setPreviewing(true);
    try {
      await Print.printAsync({ html: buildPreviewHtml(data) });
    } catch (cause) {
      // The user cancelling the print dialog also lands here on some devices.
      const message = cause instanceof Error ? cause.message : 'The preview could not be opened.';
      Alert.alert('PDF preview', message);
    } finally {
      setPreviewing(false);
    }
  }

  if (loading) {
    return (
      <Screen showBack title="Report">
        <LoadingState title="Loading report…" />
      </Screen>
    );
  }

  if (error || !data) {
    return (
      <Screen showBack title="Report">
        <ErrorState
          title="Report unavailable"
          description={error ?? 'This demonstration report could not be found.'}
          actionLabel="Go back"
          onAction={() => (router.canGoBack() ? router.back() : router.replace('/reports'))}
        />
      </Screen>
    );
  }

  return (
    <Screen showBack eyebrow="REPORT" title={data.title} subtitle={data.patientName}>
      <MockBanner what="a locally rendered demonstration report" />

      <View style={styles.badgeRow}>
        <Badge label="Model outputs unavailable" tone="warning" />
        <Badge label="Demo document" tone="mock" />
      </View>

      <SectionHeader title="Report details" />
      <Card padded={false} style={styles.card}>
        <View style={styles.cardInner}>
          <DetailRow label="Patient ID" value={data.patientId} />
          <DetailRow label="Recording" value={data.recordingFilename} />
          <DetailRow label="Recording info" value={data.recordingInfo} />
          <DetailRow label="Model status" value={data.modelStatus} unavailableText="Not available" />
          <DetailRow label="Prepared by" value={data.author} />
          <DetailRow label="Created" value={new Date(data.createdAt).toLocaleString()} />
        </View>
      </Card>

      <SectionHeader title="Contents" caption="Exactly what the report contains." />
      <Card>
        <View style={styles.sections}>
          {data.sections.map((section) => (
            <View key={section.heading} style={styles.sectionBlock}>
              <AppText variant="bodyStrong">{section.heading}</AppText>
              <AppText variant="small" tone="muted">
                {section.body}
              </AppText>
            </View>
          ))}
        </View>
      </Card>

      <SectionHeader title="Preview" caption="Rendered on-device through the system print pipeline." />
      <Card>
        <Button
          label="Preview PDF"
          icon="eye-outline"
          onPress={previewPdf}
          loading={previewing}
        />
        <Button
          label="Download / share"
          icon="share-outline"
          variant="ghost"
          disabled
          onPress={() => undefined}
          style={styles.secondarySpacing}
        />
        <AppText variant="caption" tone="faint">
          Download and share require a native sharing module and a connected backend file; both are
          reserved for a later phase.
        </AppText>
        <NoticeBox tone="warning" title="Demonstration content only">
          This preview is assembled locally from fictional text. It is not a clinical document and
          contains no patient data.
        </NoticeBox>
      </Card>

      <Disclaimer text={data.disclaimer} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg },
  cardInner: { paddingHorizontal: spacing.lg, paddingVertical: spacing.xs },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xs },
  sections: { gap: spacing.md },
  sectionBlock: { gap: 4 },
  secondarySpacing: { marginTop: spacing.sm },
});
