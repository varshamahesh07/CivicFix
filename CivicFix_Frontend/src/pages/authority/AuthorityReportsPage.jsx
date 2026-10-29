import React from 'react';
import { useComplaints } from '../../context/ComplaintContext';
import AuthorityLayout from '../../components/layout/AuthorityLayout';
import { CIVIC_CATEGORIES, DEPARTMENT_MAPPINGS } from '../../data/mockComplaints';
import {
  BarChart3, PieChart, CheckCircle2, Clock, Wrench, Flame,
  Building2, TrendingUp, AlertCircle, Hourglass, XCircle
} from 'lucide-react';

export default function AuthorityReportsPage() {
  const { complaints, authorityStats } = useComplaints();

  const total = complaints.length;
  const resolutionRate = total > 0 ? Math.round((authorityStats.resolved / total) * 100) : 0;

  // Compute category counts
  const categoryStats = CIVIC_CATEGORIES.map((cat) => {
    const matching = complaints.filter((c) => c.category === cat);
    const count = matching.length;
    const resolved = matching.filter((c) => c.status === 'Resolved').length;
    const ongoing = matching.filter((c) => c.status === 'Ongoing').length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return { category: cat, count, resolved, ongoing, percentage };
  }).sort((a, b) => b.count - a.count);

  // Compute department workloads
  const deptStats = Object.entries(DEPARTMENT_MAPPINGS).map(([cat, dept]) => {
    const matching = complaints.filter((c) => c.category === cat);
    const pending = matching.filter((c) => c.status !== 'Resolved' && c.status !== 'Denied').length;
    const totalDept = matching.length;
    return { dept, category: cat, total: totalDept, pending };
  }).filter((d) => d.total > 0).sort((a, b) => b.pending - a.pending);

  return (
    <AuthorityLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-civic-teal-700">
            Municipal Operations Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-civic-navy-950 mt-1">
            Resolution Performance & Department Reports
          </h1>
          <p className="text-xs sm:text-sm text-civic-charcoal-600 mt-0.5">
            Operational analytics derived dynamically from the active complaint database across all 5 platform statuses.
          </p>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-xl border border-civic-navy-200/90 shadow-xs">
            <span className="text-[11px] font-bold text-civic-charcoal-500 uppercase tracking-wider">
              Efficiency Rate
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold font-mono text-emerald-600">
                {resolutionRate}%
              </span>
              <span className="text-[10px] text-civic-charcoal-400">resolved</span>
            </div>
            <div className="w-full bg-civic-sand-200 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-emerald-600 h-full transition-all duration-500"
                style={{ width: `${resolutionRate}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-civic-navy-200/90 shadow-xs">
            <span className="text-[11px] font-bold text-civic-charcoal-500 uppercase tracking-wider">
              Avg Risk Rating
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold font-mono text-civic-navy-950">
                {authorityStats.avgRisk}
              </span>
              <span className="text-[10px] text-civic-charcoal-400">/ 100</span>
            </div>
            <span className="text-[10px] text-civic-charcoal-500 mt-2 block">
              Calculated mean
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
              <Wrench className="w-3 h-3" /> Ongoing
            </span>
            <p className="text-2xl font-extrabold font-mono text-blue-600 mt-1">
              {authorityStats.ongoing}
            </p>
            <span className="text-[10px] text-blue-700 font-medium mt-1 block">
              In field execution
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
              <Hourglass className="w-3 h-3" /> Waiting List
            </span>
            <p className="text-2xl font-extrabold font-mono text-amber-700 mt-1">
              {authorityStats.waitingList}
            </p>
            <span className="text-[10px] text-amber-600 font-medium mt-1 block">
              Equipment queued
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3 h-3" /> Critical Backlog
            </span>
            <p className="text-2xl font-extrabold font-mono text-rose-600 mt-1">
              {authorityStats.critical}
            </p>
            <span className="text-[10px] text-rose-700 font-medium mt-1 block">
              Immediate triage
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <XCircle className="w-3 h-3 text-rose-600" /> Denied
            </span>
            <p className="text-2xl font-extrabold font-mono text-slate-800 mt-1">
              {authorityStats.denied}
            </p>
            <span className="text-[10px] text-slate-500 font-medium mt-1 block">
              Reviewed & rejected
            </span>
          </div>
        </div>

        {/* Category Breakdown & Department Workloads */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Category Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-civic-navy-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-civic-navy-100 pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-civic-teal-700" />
                <h2 className="text-sm font-bold text-civic-navy-950 uppercase tracking-wider">
                  Breakdown by Civic Category
                </h2>
              </div>
              <span className="text-[11px] font-mono text-civic-charcoal-400">
                Total: {total} Records
              </span>
            </div>

            <div className="space-y-4 pt-1">
              {categoryStats.map((item) => (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-civic-navy-900">{item.category}</span>
                    <span className="font-mono text-civic-charcoal-600">
                      {item.count} complaints ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-civic-sand-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-civic-teal-600 h-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-civic-charcoal-400">
                    <span>Resolved: {item.resolved}</span>
                    <span>Ongoing in Field: {item.ongoing}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Workload Allocation */}
          <div className="bg-white rounded-2xl p-6 border border-civic-navy-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-civic-navy-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-civic-teal-700" />
                <h2 className="text-sm font-bold text-civic-navy-950 uppercase tracking-wider">
                  Department Workload Allocation
                </h2>
              </div>
              <span className="text-[11px] font-mono text-civic-charcoal-400">
                Active Routing
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {deptStats.map((d, index) => (
                <div
                  key={index}
                  className="p-3.5 bg-civic-sand-50 rounded-xl border border-civic-navy-100 space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-bold text-civic-navy-950">{d.dept}</h3>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        d.pending > 0
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      }`}
                    >
                      {d.pending} Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-civic-charcoal-500">
                    <span>Domain: {d.category}</span>
                    <span>Total Handled: {d.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </AuthorityLayout>
  );
}
