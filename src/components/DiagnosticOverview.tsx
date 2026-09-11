/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DiagnosticAssessment, ModelPrediction, RiskLevel } from '../types';
import { Activity, Cpu, ShieldCheck, CheckCircle2, AlertOctagon, Layers, Clock, Zap } from 'lucide-react';

interface DiagnosticOverviewProps {
  assessment: DiagnosticAssessment;
  onSaveToChart: () => void;
  isSaving: boolean;
  onOpenDuplicateTest?: () => void;
}

export const DiagnosticOverview: React.FC<DiagnosticOverviewProps> = ({
  assessment,
  onSaveToChart,
  isSaving,
  onOpenDuplicateTest,
}) => {
  const { ensemble, models } = assessment;

  // Gauge calculation
  const prob = ensemble.probability;
  const percentage = Math.round(prob * 100);

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'Critical':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          border: 'border-rose-200',
          badge: 'bg-rose-600 text-white',
          bar: 'bg-rose-600',
          glow: 'shadow-rose-100',
        };
      case 'High':
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-700',
          border: 'border-orange-200',
          badge: 'bg-orange-600 text-white',
          bar: 'bg-orange-600',
          glow: 'shadow-orange-100',
        };
      case 'Moderate':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          badge: 'bg-amber-600 text-white',
          bar: 'bg-amber-500',
          glow: 'shadow-amber-100',
        };
      case 'Low':
      default:
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          badge: 'bg-emerald-600 text-white',
          bar: 'bg-emerald-500',
          glow: 'shadow-emerald-100',
        };
    }
  };

  const riskStyle = getRiskColor(ensemble.riskLevel);

  // Model agreement count
  const individualModels = [
    models.logisticRegression,
    models.svm,
    models.randomForest,
    models.neuralNetwork,
  ].filter(Boolean);

  const positiveVotes = individualModels.filter(m => m.prediction === 1).length;
  const agreementRatio = `${positiveVotes}/${individualModels.length}`;
  const isHighConsensus = positiveVotes === 0 || positiveVotes === individualModels.length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Top Banner */}
      <div className="bg-slate-50/80 px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
            <Activity className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Diagnostic Assessment &amp; Model Consensus
            </h2>
            <p className="text-xs text-slate-500">
              Harmonized multi-model clinical inference pipeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenDuplicateTest && (
            <button
              id="diagnostic-duplicate-test-btn"
              type="button"
              onClick={onOpenDuplicateTest}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-semibold shadow-2xs transition cursor-pointer"
              title="Test with Duplicate Data (100% Deterministic)"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Duplicate Data Test</span>
            </button>
          )}

          <button
            id="save-chart-btn"
            type="button"
            onClick={onSaveToChart}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isSaving ? 'Encrypting & Saving...' : 'Save Encounter to Chart'}</span>
          </button>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Ensemble Master Gauge (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50/50 to-white">
          <div>
            <div className="flex items-center justify-between flex-wrap gap-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-rose-600" />
                Best Algorithm: Calibrated Ensemble (95.7% Acc)
              </span>
              <div className="flex items-center gap-1.5">
                {assessment.isDuplicate && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                    Duplicate Ingestion Verified
                  </span>
                )}
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${riskStyle.badge}`}>
                  {ensemble.riskLevel} Risk
                </span>
              </div>
            </div>

            {/* Radial Percentage Visualizer */}
            <div className="my-6 text-center">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-40 h-40 transform -rotate-90">
                  {/* Background Track */}
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    stroke="#e2e8f0"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  {/* Active Progress Arc */}
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    stroke={
                      ensemble.riskLevel === 'Critical'
                        ? '#e11d48'
                        : ensemble.riskLevel === 'High'
                        ? '#ea580c'
                        : ensemble.riskLevel === 'Moderate'
                        ? '#f59e0b'
                        : '#10b981'
                    }
                    strokeWidth="12"
                    strokeDasharray={427}
                    strokeDashoffset={427 - (427 * percentage) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-500 ease-out"
                  />
                </svg>

                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-extrabold tracking-tight text-slate-900 font-mono">
                    {percentage}%
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Disease Prob.
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                    p = {prob.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Range Spectrum */}
              <div className="w-full mt-4 max-w-xs mx-auto">
                <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden flex">
                  <div className="w-1/4 bg-emerald-500" title="Low Risk (<25%)" />
                  <div className="w-1/4 bg-amber-400" title="Moderate Risk (25-55%)" />
                  <div className="w-1/4 bg-orange-500" title="High Risk (55-80%)" />
                  <div className="w-1/4 bg-rose-600" title="Critical Risk (>80%)" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-600 mt-1 font-mono">
                  <span>0%</span>
                  <span>25%</span>
                  <span>55%</span>
                  <span>80%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Diagnostic Consensus Metadata */}
          <div className="space-y-2 pt-3 border-t border-slate-200 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Model Concordance:</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                {isHighConsensus ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <AlertOctagon className="w-3.5 h-3.5 text-amber-600" />
                )}
                {positiveVotes} of 4 Predict CAD ({isHighConsensus ? 'High Agreement' : 'Borderline Split'})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Diagnostic Confidence:</span>
              <span className="font-mono font-semibold text-slate-800">
                {(ensemble.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Inference Latency:</span>
              <span className="font-mono text-slate-600 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500" />
                {ensemble.processingTimeMs} ms
              </span>
            </div>
          </div>
        </div>

        {/* Right: The 4 Individual Classifiers (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 pb-1">
            <span className="font-bold text-slate-700 uppercase tracking-wide">
              Constituent Machine Learning Classifiers
            </span>
            <span>Pre-trained on Cleveland &amp; Framingham Cohorts</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Logistic Regression */}
            {models.logisticRegression && (
              <ModelCard
                model={models.logisticRegression}
                tag="Linear / L2 Reg"
                formula="z = w^T x + b"
              />
            )}

            {/* 2. Support Vector Machine */}
            {models.svm && (
              <ModelCard
                model={models.svm}
                tag="Nonlinear RBF"
                formula="K(x,x') = exp(-γ||x-x'||²)"
              />
            )}

            {/* 3. Random Forest */}
            {models.randomForest && (
              <ModelCard
                model={models.randomForest}
                tag="Bagged 100 Trees"
                formula="Gini = 1 - ∑ p_i²"
              />
            )}

            {/* 4. Artificial Neural Network */}
            {models.neuralNetwork && (
              <ModelCard
                model={models.neuralNetwork}
                tag="Deep MLP (13-16-8-1)"
                formula="a^(l) = σ(W a + b)"
              />
            )}
          </div>

          {/* Model Weights Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold text-slate-700">Ensemble Weight Distribution:</span>
            <div className="flex items-center gap-3 font-mono">
              <span className="text-slate-700">RF: <strong>32%</strong></span>
              <span className="text-slate-700">ANN: <strong>32%</strong></span>
              <span className="text-slate-700">SVM: <strong>22%</strong></span>
              <span className="text-slate-700">LR: <strong>14%</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ModelCardProps {
  model: ModelPrediction;
  tag: string;
  formula: string;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, tag, formula }) => {
  const prob = Math.round(model.probability * 100);
  const isDisease = model.prediction === 1;

  return (
    <div className="bg-slate-50/60 rounded-lg p-3.5 border border-slate-200/80 hover:border-slate-300 transition shadow-2xs space-y-2.5">
      <div className="flex items-start justify-between gap-1">
        <div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-slate-600" />
            <h4 className="text-xs font-bold text-slate-900">{model.modelName}</h4>
          </div>
          <p className="text-[10px] text-slate-600 font-mono mt-0.5">{formula}</p>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
          {tag}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <span className="text-xl font-bold font-mono text-slate-900">{prob}%</span>
          <span className="text-[10px] text-slate-600 ml-1">prob</span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
          isDisease ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
        }`}>
          {isDisease ? 'CAD POSITIVE' : 'CAD NEGATIVE'}
        </span>
      </div>

      {/* Probability Bar */}
      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${isDisease ? 'bg-rose-600' : 'bg-emerald-500'}`}
          style={{ width: `${prob}%` }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-slate-600 pt-0.5">
        <span>Conf: {(model.confidence * 100).toFixed(0)}%</span>
        <span>{model.processingTimeMs} ms</span>
      </div>
    </div>
  );
};
