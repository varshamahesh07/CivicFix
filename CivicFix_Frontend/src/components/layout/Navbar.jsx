import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';
import {
  Menu, X, PlusCircle, LayoutDashboard, FileText,
  ShieldCheck, User, LogOut, ChevronDown, UserPlus
} from 'lucide-react';

export default function Navbar() {
  const { currentUser, isCitizen, isAuthority, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signupDropdownOpen, setSignupDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-civic-navy-100 sticky top-0 z-40 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center">
            <Logo size="md" showTagline={false} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {/* If NOT logged in (Public) */}
            {!currentUser && (
              <>
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/') ? 'text-civic-teal-700 bg-civic-teal-50' : 'text-civic-charcoal-700 hover:text-civic-navy-900 hover:bg-civic-sand-100'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/how-it-works"
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/how-it-works') ? 'text-civic-teal-700 bg-civic-teal-50' : 'text-civic-charcoal-700 hover:text-civic-navy-900 hover:bg-civic-sand-100'
                  }`}
                >
                  How It Works
                </Link>
                <Link
                  to="/about"
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/about') ? 'text-civic-teal-700 bg-civic-teal-50' : 'text-civic-charcoal-700 hover:text-civic-navy-900 hover:bg-civic-sand-100'
                  }`}
                >
                  Features & Mission
                </Link>

                <div className="h-4 w-[1px] bg-civic-navy-200 mx-1.5" />

                <Link
                  to="/citizen/login"
                  className="px-3 py-2 rounded-lg text-xs font-bold text-civic-navy-900 hover:bg-civic-sand-100 transition-colors"
                >
                  Citizen Login
                </Link>

                <Link
                  to="/authority/login"
                  className="px-3 py-2 rounded-lg text-xs font-bold text-civic-navy-900 hover:bg-civic-sand-100 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-civic-teal-600" />
                  <span>Authority Portal</span>
                </Link>

                {/* Sign Up Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setSignupDropdownOpen(!signupDropdownOpen)}
                    onBlur={() => setTimeout(() => setSignupDropdownOpen(false), 200)}
                    className="px-3 py-2 rounded-lg text-xs font-semibold text-civic-charcoal-700 hover:text-civic-navy-900 hover:bg-civic-sand-100 flex items-center gap-1 transition-colors"
                  >
                    <span>Sign Up</span>
                    <ChevronDown className="w-3.5 h-3.5 text-civic-charcoal-400" />
                  </button>

                  {signupDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-civic-navy-100 py-1.5 z-50 text-xs">
                      <Link
                        to="/citizen/register"
                        className="block px-3 py-2 text-civic-navy-900 hover:bg-civic-sand-50 font-medium"
                      >
                        Citizen Registration
                      </Link>
                      <Link
                        to="/authority/register"
                        className="block px-3 py-2 text-civic-navy-900 hover:bg-civic-sand-50 font-medium border-t border-civic-navy-50"
                      >
                        Authority Onboarding
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  to="/citizen/report"
                  className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-civic-teal-600 hover:bg-civic-teal-700 shadow-xs transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Report an Issue</span>
                </Link>
              </>
            )}

            {/* If Logged in as CITIZEN */}
            {isCitizen && (
              <>
                <Link
                  to="/citizen/dashboard"
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    isActive('/citizen/dashboard') ? 'text-civic-teal-700 bg-civic-teal-50 font-bold' : 'text-civic-charcoal-700 hover:bg-civic-sand-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/citizen/complaints"
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    isActive('/citizen/complaints') ? 'text-civic-teal-700 bg-civic-teal-50 font-bold' : 'text-civic-charcoal-700 hover:bg-civic-sand-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  My Complaints
                </Link>
                <Link
                  to="/citizen/report"
                  className="ml-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-civic-teal-600 hover:bg-civic-teal-700 shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  Report Issue
                </Link>

                <div className="h-4 w-[1px] bg-civic-navy-200 mx-2" />

                <div className="flex items-center gap-2 pl-2">
                  <Link to="/citizen/profile" className="text-right hover:opacity-80">
                    <p className="text-xs font-bold text-civic-navy-900">{currentUser.name}</p>
                    <span className="text-[10px] text-civic-teal-700 font-mono">Citizen</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-civic-charcoal-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Log out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

            {/* If Logged in as AUTHORITY */}
            {isAuthority && (
              <>
                <Link
                  to="/authority/dashboard"
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    isActive('/authority/dashboard') ? 'text-civic-navy-950 bg-civic-sand-100 font-bold' : 'text-civic-charcoal-700 hover:bg-civic-sand-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-civic-teal-700" />
                  Operations Desk
                </Link>
                <Link
                  to="/authority/complaints"
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    isActive('/authority/complaints') ? 'text-civic-navy-950 bg-civic-sand-100 font-bold' : 'text-civic-charcoal-700 hover:bg-civic-sand-100'
                  }`}
                >
                  <FileText className="w-4 h-4 text-civic-teal-700" />
                  All Complaints
                </Link>
                <Link
                  to="/authority/reports"
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    isActive('/authority/reports') ? 'text-civic-navy-950 bg-civic-sand-100 font-bold' : 'text-civic-charcoal-700 hover:bg-civic-sand-100'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-civic-teal-700" />
                  Reports
                </Link>

                <div className="h-4 w-[1px] bg-civic-navy-200 mx-2" />

                <div className="flex items-center gap-2 pl-2">
                  <Link to="/authority/profile" className="text-right hover:opacity-80">
                    <p className="text-xs font-bold text-civic-navy-900">{currentUser.name}</p>
                    <span className="text-[10px] text-civic-teal-700 font-mono font-medium">Operations</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-civic-charcoal-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Log out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {!currentUser ? (
              <Link
                to="/citizen/report"
                className="px-2.5 py-1 text-xs font-bold text-white bg-civic-teal-600 rounded-md"
              >
                + Report
              </Link>
            ) : null}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-civic-charcoal-600 hover:text-civic-navy-900 hover:bg-civic-sand-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-civic-navy-100 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {!currentUser ? (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-civic-charcoal-700 hover:bg-civic-sand-100"
              >
                Home
              </Link>
              <Link
                to="/how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-civic-charcoal-700 hover:bg-civic-sand-100"
              >
                How It Works
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-civic-charcoal-700 hover:bg-civic-sand-100"
              >
                Features & Mission
              </Link>
              <div className="pt-2 border-t border-civic-navy-100 space-y-1.5">
                <Link
                  to="/citizen/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-bold text-civic-navy-900 bg-civic-sand-50"
                >
                  Citizen Login
                </Link>
                <Link
                  to="/citizen/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-xs font-semibold text-civic-teal-800"
                >
                  + Citizen Registration
                </Link>
                <Link
                  to="/authority/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-bold text-civic-navy-900 bg-civic-sand-50"
                >
                  Authority Portal Login
                </Link>
                <Link
                  to="/authority/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-xs font-semibold text-civic-teal-800"
                >
                  + Authority Onboarding
                </Link>
              </div>
            </>
          ) : isCitizen ? (
            <>
              <Link
                to="/citizen/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-civic-charcoal-700"
              >
                Dashboard
              </Link>
              <Link
                to="/citizen/report"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-bold text-civic-teal-700"
              >
                + Report a Complaint
              </Link>
              <Link
                to="/citizen/complaints"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-civic-charcoal-700"
              >
                My Complaints
              </Link>
              <Link
                to="/citizen/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-civic-charcoal-700"
              >
                My Profile
              </Link>
              <Link
                to="/citizen/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-civic-charcoal-700"
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/authority/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-civic-charcoal-700"
              >
                Operations Desk
              </Link>
              <Link
                to="/authority/complaints"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-civic-charcoal-700"
              >
                All Complaints
              </Link>
              <Link
                to="/authority/reports"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-civic-charcoal-700"
              >
                Reports
              </Link>
              <Link
                to="/authority/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-civic-charcoal-700"
              >
                Authority Profile
              </Link>
              <Link
                to="/authority/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-civic-charcoal-700"
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600"
              >
                Sign Out Authority
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
