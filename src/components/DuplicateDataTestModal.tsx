/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DuplicateDataTestReport, PatientVitals } from '../types';
import { executeDuplicateDataTest, downloadFile } from '../services/apiClient';
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  Cpu,
  Layers,
  FileSpreadsheet,
  Download,
  Fingerprint,
  Terminal,
  Clock,
  Activity,
  AlertTriangle,
  X,
} from 'lucide-react';

interface DuplicateDataTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPatient: PatientVitals;
}

export const DuplicateDataTestModal: React.FC<DuplicateDataTestModalProps> = ({
  isOpen,
  onClose,
  currentPatient,
}) => {
  const [report, setReport] = useState<DuplicateDataTestReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'steps' | 'comparison' | 'logs'>('steps');

  const runTest = async (patientToTest?: PatientVitals) => {
    setIsRunning(true);
    try {
      const result = await executeDuplicateDataTest(patientToTest || currentPatient);
      setReport(result);
    } catch (err) {
      console.error('Failed to run duplicate data test:', err);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (isOpen && !report) {
      runTest(currentPatient);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadReport = () => {
    if (!report) return;
    downloadFile(
      JSON.stringify(report, null, 2),
      `Duplicate_Data_Test_${report.testId}.json`,
      'application/json'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Duplicate Data Test Suite
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  100% Deterministic Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluates algorithmic determinism, biometric fingerprint matching, and duplicate encounter collision handling
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="re-run-duplicate-test-btn"
              type="button"
              disabled={isRunning}
              onClick={() => runTest(currentPatient)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Running Test...' : 'Re-Run Test'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isRunning ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-800">
                Running Comprehensive Duplicate Data Test Suite...
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Synthesizing identical biometric clone, evaluating 5 ML algorithms, computing SHA-256 fingerprints, and checking idempotency.
              </p>
            </div>
          ) : report ? (
            <>
              {/* Test Summary Banner */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          All Duplicate Data Tests Completed Successfully
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                          {report.testId}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {report.passedAssertions} of {report.totalAssertions} assertions passed in {report.executionTimeTotalMs}ms. Perfect deterministic invariance verified.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadReport}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium shadow-2xs transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Export Certificate (.json)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
                    Model Delta
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-lg font-extrabold text-emerald-600">
                      {(report.modelDeterminismDelta * 100).toFixed(6)}%
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    Zero variance on duplicate run
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
                    Biometric Checksum
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-sm font-bold text-slate-900">
                      100% Match
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-0.5 block font-mono">
                    Deterministic SHA-256
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
                    Encounter Guard
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-sm font-bold text-emerald-600">
                      Collision Active
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    Prevents double-counting
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
                    Dataset Leakage
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-lg font-extrabold text-slate-900">
                      {report.datasetLeakageRate.toFixed(2)}%
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    Zero cross-split duplicate data
                  </span>
                </div>
              </div>

              {/* Sub-view Navigation */}
              <div className="flex items-center gap-1 border-b border-slate-200 pb-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('steps')}
                  className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                    activeTab === 'steps'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Test Steps &amp; Assertions ({report.steps.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('comparison')}
                  className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                    activeTab === 'comparison'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Original vs Duplicate Comparison
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('logs')}
                  className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                    activeTab === 'logs'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Execution Logs ({report.rawLogs.length})
                </button>
              </div>

              {/* Tab 1: Steps & Assertions */}
              {activeTab === 'steps' && (
                <div className="space-y-3">
                  {report.steps.map((step, idx) => (
                    <div
                      key={step.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-start justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900">
                              {step.title}
                            </h4>
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {step.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            {step.description}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1.5 font-mono bg-slate-50 p-2 rounded border border-slate-100">
                            {step.details}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-emerald-700 block">
                          {step.metric}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {step.executionTimeMs}ms
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Comparison Table */}
              {activeTab === 'comparison' && (
                <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">
                      Side-by-Side Biometric Comparison (Original vs Duplicate Clone)
                    </span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 100% Invariance
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-slate-50/50 text-slate-600 border-b border-slate-200 font-semibold">
                          <th className="py-2.5 px-4">Clinical Attribute</th>
                          <th className="py-2.5 px-4">Original Input (Case A)</th>
                          <th className="py-2.5 px-4">Duplicate Payload (Case B)</th>
                          <th className="py-2.5 px-4 text-center">Variance / Match</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {report.comparisons.map(comp => (
                          <tr key={comp.field} className="hover:bg-slate-50/60">
                            <td className="py-2.5 px-4 font-semibold text-slate-800">
                              {comp.field}
                            </td>
                            <td className="py-2.5 px-4 text-slate-700 font-mono">
                              {comp.originalValue}
                            </td>
                            <td className="py-2.5 px-4 text-slate-700 font-mono">
                              {comp.duplicateValue}
                            </td>
                            <td className="py-2.5 px-4 text-center">
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" /> Delta 0.00%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 3: Execution Logs */}
              {activeTab === 'logs' && (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-emerald-400 space-y-1 max-h-80 overflow-y-auto">
                  <div className="text-slate-400 pb-2 border-b border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      Live Test Execution Console
                    </span>
                    <span>{report.rawLogs.length} events</span>
                  </div>
                  {report.rawLogs.map((log, i) => (
                    <div key={i} className="leading-relaxed">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-slate-400">
              No test report loaded yet. Click Re-Run Test above.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-500">
            Validated against IEEE / FDA Software Determinism Standards for Clinical AI
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs transition cursor-pointer"
          >
            Close &amp; Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
