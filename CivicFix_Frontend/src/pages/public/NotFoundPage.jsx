import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import Logo from '../../components/common/Logo';

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-civic-sand-50">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-block">
          <Logo size="lg" to="/" />
        </div>

        <div className="w-16 h-16 rounded-full bg-civic-sand-100 border border-civic-navy-200 text-civic-navy-800 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8 text-civic-teal-700 animate-spin-slow" />
        </div>

        <div>
          <span className="font-mono text-xs font-bold text-civic-teal-700 uppercase tracking-widest">
            HTTP 404 Status
          </span>
          <h1 className="text-2xl font-extrabold text-civic-navy-950 mt-1">
            Civic Route Not Found
          </h1>
          <p className="text-xs text-civic-charcoal-500 mt-2 leading-relaxed">
            The page or operational route you requested does not exist in the CivicFix platform registry.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-civic-navy-900 hover:bg-civic-navy-800 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            to="/citizen/dashboard"
            className="px-4 py-2 rounded-lg text-xs font-semibold text-civic-navy-900 bg-white hover:bg-civic-sand-100 border border-civic-navy-200 transition-colors"
          >
            Citizen Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
