/**
 * Repositories — the single access point for screen data.
 *
 * Today every repository is backed by the mock fixtures in '@/data/mock'
 * and adds a small simulated latency so loading states are exercised.
 * NOTHING here performs a network request, and no method corresponds to an
 * invented endpoint: each one maps to an endpoint that exists in
 * Frontend/backend/app/main.py and will be wired up in a later phase.
 */

import {
  MOCK_ANALYSIS_STATUS,
  MOCK_DASHBOARD,
  MOCK_PATIENTS,
  MOCK_RECORDINGS,
  MOCK_REPORTS,
  toPatientSummary,
} from './mock/fixtures';
import { DATA_SOURCE } from './source';
import type {
  AnalysisStatus,
  DashboardStats,
  PatientDetail,
  PatientSummary,
  RecordingSummary,
  ReportDetail,
  ReportSummary,
} from './types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Simulated latency so loading/empty/error states can be seen. */
const LATENCY_MS = 450;

function notFound(what: string): Error {
  return new Error(`No ${what} exists in the demonstration dataset.`);
}

export const repositories = {
  dataSource: DATA_SOURCE,

  dashboard: {
    async get(): Promise<DashboardStats> {
      await delay(LATENCY_MS);
      return MOCK_DASHBOARD;
    },
  },

  patients: {
    async list(query = ''): Promise<PatientSummary[]> {
      await delay(LATENCY_MS);
      const needle = query.trim().toLowerCase();
      const rows = MOCK_PATIENTS.map(toPatientSummary);
      if (!needle) return rows;
      return rows.filter(
        (patient) =>
          patient.name.toLowerCase().includes(needle) ||
          patient.patientId.toLowerCase().includes(needle) ||
          (patient.hospitalUnit ?? '').toLowerCase().includes(needle),
      );
    },

    async get(patientId: number): Promise<PatientDetail> {
      await delay(LATENCY_MS);
      const patient = MOCK_PATIENTS.find((row) => row.id === patientId);
      if (!patient) throw notFound('patient');
      return { ...patient };
    },
  },

  recordings: {
    async get(recordingId: number): Promise<RecordingSummary> {
      await delay(LATENCY_MS);
      const recording = MOCK_RECORDINGS.find((row) => row.id === recordingId);
      if (!recording) throw notFound('recording');
      return { ...recording };
    },

    async listForPatient(patientId: number): Promise<RecordingSummary[]> {
      await delay(LATENCY_MS);
      return MOCK_RECORDINGS.filter((row) => row.patientId === patientId).map((row) => ({ ...row }));
    },
  },

  analysis: {
    /**
     * Mirrors GET /api/analysis/{recording_id}: honest "model not
     * configured" status plus an empty events list. No scores are faked.
     */
    async get(recordingId: number): Promise<AnalysisStatus & { recordingId: number }> {
      await delay(LATENCY_MS);
      if (!MOCK_RECORDINGS.some((row) => row.id === recordingId)) {
        throw notFound('recording');
      }
      return { ...MOCK_ANALYSIS_STATUS, recordingId };
    },

    /** Most recent demonstration recording — used as the default analysis target. */
    async latestRecording(): Promise<RecordingSummary> {
      await delay(LATENCY_MS);
      const latest = [...MOCK_RECORDINGS].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
      if (!latest) throw notFound('recording');
      return { ...latest };
    },
  },

  reports: {
    async list(): Promise<ReportSummary[]> {
      await delay(LATENCY_MS);
      return MOCK_REPORTS.map(
        ({ sections, disclaimer, patientId, recordingInfo, modelStatus, author, ...summary }) => {
          void sections;
          void disclaimer;
          void patientId;
          void recordingInfo;
          void modelStatus;
          void author;
          return summary;
        },
      );
    },

    async get(reportId: number): Promise<ReportDetail> {
      await delay(LATENCY_MS);
      const found = MOCK_REPORTS.find((row) => row.id === reportId);
      if (!found) throw notFound('report');
      return { ...found };
    },
  },
};
