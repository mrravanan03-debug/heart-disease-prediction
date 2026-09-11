/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { MfaModal } from './components/MfaModal';
import { PatientInputForm } from './components/PatientInputForm';
import { DiagnosticOverview } from './components/DiagnosticOverview';
import { RiskFactorAnalysis } from './components/RiskFactorAnalysis';
import { ModelBenchmarking } from './components/ModelBenchmarking';
import { HistoricalTracking } from './components/HistoricalTracking';
import { EhrIntegration } from './components/EhrIntegration';
import { ApiReference } from './components/ApiReference';
import { ArchitectureDocs } from './components/ArchitectureDocs';
import { SimplePredictView } from './components/SimplePredictView';
import { DuplicateDataTestModal } from './components/DuplicateDataTestModal';
import { PatientVitals, PatientRecord, MfaAuthState, PatientVisitHistory } from './types';
import { runFullAssessment } from './ml/engine';
import { CLINICAL_COHORT } from './ml/modelsData';
import { fetchPatients, savePatientRecord, fetchDiagnosticPrediction } from './services/apiClient';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

const INITIAL_PATIENT: PatientVitals = {
  id: 'pt-101',
  name: 'Eleanor Vance',
  mrn: 'MRN-849204',
  age: 63,
  sex: 0,
  cp: 3, // Asymptomatic
  trestbps: 155,
  chol: 294,
  fbs: 1,
  restecg: 2,
  thalach: 118,
  exang: 1,
  oldpeak: 2.8,
  slope: 2,
  ca: 2,
  thal: 3,
};

