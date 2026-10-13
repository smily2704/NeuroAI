/**
 * MOCK FIXTURES — entirely fictional demonstration data.
 *
 * Every name, id, date, filename and measurement below is invented for UI
 * demonstration. None of it corresponds to a real patient, recording,
 * upload, or analysis. Do not use any of it for clinical purposes.
 */

import type {
  AnalysisStatus,
  DashboardStats,
  PatientDetail,
  PatientSummary,
  RecordingSummary,
  ReportDetail,
} from '../types';

export const MOCK_PATIENTS: PatientDetail[] = [
  {
    id: 1,
    patientId: 'NEO-1042',
    name: 'Anaya Kulkarni',
    ageDays: 6,
    gestationalAge: '31w 4d',
    sex: 'Female',
    hospitalUnit: 'NICU — Level III',
    admissionDate: '2026-10-04',
    status: 'Active',
    dateOfBirth: '2026-10-02',
    birthWeightKg: 1.62,
    birthType: 'Caesarean section',
    birthStatus: 'NICU admission',
    clinicalInformation:
      'Preterm admission for respiratory support. Routine EEG monitoring requested by the treating team.',
    recordings: [],
  },
  {
    id: 2,
    patientId: 'NEO-1043',
    name: 'Ishaan Fernandes',
    ageDays: 3,
    gestationalAge: '36w 1d',
    sex: 'Male',
    hospitalUnit: 'NICU — Level II',
    admissionDate: '2026-10-07',
    status: 'Active',
    dateOfBirth: '2026-10-06',
    birthWeightKg: 2.48,
    birthType: 'Vaginal delivery',
    birthStatus: 'Special care nursery',
    clinicalInformation: 'Observation following reduced feeding. EEG requested for monitoring purposes.',
    recordings: [],
  },
  {
    id: 3,
    patientId: 'NEO-1044',
    name: 'Meera Raghavan',
    ageDays: 11,
    gestationalAge: '38w 0d',
    sex: 'Female',
    hospitalUnit: 'Special Care Nursery',
    admissionDate: '2026-09-30',
    status: 'Active',
    dateOfBirth: '2026-09-29',
    birthWeightKg: 3.05,
    birthType: 'Vaginal delivery',
    birthStatus: 'Stable',
    clinicalInformation: 'Follow-up recording scheduled by the clinical team.',
    recordings: [],
  },
  {
    id: 4,
    patientId: 'NEO-1045',
    name: 'Tobias Okafor',
    ageDays: 19,
    gestationalAge: '34w 2d',
    sex: 'Male',
    hospitalUnit: 'NICU — Level III',
    admissionDate: '2026-09-22',
    status: 'Discharged',
    dateOfBirth: '2026-09-21',
    birthWeightKg: 2.11,
    birthType: 'Assisted delivery',
    birthStatus: 'NICU admission',
    clinicalInformation: 'Discharge summary pending. Historical recordings retained for review.',
    recordings: [],
  },
  {
    id: 5,
    patientId: 'NEO-1046',
    name: 'Lina Haddad',
    ageDays: 8,
    gestationalAge: '37w 5d',
    sex: 'Female',
    hospitalUnit: 'NICU — Level II',
    admissionDate: '2026-10-03',
    status: 'Active',
    dateOfBirth: '2026-10-01',
    birthWeightKg: 2.76,
    birthType: 'Caesarean section',
    birthStatus: 'Stable',
    clinicalInformation: 'Routine monitoring.',
    recordings: [],
  },
  {
    id: 6,
    patientId: 'NEO-1047',
    name: 'Rohan Deshpande',
    ageDays: 2,
    gestationalAge: '39w 3d',
    sex: 'Male',
    hospitalUnit: 'Transitional Care',
    admissionDate: '2026-10-09',
    status: 'Active',
    dateOfBirth: '2026-10-09',
    birthWeightKg: 3.31,
    birthType: 'Vaginal delivery',
    birthStatus: 'Stable',
    clinicalInformation: 'Short observation recording requested before discharge planning.',
    recordings: [],
  },
];

const QUALITY_ALL_GOOD = (channels: string[]) =>
  channels.map((channel) => ({
    channel,
    status: 'GOOD' as const,
    problem: 'No basic rule-based issue detected',
  }));

