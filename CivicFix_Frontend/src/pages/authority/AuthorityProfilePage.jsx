import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import {
  ShieldCheck, User, Building, BadgeCheck, Mail, Phone, Calendar,
  CheckCircle2, LogOut, Flame, Clock
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function AuthorityProfilePage() {
  const { currentUser, logout } = useAuth();
  const { authorityStats } = useComplaints();
  const navigate = useNavigate();

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
            Official Personnel Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-civic-navy-950 mt-1">
            Authority Command Profile
          </h1>
          <p className="text-xs sm:text-sm text-civic-charcoal-600 mt-0.5">
            Operational credentials and departmental oversight purview.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-civic-navy-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-civic-navy-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-civic-navy-950 text-civic-teal-300 font-bold flex items-center justify-center text-2xl border-2 border-civic-teal-600 shadow-xs">
                {currentUser?.name?.charAt(0) || 'P'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-civic-navy-950">
                  {currentUser?.name || 'Commissioner Priya Nair'}
                </h2>
                <p className="text-xs text-civic-charcoal-600 font-medium mt-0.5">
                  {currentUser?.designation || 'Senior Municipal Commissioner'}
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {currentUser?.verificationStatus || 'Verified (Demo)'}
                  </span>
                  <span className="text-[11px] font-mono text-civic-charcoal-500 bg-civic-sand-100 px-2 py-0.5 rounded border border-civic-navy-200">
                    ID: {currentUser?.employeeId || 'EMP-CIV-8842'}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-mono uppercase text-civic-charcoal-400 block">Clearance Purview</span>
              <span className="text-xs font-bold text-civic-navy-950 block mt-0.5">
                Zone & Ward Public Works Triage
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-civic-sand-50 p-4 rounded-xl border border-civic-navy-100 space-y-1">
              <span className="text-[11px] font-bold text-civic-charcoal-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" />
                Department
              </span>
              <p className="font-semibold text-civic-navy-900">{currentUser?.department || 'Central Civic Operations Command'}</p>
            </div>

            <div className="bg-civic-sand-50 p-4 rounded-xl border border-civic-navy-100 space-y-1">
              <span className="text-[11px] font-bold text-civic-charcoal-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                Official Email
              </span>
              <p className="font-semibold text-civic-navy-900 font-mono">{currentUser?.email || 'priya.nair@civic.gov'}</p>
            </div>

            <div className="bg-civic-sand-50 p-4 rounded-xl border border-civic-navy-100 space-y-1">
              <span className="text-[11px] font-bold text-civic-charcoal-400 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                Department Hotline
              </span>
              <p className="font-semibold text-civic-navy-900 font-mono">{currentUser?.phone || '+91 94480 99887'}</p>
            </div>

            <div className="bg-civic-sand-50 p-4 rounded-xl border border-civic-navy-100 space-y-1">
              <span className="text-[11px] font-bold text-civic-charcoal-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Commissioning Date
              </span>
              <p className="font-semibold text-civic-navy-900">
                {currentUser?.registeredAt ? new Date(currentUser.registeredAt).toLocaleDateString() : 'September 2026'}
              </p>
            </div>
          </div>

          {/* Operational Metrics Under Oversight */}
          <div className="border-t border-civic-navy-100 pt-6">
            <h3 className="text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-3">
              Departmental Oversight Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3 bg-civic-sand-100 rounded-xl">
                <span className="text-xl font-bold font-mono text-civic-navy-950 block">{authorityStats.total}</span>
                <span className="text-[11px] text-civic-charcoal-500 font-medium">Total Complaints</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-xl font-bold font-mono text-blue-800 block">{authorityStats.ongoing}</span>
                <span className="text-[11px] text-blue-700 font-medium">Crews Active</span>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                <span className="text-xl font-bold font-mono text-rose-800 block">{authorityStats.critical}</span>
                <span className="text-[11px] text-rose-700 font-medium">Critical Hazards</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-xl font-bold font-mono text-emerald-800 block">{authorityStats.resolved}</span>
                <span className="text-[11px] text-emerald-700 font-medium">Resolved & Verified</span>
              </div>
            </div>
          </div>

          <div className="border-t border-civic-navy-100 pt-4 flex items-center justify-between">
            <Link
              to="/authority/dashboard"
              className="text-xs font-bold text-civic-teal-700 hover:text-civic-teal-900"
            >
              &larr; Return to Operations Desk
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Authority</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
