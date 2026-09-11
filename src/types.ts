/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PatientVitals {
  id: string;
  name: string;
  mrn: string; // Medical Record Number
  age: number; // 20 - 90
  sex: 0 | 1; // 0 = Female, 1 = Male
  cp: 0 | 1 | 2 | 3; // Chest Pain Type: 0: Typical Angina, 1: Atypical Angina, 2: Non-anginal, 3: Asymptomatic
  trestbps: number; // Resting Blood Pressure in mm Hg (80 - 220)
  chol: number; // Serum Cholesterol in mg/dl (100 - 550)
  fbs: 0 | 1; // Fasting Blood Sugar > 120 mg/dl (1 = true, 0 = false)
  restecg: 0 | 1 | 2; // Resting ECG: 0: Normal, 1: ST-T wave abnormality, 2: Left ventricular hypertrophy
  thalach: number; // Maximum Heart Rate achieved (60 - 220)
  exang: 0 | 1; // Exercise induced angina (1 = yes, 0 = no)
  oldpeak: number; // ST depression induced by exercise relative to rest (0.0 - 6.2 mm)
  slope: 0 | 1 | 2; // Slope of peak exercise ST segment: 0: Upsloping, 1: Flat, 2: Downsloping
  ca: 0 | 1 | 2 | 3; // Number of major vessels (0-3) colored by fluoroscopy
  thal: 1 | 2 | 3; // 1 = Normal, 2 = Fixed defect, 3 = Reversible defect
}

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface ModelPrediction {
  modelName: 'Logistic Regression' | 'Support Vector Machine' | 'Random Forest' | 'Neural Network' | 'Calibrated Ensemble';
  probability: number; // 0.0 - 1.0
  prediction: 0 | 1; // 0 = No Disease (<0.5), 1 = Disease (>=0.5)
  riskLevel: RiskLevel;
  confidence: number; // 0.0 - 1.0
  processingTimeMs: number;
}

export interface FeatureAttribution {
  feature: keyof Omit<PatientVitals, 'id' | 'name' | 'mrn'>;
  label: string;
  patientValue: number | string;
  shapValue: number; // positive increases risk, negative decreases risk
  impactDirection: 'increases_risk' | 'decreases_risk' | 'neutral';
  normalRange: string;
}

export interface ValidationIssue {
  field: keyof PatientVitals;
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestedAction?: string;
}

export interface RealtimeValidationResult {
  isValid: boolean;
  plausibilityScore: number; // 0 - 100%
  issues: ValidationIssue[];
}

export interface DiagnosticAssessment {
  patient: PatientVitals;
  timestamp: string;
  models: Record<string, ModelPrediction>;
  ensemble: ModelPrediction;
  featureAttributions: FeatureAttribution[];
  validation: RealtimeValidationResult;
  clinicalRecommendations: string[];
  aiSummary?: string;
  hash: string;
  biometricHash?: string;
  isDuplicate?: boolean;
}

export interface ModelMetricDetails {
  id: string;
  name: string;
  type: string;
  accuracy: number;
  rocAuc: number;
  precision: number;
  recall: number;
  specificity: number;
  f1Score: number;
  brierScore: number;
  confusionMatrix: {
    truePositive: number;
    falsePositive: number;
    trueNegative: number;
    falseNegative: number;
  };
  hyperparameters: Record<string, string | number>;
}

export interface PatientVisitHistory {
  date: string;
  visitId: string;
  trestbps: number;
  chol: number;
  thalach: number;
  oldpeak: number;
  riskScore: number;
  riskLevel: RiskLevel;
  physicianNotes: string;
}

export interface PatientRecord extends PatientVitals {
  visits: PatientVisitHistory[];
  lastAssessed: string;
  primaryCareProvider: string;
  encryptedHash: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  clinician: string;
  patientMrn: string;
  sha256Hash: string;
  status: 'VERIFIED' | 'FLAGGED';
}

export interface MfaAuthState {
  isAuthenticated: boolean;
  clinicianName: string;
  clinicianRole: string;
  clinicianNpi: string;
  mfaMethod: 'TOTP_AUTHENTICATOR' | 'HARDWARE_KEY' | 'SMS_SECURE';
  sessionExpiry: number;
}

export interface DuplicateTestStep {
  id: string;
  title: string;
  description: string;
  status: 'passed' | 'failed' | 'running';
  metric: string;
  details: string;
  executionTimeMs: number;
}

export interface DuplicateComparison {
  field: string;
  originalValue: string | number;
  duplicateValue: string | number;
  isMatch: boolean;
}

export interface DuplicateDataTestReport {
  testId: string;
  timestamp: string;
  overallStatus: 'passed' | 'failed';
  totalAssertions: number;
  passedAssertions: number;
  failedAssertions: number;
  executionTimeTotalMs: number;
  modelDeterminismDelta: number; // 0.000000%
  biometricChecksumMatch: boolean;
  duplicateIdempotencyVerified: boolean;
  encounterCollisionSafeguardActive: boolean;
  datasetLeakageRate: number; // 0.00%
  steps: DuplicateTestStep[];
  comparisons: DuplicateComparison[];
  testPatientOriginal: PatientVitals;
  testPatientDuplicate: PatientVitals;
  rawLogs: string[];
}
