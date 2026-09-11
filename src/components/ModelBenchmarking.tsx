/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ModelMetricDetails } from '../types';
import { BENCHMARK_MODELS, ROC_CURVES } from '../ml/modelsData';
import { BarChart3, TrendingUp, Sliders, CheckSquare, Layers, HelpCircle, Activity } from 'lucide-react';

interface ModelBenchmarkingProps {
  onOpenDuplicateTest?: () => void;
}

export const ModelBenchmarking: React.FC<ModelBenchmarkingProps> = ({
  onOpenDuplicateTest,
}) => {
  const [selectedModelId, setSelectedModelId] = useState<string>('ensemble');
  const [visibleCurves, setVisibleCurves] = useState<Record<string, boolean>>({
    ensemble: true,
    nn: true,
    rf: true,
    svm: true,
    lr: true,
  });

  const selectedModel = BENCHMARK_MODELS.find(m => m.id === selectedModelId) || BENCHMARK_MODELS[4];

  const toggleCurve = (id: string) => {
    setVisibleCurves(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Color mapping for models
  const modelColors: Record<string, { stroke: string; label: string }> = {
    ensemble: { stroke: '#e11d48', label: 'Calibrated Ensemble (AUC = 0.978)' },
    nn: { stroke: '#2563eb', label: 'Neural Network (AUC = 0.958)' },
    rf: { stroke: '#059669', label: 'Random Forest (AUC = 0.954)' },
    svm: { stroke: '#7c3aed', label: 'Support Vector Machine (AUC = 0.932)' },
    lr: { stroke: '#d97706', label: 'Logistic Regression (AUC = 0.908)' },
  };

  // SVG coordinate transform for ROC curve
  // Width: 400, Height: 300, Padding: 40
  const svgWidth = 460;
  const svgHeight = 320;
  const pad = 45;
  const plotW = svgWidth - pad * 2;
  const plotH = svgHeight - pad * 2;

  const toSvgX = (fpr: number) => pad + fpr * plotW;
  const toSvgY = (tpr: number) => pad + (1 - tpr) * plotH;

  const makePath = (points: { fpr: number; tpr: number }[]) => {
    return points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toSvgX(p.fpr).toFixed(1)} ${toSvgY(p.tpr).toFixed(1)}`)
      .join(' ');
  };

  const cm = selectedModel.confusionMatrix;
  const total = cm.truePositive + cm.falsePositive + cm.trueNegative + cm.falseNegative;

  return (
    <div className="space-y-6">
      {/* Benchmark Summary Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
                <BarChart3 className="w-4 h-4" />
              </span>
              <h2 className="text-sm font-bold text-slate-900">
                Machine Learning Model Evaluation &amp; Statistical Benchmarking
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Rigorous 10-Fold Cross-Validation on standardized cardiovascular clinical cohort (N=1,025)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs flex-wrap">
            {onOpenDuplicateTest && (
              <button
                id="benchmark-duplicate-test-btn"
                type="button"
                onClick={onOpenDuplicateTest}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-semibold shadow-2xs transition cursor-pointer"
                title="Verify Model Determinism on Duplicate Data"
              >
                <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                <span>Duplicate Data Test (Delta: 0.00%)</span>
              </button>
            )}
            <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-mono border border-slate-200">
              Diagnostic Sensitivity: &gt;96.5%
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-mono border border-emerald-200">
              Ensemble Accuracy: 95.7%
            </span>
          </div>
        </div>

        {/* Comparison Metrics Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-y border-slate-200">
                <th className="py-2.5 px-3">Classifier Architecture</th>
                <th className="py-2.5 px-3">Accuracy</th>
                <th className="py-2.5 px-3">ROC-AUC</th>
                <th className="py-2.5 px-3">Precision (PPV)</th>
                <th className="py-2.5 px-3">Recall (Sensitivity)</th>
                <th className="py-2.5 px-3">Specificity</th>
                <th className="py-2.5 px-3">F1-Score</th>
                <th className="py-2.5 px-3">Brier Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {BENCHMARK_MODELS.map(model => {
                const isSelected = model.id === selectedModelId;
                return (
                  <tr
                    key={model.id}
                    onClick={() => setSelectedModelId(model.id)}
                    className={`cursor-pointer transition ${
                      isSelected ? 'bg-rose-50/60 font-semibold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: modelColors[model.id]?.stroke }}
                        />
                        <div>
                          <span className="text-slate-900">{model.name}</span>
                          <p className="text-[10px] text-slate-600 font-normal">{model.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-800">
                      <span className={model.id === 'ensemble' ? 'text-rose-600 font-bold' : ''}>
                        {model.accuracy.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-800">
                      <span className={model.id === 'ensemble' ? 'text-rose-600 font-bold' : ''}>
                        {model.rocAuc.toFixed(3)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-800">{model.precision.toFixed(1)}%</td>
                    <td className="py-2.5 px-3 font-mono text-slate-800">{model.recall.toFixed(1)}%</td>
                    <td className="py-2.5 px-3 font-mono text-slate-800">{model.specificity.toFixed(1)}%</td>
                    <td className="py-2.5 px-3 font-mono text-slate-800">{model.f1Score.toFixed(1)}%</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{model.brierScore.toFixed(3)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive ROC Curve & Confusion Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Multi-Model ROC Curves (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Interactive ROC Curve (Receiver Operating Characteristic)
              </h3>
            </div>
            <span className="text-[11px] text-slate-600">Sensitivity vs 1 - Specificity</span>
          </div>

          {/* SVG ROC Plot */}
          <div className="bg-slate-50/70 rounded-lg p-2 border border-slate-200 flex justify-center">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full max-w-lg h-auto font-mono text-[10px]">
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1.0].map(val => (
                <g key={val}>
                  {/* Horizontal grid line */}
                  <line
                    x1={pad}
                    y1={toSvgY(val)}
                    x2={svgWidth - pad}
                    y2={toSvgY(val)}
                    stroke="#e2e8f0"
                    strokeDasharray="3,3"
                  />
                  {/* Vertical grid line */}
                  <line
                    x1={toSvgX(val)}
                    y1={pad}
                    x2={toSvgX(val)}
                    y2={svgHeight - pad}
                    stroke="#e2e8f0"
                    strokeDasharray="3,3"
                  />
                  {/* Y-axis labels */}
                  <text x={pad - 8} y={toSvgY(val) + 3} textAnchor="end" fill="#64748b">
                    {val.toFixed(2)}
                  </text>
                  {/* X-axis labels */}
                  <text x={toSvgX(val)} y={svgHeight - pad + 15} textAnchor="middle" fill="#64748b">
                    {val.toFixed(2)}
                  </text>
                </g>
              ))}

              {/* Diagonal Chance Line (AUC = 0.5) */}
              <line
                x1={toSvgX(0)}
                y1={toSvgY(0)}
                x2={toSvgX(1)}
                y2={toSvgY(1)}
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />

              {/* ROC Model Curves */}
              {Object.entries(ROC_CURVES).map(([key, points]) => {
                if (!visibleCurves[key]) return null;
                const strokeColor = modelColors[key]?.stroke || '#000';
                const isEnsemble = key === 'ensemble';
                return (
                  <path
                    key={key}
                    d={makePath(points)}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isEnsemble ? 3 : 1.8}
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* Axis Titles */}
              <text
                x={svgWidth / 2}
                y={svgHeight - 8}
                textAnchor="middle"
                fill="#334155"
                className="font-sans font-semibold text-[11px]"
              >
                False Positive Rate (1 - Specificity)
              </text>
              <text
                x={-svgHeight / 2}
                y={15}
                transform="rotate(-90)"
                textAnchor="middle"
                fill="#334155"
                className="font-sans font-semibold text-[11px]"
              >
                True Positive Rate (Sensitivity)
              </text>
            </svg>
          </div>

          {/* Curve Toggle Controls */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-500 font-medium">Toggle Curves:</span>
            {BENCHMARK_MODELS.map(m => {
              const isVisible = visibleCurves[m.id];
              const color = modelColors[m.id]?.stroke;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggleCurve(m.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-medium transition cursor-pointer ${
                    isVisible
                      ? 'bg-white text-slate-800 border-slate-300 shadow-2xs'
                      : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span>{m.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Confusion Matrix & Hyperparameters for Selected Model (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Confusion Matrix &amp; Error Analysis
              </h3>
              <p className="text-[11px] text-slate-500">{selectedModel.name}</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              N = {total} Test Cases
            </span>
          </div>

          {/* 2x2 Matrix */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              {/* True Positive */}
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
                <span className="text-[10px] font-bold text-emerald-800 block">TRUE POSITIVE (TP)</span>
                <span className="text-2xl font-extrabold font-mono text-emerald-700 block my-1">
                  {cm.truePositive}
                </span>
                <span className="text-[10px] text-emerald-600">Correct CAD Diagnosis</span>
              </div>

              {/* False Positive (Type I Error) */}
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                <span className="text-[10px] font-bold text-amber-800 block">FALSE POSITIVE (FP)</span>
                <span className="text-2xl font-extrabold font-mono text-amber-700 block my-1">
                  {cm.falsePositive}
                </span>
                <span className="text-[10px] text-amber-600">Type I Error (False Alarm)</span>
              </div>

              {/* False Negative (Type II Error - Critical) */}
              <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg">
                <span className="text-[10px] font-bold text-rose-800 block">FALSE NEGATIVE (FN)</span>
                <span className="text-2xl font-extrabold font-mono text-rose-700 block my-1">
                  {cm.falseNegative}
                </span>
                <span className="text-[10px] text-rose-600">Type II Error (Missed CAD)</span>
              </div>

              {/* True Negative */}
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
                <span className="text-[10px] font-bold text-emerald-800 block">TRUE NEGATIVE (TN)</span>
                <span className="text-2xl font-extrabold font-mono text-emerald-700 block my-1">
                  {cm.trueNegative}
                </span>
                <span className="text-[10px] text-emerald-600">Correct Healthy Patient</span>
              </div>
            </div>

            {/* Diagnostic Reliability Ratios */}
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-700 space-y-1">
              <div className="flex justify-between">
                <span>Clinical Diagnostic Sensitivity (TP / Actual Positive):</span>
                <span className="font-mono font-bold text-slate-900">
                  {((cm.truePositive / (cm.truePositive + cm.falseNegative)) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Positive Predictive Value (TP / Predicted Positive):</span>
                <span className="font-mono font-bold text-slate-900">
                  {((cm.truePositive / (cm.truePositive + cm.falsePositive)) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>False Omission Rate (FN / Predicted Negative):</span>
                <span className="font-mono font-bold text-rose-600">
                  {((cm.falseNegative / (cm.trueNegative + cm.falseNegative)) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Hyperparameters Details */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              Tuned Hyperparameter Configuration
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {Object.entries(selectedModel.hyperparameters).map(([key, val]) => (
                <div key={key} className="bg-slate-50 p-1.5 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">{key}</span>
                  <span className="font-mono font-semibold text-slate-800">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
