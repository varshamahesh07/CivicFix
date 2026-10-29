import React from 'react';

export default function MovingTagline() {
  const repeatedText = "Every Voice Matters, Every Issue Counts.";

  return (
    <div className="bg-civic-navy-950 border-b border-civic-navy-800 text-white overflow-hidden py-2.5 select-none relative">
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-civic-navy-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-civic-navy-950 to-transparent z-10 pointer-events-none" />

      {/* Marquee Track using CSS Keyframes with pause on hover */}
      <div className="tagline-track flex items-center gap-10 whitespace-nowrap">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-10 text-xs sm:text-sm font-semibold tracking-wide">
            <span className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-civic-teal-400 inline-block" />
              <span className="text-slate-100 font-sans">{repeatedText}</span>
            </span>
            <span className="text-civic-teal-400 font-mono text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-civic-navy-900 border border-civic-navy-800">
              Civic Operations
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
