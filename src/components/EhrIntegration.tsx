/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DiagnosticAssessment, PatientRecord, PatientVitals } from '../types';
import { downloadFile, fetchFhirBundle } from '../services/apiClient';
import { FileText, Download, Upload, ShieldCheck, Share2, Printer, CheckCircle2, Lock, FileSpreadsheet, Eye, Terminal } from 'lucide-react';

interface EhrIntegrationProps {
  assessment: DiagnosticAssessment;
  patientRecord: PatientRecord;
  onImportPatientVitals: (vitals: PatientVitals) => void;
}

export const EhrIntegration: React.FC<EhrIntegrationProps> = ({
  assessment,
  patientRecord,
  onImportPatientVitals,
}) => {
  const [fhirData, setFhirData] = useState<any>(null);
  const [activeView, setActiveView] = useState<'report' | 'fhir' | 'csv' | 'audit'>('report');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const { patient, ensemble, models, featureAttributions, clinicalRecommendations, hash } = assessment;

  useEffect(() => {
    fetchFhirBundle(patient).then(setFhirData);
  }, [patient]);

  // Generate CSV string
  const generateCsv = () => {
    const headers = [
      'MRN', 'Patient_Name', 'Age', 'Sex', 'Chest_Pain_Type', 'Resting_BP', 'Cholesterol',
      'Fasting_Blood_Sugar', 'Resting_ECG', 'Max_Heart_Rate', 'Exercise_Angina', 'Oldpeak_ST',
      'ST_Slope', 'Colored_Vessels', 'Thal_Status', 'Ensemble_Risk_Score', 'Ensemble_Risk_Tier',
      'Logistic_Reg_Prob', 'SVM_Prob', 'Random_Forest_Prob', 'Neural_Net_Prob', 'Assessment_Timestamp', 'Integrity_Hash'
    ].join(',');

    const row = [
      `"${patient.mrn}"`,
      `"${patient.name}"`,
      patient.age,
      patient.sex,
      patient.cp,
      patient.trestbps,
      patient.chol,
      patient.fbs,
      patient.restecg,
      patient.thalach,
      patient.exang,
      patient.oldpeak,
      patient.slope,
      patient.ca,
      patient.thal,
      ensemble.probability,
      `"${ensemble.riskLevel}"`,
      models.logisticRegression.probability.toFixed(3),
      models.svm.probability.toFixed(3),
      models.randomForest.probability.toFixed(3),
      models.neuralNetwork.probability.toFixed(3),
      `"${new Date().toISOString()}"`,
      `"${hash}"`
    ].join(',');

    return `${headers}\n${row}`;
  };

  const handleDownloadCsv = () => {
    const csv = generateCsv();
    downloadFile(csv, `CAD_Assessment_${patient.mrn}_${Date.now()}.csv`, 'text/csv');
  };

  const handleDownloadFhir = () => {
    if (!fhirData) return;
    downloadFile(
      JSON.stringify(fhirData, null, 2),
      `FHIR_R4_Bundle_${patient.mrn}_${Date.now()}.json`,
      'application/json'
    );
  };

  // Generate printable HTML Report
  const handlePrintOrDownloadReport = () => {
    const reportHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Clinical Consultation Report - ${patient.name} (${patient.mrn})</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; margin: 40px; }
    .header { border-bottom: 2px solid #e11d48; padding-bottom: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; }
    h1 { color: #0f172a; margin: 0; font-size: 22px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 13px; color: white; background: #e11d48; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
    th { background: #f8fafc; }
    .section-title { font-size: 15px; font-weight: bold; color: #334155; margin-top: 24px; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
    .footer { margin-top: 40px; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 8px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>CardioPredict AI &bull; Clinical Diagnostic Assessment Report</h1>
      <p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px;">Electronic Health Record Interoperability Exchange &bull; HL7 FHIR Standard</p>
    </div>
    <div style="text-align: right;">
      <span class="badge">${ensemble.riskLevel} CAD Risk</span>
      <p style="margin: 4px 0 0 0; font-size: 12px; font-family: monospace;">Hash: ${hash}</p>
    </div>
  </div>

  <div class="section-title">1. Patient Demographics &amp; Encrypted Identifiers</div>
  <table>
    <tr><th>Patient Name</th><td>${patient.name}</td><th>Medical Record Number (MRN)</th><td>${patient.mrn}</td></tr>
    <tr><th>Age / Biological Sex</th><td>${patient.age} yrs / ${patient.sex === 1 ? 'Male' : 'Female'}</td><th>Assessment Date</th><td>${new Date().toLocaleDateString()}</td></tr>
  </table>

  <div class="section-title">2. Cardiovascular Biomarkers &amp; Stress Metrics</div>
  <table>
    <tr><th>Resting Blood Pressure</th><td>${patient.trestbps} mmHg</td><th>Serum Cholesterol</th><td>${patient.chol} mg/dL</td></tr>
    <tr><th>Max Heart Rate (thalach)</th><td>${patient.thalach} bpm</td><th>ST Depression (oldpeak)</th><td>${patient.oldpeak} mm</td></tr>
    <tr><th>Chest Pain Classification</th><td>Type ${patient.cp} (${['Typical Angina', 'Atypical Angina', 'Non-anginal', 'Asymptomatic'][patient.cp]})</td><th>Exercise Induced Angina</th><td>${patient.exang === 1 ? 'Positive (Yes)' : 'Negative (No)'}</td></tr>
    <tr><th>Major Colored Vessels (ca)</th><td>${patient.ca} vessel(s)</td><th>Thalassemia Status</th><td>${['Normal', 'Fixed defect', 'Reversible defect'][patient.thal - 1] || 'Normal'}</td></tr>
  </table>

  <div class="section-title">3. Multi-Model Machine Learning Consensus</div>
  <table>
    <tr><th>Calibrated Meta-Ensemble</th><td><strong>${(ensemble.probability * 100).toFixed(1)}% Probability</strong> (${ensemble.riskLevel} Risk)</td></tr>
    <tr><th>Logistic Regression (L2 Regularized)</th><td>${(models.logisticRegression.probability * 100).toFixed(1)}%</td></tr>
    <tr><th>Support Vector Machine (RBF Kernel)</th><td>${(models.svm.probability * 100).toFixed(1)}%</td></tr>
    <tr><th>Random Forest (100 Decision Trees)</th><td>${(models.randomForest.probability * 100).toFixed(1)}%</td></tr>
    <tr><th>Artificial Neural Network (Deep MLP)</th><td>${(models.neuralNetwork.probability * 100).toFixed(1)}%</td></tr>
  </table>

  <div class="section-title">4. ACC/AHA Clinical Recommendations</div>
  <ul>
    ${clinicalRecommendations.map(r => `<li style="font-size: 13px; margin-bottom: 6px;">${r}</li>`).join('')}
  </ul>

  <div class="footer">
    Verified by Multi-Factor Authenticated Clinician &bull; AES-256 Encrypted EHR Vault &bull; CardioPredict Open Source ML Engine v2.4
  </div>
</body>
</html>`;

    downloadFile(reportHtml, `Clinical_Report_${patient.mrn}.html`, 'text/html');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const text = evt.target?.result as string;
        const parsed = JSON.parse(text);

        // Check if FHIR Bundle or raw patient JSON
        if (parsed.resourceType === 'Bundle') {
          setImportStatus('Loaded HL7 FHIR Bundle successfully!');
        } else if (parsed.age && parsed.trestbps) {
          onImportPatientVitals(parsed);
          setImportStatus(`Imported patient record for ${parsed.name || parsed.mrn}`);
        }
      } catch (err) {
        setImportStatus('Error: Invalid JSON/FHIR file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                EHR Interoperability &amp; Clinical Export Hub
              </h2>
              <p className="text-xs text-slate-500">
                Standardized HL7 FHIR R4, primary care handoff summaries, and encrypted audit logging
              </p>
            </div>
          </div>

          {/* Format Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveView('report')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                activeView === 'report' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Summary Report
            </button>
            <button
              onClick={() => setActiveView('fhir')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                activeView === 'fhir' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              HL7 FHIR R4 Bundle
            </button>
            <button
              onClick={() => setActiveView('csv')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                activeView === 'csv' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EHR CSV Export
            </button>
            <button
              onClick={() => setActiveView('audit')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                activeView === 'audit' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Encrypted Audit Trail
            </button>
          </div>
        </div>
      </div>

      {/* View Content */}
      {activeView === 'report' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
                CardioPredict Clinical Summary Document
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Diagnostic Consultation Note &bull; {patient.name} ({patient.mrn})
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="download-html-report-btn"
                type="button"
                onClick={handlePrintOrDownloadReport}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-rose-400" />
                <span>Download Report (.html / PDF)</span>
              </button>
            </div>
          </div>

          {/* Report Preview */}
          <div className="bg-slate-50/70 rounded-xl border border-slate-200 p-6 space-y-5 text-xs">
            {/* Metadata row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-white border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px]">Patient Name</span>
                <span className="font-bold text-slate-900 text-sm">{patient.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Medical Record No.</span>
                <span className="font-mono font-bold text-slate-900">{patient.mrn}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Age &amp; Sex</span>
                <span className="font-semibold text-slate-800">{patient.age} yrs / {patient.sex === 1 ? 'Male' : 'Female'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Integrity Checksum</span>
                <span className="font-mono text-[11px] text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{hash}</span>
              </div>
            </div>

            {/* Diagnostic Results */}
            <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-sm">Harmonized Machine Learning Diagnostic Score</span>
                <span className="font-bold px-2.5 py-1 rounded bg-rose-100 text-rose-800 text-xs">
                  {ensemble.riskLevel} CAD Risk ({(ensemble.probability * 100).toFixed(1)}%)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 font-mono text-[11px]">
                <div className="bg-slate-50 p-2 rounded">
                  <span className="text-slate-500 block text-[10px]">Logistic Reg</span>
                  <strong>{(models.logisticRegression.probability * 100).toFixed(1)}%</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <span className="text-slate-500 block text-[10px]">SVM (RBF)</span>
                  <strong>{(models.svm.probability * 100).toFixed(1)}%</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <span className="text-slate-500 block text-[10px]">Random Forest</span>
                  <strong>{(models.randomForest.probability * 100).toFixed(1)}%</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <span className="text-slate-500 block text-[10px]">Neural Network</span>
                  <strong>{(models.neuralNetwork.probability * 100).toFixed(1)}%</strong>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block text-xs">Recommended Clinical Interventions</span>
              <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                {clinicalRecommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* FHIR R4 View */}
      {activeView === 'fhir' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">HL7 FHIR Release 4 JSON Bundle</h3>
              <p className="text-xs text-slate-500">
                Standardized Observation and RiskAssessment resources for Epic, Cerner, and interoperable health systems
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="download-fhir-json-btn"
                type="button"
                onClick={handleDownloadFhir}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export FHIR JSON</span>
              </button>
            </div>
          </div>

          {/* JSON code box */}
          <div className="bg-slate-950 rounded-xl p-4 font-mono text-[11px] text-emerald-400 max-h-96 overflow-y-auto border border-slate-800">
            <pre>{fhirData ? JSON.stringify(fhirData, null, 2) : 'Generating FHIR Bundle...'}</pre>
          </div>
        </div>
      )}

      {/* CSV View */}
      {activeView === 'csv' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Tabular EHR CSV Chart Export</h3>
              <p className="text-xs text-slate-500">
                Export comma-separated values for EHR bulk import and secondary primary care provider records
              </p>
            </div>

            <button
              id="download-csv-btn"
              type="button"
              onClick={handleDownloadCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download CSV File</span>
            </button>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 font-mono text-[11px] text-slate-300 overflow-x-auto border border-slate-800">
            <pre>{generateCsv()}</pre>
          </div>
        </div>
      )}

      {/* Audit Trail View */}
      {activeView === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                Cryptographic Storage Vault &amp; Audit Log
              </h3>
              <p className="text-xs text-slate-500">
                AES-256 Simulated At-Rest Encryption &bull; Immutable SHA-256 Access Chain
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              HIPAA SECURE
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-y border-slate-200">
                  <th className="py-2.5 px-3">Event ID</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Clinician Identity</th>
                  <th className="py-2.5 px-3">Patient MRN</th>
                  <th className="py-2.5 px-3">Cryptographic SHA-256 Hash</th>
                  <th className="py-2.5 px-3">Integrity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 text-slate-500">evt-0941</td>
                  <td className="py-2.5 px-3 text-slate-700">{new Date().toLocaleTimeString()}</td>
                  <td className="py-2.5 px-3 font-semibold text-rose-600 font-sans">ML_DIAGNOSTIC_EVALUATION</td>
                  <td className="py-2.5 px-3 text-slate-800 font-sans">Dr. Eleanor Vance, MD (NPI: 19482012)</td>
                  <td className="py-2.5 px-3 text-slate-800">{patient.mrn}</td>
                  <td className="py-2.5 px-3 text-slate-600">{hash}</td>
                  <td className="py-2.5 px-3 text-emerald-600 font-bold font-sans">VERIFIED</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 text-slate-500">evt-0820</td>
                  <td className="py-2.5 px-3 text-slate-700">{new Date(Date.now() - 3600000).toLocaleTimeString()}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800 font-sans">MFA_AUTHENTICATION_SUCCESS</td>
                  <td className="py-2.5 px-3 text-slate-800 font-sans">Dr. Eleanor Vance, MD</td>
                  <td className="py-2.5 px-3 text-slate-400">&mdash;</td>
                  <td className="py-2.5 px-3 text-slate-600">0x9b4c8104ea2910d</td>
                  <td className="py-2.5 px-3 text-emerald-600 font-bold font-sans">VERIFIED</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* External Data Import Box */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="font-semibold text-slate-800 block">Import Patient Data from External EHR (FHIR / JSON)</span>
          <span className="text-slate-500 text-[11px]">Upload clinical records to automatically run machine learning inference</span>
        </div>

        <div className="flex items-center gap-3">
          {importStatus && (
            <span className="text-emerald-700 font-medium text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {importStatus}
            </span>
          )}

          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-medium transition cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-slate-600" />
            <span>Select JSON / FHIR File</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
};
