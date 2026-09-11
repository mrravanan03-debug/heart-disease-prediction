/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PatientVitals, RealtimeValidationResult } from '../types';
import { UserCheck, AlertTriangle, CheckCircle2, RotateCcw, Sparkles, ShieldCheck, HeartPulse } from 'lucide-react';

interface PatientInputFormProps {
  patient: PatientVitals;
  onChange: (updated: PatientVitals) => void;
  validation: RealtimeValidationResult;
  onSelectPreset: (presetKey: string) => void;
  onReset: () => void;
}

export const PatientInputForm: React.FC<PatientInputFormProps> = ({
  patient,
  onChange,
  validation,
  onSelectPreset,
  onReset,
}) => {
  const updateField = <K extends keyof PatientVitals>(field: K, value: PatientVitals[K]) => {
    onChange({ ...patient, [field]: value });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50/80 px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Real-Time Patient Data Input
              <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Diagnostic Validation
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Biomarkers automatically feed all 4 ML models and ensemble
            </p>
          </div>
        </div>

        {/* Validation Score Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Validation Plausibility:</span>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-bold ${validation.plausibilityScore >= 80 ? 'text-emerald-600' : validation.plausibilityScore >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                {validation.plausibilityScore}%
              </span>
              {validation.isValid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              )}
            </div>
          </div>

          <button
            id="reset-form-btn"
            type="button"
            onClick={onReset}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
            title="Reset Patient Parameters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Clinical Cases Bar */}
      <div className="bg-slate-100/60 px-5 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-slate-500 font-medium flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Load Benchmark Case:
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            id="preset-critical-btn"
            type="button"
            onClick={() => onSelectPreset('critical')}
            className="px-2.5 py-1 rounded bg-white text-rose-700 border border-rose-200 hover:bg-rose-50 text-[11px] font-medium transition cursor-pointer"
          >
            High Risk CAD (ACS)
          </button>
          <button
            id="preset-moderate-btn"
            type="button"
            onClick={() => onSelectPreset('moderate')}
            className="px-2.5 py-1 rounded bg-white text-amber-700 border border-amber-200 hover:bg-amber-50 text-[11px] font-medium transition cursor-pointer"
          >
            Moderate Risk (Metabolic)
          </button>
          <button
            id="preset-low-btn"
            type="button"
            onClick={() => onSelectPreset('low')}
            className="px-2.5 py-1 rounded bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50 text-[11px] font-medium transition cursor-pointer"
          >
            Low Risk (Healthy)
          </button>
          <button
            id="preset-geriatric-btn"
            type="button"
            onClick={() => onSelectPreset('geriatric')}
            className="px-2.5 py-1 rounded bg-white text-purple-700 border border-purple-200 hover:bg-purple-50 text-[11px] font-medium transition cursor-pointer"
          >
            Geriatric Hypertensive
          </button>
        </div>
      </div>

      {/* Patient Identification Fields */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/40 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="patient-name-input" className="block text-xs font-semibold text-slate-700 mb-1">
            Patient Full Name
          </label>
          <input
            id="patient-name-input"
            type="text"
            value={patient.name}
            onChange={e => updateField('name', e.target.value)}
            className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
          />
        </div>
        <div>
          <label htmlFor="patient-mrn-input" className="block text-xs font-semibold text-slate-700 mb-1">
            EHR Identifier (MRN)
          </label>
          <input
            id="patient-mrn-input"
            type="text"
            value={patient.mrn}
            onChange={e => updateField('mrn', e.target.value)}
            className="w-full text-xs font-mono px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
          />
        </div>
        <div>
          <label htmlFor="patient-sex-select" className="block text-xs font-semibold text-slate-700 mb-1">
            Biological Sex
          </label>
          <select
            id="patient-sex-select"
            value={patient.sex}
            onChange={e => updateField('sex', Number(e.target.value) as 0 | 1)}
            className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
          >
            <option value={1}>Male (1)</option>
            <option value={0}>Female (0)</option>
          </select>
        </div>
      </div>

      {/* Primary Biometrics & Diagnostic Controls */}
      <div className="p-5 space-y-6">
        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Age */}
          <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-lg border border-slate-150">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="patient-age-slider" className="font-semibold text-slate-800">
                Age
              </label>
              <span className="font-mono font-bold text-rose-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                {patient.age} yrs
              </span>
            </div>
            <input
              id="patient-age-slider"
              type="range"
              min={20}
              max={88}
              value={patient.age}
              onChange={e => updateField('age', Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>20</span>
              <span>Baseline: 54</span>
              <span>88</span>
            </div>
          </div>

          {/* Resting Blood Pressure */}
          <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-lg border border-slate-150">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="patient-bp-slider" className="font-semibold text-slate-800">
                Resting BP (trestbps)
              </label>
              <span className={`font-mono font-bold px-2 py-0.5 rounded border ${
                patient.trestbps >= 140 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-white text-slate-800 border-slate-200'
              }`}>
                {patient.trestbps} mmHg
              </span>
            </div>
            <input
              id="patient-bp-slider"
              type="range"
              min={85}
              max={205}
              value={patient.trestbps}
              onChange={e => updateField('trestbps', Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>Optimal: &lt;120</span>
              <span>Stage 1: 130</span>
              <span>Crisis: &gt;180</span>
            </div>
          </div>

          {/* Serum Cholesterol */}
          <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-lg border border-slate-150">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="patient-chol-slider" className="font-semibold text-slate-800">
                Serum Cholesterol (chol)
              </label>
              <span className={`font-mono font-bold px-2 py-0.5 rounded border ${
                patient.chol >= 240 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-white text-slate-800 border-slate-200'
              }`}>
                {patient.chol} mg/dL
              </span>
            </div>
            <input
              id="patient-chol-slider"
              type="range"
              min={115}
              max={450}
              value={patient.chol}
              onChange={e => updateField('chol', Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>Desirable: &lt;200</span>
              <span>Borderline: 200-239</span>
              <span>High: &ge;240</span>
            </div>
          </div>

          {/* Max Heart Rate */}
          <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-lg border border-slate-150">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="patient-hr-slider" className="font-semibold text-slate-800">
                Max Heart Rate (thalach)
              </label>
              <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                {patient.thalach} bpm
              </span>
            </div>
            <input
              id="patient-hr-slider"
              type="range"
              min={70}
              max={210}
              value={patient.thalach}
              onChange={e => updateField('thalach', Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>70</span>
              <span>Max predicted: {220 - patient.age}</span>
              <span>210</span>
            </div>
          </div>

          {/* ST Depression */}
          <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-lg border border-slate-150">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="patient-oldpeak-slider" className="font-semibold text-slate-800">
                ST Depression (oldpeak)
              </label>
              <span className={`font-mono font-bold px-2 py-0.5 rounded border ${
                patient.oldpeak >= 2.0 ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-white text-slate-800 border-slate-200'
              }`}>
                {patient.oldpeak.toFixed(1)} mm
              </span>
            </div>
            <input
              id="patient-oldpeak-slider"
              type="range"
              min={0.0}
              max={5.5}
              step={0.1}
              value={patient.oldpeak}
              onChange={e => updateField('oldpeak', parseFloat(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>0.0 (Normal)</span>
              <span>&gt;1.5 (Ischemic)</span>
              <span>5.5 (Severe)</span>
            </div>
          </div>

          {/* Major Vessels Colored */}
          <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-lg border border-slate-150">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="patient-ca-slider" className="font-semibold text-slate-800">
                Major Vessels (ca: 0-3)
              </label>
              <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                {patient.ca} vessel{patient.ca !== 1 ? 's' : ''}
              </span>
            </div>
            <input
              id="patient-ca-slider"
              type="range"
              min={0}
              max={3}
              step={1}
              value={patient.ca}
              onChange={e => updateField('ca', Number(e.target.value) as 0 | 1 | 2 | 3)}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>0 (Patent)</span>
              <span>1</span>
              <span>2</span>
              <span>3 (Severe Calcification)</span>
            </div>
          </div>
        </div>

        {/* Categorical Clinical Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
          {/* Chest Pain Type */}
          <div>
            <label htmlFor="patient-cp-select" className="block text-xs font-semibold text-slate-700 mb-1">
              Chest Pain Type (cp)
            </label>
            <select
              id="patient-cp-select"
              value={patient.cp}
              onChange={e => updateField('cp', Number(e.target.value) as 0 | 1 | 2 | 3)}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
            >
              <option value={0}>0: Typical Angina</option>
              <option value={1}>1: Atypical Angina</option>
              <option value={2}>2: Non-anginal Pain</option>
              <option value={3}>3: Asymptomatic (High Risk)</option>
            </select>
          </div>

          {/* Exercise Induced Angina */}
          <div>
            <label htmlFor="patient-exang-select" className="block text-xs font-semibold text-slate-700 mb-1">
              Exercise Induced Angina (exang)
            </label>
            <select
              id="patient-exang-select"
              value={patient.exang}
              onChange={e => updateField('exang', Number(e.target.value) as 0 | 1)}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
            >
              <option value={0}>No (0)</option>
              <option value={1}>Yes (1 - Exertional Discomfort)</option>
            </select>
          </div>

          {/* ST Segment Slope */}
          <div>
            <label htmlFor="patient-slope-select" className="block text-xs font-semibold text-slate-700 mb-1">
              Peak Exercise ST Slope
            </label>
            <select
              id="patient-slope-select"
              value={patient.slope}
              onChange={e => updateField('slope', Number(e.target.value) as 0 | 1 | 2)}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
            >
              <option value={0}>0: Upsloping (Normal)</option>
              <option value={1}>1: Flat (Equivocal)</option>
              <option value={2}>2: Downsloping (Ischemia)</option>
            </select>
          </div>

          {/* Thalassemia Defect */}
          <div>
            <label htmlFor="patient-thal-select" className="block text-xs font-semibold text-slate-700 mb-1">
              Thalassemia Status (thal)
            </label>
            <select
              id="patient-thal-select"
              value={patient.thal}
              onChange={e => updateField('thal', Number(e.target.value) as 1 | 2 | 3)}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
            >
              <option value={1}>1: Normal</option>
              <option value={2}>2: Fixed Defect (Previous Infarct)</option>
              <option value={3}>3: Reversible Defect (Active Ischemia)</option>
            </select>
          </div>

          {/* Fasting Blood Sugar */}
          <div>
            <label htmlFor="patient-fbs-select" className="block text-xs font-semibold text-slate-700 mb-1">
              Fasting Blood Sugar &gt; 120 mg/dL
            </label>
            <select
              id="patient-fbs-select"
              value={patient.fbs}
              onChange={e => updateField('fbs', Number(e.target.value) as 0 | 1)}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
            >
              <option value={0}>False (&le; 120 mg/dL)</option>
              <option value={1}>True (&gt; 120 mg/dL - Diabetic Risk)</option>
            </select>
          </div>

          {/* Resting ECG */}
          <div className="sm:col-span-2 lg:col-span-3">
            <label htmlFor="patient-restecg-select" className="block text-xs font-semibold text-slate-700 mb-1">
              Resting Electrocardiographic Results (restecg)
            </label>
            <select
              id="patient-restecg-select"
              value={patient.restecg}
              onChange={e => updateField('restecg', Number(e.target.value) as 0 | 1 | 2)}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
            >
              <option value={0}>0: Normal Resting Electrocardiogram</option>
              <option value={1}>1: Having ST-T wave abnormality (T wave inversions and/or ST elevation/depression &gt; 0.05 mV)</option>
              <option value={2}>2: Showing probable or definite left ventricular hypertrophy (Estes criteria)</option>
            </select>
          </div>
        </div>

        {/* Real-Time Clinical Validation Feedback */}
        {validation.issues.length > 0 && (
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Diagnostic Quality &amp; Plausibility Advisory ({validation.issues.length} detected):</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
              {validation.issues.map((issue, idx) => (
                <li key={idx}>
                  <span className={`font-semibold ${issue.severity === 'error' ? 'text-rose-700' : 'text-amber-800'}`}>
                    [{issue.field.toUpperCase()}]:
                  </span>{' '}
                  {issue.message}
                  {issue.suggestedAction && (
                    <span className="text-slate-500 ml-1 italic">Action: {issue.suggestedAction}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
