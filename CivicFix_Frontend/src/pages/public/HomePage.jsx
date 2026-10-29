import React from 'react';
import HeroSection from '../../components/home/HeroSection';
import MovingTagline from '../../components/home/MovingTagline';
import LifecycleSection from '../../components/home/LifecycleSection';
import FeaturesSection from '../../components/home/FeaturesSection';
import TransparencySection from '../../components/home/TransparencySection';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Moving Tagline Banner (Strict CSS Marquee) */}
      <MovingTagline />

      {/* 3. Lifecycle Walkthrough */}
      <LifecycleSection />

      {/* 4. Features & Core Capabilities */}
      <FeaturesSection />

      {/* 5. Trust, Transparency & Disclaimer */}
      <TransparencySection />

      {/* 6. Quick Action Callout */}
      <section className="py-12 bg-civic-sand-100 border-t border-civic-navy-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-extrabold text-civic-navy-950">
            Notice a civic breakdown in your neighborhood?
          </h3>
          <p className="text-sm text-civic-charcoal-600 max-w-xl mx-auto">
            Report potholes, flooded streets, streetlights, or waste overflow in under 60 seconds with exact location coordinates.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/citizen/report"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold text-white bg-civic-teal-600 hover:bg-civic-teal-700 shadow-md transition-all"
            >
              <span>Submit a Report</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/how-it-works"
              className="px-5 py-3 rounded-lg text-sm font-semibold text-civic-navy-900 bg-white hover:bg-civic-sand-50 border border-civic-navy-200 shadow-sm transition-all"
            >
              Explore Reporting Guidelines
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
