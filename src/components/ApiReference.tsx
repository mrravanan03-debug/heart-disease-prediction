/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { downloadFile } from '../services/apiClient';
import { Code2, Terminal, Copy, Check, Download, Play, ShieldAlert, FileCode2 } from 'lucide-react';

export const ApiReference: React.FC = () => {
  const [activeLang, setActiveLang] = useState<'python' | 'javascript' | 'curl'>('python');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestApiCall = async () => {
    setIsTesting(true);
    try {
      const samplePayload = {
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
      };

      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(samplePayload),
      });

      const data = await res.json();
      setTestResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setTestResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setIsTesting(false);
    }
  };

  const pythonSdkCode = `"""
CardioPredict AI - Python Clinical SDK (v2.4.0)
Official client library for Heart Disease ML Diagnostic Engine
Supports Python 3.8+
"""

import json
from dataclasses import dataclass, asdict
from typing import Optional, Dict, Any, List
import requests

@dataclass
class PatientBiometrics:
    age: int                     # Age in years (20 - 90)
    sex: int                     # 0 = Female, 1 = Male
    cp: int                      # Chest pain type (0-3)
    trestbps: int                # Resting Blood Pressure (mmHg)
    chol: int                    # Serum Cholesterol (mg/dL)
    fbs: int                     # Fasting blood sugar > 120 (0 or 1)
    restecg: int                 # Resting ECG (0, 1, 2)
    thalach: int                 # Max heart rate (bpm)
    exang: int                   # Exercise induced angina (0 or 1)
    oldpeak: float               # ST depression (mm)
    slope: int                   # Slope of peak exercise ST segment (0-2)
    ca: int                      # Major vessels colored by fluoroscopy (0-3)
    thal: int                    # Thalassemia defect (1, 2, 3)
    name: Optional[str] = "Anonymous Patient"
    mrn: Optional[str] = "MRN-000000"

class CardioPredictClient:
    def __init__(self, base_url: str = "https://api.cardiopredict.org", api_key: Optional[str] = None):
        self.base_url = base_url.rstrip("/")
        self.headers = {
            "Content-Type": "application/json",
            "User-Agent": "CardioPredict-Python-SDK/2.4.0",
        }
        if api_key:
            self.headers["Authorization"] = f"Bearer {api_key}"

    def predict(self, patient: PatientBiometrics) -> Dict[str, Any]:
        """
        Executes real-time validation and multi-model ML diagnostic inference
        Returns:
            Dict containing Logistic Regression, SVM, Random Forest, Neural Network
            and Calibrated Ensemble predictions with SHAP feature attributions.
        """
        endpoint = f"{self.base_url}/api/predict"
        response = requests.post(endpoint, headers=self.headers, json=asdict(patient), timeout=10)
        response.raise_for_status()
        return response.json()

    def get_model_metrics(self) -> Dict[str, Any]:
        """Fetches statistical cross-validation benchmark metrics and ROC values."""
        endpoint = f"{self.base_url}/api/models/metrics"
        response = requests.get(endpoint, headers=self.headers, timeout=10)
        response.raise_for_status()
        return response.json()

    def export_fhir_bundle(self, patient: PatientBiometrics) -> Dict[str, Any]:
        """Generates HL7 FHIR Release 4 standard JSON observation bundle."""
        endpoint = f"{self.base_url}/api/fhir/observation"
        response = requests.post(endpoint, headers=self.headers, json=asdict(patient), timeout=10)
        response.raise_for_status()
        return response.json()

# Example Usage:
if __name__ == "__main__":
    client = CardioPredictClient(base_url="http://localhost:3000")
    patient = PatientBiometrics(
        age=63, sex=0, cp=3, trestbps=155, chol=294, fbs=1,
        restecg=2, thalach=118, exang=1, oldpeak=2.8, slope=2,
        ca=2, thal=3, name="Eleanor Vance", mrn="MRN-849204"
    )
    assessment = client.predict(patient)
    ensemble = assessment["ensemble"]
    print(f"CAD Risk Probability: {ensemble['probability'] * 100:.1f}%")
    print(f"Stratified Risk Category: {ensemble['riskLevel']}")
`;

  const jsSdkCode = `/**
 * CardioPredict AI - JavaScript / TypeScript SDK (v2.4.0)
 * Client library for Cardiovascular Machine Learning Diagnostic Engine
 * Compatible with Browser, Node.js, and Edge runtimes.
 */

export interface PatientBiometrics {
  age: number;
  sex: 0 | 1;
  cp: 0 | 1 | 2 | 3;
  trestbps: number;
  chol: number;
  fbs: 0 | 1;
  restecg: 0 | 1 | 2;
  thalach: number;
  exang: 0 | 1;
  oldpeak: number;
  slope: 0 | 1 | 2;
  ca: 0 | 1 | 2 | 3;
  thal: 1 | 2 | 3;
  name?: string;
  mrn?: string;
}

export class CardioPredictClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor(options?: { baseUrl?: string; apiKey?: string }) {
    this.baseUrl = (options?.baseUrl || 'http://localhost:3000').replace(/\\/+$/, '');
    this.apiKey = options?.apiKey;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(this.apiKey ? { Authorization: \`Bearer \${this.apiKey}\` } : {}),
      ...(options.headers as Record<string, string> || {}),
    };

    const res = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(\`CardioPredict API Error (\${res.status}): \${errBody}\`);
    }

    return res.json();
  }

  /**
   * Run real-time machine learning inference across all 4 models + ensemble
   */
  async predict(patient: PatientBiometrics): Promise<any> {
    return this.request('/api/predict', {
      method: 'POST',
      body: JSON.stringify(patient),
    });
  }

  /**
   * Retrieve statistical benchmarks and ROC curve coordinates
   */
  async getModelMetrics(): Promise<any> {
    return this.request('/api/models/metrics');
  }

  /**
   * Export standardized HL7 FHIR Release 4 bundle
   */
  async exportFhirBundle(patient: PatientBiometrics): Promise<any> {
    return this.request('/api/fhir/observation', {
      method: 'POST',
      body: JSON.stringify(patient),
    });
  }
}

// Example usage:
// const client = new CardioPredictClient();
// const assessment = await client.predict({ age: 63, sex: 0, cp: 3, trestbps: 155, chol: 294, ... });
// console.log(assessment.ensemble.probability);
`;

  const curlExample = `# Real-Time ML Diagnostic Prediction Request
curl -X POST http://localhost:3000/api/predict \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Eleanor Vance",
    "mrn": "MRN-849204",
    "age": 63,
    "sex": 0,
    "cp": 3,
    "trestbps": 155,
    "chol": 294,
    "fbs": 1,
    "restecg": 2,
    "thalach": 118,
    "exang": 1,
    "oldpeak": 2.8,
    "slope": 2,
    "ca": 2,
    "thal": 3
  }'`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Public RESTful API Reference &amp; Official SDKs
              </h2>
              <p className="text-xs text-slate-500">
                Production-grade developer integrations for Python, JavaScript, Node.js, and mobile EHR clients
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              OpenAPI 3.1 &bull; REST / JSON
            </span>
          </div>
        </div>
      </div>

      {/* Interactive REST API Sandbox & Endpoints */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoints List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
            Core REST Endpoints
          </h3>

          <div className="space-y-2 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-slate-900">/api/predict</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                  POST
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Executes multi-model ML inference and localized SHAP attribution.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-slate-900">/api/models/metrics</span>
                <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                  GET
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Returns cross-validation accuracy, ROC-AUC, and confusion matrices.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-slate-900">/api/fhir/observation</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                  POST
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Generates HL7 FHIR Release 4 standard RiskAssessment JSON bundle.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-slate-900">/api/patients</span>
                <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                  GET/POST
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                EHR patient cohort queries and AES-256 encrypted chart record upsert.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              id="test-api-endpoint-btn"
              type="button"
              onClick={handleTestApiCall}
              disabled={isTesting}
              className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isTesting ? 'Sending Request...' : 'Send Live Test Request (/api/predict)'}</span>
            </button>
          </div>
        </div>

        {/* Live Response Box (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 text-[11px] flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Live API Response Console
            </span>
            <span className="text-emerald-400 text-[11px]">HTTP 200 OK</span>
          </div>

          <div className="bg-slate-900/90 rounded-lg p-3 text-[11px] text-emerald-300 max-h-72 overflow-y-auto">
            <pre>
              {testResponse ||
                `// Click 'Send Live Test Request' to test /api/predict in real-time
{
  "ensemble": {
    "modelName": "Calibrated Ensemble",
    "probability": 0.8872,
    "riskLevel": "Critical",
    "confidence": 0.965,
    "processingTimeMs": 2.45
  },
  "models": {
    "logisticRegression": { "probability": 0.841, "riskLevel": "High" },
    "svm": { "probability": 0.875, "riskLevel": "Critical" },
    "randomForest": { "probability": 0.912, "riskLevel": "Critical" },
    "neuralNetwork": { "probability": 0.920, "riskLevel": "Critical" }
  },
  "validation": { "isValid": true, "plausibilityScore": 100 },
  "hash": "0xa7f920bc483ef19dc4b8e9"
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Official Developer SDKs */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Official Client Libraries &amp; SDKs</h3>
            <p className="text-xs text-slate-500">
              Complete, typed SDK implementations ready for inclusion in production environments
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              <button
                onClick={() => setActiveLang('python')}
                className={`px-3 py-1 rounded font-medium transition cursor-pointer ${
                  activeLang === 'python' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Python SDK
              </button>
              <button
                onClick={() => setActiveLang('javascript')}
                className={`px-3 py-1 rounded font-medium transition cursor-pointer ${
                  activeLang === 'javascript' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                JavaScript / TypeScript
              </button>
              <button
                onClick={() => setActiveLang('curl')}
                className={`px-3 py-1 rounded font-medium transition cursor-pointer ${
                  activeLang === 'curl' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                cURL CLI
              </button>
            </div>

            {/* Actions */}
            {activeLang === 'python' && (
              <button
                type="button"
                onClick={() => downloadFile(pythonSdkCode, 'heart_guard_sdk.py', 'text/x-python')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-rose-400" />
                <span>Download .py</span>
              </button>
            )}

            {activeLang === 'javascript' && (
              <button
                type="button"
                onClick={() => downloadFile(jsSdkCode, 'heartGuardClient.js', 'application/javascript')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Download .js</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                const codeToCopy =
                  activeLang === 'python' ? pythonSdkCode : activeLang === 'javascript' ? jsSdkCode : curlExample;
                copyToClipboard(codeToCopy, activeLang);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              {copiedKey === activeLang ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === activeLang ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-300 max-h-[420px] overflow-y-auto border border-slate-800">
          <pre>
            {activeLang === 'python' && pythonSdkCode}
            {activeLang === 'javascript' && jsSdkCode}
            {activeLang === 'curl' && curlExample}
          </pre>
        </div>
      </div>
    </div>
  );
};
