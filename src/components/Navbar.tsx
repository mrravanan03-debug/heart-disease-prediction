/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, ShieldCheck, ShieldAlert, KeyRound, Database, FileText, BarChart3, LineChart, Code2, BookOpen, Stethoscope, Sparkles, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { MfaAuthState } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mfaState: MfaAuthState;
  onOpenMfaModal: () => void;
  viewMode: 'simple' | 'advanced';
  setViewMode: (mode: 'simple' | 'advanced') => void;
  onOpenDuplicateTest?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  mfaState,
  onOpenMfaModal,
  viewMode,
  setViewMode,
  onOpenDuplicateTest,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Diagnostic Assessment', icon: Activity },
    { id: 'benchmarks', label: 'ML Models & ROC Curves', icon: BarChart3 },
    { id: 'trends', label: 'Patient History & Trends', icon: LineChart },
    { id: 'ehr', label: 'EHR Export & Reports', icon: FileText },
    { id: 'api', label: 'REST API & SDKs', icon: Code2 },
    { id: 'docs', label: 'Architecture & Docs', icon: BookOpen },
  ];

  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-40">
      {/* Top utility bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-700/50 text-emerald-400 px-2.5 py-1 rounded">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold tracking-wide">CLINICAL ML ENGINE v2.4</span>
            <span className="text-slate-400 text-[10px]">| ACC/AHA Compliant</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-slate-400 bg-slate-800/60 px-2 py-1 rounded border border-slate-700/50">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Encrypted Vault: AES-256 Enabled</span>
          </div>

          {onOpenDuplicateTest && (
            <button
              id="navbar-duplicate-data-test-btn"
              type="button"
              onClick={onOpenDuplicateTest}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-600/40 font-semibold transition cursor-pointer"
              title="Run Duplicate Data Test & Verify Model Invariance"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Duplicate Data Test (100% Deterministic)</span>
            </button>
          )}
        </div>

        {/* Clinician Profile & MFA Status */}
        <div className="flex items-center gap-3 mt-1 sm:mt-0">
          <button
            id="mfa-auth-toggle-btn"
            onClick={onOpenMfaModal}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition border cursor-pointer ${
              mfaState.isAuthenticated
                ? 'bg-emerald-900/30 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900/50'
                : 'bg-amber-900/30 text-amber-300 border-amber-600/40 hover:bg-amber-900/50'
            }`}
          >
            {mfaState.isAuthenticated ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span className="font-medium">
              {mfaState.isAuthenticated ? 'MFA Verified (TOTP)' : 'MFA Required'}
            </span>
          </button>

          <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700/70 text-slate-300">
            <Stethoscope className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-medium">{mfaState.clinicianName}</span>
            <span className="text-slate-400 text-[10px] hidden sm:inline">NPI: {mfaState.clinicianNpi}</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center shadow-sm shadow-rose-900/40 text-white">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                CardioPredict<span className="text-rose-400">AI</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Diagnostic Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Multi-Model Cardiovascular Diagnostic Decision Support System
            </p>
          </div>
        </div>

        {/* View Mode Toggle & Tabs */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Simple vs Advanced Toggle */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              id="toggle-mode-simple-btn"
              type="button"
              onClick={() => setViewMode('simple')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                viewMode === 'simple'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Simple Mode (Best Algorithm)</span>
            </button>
            <button
              id="toggle-mode-advanced-btn"
              type="button"
              onClick={() => setViewMode('advanced')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                viewMode === 'advanced'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Advanced Clinical Tools</span>
            </button>
          </div>

          {/* Tab Navigation shown when in Advanced mode or as submenu */}
          {viewMode === 'advanced' && (
            <nav className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`nav-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition cursor-pointer ${
                      isActive
                        ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};
