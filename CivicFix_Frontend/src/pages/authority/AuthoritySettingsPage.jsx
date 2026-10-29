import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Settings, Sliders, Shield, Bell, Lock, CheckCircle2, AlertCircle, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthoritySettingsPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [triageThreshold, setTriageThreshold] = useState(80);
  const [autoRouting, setAutoRouting] = useState(true);
  const [duplicateStrictness, setDuplicateStrictness] = useState('Medium');
  const [saveMessage, setSaveMessage] = useState(false);

  const [pwdState, setPwdState] = useState({
    current: '',
    newPass: '',
    confirm: ''
  });
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState(false);

  const handleSaveOperational = (e) => {
    e.preventDefault();
    setSaveMessage(true);
    setTimeout(() => setSaveMessage(false), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess(false);

    if (!pwdState.current) return setPwdError('Please enter current departmental passkey.');
    if (pwdState.newPass.length < 6) return setPwdError('New passkey must be at least 6 characters.');
    if (pwdState.newPass !== pwdState.confirm) return setPwdError('Passkeys do not match.');

    setPwdSuccess(true);
    setPwdState({ current: '', newPass: '', confirm: '' });
    setTimeout(() => setPwdSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="py-8 bg-civic-sand-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-civic-teal-700">
            Operations Preferences
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-civic-navy-950 mt-1">
            Authority Operations Configuration
          </h1>
          <p className="text-xs sm:text-sm text-civic-charcoal-600 mt-0.5">
            Configure triage thresholds, duplicate scanning strictness, and command passkeys.
          </p>
        </div>

        {saveMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Operational settings saved for this prototype command session.</span>
          </div>
        )}

        {/* 1. Triage Rule Tuning */}
        <div className="bg-white rounded-2xl p-6 border border-civic-navy-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-civic-navy-100 pb-3">
            <Sliders className="w-4 h-4 text-civic-teal-700" />
            <h2 className="text-sm font-bold text-civic-navy-950 uppercase tracking-wide">
              Automated Triage Rules & Hazard Thresholds
            </h2>
          </div>

          <form onSubmit={handleSaveOperational} className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-civic-navy-900 uppercase tracking-wider">
                  Critical Hazard Triage Score Threshold ({triageThreshold}/100)
                </label>
                <span className="font-mono text-rose-700 font-bold">Priority: Critical Queue</span>
              </div>
              <input
                type="range"
                min="60"
                max="95"
                value={triageThreshold}
                onChange={(e) => setTriageThreshold(Number(e.target.value))}
                className="w-full accent-civic-teal-600"
              />
              <span className="text-[11px] text-civic-charcoal-500 mt-1 block">
                Complaints with rule-based risk score exceeding {triageThreshold} trigger immediate red priority badges on the desk.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                  Duplicate Scanning Sensitivity
                </label>
                <select
                  value={duplicateStrictness}
                  onChange={(e) => setDuplicateStrictness(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-civic-navy-200 bg-white"
                >
                  <option value="Low">Relaxed (70% token match)</option>
                  <option value="Medium">Standard (55% token + 150m proximity)</option>
                  <option value="High">Strict (40% match + 300m radius)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                  Department Auto-Routing
                </label>
                <select
                  value={autoRouting ? 'yes' : 'no'}
                  onChange={(e) => setAutoRouting(e.target.value === 'yes')}
                  className="w-full text-xs p-2.5 rounded-lg border border-civic-navy-200 bg-white"
                >
                  <option value="yes">Enabled (Route by Civic Category)</option>
                  <option value="no">Manual Triage Allocation</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-civic-navy-950 hover:bg-civic-navy-900 transition-colors shadow-xs"
              >
                Apply Operational Rules
              </button>
            </div>
          </form>
        </div>

        {/* 2. Authority Passkey Security */}
        <div className="bg-white rounded-2xl p-6 border border-civic-navy-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-civic-navy-100 pb-3">
            <Lock className="w-4 h-4 text-civic-teal-700" />
            <h2 className="text-sm font-bold text-civic-navy-950 uppercase tracking-wide">
              Official Passkey Rotation
            </h2>
          </div>

          {pwdError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{pwdError}</span>
            </div>
          )}

          {pwdSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Departmental passkey updated for active session.</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                Current Passkey
              </label>
              <input
                type="password"
                value={pwdState.current}
                onChange={(e) => setPwdState((p) => ({ ...p, current: e.target.value }))}
                placeholder="••••••••"
                className="w-full text-xs p-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-navy-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                  New Official Passkey
                </label>
                <input
                  type="password"
                  value={pwdState.newPass}
                  onChange={(e) => setPwdState((p) => ({ ...p, newPass: e.target.value }))}
                  placeholder="Min 6 chars"
                  className="w-full text-xs p-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-navy-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                  Confirm Passkey
                </label>
                <input
                  type="password"
                  value={pwdState.confirm}
                  onChange={(e) => setPwdState((p) => ({ ...p, confirm: e.target.value }))}
                  placeholder="Repeat passkey"
                  className="w-full text-xs p-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-navy-800"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-civic-navy-950 hover:bg-civic-navy-900 transition-colors shadow-xs"
              >
                Rotate Passkey
              </button>
            </div>
          </form>
        </div>

        {/* Bottom Sign Out */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Authority Session</span>
          </button>
        </div>

      </div>
    </div>
  );
}
