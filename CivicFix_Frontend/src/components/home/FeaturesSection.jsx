import React from 'react';
import { Camera, Mic, Sliders, ShieldAlert, Info } from 'lucide-react';

export default function FeaturesSection() {
  const coreFeatures = [
    {
      badge: 'IMAGE ANALYSIS',
      title: 'Visual Evidence Intake',
      description: 'Understand reported issues through submitted images.',
      icon: Camera,
      statusLabel: 'Image Upload & Preview (Simulated AI Tagging)'
    },
    {
      badge: 'NLP & VOICE',
      title: 'Speech & Text Processing',
      description: 'Turn complaint text or spoken descriptions into usable reports.',
      icon: Mic,
      statusLabel: 'Browser SpeechRecognition & Keyword Parser'
    },
    {
      badge: 'SMART PRIORITY',
      title: 'Operational Triage',
      description: 'Organize complaints by urgency and importance.',
      icon: Sliders,
      statusLabel: 'Deterministic Multi-Tier Priority Engine'
    },
    {
      badge: 'RISK ASSESSMENT',
      title: 'Public Hazard Scoring',
      description: 'Highlight issues that may need faster attention.',
      icon: ShieldAlert,
      statusLabel: '0–100 Rule-Based Severity Index'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-civic-sand-100/60 border-b border-civic-navy-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-civic-teal-700">
            Intelligent Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-civic-navy-950 mt-2 tracking-tight">
            Four Core Capabilities for Civic Resolution
          </h2>
          <p className="text-xs sm:text-sm text-civic-charcoal-600 mt-2 leading-relaxed">
            Every feature is designed to reduce friction for reporting citizens while giving municipal authorities structured, actionable data.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {coreFeatures.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-civic-navy-200/90 shadow-xs hover:border-civic-teal-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-civic-sand-100 text-civic-navy-900 border border-civic-navy-200">
                      {feat.badge}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-civic-teal-50 border border-civic-teal-200 flex items-center justify-center text-civic-teal-700">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-civic-navy-950 mb-2">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-civic-charcoal-700 leading-relaxed font-medium">
                    "{feat.description}"
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-civic-navy-100">
                  <span className="text-[10px] font-mono text-civic-charcoal-500 block truncate">
                    Mode: {feat.statusLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transparent Capability Distinction Disclaimer */}
        <div className="mt-8 bg-white p-4 rounded-xl border border-civic-navy-200/80 max-w-3xl mx-auto flex items-start gap-2.5 text-xs text-civic-charcoal-600">
          <Info className="w-4 h-4 text-civic-teal-700 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Architecture Notice:</strong> The features above demonstrate intended product capabilities. The current prototype executes client-side speech recognition, image previews, and rule-based risk scoring. Deep vector NLP and computer vision models connect via backend APIs during final deployment.
          </p>
        </div>
      </div>
    </section>
  );
}