const STANDARD_CHANNELS = ['Fp1', 'Fp2', 'C3', 'C4', 'T3', 'T4', 'O1', 'O2'];

export const MOCK_RECORDINGS: RecordingSummary[] = [
  {
    id: 501,
    patientId: 1,
    filename: 'neo1042_eeg_2026-10-05.edf',
    format: 'EDF',
    samplingRateHz: 256,
    channels: STANDARD_CHANNELS,
    sampleCount: 460_800,
    durationSeconds: 1800,
    createdAt: '2026-10-05T09:24:00Z',
    sizeBytes: 45_117_440,
    signalQuality: [
      { channel: 'Fp1', status: 'GOOD', problem: 'No basic rule-based issue detected' },
      { channel: 'Fp2', status: 'WARNING', problem: 'High variability; inspect noise/artifacts' },
      { channel: 'C3', status: 'GOOD', problem: 'No basic rule-based issue detected' },
      { channel: 'C4', status: 'GOOD', problem: 'No basic rule-based issue detected' },
      { channel: 'T3', status: 'WARNING', problem: 'Large amplitude; verify units' },
      { channel: 'T4', status: 'GOOD', problem: 'No basic rule-based issue detected' },
      { channel: 'O1', status: 'GOOD', problem: 'No basic rule-based issue detected' },
      { channel: 'O2', status: 'POOR', problem: 'Possible flatline; 12 missing sample(s)' },
    ],
  },
  {
    id: 502,
    patientId: 2,
    filename: 'neo1043_eeg_2026-10-08.csv',
    format: 'CSV',
    samplingRateHz: 128,
    channels: STANDARD_CHANNELS.slice(0, 6),
    sampleCount: 230_400,
    durationSeconds: 1800,
    createdAt: '2026-10-08T14:02:00Z',
    sizeBytes: 18_874_368,
    signalQuality: QUALITY_ALL_GOOD(STANDARD_CHANNELS.slice(0, 6)),
  },
  {
    id: 503,
    patientId: 4,
    filename: 'neo1045_eeg_2026-09-25.edf',
    format: 'EDF',
    samplingRateHz: 256,
    channels: STANDARD_CHANNELS,
    sampleCount: 276_480,
    durationSeconds: 1080,
    createdAt: '2026-09-25T08:47:00Z',
    sizeBytes: 27_070_464,
    signalQuality: QUALITY_ALL_GOOD(STANDARD_CHANNELS),
  },
  {
    id: 504,
    patientId: 3,
    filename: 'neo1044_eeg_2026-10-02.tsv',
    format: 'TSV',
    samplingRateHz: 200,
    channels: STANDARD_CHANNELS.slice(0, 4),
    sampleCount: 300_000,
    durationSeconds: 1500,
    createdAt: '2026-10-02T11:15:00Z',
    sizeBytes: 9_600_000,
    signalQuality: QUALITY_ALL_GOOD(STANDARD_CHANNELS.slice(0, 4)),
  },
];

// Attach recordings to their fictional patients so profile screens can read
// either collection.
for (const patient of MOCK_PATIENTS) {
  patient.recordings = MOCK_RECORDINGS.filter((recording) => recording.patientId === patient.id);
}

/**
 * Honest analysis status — a direct mirror of the backend's ml_adapter.
 * There are no numeric seizure fields in this object because the integrated
 * model status provides none.
 */
export const MOCK_ANALYSIS_STATUS: AnalysisStatus = {
  status: 'model_not_configured',
  available: false,
  message:
    'The seizure-detection model integration and validated checkpoint are not included in this build. No seizure predictions, confidence values, events, or localisation have been generated.',
  outputs: [
    {
      key: 'epoch_probabilities',
      label: 'Epoch-level seizure probability',
      available: false,
      reason: 'Model not connected — no inference has been run on any recording.',
    },
    {
      key: 'seizure_events',
      label: 'Seizure events / candidate events',
      available: false,
      reason: 'Not available from the current model status.',
    },
    {
      key: 'seizure_burden',
      label: 'Seizure burden (minutes per hour)',
      available: false,
      reason: 'Requires validated model output that does not exist yet.',
    },
    {
      key: 'confidence',
      label: 'Confidence / sensitivity figures',
      available: false,
      reason: 'No validated model output; no figures may be displayed.',
    },
    {
      key: 'localisation',
      label: 'Channel-level scores & seizure localisation',
      available: false,
      reason:
        'The planned model produces epoch-level outputs only; channel-level localisation is not supported.',
    },
  ],
};