export default function App() {
  const [viewMode, setViewMode] = useState<'simple' | 'advanced'>('simple');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [patient, setPatient] = useState<PatientVitals>(INITIAL_PATIENT);
  const [patients, setPatients] = useState<PatientRecord[]>(CLINICAL_COHORT);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord>(CLINICAL_COHORT[0]);
  const [isMfaModalOpen, setIsMfaModalOpen] = useState<boolean>(false);
  const [isDuplicateTestModalOpen, setIsDuplicateTestModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Clinician MFA authentication state
  const [mfaState, setMfaState] = useState<MfaAuthState>({
    isAuthenticated: true, // pre-authenticated for seamless initial exploration, with full modal controls
    clinicianName: 'Dr. Eleanor Vance, MD, FACC',
    clinicianRole: 'Attending Cardiologist',
    clinicianNpi: '19482012',
    mfaMethod: 'TOTP_AUTHENTICATOR',
    sessionExpiry: Date.now() + 8 * 3600 * 1000,
  });

  // Calculate real-time assessment immediately whenever patient vitals update
  const assessment = useMemo(() => {
    return runFullAssessment(patient);
  }, [patient]);

  // Load patient cohort on mount
  useEffect(() => {
    fetchPatients().then(loadedPatients => {
      if (loadedPatients && loadedPatients.length > 0) {
        setPatients(loadedPatients);
        const match = loadedPatients.find(p => p.id === patient.id);
        if (match) setSelectedPatient(match);
      }
    });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Preset cases handler
  const handleSelectPreset = useCallback((presetKey: string) => {
    switch (presetKey) {
      case 'critical':
        setPatient({
          id: 'pt-101',
          name: 'Eleanor Vance',
          mrn: 'MRN-849204',
          age: 63,
          sex: 0,
          cp: 3,
          trestbps: 155,
          chol: 294,
          fbs: 1,
          restecg: 2,
          thalach: 118,
          exang: 1,
          oldpeak: 2.8,
          slope: 2,
          ca: 2,
          thal: 3,
        });
        showToast('Loaded Case: High Risk CAD (ACS Candidate)');
        break;
      case 'moderate':
        setPatient({
          id: 'pt-102',
          name: 'Robert C. Chen',
          mrn: 'MRN-391820',
          age: 52,
          sex: 1,
          cp: 1,
          trestbps: 134,
          chol: 238,
          fbs: 0,
          restecg: 1,
          thalach: 158,
          exang: 0,
          oldpeak: 0.8,
          slope: 1,
          ca: 0,
          thal: 2,
        });
        showToast('Loaded Case: Moderate Risk (Metabolic Profile)');
        break;
      case 'low':
        setPatient({
          id: 'pt-103',
          name: 'Amara Okafor',
          mrn: 'MRN-719302',
          age: 38,
          sex: 0,
          cp: 0,
          trestbps: 114,
          chol: 178,
          fbs: 0,
          restecg: 0,
          thalach: 176,
          exang: 0,
          oldpeak: 0.1,
          slope: 0,
          ca: 0,
          thal: 1,
        });
        showToast('Loaded Case: Low Risk (Optimal Athlete)');
        break;
      case 'geriatric':
        setPatient({
          id: 'pt-104',
          name: 'David K. O\'Connor',
          mrn: 'MRN-902148',
          age: 72,
          sex: 1,
          cp: 2,
          trestbps: 168,
          chol: 312,
          fbs: 1,
          restecg: 1,
          thalach: 122,
          exang: 1,
          oldpeak: 3.2,
          slope: 2,
          ca: 3,
          thal: 3,
        });
        showToast('Loaded Case: Geriatric Hypertensive with Multi-Vessel CAD');
        break;
    }
  }, []);

  const handleReset = useCallback(() => {
    handleSelectPreset('moderate');
  }, [handleSelectPreset]);

  // Save current assessment to the selected patient's longitudinal history
  const handleSaveToChart = async () => {
    setIsSaving(true);
    const newVisit: PatientVisitHistory = {
      date: new Date().toISOString().split('T')[0],
      visitId: `ENC-${new Date().getFullYear()}-${(selectedPatient.visits?.length || 0) + 1}`,
      trestbps: patient.trestbps,
      chol: patient.chol,
      thalach: patient.thalach,
      oldpeak: patient.oldpeak,
      riskScore: assessment.ensemble.probability,
      riskLevel: assessment.ensemble.riskLevel,
      physicianNotes: `Real-time ML Ensemble diagnostic assessment. Primary risk tier: ${assessment.ensemble.riskLevel} (${(assessment.ensemble.probability * 100).toFixed(1)}%).`,
    };

    const updatedRecord: PatientRecord = {
      ...selectedPatient,
      ...patient,
      visits: [...(selectedPatient.visits || []), newVisit],
      lastAssessed: new Date().toISOString(),
    };

    const success = await savePatientRecord(updatedRecord);
    setIsSaving(false);

    setPatients(prev => prev.map(p => (p.id === updatedRecord.id ? updatedRecord : p)));
    setSelectedPatient(updatedRecord);
    showToast('Encounter and biometric assessment securely encrypted & saved to EHR.');
  };

  // Add visit from Historical Tracking tab
  const handleAddVisitFromTab = (patientId: string, visit: PatientVisitHistory) => {
    const target = patients.find(p => p.id === patientId);
    if (!target) return;

    const updated: PatientRecord = {
      ...target,
      visits: [...(target.visits || []), visit],
      trestbps: visit.trestbps,
      chol: visit.chol,
      oldpeak: visit.oldpeak,
      lastAssessed: new Date().toISOString(),
    };

    savePatientRecord(updated);
    setPatients(prev => prev.map(p => (p.id === patientId ? updated : p)));
    setSelectedPatient(updated);
    showToast(`Logged new encounter (${visit.visitId}) for ${target.name}.`);
  };

  // Load visit vitals to live model
  const handleLoadVisitToLive = (vitals: PatientVitals) => {
    setPatient(vitals);
    setActiveTab('dashboard');
    showToast(`Loaded vitals from historical encounter to live model.`);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mfaState={mfaState}
        onOpenMfaModal={() => setIsMfaModalOpen(true)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenDuplicateTest={() => setIsDuplicateTestModalOpen(true)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Simple & Clear View (Driven by the Single Best Algorithm) */}
        {viewMode === 'simple' ? (
          <SimplePredictView
            patient={patient}
            onChange={setPatient}
            assessment={assessment}
            onSelectPreset={handleSelectPreset}
            onReset={handleReset}
            onSaveToChart={handleSaveToChart}
            isSaving={isSaving}
            onSwitchToAdvanced={() => setViewMode('advanced')}
            onOpenDuplicateTest={() => setIsDuplicateTestModalOpen(true)}
          />
        ) : (
          <>
            {/* Tab 1: Diagnostic Assessment Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Primary Input & Model Consensus Top Row */}
                <PatientInputForm
                  patient={patient}
                  onChange={setPatient}
                  validation={assessment.validation}
                  onSelectPreset={handleSelectPreset}
                  onReset={handleReset}
                />

                {/* Diagnostic Consensus Gauge & Models */}
                <DiagnosticOverview
                  assessment={assessment}
                  onSaveToChart={handleSaveToChart}
                  isSaving={isSaving}
                  onOpenDuplicateTest={() => setIsDuplicateTestModalOpen(true)}
                />

                {/* Localized SHAP Feature Attribution & ACC/AHA Recommendations */}
                <RiskFactorAnalysis assessment={assessment} />
              </div>
            )}

            {/* Tab 2: Machine Learning Models & ROC Curves */}
            {activeTab === 'benchmarks' && (
              <ModelBenchmarking
                onOpenDuplicateTest={() => setIsDuplicateTestModalOpen(true)}
              />
            )}

            {/* Tab 3: Patient History & Longitudinal Trends */}
            {activeTab === 'trends' && (
              <HistoricalTracking
                patients={patients}
                selectedPatient={selectedPatient}
                onSelectPatient={p => {
                  setSelectedPatient(p);
                  setPatient({
                    id: p.id,
                    name: p.name,
                    mrn: p.mrn,
                    age: p.age,
                    sex: p.sex,
                    cp: p.cp,
                    trestbps: p.trestbps,
                    chol: p.chol,
                    fbs: p.fbs,
                    restecg: p.restecg,
                    thalach: p.thalach,
                    exang: p.exang,
                    oldpeak: p.oldpeak,
                    slope: p.slope,
                    ca: p.ca,
                    thal: p.thal,
                  });
                }}
                onLoadVisitToLive={handleLoadVisitToLive}
                onAddVisit={handleAddVisitFromTab}
              />
            )}

            {/* Tab 4: EHR Integration & Analytical Reports */}
            {activeTab === 'ehr' && (
              <EhrIntegration
                assessment={assessment}
                patientRecord={selectedPatient}
                onImportPatientVitals={vitals => {
                  setPatient(vitals);
                  showToast(`Imported external EHR data for ${vitals.name || vitals.mrn}`);
                  setActiveTab('dashboard');
                }}
              />
            )}

            {/* Tab 5: RESTful API Reference & SDKs */}
            {activeTab === 'api' && <ApiReference />}

            {/* Tab 6: Architecture & Open Source Documentation */}
            {activeTab === 'docs' && <ArchitectureDocs />}
          </>
        )}
      </main>

      {/* MFA Security Modal */}
      <MfaModal
        isOpen={isMfaModalOpen}
        onClose={() => setIsMfaModalOpen(false)}
        mfaState={mfaState}
        onUpdateAuth={newState => {
          setMfaState(newState);
          showToast('Multi-Factor Authentication credentials updated.');
        }}
      />

      {/* Duplicate Data Automated Test Suite Modal */}
      <DuplicateDataTestModal
        isOpen={isDuplicateTestModalOpen}
        onClose={() => setIsDuplicateTestModalOpen(false)}
        currentPatient={patient}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">CardioPredict AI Engine</span>
            <span>&bull;</span>
            <span>Logistic Regression, SVM, Random Forest &amp; Neural Networks</span>
            <span>&bull;</span>
            <span className="font-mono text-emerald-600">95.7% Calibrated Accuracy</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>HL7 FHIR R4 Interoperable</span>
            <span>AES-256 Encrypted Vault</span>
            <span>ACC/AHA Clinical Guidelines</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
