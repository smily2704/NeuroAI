/**
 * EEG upload workspace (demonstration).
 *
 * Flow: select patient → pick an EDF/CSV/TSV file with the native document
 * picker → validate filename/size/extension locally → run a clearly-labelled
 * DEMONSTRATION upload progress animation.
 *
 * IMPORTANT: no file is transmitted. The backend is not connected, and the
 * progress bar is an interface demonstration only.
 */

import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Disclaimer, MockBanner, NoticeBox } from '@/components/Banner';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ProgressBar, SectionHeader } from '@/components/Layout';
import { Screen } from '@/components/Screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/States';
import { repositories } from '@/data/repositories';
import { useAsync } from '@/hooks/useAsync';
import { radius, spacing } from '@/theme/tokens';
import { useTokens } from '@/theme/ThemeProvider';

const ALLOWED_EXTENSIONS = ['.edf', '.csv', '.tsv'] as const;
const MAX_UPLOAD_BYTES = 100 * 1024 * 1024; // matches backend MAX_UPLOAD_SIZE_MB = 100

interface PickedFile {
  name: string;
  sizeBytes: number;
}

type Validation =
  | { ok: true; extension: string }
  | { ok: false; problems: string[] };

function validateFile(file: PickedFile): Validation {
  const problems: string[] = [];
  const lower = file.name.toLowerCase();
  const extension = ALLOWED_EXTENSIONS.find((candidate) => lower.endsWith(candidate));

  if (!extension) {
    problems.push(`Unsupported file type. Accepted formats: ${ALLOWED_EXTENSIONS.join(', ')}.`);
  }
  if (file.sizeBytes === 0) {
    problems.push('The selected file is empty.');
  }
  if (file.sizeBytes > MAX_UPLOAD_BYTES) {
    problems.push(`File is larger than the ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB upload limit.`);
  }

  if (problems.length > 0) return { ok: false, problems };
  return { ok: true, extension: extension ?? '' };
}

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

