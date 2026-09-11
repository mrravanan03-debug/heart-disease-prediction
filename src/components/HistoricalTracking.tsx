/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PatientRecord, PatientVisitHistory, PatientVitals } from '../types';
import { LineChart, Calendar, Clock, User, ArrowUpRight, TrendingUp, TrendingDown, Stethoscope, Plus, Save, FileText } from 'lucide-react';

interface HistoricalTrackingProps {
  patients: PatientRecord[];
  selectedPatient: PatientRecord;
  onSelectPatient: (patient: PatientRecord) => void;
  onLoadVisitToLive: (vitals: PatientVitals) => void;
  onAddVisit: (patientId: string, visit: PatientVisitHistory) => void;
}

export const HistoricalTracking: React.FC<HistoricalTrackingProps> = ({
  patients,
  selectedPatient,
  onSelectPatient,
  onLoadVisitToLive,
  onAddVisit,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVisitNotes, setNewVisitNotes] = useState('');
  const [newBp, setNewBp] = useState(selectedPatient.trestbps);
  const [newChol, setNewChol] = useState(selectedPatient.chol);
  const [newOldpeak, setNewOldpeak] = useState(selectedPatient.oldpeak);

  const visits = selectedPatient.visits || [];

  // Trend calculations
  const latestVisit = visits[visits.length - 1];
  const earliestVisit = visits[0];
  const riskDelta = latestVisit && earliestVisit ? latestVisit.riskScore - earliestVisit.riskScore : 0;
  const isWorsening = riskDelta > 0.05;
  const isImproving = riskDelta < -0.05;

  const handleSaveNewVisit = () => {
    const newRisk = Math.min(0.98, Math.max(0.04, (newBp / 160) * 0.4 + (newChol / 320) * 0.3 + (newOldpeak / 3.5) * 0.3));
    const newVisit: PatientVisitHistory = {
      date: new Date().toISOString().split('T')[0],
      visitId: `ENC-${new Date().getFullYear()}-${visits.length + 1}`,
      trestbps: newBp,
      chol: newChol,
      thalach: selectedPatient.thalach,
      oldpeak: newOldpeak,
      riskScore: Number(newRisk.toFixed(2)),
      riskLevel: newRisk > 0.8 ? 'Critical' : newRisk > 0.55 ? 'High' : newRisk > 0.25 ? 'Moderate' : 'Low',
      physicianNotes: newVisitNotes || 'Routine follow-up clinical encounter and biometric re-assessment.',
    };

    onAddVisit(selectedPatient.id, newVisit);
    setShowAddModal(false);
    setNewVisitNotes('');
  };

  // SVG Trend Chart Dimensions
  const chartW = 540;
  const chartH = 180;
  const padX = 40;
  const padY = 25;
  const innerW = chartW - padX * 2;
  const innerH = chartH - padY * 2;

  // Map visit points
  const points = visits.map((v, i) => {
    const x = visits.length === 1 ? innerW / 2 + padX : padX + (i / (visits.length - 1)) * innerW;
    const y = padY + (1 - v.riskScore) * innerH;
    return { x, y, ...v };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

  return (
    <div className="space-y-6">
      {/* Patient Cohort Selector Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Longitudinal Patient Cohort &amp; Historical Trajectory
            </h2>
            <p className="text-xs text-slate-500">
              Multi-encounter clinical monitoring across electronic health records
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="patient-cohort-select" className="text-xs text-slate-600 font-medium">Select Cohort Patient:</label>
          <select
            id="patient-cohort-select"
            value={selectedPatient.id}
            onChange={e => {
              const p = patients.find(item => item.id === e.target.value);
              if (p) onSelectPatient(p);
            }}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.mrn}) — {p.age}y {p.sex === 1 ? 'M' : 'F'}
              </option>
            ))}
          </select>

          <button
            id="log-new-visit-btn"
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Encounter</span>
          </button>
        </div>
      </div>

      {/* Trajectory Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Trend Graph (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LineChart className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                CAD Probability Trajectory Over Time
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span className="text-slate-500">Longitudinal Trend:</span>
              <span className={`flex items-center gap-0.5 ${
                isWorsening ? 'text-rose-600' : isImproving ? 'text-emerald-600' : 'text-slate-700'
              }`}>
                {isWorsening && <TrendingUp className="w-4 h-4" />}
                {isImproving && <TrendingDown className="w-4 h-4" />}
                {isWorsening ? 'Progressive Risk' : isImproving ? 'Therapeutic Improvement' : 'Stable Trajectory'}
              </span>
            </div>
          </div>

          {/* SVG Risk Trajectory Chart */}
          <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-200">
            <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto font-mono text-[10px]">
              {/* Risk zone background strips */}
              <rect x={padX} y={padY} width={innerW} height={innerH * 0.20} fill="#ffe4e6" opacity="0.4" />
              <rect x={padX} y={padY + innerH * 0.20} width={innerW} height={innerH * 0.25} fill="#ffedd5" opacity="0.4" />
              <rect x={padX} y={padY + innerH * 0.45} width={innerW} height={innerH * 0.30} fill="#fef3c7" opacity="0.4" />
              <rect x={padX} y={padY + innerH * 0.75} width={innerW} height={innerH * 0.25} fill="#ecfdf5" opacity="0.4" />

              {/* Y Axis Guide Lines */}
              {[1.0, 0.8, 0.55, 0.25, 0.0].map(r => {
                const y = padY + (1 - r) * innerH;
                return (
                  <g key={r}>
                    <line x1={padX} y1={y} x2={chartW - padX} y2={y} stroke="#cbd5e1" strokeDasharray="3,3" />
                    <text x={padX - 6} y={y + 3} textAnchor="end" fill="#64748b" fontSize="9">
                      {(r * 100).toFixed(0)}%
                    </text>
                  </g>
                );
              })}

              {/* Connective Spline */}
              {points.length > 1 && (
                <path d={pathD} fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" />
              )}

              {/* Point Markers */}
              {points.map((p, i) => (
                <g key={i} className="cursor-pointer">
                  <circle cx={p.x} cy={p.y} r="5" fill="#e11d48" stroke="#ffffff" strokeWidth="2" />
                  <text x={p.x} y={p.y - 10} textAnchor="middle" fill="#0f172a" fontWeight="bold" fontSize="10">
                    {(p.riskScore * 100).toFixed(0)}%
                  </text>
                  <text x={p.x} y={chartH - 6} textAnchor="middle" fill="#64748b" fontSize="9">
                    {p.date}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Key Biomarker Shifts Across Timeline */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Resting BP Evolution</span>
              <span className="font-mono font-bold text-slate-800">
                {earliestVisit?.trestbps ?? 0} &rarr; {latestVisit?.trestbps ?? 0} mmHg
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Serum Cholesterol</span>
              <span className="font-mono font-bold text-slate-800">
                {earliestVisit?.chol ?? 0} &rarr; {latestVisit?.chol ?? 0} mg/dL
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[10px]">ST Depression (Oldpeak)</span>
              <span className="font-mono font-bold text-slate-800">
                {earliestVisit?.oldpeak ?? 0} &rarr; {latestVisit?.oldpeak ?? 0} mm
              </span>
            </div>
          </div>
        </div>

        {/* Right: Visit Encounters Timeline & Physician Notes (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Encounter History &amp; Physician Notes
              </h3>
              <p className="text-[11px] text-slate-500">{selectedPatient.name} | {selectedPatient.mrn}</p>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
              {visits.length} Encounters
            </span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {visits.slice().reverse().map((visit, idx) => (
              <div
                key={visit.visitId}
                className="bg-slate-50/70 p-3 rounded-lg border border-slate-200/80 hover:border-slate-300 transition text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{visit.date}</span>
                    <span className="font-mono text-[10px] text-slate-400">({visit.visitId})</span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    visit.riskLevel === 'Critical'
                      ? 'bg-rose-100 text-rose-800'
                      : visit.riskLevel === 'High'
                      ? 'bg-orange-100 text-orange-800'
                      : visit.riskLevel === 'Moderate'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {visit.riskLevel} ({Math.round(visit.riskScore * 100)}%)
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-slate-600 bg-white p-1.5 rounded border border-slate-150">
                  <div>BP: {visit.trestbps}</div>
                  <div>Chol: {visit.chol}</div>
                  <div>HR: {visit.thalach}</div>
                  <div>ST: {visit.oldpeak}mm</div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed italic bg-slate-100/50 p-2 rounded">
                  "{visit.physicianNotes}"
                </p>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onLoadVisitToLive({
                        ...selectedPatient,
                        trestbps: visit.trestbps,
                        chol: visit.chol,
                        thalach: visit.thalach,
                        oldpeak: visit.oldpeak,
                      });
                    }}
                    className="text-[11px] text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <span>Load Vitals to Live Model</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add New Visit Encounter Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Log Clinical Encounter</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Resting Blood Pressure (mmHg)</label>
                <input
                  type="number"
                  value={newBp}
                  onChange={e => setNewBp(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Serum Cholesterol (mg/dL)</label>
                <input
                  type="number"
                  value={newChol}
                  onChange={e => setNewChol(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ST Depression - Oldpeak (mm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newOldpeak}
                  onChange={e => setNewOldpeak(parseFloat(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Attending Physician Assessment Note</label>
                <textarea
                  rows={3}
                  value={newVisitNotes}
                  onChange={e => setNewVisitNotes(e.target.value)}
                  placeholder="Document medication adherence, symptoms, stress test tolerance..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNewVisit}
                className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to Longitudinal Chart</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
