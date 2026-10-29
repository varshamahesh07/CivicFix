import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import { Shield, ExternalLink, Heart, AlertCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-civic-navy-950 text-slate-300 border-t border-civic-navy-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <Logo size="md" light showTagline={false} />
            <p className="text-xs text-slate-400 leading-relaxed">
              CivicFix empowers citizens to report everyday infrastructure breakdowns and assists civic authorities with transparent, prioritized resolution tracking.
            </p>
            <div className="pt-2">
              <span className="text-xs text-civic-teal-400 font-mono font-medium block">
                Official Tagline:
              </span>
              <p className="text-xs text-slate-300 italic">
                “Every Voice Matters, Every Issue Counts.”
              </p>
            </div>
          </div>

          {/* Citizen Portal Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Citizen Portal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/citizen/report" className="hover:text-civic-teal-300 transition-colors">
                  Report a Problem
                </Link>
              </li>
              <li>
                <Link to="/citizen/dashboard" className="hover:text-civic-teal-300 transition-colors">
                  Citizen Dashboard
                </Link>
              </li>
              <li>
                <Link to="/citizen/complaints" className="hover:text-civic-teal-300 transition-colors">
                  Track My Complaints
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-civic-teal-300 transition-colors">
                  How Reporting Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Operations & Authority Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Civic Operations
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/authority/login" className="hover:text-civic-teal-300 transition-colors">
                  Authority Login
                </Link>
              </li>
              <li>
                <Link to="/authority/dashboard" className="hover:text-civic-teal-300 transition-colors">
                  Operations Desk
                </Link>
              </li>
              <li>
                <Link to="/authority/complaints" className="hover:text-civic-teal-300 transition-colors">
                  Complaint Assessment Queue
                </Link>
              </li>
              <li>
                <Link to="/authority/reports" className="hover:text-civic-teal-300 transition-colors">
                  Resolution Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Educational Disclaimer */}
          <div className="bg-civic-navy-900/60 p-4 rounded-xl border border-civic-navy-800 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Project & Demo Disclaimer</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              CivicFix is an academic college mini-project prototype developed for demonstration and engineering evaluation. It is <strong>not</strong> an officially deployed government platform or endorsed municipal department service.
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Architecture: React 18 + Vite | Modular API Ready
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-civic-navy-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} CivicFix — Human-Centered Civic Operations Prototype.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/about" className="hover:text-white transition-colors">About Project</Link>
            <Link to="/how-it-works" className="hover:text-white transition-colors">Workflow</Link>
            <span className="text-civic-teal-400">Design Identity: Civic Operations</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
