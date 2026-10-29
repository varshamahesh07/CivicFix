import React from 'react';
import { Clock, Wrench, CheckCircle2, XCircle, AlertCircle, Hourglass } from 'lucide-react';

export function StatusBadge({ status, size = 'sm' }) {
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[11px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm font-medium',
  };

  switch (status) {
    case 'Registered':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-slate-100 text-slate-800 border border-slate-300 ${sizeClasses[size]}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          Registered
        </span>
      );
    case 'Ongoing':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-blue-50 text-blue-800 border border-blue-300 ${sizeClasses[size]}`}>
          <Wrench className="w-3 h-3 text-blue-600" />
          Ongoing
        </span>
      );
    case 'Waiting List':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-amber-50 text-amber-900 border border-amber-300 ${sizeClasses[size]}`}>
          <Hourglass className="w-3 h-3 text-amber-700 animate-pulse" />
          Waiting List
        </span>
      );
    case 'Resolved':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 ${sizeClasses[size]}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Resolved
        </span>
      );
    case 'Denied':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-rose-50 text-rose-800 border border-rose-300 ${sizeClasses[size]}`}>
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          Denied
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center rounded-full font-medium bg-gray-100 text-gray-700 border border-gray-300 ${sizeClasses[size]}`}>
          {status}
        </span>
      );
  }
}

export function PriorityBadge({ priority, size = 'sm' }) {
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[11px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm font-semibold',
  };

  switch (priority) {
    case 'Critical':
      return (
        <span className={`inline-flex items-center gap-1 rounded font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-300 ${sizeClasses[size]}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
          Critical
        </span>
      );
    case 'High':
      return (
        <span className={`inline-flex items-center gap-1 rounded font-semibold uppercase tracking-wider bg-orange-50 text-orange-800 border border-orange-300 ${sizeClasses[size]}`}>
          High
        </span>
      );
    case 'Medium':
      return (
        <span className={`inline-flex items-center gap-1 rounded font-medium bg-amber-50 text-amber-800 border border-amber-200 ${sizeClasses[size]}`}>
          Medium
        </span>
      );
    case 'Low':
    default:
      return (
        <span className={`inline-flex items-center gap-1 rounded font-medium bg-slate-50 text-slate-700 border border-slate-200 ${sizeClasses[size]}`}>
          Low
        </span>
      );
  }
}

export function RiskScoreBadge({ score }) {
  if (score === null || score === undefined) return null;

  let colorClasses = 'bg-slate-100 text-slate-800 border-slate-300';
  if (score >= 85) {
    colorClasses = 'bg-rose-100 text-rose-900 border-rose-300';
  } else if (score >= 68) {
    colorClasses = 'bg-orange-100 text-orange-900 border-orange-300';
  } else if (score >= 45) {
    colorClasses = 'bg-amber-100 text-amber-900 border-amber-300';
  } else {
    colorClasses = 'bg-teal-50 text-teal-800 border-teal-200';
  }

  return (
    <div className={`inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-0.5 rounded border ${colorClasses}`}>
      <span className="text-[10px] uppercase font-sans tracking-tight text-civic-charcoal-500 font-semibold">Risk</span>
      <span>{score}</span>
      <span className="text-[10px] text-civic-charcoal-400 font-normal">/100</span>
    </div>
  );
}

export function CategoryBadge({ category }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-civic-navy-50 text-civic-navy-800 border border-civic-navy-200/60">
      {category}
    </span>
  );
}
