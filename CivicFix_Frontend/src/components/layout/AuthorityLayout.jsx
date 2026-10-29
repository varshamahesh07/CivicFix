import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FileText, AlertTriangle, BarChart3, User, Settings,
  LogOut, Menu, X, ShieldCheck, Flame
} from 'lucide-react';

export default function AuthorityLayout({ children }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Operations Desk', to: '/authority/dashboard', icon: LayoutDashboard },
    { label: 'All Complaints', to: '/authority/complaints', icon: FileText },
    { label: 'Priority Queue', to: '/authority/dashboard#priority-queue', icon: Flame },
    { label: 'Reports & Analytics', to: '/authority/reports', icon: BarChart3 },
    { label: 'Authority Profile', to: '/authority/profile', icon: User },
    { label: 'Settings', to: '/authority/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-civic-sand-50 flex flex-col md:flex-row">
      {/* Mobile Top Sub-Header */}
      <div className="md:hidden bg-civic-navy-950 text-white border-b border-civic-navy-800 px-4 py-3 flex items-center justify-between sticky top-[95px] z-30 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-civic-navy-800 text-civic-teal-300 border border-civic-navy-700">
            Operations
          </span>
          <span className="text-xs font-semibold text-white truncate max-w-[160px]">
            {currentUser?.name || 'Commissioner'}
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-slate-300 hover:bg-civic-navy-900"
          aria-label="Toggle operations menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-civic-navy-950 text-white border-b border-civic-navy-800 px-4 py-3 space-y-1 shadow-md animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to || (item.to.includes('#') && location.hash === '#priority-queue');
            return (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  active
                    ? 'bg-civic-navy-800 text-civic-teal-300 font-bold border border-civic-navy-700'
                    : 'text-slate-300 hover:bg-civic-navy-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-civic-teal-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-civic-navy-900 rounded-lg pt-2 border-t border-civic-navy-800"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Authority</span>
          </button>
        </div>
      )}

      {/* Desktop Information-Dense Sidebar */}
      <aside aria-label="Authority operational navigation" className="hidden md:flex flex-col w-64 bg-civic-navy-950 text-slate-200 border-r border-civic-navy-800 min-h-[calc(100vh-100px)] sticky top-[95px] p-4 justify-between flex-shrink-0">
        <div className="space-y-6">
          {/* Officer Command Badge */}
          <div className="bg-civic-navy-900/90 p-3 rounded-xl border border-civic-navy-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-civic-teal-700 text-white font-bold flex items-center justify-center text-sm shadow-xs border border-civic-teal-500">
                <ShieldCheck className="w-5 h-5 text-civic-teal-300" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {currentUser?.name || 'Commissioner'}
                </p>
                <span className="text-[10px] font-mono text-civic-teal-400 font-medium block truncate">
                  {currentUser?.designation || 'Operations Officer'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
              Operations Control
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to || (item.to.includes('#') && location.hash === '#priority-queue');
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-civic-teal-600 text-white font-bold shadow-xs'
                      : 'text-slate-300 hover:bg-civic-navy-900 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-civic-teal-400'}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-civic-navy-800 space-y-2">
          <div className="px-3 py-2 bg-civic-navy-900/60 rounded-lg text-[10px] text-slate-400 border border-civic-navy-800">
            <span className="font-semibold text-civic-teal-300 block">Jurisdiction:</span>
            Ward Operations & Triage
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-civic-navy-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Authority</span>
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
