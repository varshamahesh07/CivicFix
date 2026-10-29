import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import {
  User, Mail, Phone, Calendar, ShieldCheck, Edit3, Check, X,
  MapPin, CheckCircle2, AlertCircle, LogOut
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function CitizenProfilePage() {
  const { currentUser, updateProfile, logout } = useAuth();
  const { getCitizenStats } = useComplaints();
  const navigate = useNavigate();

  const stats = getCitizenStats(currentUser?.id);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    age: currentUser?.age || 28,
    address: currentUser?.address || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });

  const [message, setMessage] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    setMessage(null);

    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Full name cannot be empty.' });
      return;
    }
    const ageNum = Number(formData.age);
    if (!formData.age || isNaN(ageNum) || ageNum < 16) {
      setMessage({ type: 'error', text: 'Valid age (minimum 16) is required.' });
      return;
    }
    if (!formData.address.trim()) {
      setMessage({ type: 'error', text: 'Address cannot be empty.' });
      return;
    }

    updateProfile({
      name: formData.name.trim(),
      age: ageNum,
      address: formData.address.trim(),
      phone: formData.phone.trim(),
    });

    setIsEditing(false);
    setMessage({ type: 'success', text: 'Citizen profile details successfully updated!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="py-8 sm:py-10 bg-civic-sand-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-civic-teal-700">
              Verified Reporter Details
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-civic-navy-950 mt-1">
              Citizen Profile
            </h1>
            <p className="text-xs sm:text-sm text-civic-charcoal-600 mt-0.5">
              Review and manage your personal civic reporter identity.
            </p>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-civic-navy-900 bg-white hover:bg-civic-sand-100 border border-civic-navy-200 shadow-xs transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-civic-teal-700" />
              <span>Edit Details</span>
            </button>
          )}
        </div>

        {message && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-civic-navy-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-civic-navy-100">
            <div className="w-16 h-16 rounded-full bg-civic-navy-100 text-civic-navy-800 flex items-center justify-center font-bold text-2xl border border-civic-navy-200">
              {currentUser?.name?.charAt(0) || 'C'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-civic-navy-950">
                {currentUser?.name || 'Citizen'}
              </h2>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-civic-teal-800 bg-civic-teal-50 px-2 py-0.5 rounded border border-civic-teal-200 mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-civic-teal-600" />
                Verified Community Reporter
              </span>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="w-full text-xs p-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    min="16"
                    max="120"
                    required
                    value={formData.age}
                    onChange={(e) => setFormData((p) => ({ ...p, age: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                    Address / Locality *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                    Email Address (Read-only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={formData.email}
                    className="w-full text-xs p-2.5 rounded-lg border border-civic-navy-200 bg-civic-sand-100/70 text-civic-charcoal-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-lg border border-civic-navy-200 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-civic-charcoal-600 hover:bg-civic-sand-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-civic-teal-600 hover:bg-civic-teal-700 transition-colors shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-civic-sand-50 p-4 rounded-xl border border-civic-navy-100 space-y-1">
                <span className="text-[11px] font-bold text-civic-charcoal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Citizen Name & Age
                </span>
                <p className="font-semibold text-civic-navy-900">
                  {currentUser?.name || 'Citizen'}, {currentUser?.age || 29} yrs
                </p>
              </div>

              <div className="bg-civic-sand-50 p-4 rounded-xl border border-civic-navy-100 space-y-1">
                <span className="text-[11px] font-bold text-civic-charcoal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Registered Address
                </span>
                <p className="font-semibold text-civic-navy-900">
                  {currentUser?.address || 'Indiranagar, Ward 12'}
                </p>
              </div>

              <div className="bg-civic-sand-50 p-4 rounded-xl border border-civic-navy-100 space-y-1">
                <span className="text-[11px] font-bold text-civic-charcoal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  Email Address
                </span>
                <p className="font-semibold text-civic-navy-900 font-mono">{currentUser?.email || 'N/A'}</p>
              </div>

              <div className="bg-civic-sand-50 p-4 rounded-xl border border-civic-navy-100 space-y-1">
                <span className="text-[11px] font-bold text-civic-charcoal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  Contact Phone
                </span>
                <p className="font-semibold text-civic-navy-900 font-mono">{currentUser?.phone || '+91 98765 43210'}</p>
              </div>
            </div>
          )}

          {/* Reporting Activity Breakdown (5 exact statuses) */}
          <div className="border-t border-civic-navy-100 pt-6">
            <h3 className="text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-3">
              Reporting Activity Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="p-3 bg-civic-sand-100 rounded-lg">
                <span className="text-lg font-bold font-mono text-civic-navy-950 block">{stats.total}</span>
                <span className="text-[10px] text-civic-charcoal-500 uppercase font-bold">Total</span>
              </div>
              <div className="p-3 bg-slate-100 rounded-lg">
                <span className="text-lg font-bold font-mono text-slate-800 block">{stats.registered}</span>
                <span className="text-[10px] text-slate-700 uppercase font-bold">Registered</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <span className="text-lg font-bold font-mono text-blue-800 block">{stats.ongoing}</span>
                <span className="text-[10px] text-blue-700 uppercase font-bold">Ongoing</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <span className="text-lg font-bold font-mono text-amber-800 block">{stats.waitingList}</span>
                <span className="text-[10px] text-amber-700 uppercase font-bold">Waiting List</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg col-span-2 sm:col-span-1">
                <span className="text-lg font-bold font-mono text-emerald-800 block">{stats.resolved}</span>
                <span className="text-[10px] text-emerald-700 uppercase font-bold">Resolved</span>
              </div>
            </div>
          </div>

          <div className="border-t border-civic-navy-100 pt-4 flex items-center justify-between">
            <Link
              to="/citizen/complaints"
              className="text-xs font-bold text-civic-teal-700 hover:text-civic-teal-900"
            >
              View My Complaints &rarr;
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
