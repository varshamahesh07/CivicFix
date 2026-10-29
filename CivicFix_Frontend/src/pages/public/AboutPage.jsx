import React from 'react';
import { Shield, Eye, Users, Cpu, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16 bg-civic-sand-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-civic-teal-700 font-mono">
            Platform Overview & Architecture
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-civic-navy-950 tracking-tight">
            About CivicFix
          </h1>
          <p className="text-base text-civic-charcoal-600 max-w-2xl mx-auto italic">
            “Every Voice Matters, Every Issue Counts.”
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-2xl p-8 border border-civic-navy-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-civic-navy-900">
            Our Purpose & Civic Mission
          </h2>
          <p className="text-sm text-civic-charcoal-700 leading-relaxed">
            In modern urban communities, reporting everyday civic failures—a dangerous crater on an arterial road, an open high-voltage transformer, or an overflowing sewage line—often involves tangled bureaucracies, misplaced files, and complete lack of feedback for citizens.
          </p>
          <p className="text-sm text-civic-charcoal-700 leading-relaxed">
            <strong>CivicFix</strong> was conceived as an intelligent, human-centered civic operations platform that connects citizen reports with organized authority triage, automated hazard assessment, and verifiable tracking. By introducing deterministic risk calculation, duplicate filtering, and clear departmental assignment, CivicFix ensures local problems are seen, prioritized, and acted upon.
          </p>
        </div>

        {/* Guiding Principles */}
        <div>
          <h2 className="text-lg font-bold text-civic-navy-950 mb-6 text-center">
            Foundational Civic Operations Principles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                icon: Shield,
                title: 'Public Trust & Transparency',
                desc: 'Every status transition is logged with actor identification and timestamps. Citizens never have to wonder if a complaint was quietly deleted.'
              },
              {
                icon: Cpu,
                title: 'Intelligent Hazard Prioritization',
                desc: 'Complaints are systematically evaluated by risk score and urgency keywords to surface critical public safety hazards before minor inconveniences.'
              },
              {
                icon: Users,
                title: 'Active Community Participation',
                desc: 'Citizens become active stewards of their neighborhoods by providing actionable photographic evidence and exact geolocations.'
              },
              {
                icon: CheckCircle2,
                title: 'Measurable Resolution Progress',
                desc: 'Resolution requires explicit ground verification notes, closing the feedback loop between the public and municipal teams.'
              }
            ].map((principle, index) => {
              const Icon = principle.icon;
              return (
                <div key={index} className="bg-white p-5 rounded-xl border border-civic-navy-200/80 shadow-sm">
                  <div className="w-9 h-9 rounded-lg bg-civic-teal-50 text-civic-teal-700 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-civic-navy-900 mb-1.5">{principle.title}</h3>
                  <p className="text-xs text-civic-charcoal-600 leading-relaxed">{principle.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Academic Prototype Notice */}
        <div className="bg-civic-navy-950 text-white rounded-2xl p-6 sm:p-8 border border-civic-navy-800">
          <div className="flex items-center gap-2 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <span>College Mini-Project Engineering Prototype</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            Technical Architecture & Prototype Scope
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            CivicFix is developed as a comprehensive full-stack prototype. The frontend is built using React 18, Vite, React Router DOM, and Tailwind CSS. The system features a mock-authentication and data service layer configured for seamless backend integration with a Python Flask REST API and SQLite database.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/citizen/report"
              className="px-4 py-2 rounded-lg bg-civic-teal-600 hover:bg-civic-teal-500 text-xs font-bold text-white transition-colors flex items-center gap-1.5"
            >
              <span>Test Complaint Submission</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/authority/dashboard"
              className="px-4 py-2 rounded-lg bg-civic-navy-800 hover:bg-civic-navy-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
            >
              View Operations Desk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
