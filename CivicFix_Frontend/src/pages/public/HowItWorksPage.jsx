import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, MapPin, Search, Cpu, CheckSquare, Bell, ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="py-12 sm:py-16 bg-civic-sand-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-civic-teal-700 font-mono">
            Process Breakdown
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-civic-navy-950 tracking-tight">
            How CivicFix Works
          </h1>
          <p className="text-sm sm:text-base text-civic-charcoal-600 max-w-xl mx-auto">
            A step-by-step walkthrough of how citizen reports are processed, evaluated, and verified through to completion.
          </p>
        </div>

        {/* Citizen Workflow */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-civic-navy-200/90 shadow-sm space-y-6">
          <div className="border-b border-civic-navy-100 pb-4">
            <span className="text-xs font-mono font-bold uppercase px-2.5 py-1 rounded bg-civic-teal-50 text-civic-teal-800 border border-civic-teal-200">
              For Citizens
            </span>
            <h2 className="text-xl font-bold text-civic-navy-950 mt-2">
              Reporting and Tracking an Issue
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-civic-navy-100 text-civic-navy-900 font-mono font-bold flex items-center justify-center flex-shrink-0 text-xs">
                1
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-civic-navy-900">
                  Document the Problem
                </h3>
                <p className="text-xs text-civic-charcoal-600 leading-relaxed">
                  Provide a concise title, describe the hazard or disruption, select the correct category (Roads, Water, Waste, etc.), and capture or attach a clear photograph.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-civic-navy-100 text-civic-navy-900 font-mono font-bold flex items-center justify-center flex-shrink-0 text-xs">
                2
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-civic-navy-900">
                  Specify Location with Street or Geolocation
                </h3>
                <p className="text-xs text-civic-charcoal-600 leading-relaxed">
                  Enter the street address, landmark, or click "Use Current Location" to fetch browser GPS coordinates with accuracy fallback.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-civic-navy-100 text-civic-navy-900 font-mono font-bold flex items-center justify-center flex-shrink-0 text-xs">
                3
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-civic-navy-900">
                  Receive Unique Complaint ID & Track Progress
                </h3>
                <p className="text-xs text-civic-charcoal-600 leading-relaxed">
                  Upon submission, you receive an authentic complaint tracking ID (e.g. <code>CF-2026-0104</code>). Watch the status advance from Reported to In Progress to Resolved with exact audit notes.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/citizen/report"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-civic-teal-600 hover:bg-civic-teal-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <span>Submit a Complaint Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Authority Operations Workflow */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-civic-navy-200/90 shadow-sm space-y-6">
          <div className="border-b border-civic-navy-100 pb-4">
            <span className="text-xs font-mono font-bold uppercase px-2.5 py-1 rounded bg-civic-navy-100 text-civic-navy-900 border border-civic-navy-200">
              For Civic Authorities
            </span>
            <h2 className="text-xl font-bold text-civic-navy-950 mt-2">
              Operations Triage & Resolution Management
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-civic-navy-900 text-white font-mono font-bold flex items-center justify-center flex-shrink-0 text-xs">
                1
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-civic-navy-900">
                  Automated Assessment & Intake Triage
                </h3>
                <p className="text-xs text-civic-charcoal-600 leading-relaxed">
                  Every incoming complaint is evaluated: an illustrative risk score (0-100) is generated, urgency keywords are highlighted, potential duplicate reports are flagged, and the relevant department is suggested.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-civic-navy-900 text-white font-mono font-bold flex items-center justify-center flex-shrink-0 text-xs">
                2
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-civic-navy-900">
                  Operational Filtering & Work Scheduling
                </h3>
                <p className="text-xs text-civic-charcoal-600 leading-relaxed">
                  Municipal officers filter by risk range, category, status, and location to dispatch repair teams to critical hazards before routine maintenance items.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-civic-navy-900 text-white font-mono font-bold flex items-center justify-center flex-shrink-0 text-xs">
                3
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-civic-navy-900">
                  Status Transition & Verification Logging
                </h3>
                <p className="text-xs text-civic-charcoal-600 leading-relaxed">
                  Officers transition status to "In Progress" with dispatch details, and finally "Resolved" with an mandatory resolution note detailing ground repair.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/authority/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-civic-navy-900 hover:bg-civic-navy-800 text-white text-xs font-bold transition-all shadow-sm"
            >
              <span>Access Authority Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