export const MOCK_REPORTS: ReportDetail[] = [
  {
    id: 9001,
    title: 'Neonatal EEG analysis report — NEO-1042',
    patientName: 'Anaya Kulkarni',
    recordingFilename: 'neo1042_eeg_2026-10-05.edf',
    createdAt: '2026-10-05T10:10:00Z',
    status: 'generated_with_unavailable_model_outputs',
    patientId: 'NEO-1042',
    recordingInfo: 'EDF · 8 channels · 256 Hz · 30 min · 43.0 MB',
    modelStatus: 'model_not_configured',
    author: 'Dr. Demo Clinician',
    disclaimer:
      'This report is generated using an AI-assisted EEG analysis system and is intended to support clinical/research review. It must not be used as a standalone diagnosis. Final interpretation must be performed by a qualified healthcare professional.',
    sections: [
      {
        heading: 'Analysis status',
        body: 'Model status: model_not_configured. Seizure events, confidence, seizure burden and localisation are not available because a validated model output is not connected.',
      },
      {
        heading: 'Signal description',
        body: 'Descriptive signal statistics and basic rule-based quality checks only. These are not a clinical impedance measurement and not a seizure diagnosis.',
      },
      {
        heading: 'Clinical notes',
        body: 'Clinical notes and prescriptions must be entered and reviewed by an authorised clinician; none are generated automatically by this report.',
      },
    ],
  },
  {
    id: 9002,
    title: 'Neonatal EEG analysis report — NEO-1043',
    patientName: 'Ishaan Fernandes',
    recordingFilename: 'neo1043_eeg_2026-10-08.csv',
    createdAt: '2026-10-08T15:20:00Z',
    status: 'generated_with_unavailable_model_outputs',
    patientId: 'NEO-1043',
    recordingInfo: 'CSV · 6 channels · 128 Hz · 30 min · 18.0 MB',
    modelStatus: 'model_not_configured',
    author: 'Dr. Demo Clinician',
    disclaimer:
      'This report is generated using an AI-assisted EEG analysis system and is intended to support clinical/research review. It must not be used as a standalone diagnosis.',
    sections: [
      {
        heading: 'Analysis status',
        body: 'Model status: model_not_configured. No seizure outputs are included.',
      },
      {
        heading: 'Signal description',
        body: 'Descriptive statistics only; no inference was performed.',
      },
    ],
  },
  {
    id: 9003,
    title: 'Historical review report — NEO-1045',
    patientName: 'Tobias Okafor',
    recordingFilename: 'neo1045_eeg_2026-09-25.edf',
    createdAt: '2026-09-25T09:30:00Z',
    status: 'generated_with_unavailable_model_outputs',
    patientId: 'NEO-1045',
    recordingInfo: 'EDF · 8 channels · 256 Hz · 18 min · 25.8 MB',
    modelStatus: 'model_not_configured',
    author: 'Dr. Demo Clinician',
    disclaimer:
      'This report is generated using an AI-assisted EEG analysis system and is intended to support clinical/research review. It must not be used as a standalone diagnosis.',
    sections: [
      {
        heading: 'Analysis status',
        body: 'Model status: model_not_configured. No seizure outputs are included.',
      },
    ],
  },
];

export const MOCK_DASHBOARD: DashboardStats = {
  totalPatients: MOCK_PATIENTS.length,
  totalRecordings: MOCK_RECORDINGS.length,
  analysesCompleted: 0,
  detectedSeizureEvents: null,
  seizureEventsNote: 'Unavailable until a validated model output is integrated.',
  recentPatients: MOCK_PATIENTS.slice(-4).reverse(),
};

export function toPatientSummary(patient: PatientDetail): PatientSummary {
  const { recordings, ...summary } = patient;
  void recordings;
  return summary;
}
