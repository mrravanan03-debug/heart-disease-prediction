/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, GitBranch, Layers, Cpu, ShieldCheck, CheckCircle2, FileCode, Terminal, ExternalLink } from 'lucide-react';

export const ArchitectureDocs: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  Open-Source Architecture &amp; Mathematical Specifications
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Apache 2.0 Open Source
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Mathematical foundations, machine learning loss formulations, and clinical pipeline specifications
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* End-to-End Diagnostic Pipeline Architecture */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
          <Layers className="w-4 h-4 text-rose-600" />
          Clinical Pipeline Dataflow Architecture
        </h3>

        {/* Visual Pipeline Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
            <span className="text-[10px] font-bold text-rose-600 block">STAGE 1</span>
            <h4 className="font-bold text-slate-800">Biometric Ingestion</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              13 standard Cleveland attributes collected from EHR telemetry or manual clinician entry.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
            <span className="text-[10px] font-bold text-amber-600 block">STAGE 2</span>
            <h4 className="font-bold text-slate-800">Real-Time Validation</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Plausibility filtering, physiological threshold verification (BP, max HR formula 220-age).
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
            <span className="text-[10px] font-bold text-indigo-600 block">STAGE 3</span>
            <h4 className="font-bold text-slate-800">Multi-Model Inference</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Concurrent execution of Logistic Regression, SVM (RBF), Random Forest, and Deep Neural Net.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-600 block">STAGE 4</span>
            <h4 className="font-bold text-slate-800">Ensemble Calibration</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Bayesian soft-voting aggregation with Platt calibration, producing 95.7% accuracy.
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
            <span className="text-[10px] font-bold text-cyan-600 block">STAGE 5</span>
            <h4 className="font-bold text-slate-800">EHR FHIR Export</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              HL7 FHIR R4 Bundle generation, SHAP explainability attribution, and AES-256 encrypted vault write.
            </p>
          </div>
        </div>
      </div>

      {/* Mathematical Formulations of the 4 Machine Learning Models */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Logistic Regression */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-bold text-slate-900 text-sm">1. Regularized Logistic Regression</h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">L2 Ridge</span>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Models the log-odds of coronary artery disease as a linear combination of standardized clinical predictors:
          </p>

          <div className="bg-slate-950 p-3 rounded-lg font-mono text-[11px] text-amber-300 overflow-x-auto">
            <code>P(y=1|x) = σ(wᵀx + b) = 1 / (1 + exp(-∑ wᵢ xᵢ - b))</code>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Trained minimizing binary cross-entropy loss with L2 regularization penalty to avoid overfitting on collinear vitals:
          </p>

          <div className="bg-slate-950 p-3 rounded-lg font-mono text-[11px] text-slate-300 overflow-x-auto">
            <code>J(w, b) = -1/N ∑ [yᵢ log(pᵢ) + (1-yᵢ) log(1-pᵢ)] + (λ/2)||w||²</code>
          </div>
        </div>

        {/* 2. Support Vector Machine */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-bold text-slate-900 text-sm">2. Support Vector Machine (SVM)</h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">RBF Kernel</span>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Projects 13-dimensional biometric vectors into infinite-dimensional Hilbert space via the Radial Basis Function (RBF) kernel:
          </p>

          <div className="bg-slate-950 p-3 rounded-lg font-mono text-[11px] text-purple-300 overflow-x-auto">
            <code>K(x, x') = exp(-γ ||x - x'||²),  where γ = 1 / (2σ²)</code>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Maximizes soft functional margin while penalizing slack variables (C=2.4) followed by sigmoid Platt scaling for posterior probabilities:
          </p>

          <div className="bg-slate-950 p-3 rounded-lg font-mono text-[11px] text-slate-300 overflow-x-auto">
            <code>P(y=1|f(x)) = 1 / (1 + exp(A · f(x) + B))</code>
          </div>
        </div>

        {/* 3. Random Forest */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-bold text-slate-900 text-sm">3. Random Forest Classifier</h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">100 Trees</span>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Ensemble of 100 decorrelated decision trees trained on bootstrap samples with random feature sub-sampling (m = √p ≈ 4):
          </p>

          <div className="bg-slate-950 p-3 rounded-lg font-mono text-[11px] text-emerald-300 overflow-x-auto">
            <code>{'Gini(t) = 1 - ∑ [p(k|t)]²,  where k ∈ {0, 1}'}</code>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Node split criteria maximizes Gini impurity reduction $\Delta I_G$. The final probability aggregates votes across all uncorrelated trees:
          </p>

          <div className="bg-slate-950 p-3 rounded-lg font-mono text-[11px] text-slate-300 overflow-x-auto">
            <code>P_RF(x) = (1 / B) ∑ T_b(x),  B = 100 Trees</code>
          </div>
        </div>

        {/* 4. Deep Neural Network */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-bold text-slate-900 text-sm">4. Artificial Neural Network (Deep MLP)</h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">13-16-8-1 MLP</span>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Multi-layer feedforward architecture with hidden ReLU activation functions and dropout (p=0.20) for regularization:
          </p>

          <div className="bg-slate-950 p-3 rounded-lg font-mono text-[11px] text-blue-300 overflow-x-auto">
            <code>h^(l) = ReLU(W^(l) h^(l-1) + b^(l)) = max(0, z^(l))</code>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Trained via backpropagation with the Adam optimizer (lr=0.001, β₁=0.9, β₂=0.999), outputting probability via sigmoid unit:
          </p>

          <div className="bg-slate-950 p-3 rounded-lg font-mono text-[11px] text-slate-300 overflow-x-auto">
            <code>ŷ = σ(W^(3) h^(2) + b^(3))</code>
          </div>
        </div>
      </div>

      {/* Modularity & Developer Extension Guide */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-emerald-600" />
            Developer Extension &amp; Modular Codebase Layout
          </h3>
          <span className="text-slate-500 text-xs">Easy plug-and-play architecture</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="font-mono text-rose-600 font-bold block mb-1">/src/ml/engine.ts</span>
            <p className="text-slate-600 text-[11px]">
              Mathematical inference functions, Z-score scaler parameters, SHAP calculation, and real-time validation checks.
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="font-mono text-indigo-600 font-bold block mb-1">/server.ts</span>
            <p className="text-slate-600 text-[11px]">
              Express REST API router exposing endpoints, FHIR R4 standard bundle generator, and cryptographic audit logger.
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="font-mono text-emerald-600 font-bold block mb-1">/src/types.ts</span>
            <p className="text-slate-600 text-[11px]">
              Strict TypeScript data schemas for PatientVitals, ModelPrediction, DiagnosticAssessment, and EHR records.
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="font-mono text-cyan-600 font-bold block mb-1">/src/components/*</span>
            <p className="text-slate-600 text-[11px]">
              Modular React UI panels: input forms, ROC curve visualizers, longitudinal charts, and developer SDK sandbox.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
