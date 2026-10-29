import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import CitizenLayout from '../../components/layout/CitizenLayout';
import ComplaintCard from '../../components/complaints/ComplaintCard';
import EmptyState from '../../components/common/EmptyState';
import { StatusBadge, PriorityBadge, RiskScoreBadge } from '../../components/common/Badge';
import {
  PlusCircle, FileText, Clock, Wrench, CheckCircle2, ArrowRight,
  Hourglass, ShieldCheck, MapPin, Calendar, Eye
} from 'lucide-react';

export default function CitizenDashboardPage() {
  const { currentUser } = useAuth();
  const { getCitizenComplaints, getCitizenStats } = useComplaints();

  const userComplaints = getCitizenComplaints(currentUser?.id);
  const stats = getCitizenStats(currentUser?.id);

  const recentComplaints = userComplaints.slice(0, 4);

  return (
    <CitizenLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-civic-navy-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-civic-teal-50 text-civic-teal-800 border border-civic-teal-200">
                Citizen Portal
              </span>
              <span className="text-xs text-civic-charcoal-400">•</span>
              <span className="text-xs text-civic-charcoal-500 font-mono">
                Citizen ID: {currentUser?.id || 'citizen-demo'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-civic-navy-950 mt-1">
              Welcome back, {currentUser?.name || 'Citizen'}
            </h1>
            <p className="text-xs sm:text-sm text-civic-charcoal-600 mt-0.5">
              Monitor your reported neighborhood problems and inspect municipal ground progress.
            </p>
          </div>

          <Link
            to="/citizen/report"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold text-white bg-civic-teal-600 hover:bg-civic-teal-700 shadow-xs transition-all flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report a Complaint</span>
          </Link>
        </div>

        {/* 5-Status Dynamic Summary Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-white p-4 rounded-xl border border-civic-navy-200/90 shadow-xs">
            <span className="text-[11px] font-bold text-civic-charcoal-500 uppercase tracking-wider block">
              Total Submitted
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-civic-navy-950 mt-1">
              {stats.total}
            </p>
            <span className="text-[10px] text-civic-charcoal-400 mt-1 block">
              All lifetime reports
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-civic-navy-200/90 shadow-xs">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-600" /> Registered
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-800 mt-1">
              {stats.registered}
            </p>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Intake verified
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
              <Wrench className="w-3 h-3 text-blue-600" /> Ongoing
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-700 mt-1">
              {stats.ongoing}
            </p>
            <span className="text-[10px] text-blue-600 mt-1 block">
              Field crew dispatched
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
              <Hourglass className="w-3 h-3 text-amber-700" /> Waiting List
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-700 mt-1">
              {stats.waitingList}
            </p>
            <span className="text-[10px] text-amber-600 mt-1 block">
              Queued for equipment
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Resolved
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700 mt-1">
              {stats.resolved}
            </p>
            <span className="text-[10px] text-emerald-600 mt-1 block">
              Verified & closed
            </span>
          </div>
        </div>

        {/* Recent Complaints Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-civic-navy-950">
                Recent Reported Issues
              </h2>
              <p className="text-xs text-civic-charcoal-500">
                Track status updates and inspection logs for your submissions
              </p>
            </div>
            {userComplaints.length > 0 && (
              <Link
                to="/citizen/complaints"
                className="text-xs font-bold text-civic-teal-700 hover:text-civic-teal-900 flex items-center gap-1"
              >
                <span>View All ({userComplaints.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {userComplaints.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-civic-navy-200 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-civic-sand-100 text-civic-charcoal-400 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-civic-navy-950">No complaints yet.</h3>
              <p className="text-xs text-civic-charcoal-500 max-w-sm mx-auto">
                Report a local problem to get started. Notice potholes, leaking pipes, or broken streetlights?
              </p>
              <div className="pt-2">
                <Link
                  to="/citizen/report"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-civic-teal-600 hover:bg-civic-teal-700 shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Report a Complaint</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentComplaints.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-civic-navy-200/90 p-5 shadow-xs hover:border-civic-teal-300 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs bg-civic-sand-100 text-civic-navy-950 px-2 py-0.5 rounded border border-civic-navy-200">
                        {item.id}
                      </span>
                      <StatusBadge status={item.status} size="xs" />
                    </div>

                    <h3 className="text-sm font-bold text-civic-navy-950 line-clamp-1">
                      {item.title}
                    </h3>

                    <p className="text-xs text-civic-charcoal-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-civic-navy-100 text-civic-charcoal-500">
                      <span className="truncate flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-civic-teal-700 flex-shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[11px] text-civic-charcoal-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-civic-navy-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <PriorityBadge priority={item.priority} size="xs" />
                      <RiskScoreBadge score={item.riskScore} />
                    </div>
                    <Link
                      to={`/citizen/complaints/${item.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-civic-teal-700 hover:text-civic-teal-900"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reassuring Civic Accountability Banner */}
        <div className="bg-civic-sand-100 rounded-xl p-5 border border-civic-navy-200/80 flex items-start gap-4">
          <div className="w-9 h-9 rounded-lg bg-civic-teal-100 text-civic-teal-800 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-civic-navy-900">
              Civic Operations Transparency Commitment
            </h4>
            <p className="text-civic-charcoal-600 leading-relaxed">
              Every status transition is logged with actor identification and timestamps. You can inspect the live timeline at any time to verify that your community report is actively processed.
            </p>
          </div>
        </div>

      </div>
    </CitizenLayout>
  );
}
