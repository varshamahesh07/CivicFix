import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'md', to = '/', showTagline = false, light = false }) {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const content = (
    <div className="flex items-center gap-2.5 group select-none">
      {/* Distinctive custom SVG civic mark combining shield, location pin, and resolution checkmark */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]} transition-transform group-hover:scale-105 duration-200`}>
        <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Civic Navy Shield Foundation */}
          <path
            d="M20 3L6 9V20C6 29 12 35.5 20 38C28 35.5 34 29 34 20V9L20 3Z"
            fill={light ? "#0f233a" : "#0f233a"}
            className="transition-colors"
          />
          {/* Restrained Teal Pin Core */}
          <path
            d="M20 7L9 11.8V19.5C9 26.5 13.8 31.8 20 34C26.2 31.8 31 26.5 31 19.5V11.8L20 7Z"
            fill="#0d7675"
          />
          {/* Precision Center Marker */}
          <circle cx="20" cy="18" r="7.5" fill="#ffffff" />
          {/* Civic Checkmark of Accountability */}
          <path
            d="M16.5 18L19 20.5L24 15.5"
            stroke="#0f233a"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-extrabold tracking-tight ${textSizes[size]} ${light ? 'text-white' : 'text-civic-navy-900'}`}>
            Civic<span className="text-civic-teal-600">Fix</span>
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-civic-navy-100 text-civic-navy-800 font-semibold border border-civic-navy-200">
            Ops
          </span>
        </div>
        {showTagline && (
          <span className={`text-[11px] font-medium tracking-tight mt-0.5 ${light ? 'text-civic-navy-200' : 'text-civic-charcoal-500'}`}>
            Every Voice Matters, Every Issue Counts
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return <Link to={to} className="inline-flex items-center">{content}</Link>;
  }

  return content;
}
