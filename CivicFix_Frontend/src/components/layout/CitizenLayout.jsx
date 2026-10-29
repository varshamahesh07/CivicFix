import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, PlusCircle, FileText, User, Settings, LogOut,
  Menu, X, ShieldCheck
} from 'lucide-react';

export default function CitizenLayout({ children }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', to: '/citizen/dashboard', icon: LayoutDashboard },
    { label: 'Report a Complaint', to: '/citizen/report', icon: PlusCircle },
    { label: 'My Complaints', to: '/citizen/complaints', icon: FileText },
    { label: 'My Profile', to: '/citizen/profile', icon: User },
    { label: 'Settings', to: '/citizen/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-civic-sand-50 flex flex-col md:flex-row">
      {/* Mobile Top Sub-Header */}
      <div className="md:hidden bg-white border-b border-civic-navy-200 px-4 py-3 flex items-center justify-between sticky top-[95px] z-30 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-civic-teal-50 text-civic-teal-800 border border-civic-teal-200">
            Citizen Portal
          </span>
          <span className="text-xs font-semibold text-civic-navy-950 truncate max-w-[160px]">
            {currentUser?.name || 'Citizen'}
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-civic-charcoal-600 hover:bg-civic-sand-100"
          aria-label="Toggle citizen menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-civic-navy-200 px-4 py-3 space-y-1 shadow-md animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  active
                    ? 'bg-civic-teal-50 text-civic-teal-900 font-bold border border-civic-teal-200'
                    : 'text-civic-charcoal-700 hover:bg-civic-sand-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-civic-teal-700' : 'text-civic-charcoal-500'}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-lg pt-2 border-t border-civic-navy-100"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Desktop Compact Sidebar */}
      <aside aria-label="Citizen portal navigation" className="hidden md:flex flex-col w-64 bg-white border-r border-civic-navy-200/90 min-h-[calc(100vh-100px)] sticky top-[95px] p-4 justify-between flex-shrink-0">
        <div className="space-y-6">
          {/* User Badge */}
          <div className="bg-civic-sand-100/70 p-3 rounded-xl border border-civic-navy-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-civic-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                {currentUser?.name?.charAt(0) || 'C'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-civic-navy-950 truncate">
                  {currentUser?.name || 'Citizen'}
                </p>
                <span className="text-[10px] font-mono text-civic-teal-700 font-medium block">
                  Citizen Account
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-civic-charcoal-400 px-3 block mb-2">
              Citizen Menu
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-civic-navy-900 text-white font-bold shadow-xs'
                      : 'text-civic-charcoal-700 hover:bg-civic-sand-100 hover:text-civic-navy-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-civic-teal-400' : 'text-civic-charcoal-500'}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-civic-navy-100 space-y-2">
          <div className="px-3 py-2 bg-civic-sand-50 rounded-lg text-[11px] text-civic-charcoal-500 border border-civic-navy-100/60">
            <span className="font-semibold text-civic-navy-900 block">Civic Duty Note:</span>
            Accurate reports assist prompt dispatch.
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
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
