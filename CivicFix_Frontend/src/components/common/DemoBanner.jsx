import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, UserCheck, ShieldCheck, RefreshCw, X, Info } from 'lucide-react';

export default function DemoBanner() {
  const { currentUser, quickDemoSwitch, logout, isCitizen, isAuthority } = useAuth();
  const { resetDemoData } = useComplaints();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [resetMessage, setResetMessage] = useState(false);

  const handleSwitchToCitizen = () => {
    quickDemoSwitch('citizen');
    navigate('/citizen/dashboard');
  };

  const handleSwitchToAuthority = () => {
    quickDemoSwitch('authority');
    navigate('/authority/dashboard');
  };

  const handleResetData = () => {
    resetDemoData();
    setResetMessage(true);
    setTimeout(() => setResetMessage(false), 3000);
  };

  if (collapsed) {
    return (
      <div className="fixed bottom-3 right-3 z-50">
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-2 bg-civic-navy-900 text-white text-xs px-3 py-2 rounded-full shadow-lg border border-civic-teal-400 hover:bg-civic-navy-800 transition-all"
          title="Open Reviewer Demo Bar"
        >
          <span className="w-2 h-2 rounded-full bg-civic-teal-400 animate-pulse" />
          <span className="font-semibold">Reviewer Mode</span>
        </button>
      </div>
    );
  }

  return (
    <aside aria-label="Prototype Demonstration Environment" className="bg-civic-navy-950 text-slate-200 border-b border-civic-navy-800 text-xs px-3 sm:px-4 py-2 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Disclaimer & Current Identity */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/30 text-[11px]">
            <ShieldAlert className="w-3.5 h-3.5" />
            DEMO PROTOTYPE
          </span>

          <span className="text-slate-300 text-xs">
            {currentUser ? (
              <>
                Active Session:{' '}
                <strong className="text-white font-semibold">
                  {currentUser.name} ({currentUser.role.toUpperCase()})
                </strong>
              </>
            ) : (
              <span className="text-slate-400">Public Visitor Mode (Unauthenticated)</span>
            )}
          </span>

          {resetMessage && (
            <span className="text-emerald-400 font-semibold animate-pulse text-xs ml-2">
              ✓ Demo dataset reset to initial state
            </span>
          )}
        </div>

        {/* Right: Quick Reviewer Switchers */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 text-[11px] hidden lg:inline">Reviewer Quick-Switch:</span>

          <button
            onClick={handleSwitchToCitizen}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              isCitizen
                ? 'bg-civic-teal-600 text-white ring-2 ring-civic-teal-400/50'
                : 'bg-civic-navy-800 text-slate-200 hover:bg-civic-navy-700 border border-civic-navy-700'
            }`}
            title="Act as Citizen (Aarav Sharma)"
          >
            <UserCheck className="w-3.5 h-3.5 text-civic-teal-300" />
            <span>Citizen Demo</span>
          </button>

          <button
            onClick={handleSwitchToAuthority}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              isAuthority
                ? 'bg-civic-navy-700 text-white ring-2 ring-blue-400/50'
                : 'bg-civic-navy-800 text-slate-200 hover:bg-civic-navy-700 border border-civic-navy-700'
            }`}
            title="Act as Authority (Comm. Priya Nair)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
            <span>Authority Demo</span>
          </button>

          <button
            onClick={handleResetData}
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-slate-300 hover:text-white hover:bg-civic-navy-800 border border-slate-700 transition-all"
            title="Reset complaints to default mock data"
          >
            <RefreshCw className="w-3 h-3 text-slate-400" />
            <span>Reset Data</span>
          </button>

          <button
            onClick={() => setCollapsed(true)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-civic-navy-800 ml-1"
            title="Minimize banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