export default function EegUploadScreen() {
  const { colors } = useTokens();
  const patientsQuery = useAsync(() => repositories.patients.list());

  const [patientId, setPatientId] = React.useState<number | null>(null);
  const [file, setFile] = React.useState<PickedFile | null>(null);
  const [validation, setValidation] = React.useState<Validation | null>(null);
  const [pickerError, setPickerError] = React.useState<string | null>(null);

  const [phase, setPhase] = React.useState<'idle' | 'uploading' | 'done'>('idle');
  const [progress, setProgress] = React.useState(0);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  async function pickFile() {
    setPickerError(null);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['*/*'],
        multiple: false,
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      if (!asset) return;

      const picked: PickedFile = { name: asset.name, sizeBytes: asset.size ?? 0 };
      setFile(picked);
      setValidation(validateFile(picked));
      setPhase('idle');
      setProgress(0);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'The file could not be opened.';
      setPickerError(message);
    }
  }

  function startDemonstrationUpload() {
    if (!validation?.ok) return;
    setPhase('uploading');
    setProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setProgress((current) => {
        const next = current + 0.04 + Math.random() * 0.06;
        if (next >= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          setPhase('done');
          return 1;
        }
        return next;
      });
    }, 160);
  }

  function reset() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setPhase('idle');
    setProgress(0);
    setFile(null);
    setValidation(null);
    setPatientId(null);
  }

  const selectedPatient = patientsQuery.data?.find((patient) => patient.id === patientId) ?? null;
  const canUpload = Boolean(patientId) && Boolean(validation?.ok) && phase !== 'uploading';

  return (
    <Screen
      eyebrow="EEG WORKSPACE"
      title="Upload EEG recording"
      subtitle="Choose a patient, then select an EDF, CSV or TSV recording."
    >
      <MockBanner what="the file-upload workflow with no server behind it" />

      {/* Step 1 — patient */}
      <SectionHeader title="1 · Select patient" caption="Required before a recording can be attached." />
      {patientsQuery.loading ? (
        <LoadingState title="Loading patients…" />
      ) : patientsQuery.error ? (
        <ErrorState
          title="Patients could not be loaded"
          description={patientsQuery.error}
          actionLabel="Try again"
          onAction={patientsQuery.reload}
        />
      ) : patientsQuery.data && patientsQuery.data.length > 0 ? (
        <View style={styles.patientList}>
          {patientsQuery.data.map((patient) => {
            const selected = patient.id === patientId;
            return (
              <Pressable
                key={patient.id}
                onPress={() => setPatientId(patient.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                style={({ pressed }) => [
                  styles.patientOption,
                  {
                    backgroundColor: selected ? colors.accentSoft : colors.surface,
                    borderColor: selected ? colors.accent : colors.border,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <Ionicons
                  name={selected ? 'radio-button-on' : 'radio-button-off'}
                  size={19}
                  color={selected ? colors.primaryPressed : colors.textFaint}
                />
                <View style={styles.flex}>
                  <AppText variant="bodyStrong">{patient.name}</AppText>
                  <AppText variant="caption" tone="muted">
                    {patient.patientId} · {patient.hospitalUnit ?? 'Unit not recorded'}
                  </AppText>
                </View>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <EmptyState icon="people-outline" title="No patients" description="No demonstration patients are available." />
      )}

      {/* Step 2 — file */}
      <SectionHeader title="2 · Select EEG file" caption="EDF, CSV or TSV · maximum 100 MB." />
      <Card>
        <Button label="Choose an EEG file" icon="folder-open-outline" onPress={pickFile} variant="secondary" />

        {pickerError ? (
          <NoticeBox tone="danger" title="File picker error">
            {pickerError}
          </NoticeBox>
        ) : null}

        {file && validation ? (
          <View style={[styles.fileBlock, { borderColor: colors.border }]}>
            <View style={[styles.fileIcon, { backgroundColor: colors.accentSoft }]}>
              <Ionicons name="document-attach-outline" size={20} color={colors.accentText} />
            </View>
            <View style={styles.flex}>
              <AppText variant="bodyStrong" numberOfLines={2}>
                {file.name}
              </AppText>
              <AppText variant="caption" tone="muted">
                {formatBytes(file.sizeBytes)} ·{' '}
                {validation.ok ? validation.extension.toUpperCase().slice(1) : 'unknown format'}
              </AppText>
            </View>
          </View>
        ) : null}

        {validation ? (
          validation.ok ? (
            <NoticeBox tone="success" title="Filename validated (on this device)">
              Format, size and extension checks passed locally. The file has not been uploaded or
              inspected by any server.
            </NoticeBox>
          ) : (
            <NoticeBox tone="danger" title="File rejected">
              {validation.problems.join(' ')}
            </NoticeBox>
          )
        ) : null}

        {file ? (
          <Button label="Choose a different file" variant="ghost" icon="swap-horizontal-outline" onPress={pickFile} />
        ) : null}
      </Card>

      {/* Step 3 — demonstration upload */}
      <SectionHeader title="3 · Upload" caption="Demonstration progress — nothing is transmitted." />
      <Card>
        {phase === 'idle' ? (
          <>
            <AppText variant="small" tone="muted">
              {selectedPatient && file && validation?.ok
                ? `Ready to demonstrate an upload of ${file.name} for ${selectedPatient.name}.`
                : 'Select a patient and a valid EEG file to enable the demonstration upload.'}
            </AppText>
            <Button
              label="Start demonstration upload"
              icon="cloud-upload-outline"
              disabled={!canUpload}
              onPress={startDemonstrationUpload}
              style={styles.buttonSpacing}
            />
          </>
        ) : null}

        {phase === 'uploading' ? (
          <View style={styles.progressBlock}>
            <AppText variant="bodyStrong">Simulating upload…</AppText>
            <AppText variant="caption" tone="muted">
              This progress bar is an interface demonstration. No bytes are leaving this device.
            </AppText>
            <ProgressBar progress={progress} />
            <Button label="Cancel" variant="ghost" onPress={reset} />
          </View>
        ) : null}

        {phase === 'done' ? (
          <View style={styles.progressBlock}>
            <View style={styles.doneRow}>
              <Ionicons name="checkmark-circle" size={22} color={colors.success} />
              <AppText variant="bodyStrong">Demonstration upload finished</AppText>
            </View>
            <NoticeBox tone="warning" title="Nothing was uploaded">
              No recording was transmitted and no server was contacted. In the backend-integration
              phase this step will call the existing EEG upload endpoint and return real recording
              metadata, signal-quality checks and a waveform.
            </NoticeBox>
            <Button
              label="Open the waveform viewer (sample)"
              icon="pulse-outline"
              variant="secondary"
              onPress={() =>
                router.push({ pathname: '/eeg/viewer/[recordingId]', params: { recordingId: '501' } })
              }
            />
            <Button label="Start over" variant="ghost" onPress={reset} />
          </View>
        ) : null}
      </Card>

      <Disclaimer text="Uploading a file does not by itself produce a validated seizure diagnosis." />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  patientList: { gap: spacing.sm },
  patientOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  fileBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSpacing: { marginTop: spacing.md },
  progressBlock: { gap: spacing.sm },
  doneRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
