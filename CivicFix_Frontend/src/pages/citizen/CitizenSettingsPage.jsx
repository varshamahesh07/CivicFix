import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Settings, Bell, Lock, Shield, User, CheckCircle2, AlertCircle, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CitizenSettingsPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    smsAlerts: false,
    publicNotices: true,
  });

  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [pwdMessage, setPwdMessage] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggleNotif = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPwdMessage(null);

    if (!passwordState.currentPassword) {
      setPwdMessage({ type: 'error', text: 'Please enter your current password.' });
      return;
    }
    if (passwordState.newPassword.length < 6) {
      setPwdMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setPwdMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPwdMessage({
      type: 'success',
      text: 'Passkey updated successfully for this prototype session.'
    });
    setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="py-8 sm:py-10 bg-civic-sand-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Header */}
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-civic-teal-700">
            Citizen Preferences
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-civic-navy-950 mt-1">
            Account & Platform Settings
          </h1>
          <p className="text-xs sm:text-sm text-civic-charcoal-600 mt-0.5">
            Manage your alerts, authentication preferences, and citizen privacy options.
          </p>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Preferences updated for active prototype session.</span>
          </div>
        )}

        {/* 1. Account Info Overview */}
        <div className="bg-white rounded-2xl p-6 border border-civic-navy-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-civic-navy-100 pb-3">
            <User className="w-4 h-4 text-civic-teal-700" />
            <h2 className="text-sm font-bold text-civic-navy-950 uppercase tracking-wide">
              Account Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-civic-charcoal-500 block text-[11px]">Primary Citizen Name</span>
              <p className="font-semibold text-civic-navy-900 mt-0.5">{currentUser?.name || 'Citizen'}</p>
            </div>
            <div>
              <span className="text-civic-charcoal-500 block text-[11px]">Registered Email</span>
              <p className="font-semibold text-civic-navy-900 mt-0.5">{currentUser?.email || 'citizen@example.com'}</p>
            </div>
            <div>
              <span className="text-civic-charcoal-500 block text-[11px]">Contact Phone</span>
              <p className="font-semibold text-civic-navy-900 mt-0.5">{currentUser?.phone || '+91 98000 00000'}</p>
            </div>
            <div>
              <span className="text-civic-charcoal-500 block text-[11px]">Citizen ID Reference</span>
              <p className="font-mono text-civic-navy-900 mt-0.5">{currentUser?.id || 'citizen-demo'}</p>
            </div>
          </div>
        </div>

        {/* 2. Notification Preferences */}
        <div className="bg-white rounded-2xl p-6 border border-civic-navy-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-civic-navy-100 pb-3">
            <Bell className="w-4 h-4 text-civic-teal-700" />
            <h2 className="text-sm font-bold text-civic-navy-950 uppercase tracking-wide">
              Resolution Notification Preferences
            </h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-start justify-between gap-4 p-3 rounded-xl bg-civic-sand-50/60 border border-civic-navy-100/60 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-civic-navy-950 block">Status Change Notifications</span>
                <span className="text-[11px] text-civic-charcoal-500">Receive email notification whenever an authority updates your complaint to Ongoing or Resolved.</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailUpdates}
                onChange={() => handleToggleNotif('emailUpdates')}
                className="mt-1 rounded text-civic-teal-600 focus:ring-civic-teal-500"
              />
            </label>

            <label className="flex items-start justify-between gap-4 p-3 rounded-xl bg-civic-sand-50/60 border border-civic-navy-100/60 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-civic-navy-950 block">Urgent SMS Alerts</span>
                <span className="text-[11px] text-civic-charcoal-500">Receive SMS notifications when public safety repair teams are dispatched in your street.</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.smsAlerts}
                onChange={() => handleToggleNotif('smsAlerts')}
                className="mt-1 rounded text-civic-teal-600 focus:ring-civic-teal-500"
              />
            </label>

            <label className="flex items-start justify-between gap-4 p-3 rounded-xl bg-civic-sand-50/60 border border-civic-navy-100/60 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-civic-navy-950 block">Municipal Public Notices</span>
                <span className="text-[11px] text-civic-charcoal-500">Include weekly maintenance bulletins regarding road work or water supply shutdowns in your ward.</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.publicNotices}
                onChange={() => handleToggleNotif('publicNotices')}
                className="mt-1 rounded text-civic-teal-600 focus:ring-civic-teal-500"
              />
            </label>
          </div>
        </div>

        {/* 3. Password Change Interface */}
        <div className="bg-white rounded-2xl p-6 border border-civic-navy-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-civic-navy-100 pb-3">
            <Lock className="w-4 h-4 text-civic-teal-700" />
            <h2 className="text-sm font-bold text-civic-navy-950 uppercase tracking-wide">
              Security & Passkey Update
            </h2>
          </div>

          {pwdMessage && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                pwdMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {pwdMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              )}
              <span>{pwdMessage.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={passwordState.currentPassword}
                onChange={(e) => setPasswordState((p) => ({ ...p, currentPassword: e.target.value }))}
                placeholder="••••••••"
                className="w-full text-xs p-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordState.newPassword}
                  onChange={(e) => setPasswordState((p) => ({ ...p, newPassword: e.target.value }))}
                  placeholder="Min 6 chars"
                  className="w-full text-xs p-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordState.confirmPassword}
                  onChange={(e) => setPasswordState((p) => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Repeat new password"
                  className="w-full text-xs p-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-civic-navy-900 hover:bg-civic-navy-800 transition-colors shadow-xs"
              >
                Update Passkey
              </button>
            </div>
          </form>
        </div>

        {/* 4. Privacy & Prototype Notice */}
        <div className="bg-civic-sand-100 p-5 rounded-2xl border border-civic-navy-200/80 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-civic-navy-900 font-bold">
            <Shield className="w-4 h-4 text-civic-teal-700" />
            <span>Citizen Privacy & Data Protection Policy</span>
          </div>
          <p className="text-civic-charcoal-600 leading-relaxed text-[11px]">
            CivicFix respects your community privacy. Your personal phone and email are strictly visible only to authorized dispatch personnel and never published on open public complaint registries.
          </p>
        </div>

        {/* Bottom Sign Out */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Citizen Portal</span>
          </button>
        </div>

      </div>
    </div>
  );
}
