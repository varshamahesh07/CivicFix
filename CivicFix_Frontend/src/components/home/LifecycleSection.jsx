import React from 'react';
import { PlusCircle, Cpu, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function LifecycleSection() {
  const steps = [
    {
      number: '1',
      title: 'Report the Problem',
      description: 'Citizen captures photos, dictates voice description, and submits street location.',
      icon: PlusCircle
    },
    {
      number: '2',
      title: 'Analyze and Prioritize',
      description: 'Rule engine calculates 0–100 risk score, flags duplicate issues, and suggests department.',
      icon: Cpu
    },
    {
      number: '3',
      title: 'Authority Reviews',
      description: 'Department officers inspect the priority queue, assign field staff, and update live progress.',
      icon: ShieldCheck
    },
    {
      number: '4',
      title: 'Track the Resolution',
      description: 'Citizen observes transparent status transitions from Registered to verified Resolution.',
      icon: CheckCircle2
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-civic-navy-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-civic-teal-700">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-civic-navy-950 mt-2 tracking-tight">
            A Simple Four-Step Civic Resolution Workflow
          </h2>
          <p className="text-xs sm:text-sm text-civic-charcoal-600 mt-2">
            Connecting neighborhood problem reporting directly with municipal action and accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={st.number}
                className="bg-civic-sand-50 rounded-2xl p-6 border border-civic-navy-200/80 hover:border-civic-teal-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-full bg-civic-navy-900 text-white font-mono text-sm font-bold flex items-center justify-center">
                      {st.number}
                    </span>
                    <Icon className="w-5 h-5 text-civic-teal-700" />
                  </div>

                  <h3 className="text-sm font-bold text-civic-navy-950 mb-2">
                    {st.title}
                  </h3>

                  <p className="text-xs text-civic-charcoal-600 leading-relaxed">
                    {st.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-civic-navy-200/60 text-[10px] font-mono text-civic-teal-700 font-semibold">
                  Phase {st.number} of 4
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
