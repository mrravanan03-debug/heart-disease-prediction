/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DiagnosticAssessment } from '../types';
import { BarChart2, TrendingUp, TrendingDown, Minus, Stethoscope, Sparkles, AlertCircle, FileCheck, CheckCircle2 } from 'lucide-react';
import { generateClinicalAiSummary } from '../services/apiClient';

interface RiskFactorAnalysisProps {
  assessment: DiagnosticAssessment;
}

export const RiskFactorAnalysis: React.FC<RiskFactorAnalysisProps> = ({ assessment }) => {
  const [aiNote, setAiNote] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiProvider, setAiProvider] = useState<string | null>(null);

  const { featureAttributions, clinicalRecommendations, patient } = assessment;

  // Max absolute SHAP value for scaling bars
  const maxAbsShap = Math.max(...featureAttributions.map(f => Math.abs(f.shapValue)), 0.05);

  const handleGenerateAiNote = async () => {
    setIsGeneratingAi(true);
    const result = await generateClinicalAiSummary(patient, assessment);
    setAiNote(result.summary);
    setAiProvider(result.provider);
    setIsGeneratingAi(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50/80 px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Risk Factor Attribution &amp; Explainability (SHAP Analysis)
            </h2>
            <p className="text-xs text-slate-500">
              Quantifies biomarker contributions to individual patient CAD probability
            </p>
          </div>
        </div>

        <button
          id="generate-clinical-note-btn"
          type="button"
          onClick={handleGenerateAiNote}
          disabled={isGeneratingAi}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-xs transition cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{isGeneratingAi ? 'Synthesizing Note...' : 'Generate Clinical Consultation Note'}</span>
        </button>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: SHAP Local Feature Attribution Table & Visual Bars (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
            <span className="font-semibold text-slate-700">Predictor Biomarker</span>
            <div className="flex items-center gap-4 text-slate-500 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Increases Risk
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Decreases Risk
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            {featureAttributions.map((item, idx) => {
              const absVal = Math.abs(item.shapValue);
              const barWidth = Math.min(100, Math.round((absVal / maxAbsShap) * 100));
              const isIncrease = item.impactDirection === 'increases_risk';
              const isDecrease = item.impactDirection === 'decreases_risk';

              return (
                <div
                  key={idx}
                  className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-200/70 hover:border-slate-300 transition text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{item.label}</span>
                      <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-white text-slate-600 border border-slate-200">
                        {item.patientValue}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-600 hidden sm:inline">
                        Ref: {item.normalRange}
                      </span>
                      <span className={`font-mono text-[11px] font-bold flex items-center gap-0.5 ${
                        isIncrease ? 'text-rose-600' : isDecrease ? 'text-emerald-600' : 'text-slate-500'
                      }`}>
                        {isIncrease && <TrendingUp className="w-3 h-3" />}
                        {isDecrease && <TrendingDown className="w-3 h-3" />}
                        {!isIncrease && !isDecrease && <Minus className="w-3 h-3" />}
                        {item.shapValue > 0 ? `+${item.shapValue}` : item.shapValue}
                      </span>
                    </div>
                  </div>

                  {/* Visual Diverging Bar */}
                  <div className="relative h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isIncrease ? 'bg-rose-500' : isDecrease ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Clinical Recommendations & AI Note (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* AI Clinical Note Panel (if generated) */}
          {aiNote && (
            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Consultation Summary
                </span>
                <span className="text-[10px] text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 font-mono">
                  {aiProvider}
                </span>
              </div>
              <div className="text-slate-700 space-y-2 whitespace-pre-line leading-relaxed text-[11px] bg-white p-3 rounded-lg border border-indigo-100 shadow-2xs">
                {aiNote}
              </div>
            </div>
          )}

          {/* ACC/AHA Guideline Recommendations */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                ACC/AHA Guideline-Directed Action Plan
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              {clinicalRecommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-slate-700 text-[11px] leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>

            {/* Quality & Safety Disclaimers */}
            <div className="p-2.5 rounded-lg bg-slate-150 text-[10px] text-slate-500 border border-slate-200/60 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>
                Machine learning outputs represent diagnostic probabilities designed to assist qualified medical practitioners, not replace comprehensive clinical judgment.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
