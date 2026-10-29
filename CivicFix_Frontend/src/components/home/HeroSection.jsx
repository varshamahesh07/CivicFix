import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, ShieldCheck, PlusCircle, CheckCircle2 } from 'lucide-react';
import { StatusBadge, PriorityBadge, RiskScoreBadge } from '../common/Badge';

export default function HeroSection() {
  const { isAuthenticated, isCitizen, isAuthority } = useAuth();

  // If unauthenticated, "Report a Problem" goes to /citizen/login, else /citizen/report
  const reportLink = isCitizen ? '/citizen/report' : '/citizen/login';
  const authorityLink = isAuthority ? '/authority/dashboard' : '/authority/login';

  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-civic-sand-100/60 to-civic-sand-50 border-b border-civic-navy-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Mission & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-civic-navy-100 text-civic-navy-900 border border-civic-navy-200">
              <span className="w-2 h-2 rounded-full bg-civic-teal-600" />
              <span>Civic Operations — Human-Centered Intelligence</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-civic-navy-950 tracking-tight leading-none">
                Civic<span className="text-civic-teal-600">Fix</span>
              </h1>
              <p className="text-lg sm:text-xl font-bold text-civic-navy-800 tracking-tight">
                Every Voice Matters, Every Issue Counts.
              </p>
            </div>

            <p className="text-base sm:text-lg text-civic-charcoal-700 max-w-xl leading-relaxed">
              Report civic problems. Track progress. Help build better communities.
            </p>

            {/* Two Prominent Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                to={reportLink}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-civic-teal-600 hover:bg-civic-teal-700 shadow-md transition-all focus:ring-4 focus:ring-civic-teal-400/30"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report a Problem</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to={authorityLink}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-civic-navy-900 bg-white hover:bg-civic-sand-100 border border-civic-navy-200 shadow-xs transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-civic-teal-700" />
                <span>Authority Portal</span>
              </Link>
            </div>

            {/* Guiding Principles Strip */}
            <div className="pt-4 border-t border-civic-navy-200/70 grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs font-bold text-civic-navy-950">5-Stage Status</p>
                <p className="text-[11px] text-civic-charcoal-500">Registered to verified resolution</p>
              </div>
              <div>
                <p className="text-xs font-bold text-civic-navy-950">Voice & Text</p>
                <p className="text-[11px] text-civic-charcoal-500">Microphone input or typed reports</p>
              </div>
              <div>
                <p className="text-xs font-bold text-civic-navy-950">Zero Guesswork</p>
                <p className="text-[11px] text-civic-charcoal-500">Intelligent priority triage</p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Operations Preview Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-xl border border-civic-navy-200/90 overflow-hidden">
              <div className="bg-civic-navy-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-civic-navy-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-semibold tracking-wider uppercase text-civic-teal-300">
                    Live Operations Stream
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-300">CF-2026-0002</span>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-civic-teal-700 uppercase tracking-wide">
                      Water Supply
                    </span>
                    <h3 className="text-sm font-bold text-civic-navy-950 mt-0.5">
                      Broken drinking water main pipeline leaking on 5th Cross
                    </h3>
                  </div>
                  <PriorityBadge priority="Critical" />
                </div>

                <p className="text-xs text-civic-charcoal-600 line-clamp-2 leading-relaxed">
                  Clean drinking water has been gushing onto pedestrian sidewalks for 2 days, flooding nearby basements.
                </p>

                <div className="bg-civic-sand-100 rounded-lg p-3 text-xs space-y-2 border border-civic-navy-100">
                  <div className="flex items-center justify-between">
                    <span className="text-civic-charcoal-600 font-medium">5th Cross Road, Ward 12</span>
                    <RiskScoreBadge score={91} />
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-civic-navy-200/50 text-[11px]">
                    <span className="text-civic-charcoal-500">Duration: 2 days</span>
                    <StatusBadge status="Registered" />
                  </div>
                </div>

                <div className="p-3 bg-civic-sand-50 rounded-lg border border-civic-navy-100 text-xs">
                  <span className="text-[10px] uppercase font-bold text-civic-charcoal-400 block">Routing Target</span>
                  <span className="font-semibold text-civic-navy-950 text-[11px]">
                    Municipal Water Supply & Sewerage Board
                  </span>
                </div>
              </div>

              <div className="px-5 py-3 bg-civic-sand-50 border-t border-civic-navy-100 flex items-center justify-between text-xs">
                <span className="text-civic-charcoal-500 font-mono text-[11px]">Citizen: Aarav S.</span>
                <Link
                  to="/authority/login"
                  className="font-bold text-civic-teal-700 hover:text-civic-teal-900"
                >
                  Review in Authority Desk &rarr;
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
