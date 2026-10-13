/**
 * Shared data contracts.
 *
 * Shapes mirror the FastAPI backend response objects where such endpoints
 * exist (Frontend/backend/app/main.py), so the live adapter can slot in
 * without rewriting screens.
 *
 * Scientific boundary encoded here:
 *  - The existing model integration reports "model_not_configured" and
 *    provides NO seizure probabilities, events, burden, confidence or
 *    localisation. The AnalysisStatus type therefore has no numeric
 *    seizure fields at all — there is nothing to accidentally render.
 *  - Seizure localisation / channel-level scores are represented only as
 *    explicitly unavailable outputs.
 */

export interface PatientSummary {
  /** Internal numeric id (matches backend Patient.id). */
  id: number;
  /** Human-readable id (matches backend Patient.patient_id). */
  patientId: string;
  name: string;
  ageDays: number | null;
  gestationalAge: string | null;
  sex: string | null;
  hospitalUnit: string | null;
  admissionDate: string | null;
  status: 'Active' | 'Discharged';
}

export interface PatientDetail extends PatientSummary {
  dateOfBirth: string | null;
  birthWeightKg: number | null;
  birthType: string | null;
  birthStatus: string | null;
  clinicalInformation: string | null;
  recordings: RecordingSummary[];
}

export type SignalQualityStatus = 'GOOD' | 'WARNING' | 'POOR';

export interface SignalQualityItem {
  channel: string;
  status: SignalQualityStatus;
  problem: string;
}

export interface RecordingSummary {
  id: number;
  patientId: number;
  filename: string;
  format: 'EDF' | 'CSV' | 'TSV';
  samplingRateHz: number | null;
  channels: string[];
  sampleCount: number;
  durationSeconds: number | null;
  createdAt: string;
  sizeBytes: number;
  signalQuality: SignalQualityItem[];
}

/**
 * Why an analysis output cannot be shown. `available` is always false in
 * this increment — the model is not connected.
 */
export interface AnalysisOutputStatus {
  key:
    | 'epoch_probabilities'
    | 'seizure_events'
    | 'seizure_burden'
    | 'confidence'
    | 'localisation';
  label: string;
  available: false;
  reason: string;
}

export interface AnalysisStatus {
  /** Mirrors ml_adapter.model_status()["status"]. */
  status: 'model_not_configured';
  available: false;
  message: string;
  /** Every output the UI would otherwise show, marked unavailable. */
  outputs: AnalysisOutputStatus[];
}

export interface ReportSummary {
  id: number;
  title: string;
  patientName: string;
  recordingFilename: string;
  createdAt: string;
  /** Mirrors the backend report endpoint status string. */
  status: 'generated_with_unavailable_model_outputs';
}

export interface ReportSection {
  heading: string;
  body: string;
}

export interface ReportDetail extends ReportSummary {
  patientId: string;
  recordingInfo: string;
  modelStatus: string;
  author: string;
  disclaimer: string;
  sections: ReportSection[];
}

export interface DashboardStats {
  totalPatients: number;
  totalRecordings: number;
  analysesCompleted: number;
  /** Always null until a validated model output exists. */
  detectedSeizureEvents: null;
  seizureEventsNote: string;
  recentPatients: PatientSummary[];
}
