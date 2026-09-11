/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Lock, Smartphone, KeyRound, AlertCircle, X, CheckCircle2, ShieldAlert } from 'lucide-react';
import { MfaAuthState } from '../types';
import { verifyMfaToken } from '../services/apiClient';

interface MfaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mfaState: MfaAuthState;
  onUpdateAuth: (state: MfaAuthState) => void;
}

export const MfaModal: React.FC<MfaModalProps> = ({ isOpen, onClose, mfaState, onUpdateAuth }) => {
  const [code, setCode] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'TOTP_AUTHENTICATOR' | 'HARDWARE_KEY' | 'SMS_SECURE'>('TOTP_AUTHENTICATOR');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const handleVerify = async (tokenToVerify?: string) => {
    const finalCode = tokenToVerify || code;
    if (!finalCode || finalCode.length < 6) {
      setError('Please enter a valid 6-digit authentication code.');
      return;
    }

    setLoading(true);
    setError(null);

    const verified = await verifyMfaToken(finalCode, mfaState.clinicianName);
    setLoading(false);

    if (verified) {
      setSuccessNotice(true);
      setTimeout(() => {
        onUpdateAuth({
          ...mfaState,
          isAuthenticated: true,
          mfaMethod: selectedMethod,
          sessionExpiry: Date.now() + 8 * 3600 * 1000,
        });
        setSuccessNotice(false);
        onClose();
      }, 700);
    } else {
      setError('Invalid authentication code. Please check your authenticator application or use Demo Token: 849201.');
    }
  };

  const handleQuickDemoFill = () => {
    setCode('849201');
    handleVerify('849201');
  };

  const handleEmergencyOverride = () => {
    handleVerify('EMERGENCY_OVERRIDE');
  };

  const handleSignOut = () => {
    onUpdateAuth({
      ...mfaState,
      isAuthenticated: false,
    });
    setCode('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-md w-full overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-850 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-950 border border-rose-600/40 text-rose-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">Multi-Factor Authentication (MFA)</h3>
              <p className="text-[11px] text-slate-400">HIPAA Security Rule §164.312(a)(2)(i)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {successNotice ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <p className="text-base font-semibold text-white">MFA Verified Successfully</p>
              <p className="text-xs text-slate-400">Encrypted clinical session established for 8 hours.</p>
            </div>
          ) : (
            <>
              {/* Clinician Card */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-3 flex items-center justify-between text-xs">
                <div>
                  <p className="text-slate-400">Clinician Identity</p>
                  <p className="font-semibold text-slate-200 text-sm">{mfaState.clinicianName}</p>
                  <p className="text-slate-400 text-[11px]">{mfaState.clinicianRole} | NPI: {mfaState.clinicianNpi}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                    mfaState.isAuthenticated
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : 'bg-amber-950 text-amber-300 border border-amber-700'
                  }`}>
                    {mfaState.isAuthenticated ? 'AUTHENTICATED' : 'UNVERIFIED'}
                  </span>
                </div>
              </div>

              {/* Method Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Authentication Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('TOTP_AUTHENTICATOR')}
                    className={`p-2.5 rounded-lg border text-xs text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      selectedMethod === 'TOTP_AUTHENTICATOR'
                        ? 'bg-rose-950/40 border-rose-500 text-white font-medium'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-rose-400" />
                    <span>TOTP App</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('HARDWARE_KEY')}
                    className={`p-2.5 rounded-lg border text-xs text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      selectedMethod === 'HARDWARE_KEY'
                        ? 'bg-rose-950/40 border-rose-500 text-white font-medium'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <KeyRound className="w-4 h-4 text-cyan-400" />
                    <span>FIDO2 Key</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('SMS_SECURE')}
                    className={`p-2.5 rounded-lg border text-xs text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      selectedMethod === 'SMS_SECURE'
                        ? 'bg-rose-950/40 border-rose-500 text-white font-medium'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>SMS Token</span>
                  </button>
                </div>
              </div>

              {/* Code Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="mfa-token-input" className="text-xs font-medium text-slate-300">
                    6-Digit Verification Token
                  </label>
                  <button
                    type="button"
                    onClick={handleQuickDemoFill}
                    className="text-[11px] text-rose-400 hover:text-rose-300 underline cursor-pointer"
                  >
                    Use Demo Code (849201)
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="mfa-token-input"
                    type="text"
                    maxLength={8}
                    value={code}
                    onChange={e => setCode(e.target.value.replace(/\s+/g, ''))}
                    placeholder="e.g. 849201"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-center text-lg tracking-[0.25em] font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/60 p-2 rounded">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Security Details */}
              <div className="bg-slate-950/60 border border-slate-800 rounded p-2.5 text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Cryptographic Vault:</span>
                  <span className="font-mono text-slate-300">AES-256-GCM / SHA-256</span>
                </div>
                <div className="flex justify-between">
                  <span>EHR Audit Trail:</span>
                  <span className="font-mono text-slate-300">Active Logging</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleVerify()}
                  disabled={loading}
                  className="flex-1 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-900 text-white font-medium py-2 px-4 rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{loading ? 'Verifying Token...' : 'Verify MFA Token'}</span>
                </button>

                {mfaState.isAuthenticated && (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded-lg transition border border-slate-700 cursor-pointer"
                  >
                    De-authenticate
                  </button>
                )}
              </div>

              {/* Emergency Override */}
              <div className="text-center pt-1 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleEmergencyOverride}
                  className="text-[11px] text-slate-500 hover:text-slate-400 flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <ShieldAlert className="w-3 h-3" />
                  <span>Emergency Clinician Override (Protocol §2.9)</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
