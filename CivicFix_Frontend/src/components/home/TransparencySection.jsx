import React from 'react';
import { ShieldCheck, Users, Eye, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TransparencySection() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-civic-navy-900 rounded-2xl p-8 sm:p-12 text-white border border-civic-navy-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-civic-teal-900/80 text-civic-teal-300 border border-civic-teal-700/60 text-xs font-mono font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Community Participation & Accountability
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Public trust through open verification
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                CivicFix is designed on the principle that civic complaints should never disappear into a bureaucratic black box. 
                When citizens report a community breakdown, they receive a permanent tracking ID, transparent status logs, and verified resolution notes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-civic-navy-800 flex items-center justify-center flex-shrink-0 text-civic-teal-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Citizen Ownership</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Citizens maintain visibility over their neighborhood issues without bureaucratic hurdles.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-civic-navy-800 flex items-center justify-center flex-shrink-0 text-civic-teal-400">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Actionable Accountability</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Authorities operate from quantifiable queues with verified timestamps for every state change.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-civic-navy-950/80 p-6 rounded-xl border border-civic-navy-800 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-civic-teal-400 uppercase tracking-wider font-semibold">
                <HelpCircle className="w-4 h-4" />
                <span>Prototype Demonstration Note</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                CivicFix is an engineering prototype prepared for demonstration and college review. It exhibits genuine frontend architecture, realistic data schemas, and role-separated workflows ready for backend integration.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <Link
                  to="/citizen/login"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-bold bg-civic-teal-600 hover:bg-civic-teal-500 text-white transition-colors"
                >
                  Explore Citizen View
                </Link>
                <Link
                  to="/authority/login"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold bg-civic-navy-800 hover:bg-civic-navy-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  Explore Authority View
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
