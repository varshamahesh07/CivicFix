import React from 'react';
import {
  Check, Clock, Wrench, CheckCircle2, XCircle, Hourglass, ShieldCheck,
  AlertTriangle, MessageSquare, Info
} from 'lucide-react';

export default function ComplaintTimeline({
  statusHistory = [],
  currentStatus = 'Registered',
  resolutionNote = null,
  deniedReason = null
}) {
  const getReassuranceMessage = () => {
    switch (currentStatus) {
      case 'Ongoing':
        return {
          title: 'Active Operations in Progress',
          message: 'Your concern is being addressed. Every step brings us closer to a solution.',
          color: 'bg-blue-50 text-blue-900 border-blue-200',
          icon: Wrench
        };
      case 'Waiting List':
        return {
          title: 'Queued for Equipment & Crew Allocation',
          message: 'Your complaint matters. Waiting does not mean forgotten.',
          color: 'bg-amber-50 text-amber-900 border-amber-300',
          icon: Hourglass
        };
      case 'Resolved':
        return {
          title: 'Work Completed & Ground Verified',
          message: resolutionNote || 'The designated municipal department has executed the repair and verified completion on the ground.',
          color: 'bg-emerald-50 text-emerald-900 border-emerald-300',
          icon: CheckCircle2
        };
      case 'Denied':
        return {
          title: 'Complaint Closed Following Administrative Review',
          message: deniedReason || 'This report was reviewed by departmental officers and closed as outside public municipal jurisdiction.',
          color: 'bg-rose-50 text-rose-900 border-rose-200',
          icon: XCircle
        };
      case 'Registered':
      default:
        return {
          title: 'Complaint Registered in Municipal Queue',
          message: 'Your report is received and pending triage assignment by the responsible civic department.',
          color: 'bg-slate-50 text-slate-800 border-slate-200',
          icon: Clock
        };
    }
  };

  const reassurance = getReassuranceMessage();
  const ReassuranceIcon = reassurance.icon;

  return (
    <div className="bg-white rounded-2xl border border-civic-navy-200/90 p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-civic-navy-100 flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold text-civic-navy-950 uppercase tracking-wide">
            Complaint Lifecycle & Audit History
          </h3>
          <p className="text-xs text-civic-charcoal-500 mt-0.5">
            Transparent record of every state transition logged by citizens and municipal authorities.
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-civic-sand-100 text-civic-navy-900 border border-civic-navy-200">
          Current State: {currentStatus}
        </span>
      </div>

      {/* Prominent Confidence-Building Reassurance Message Box */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 ${reassurance.color}`}>
        <ReassuranceIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <h4 className="font-bold text-sm">{reassurance.title}</h4>
          <p className="leading-relaxed">{reassurance.message}</p>
        </div>
      </div>

      {/* Chronological Event History */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-civic-navy-900 uppercase tracking-wider">
          Chronological Audit Log
        </h4>

        {statusHistory.length === 0 ? (
          <p className="text-xs text-civic-charcoal-400 italic">No historical transitions recorded yet.</p>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-civic-navy-200">
            {statusHistory.map((item, index) => {
              const dateStr = new Date(item.timestamp).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div key={index} className="relative flex items-start gap-3 text-xs">
                  {/* Dot */}
                  <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-white border-2 border-civic-teal-600 ring-2 ring-white" />

                  <div className="flex-1 bg-civic-sand-50/80 p-3.5 rounded-xl border border-civic-navy-100 space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="font-bold text-civic-navy-950">
                        Status: {item.status}
                      </span>
                      <span className="text-[11px] font-mono text-civic-charcoal-400">
                        {dateStr}
                      </span>
                    </div>

                    <p className="text-civic-charcoal-700 leading-relaxed pt-0.5">
                      {item.note}
                    </p>

                    <div className="text-[10px] text-civic-charcoal-400 pt-1 font-mono">
                      Recorded by: <span className="font-semibold text-civic-navy-900">{item.updatedBy}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Resolution or Denied Note Highlights */}
      {currentStatus === 'Resolved' && resolutionNote && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Official Resolution Verification Note</span>
          </div>
          <p className="leading-relaxed pl-5 font-medium">{resolutionNote}</p>
        </div>
      )}

      {currentStatus === 'Denied' && deniedReason && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <Info className="w-4 h-4 text-rose-600" />
            <span>Authority Review Determination</span>
          </div>
          <p className="leading-relaxed pl-5 font-medium">{deniedReason}</p>
        </div>
      )}
    </div>
  );
}
