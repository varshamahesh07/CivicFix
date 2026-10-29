import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import CitizenLayout from '../../components/layout/CitizenLayout';
import ComplaintTimeline from '../../components/complaints/ComplaintTimeline';
import { StatusBadge, PriorityBadge, RiskScoreBadge, CategoryBadge } from '../../components/common/Badge';
import {
  MapPin, Calendar, ArrowLeft, ShieldAlert, Image as ImageIcon,
  Building2, Clock, Landmark, Info
} from 'lucide-react';

export default function ComplaintTrackingPage() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { getComplaintForUser } = useComplaints();

  const { allowed, complaint, reason } = getComplaintForUser(id, currentUser);

  // Access control denial screen
  if (!allowed || !complaint) {
    return (
      <CitizenLayout>
        <div className="py-16 px-4 flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-rose-200 shadow-lg text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-civic-navy-950">
                Access Restricted
              </h2>
              <p className="text-xs text-civic-charcoal-600 mt-2 leading-relaxed">
                {reason || 'You do not have authorization to view this complaint reference.'}
              </p>
            </div>
            <div className="bg-civic-sand-50 p-3 rounded-lg text-[11px] text-civic-charcoal-500 font-mono text-left border border-civic-navy-100">
              <strong>Citizen Privacy Rule:</strong> Citizens may only inspect issues submitted from their authenticated account.
            </div>
            <div className="pt-2">
              <Link
                to="/citizen/complaints"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-civic-navy-900 hover:bg-civic-navy-800 transition-colors shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to My Complaints</span>
              </Link>
            </div>
          </div>
        </div>
      </CitizenLayout>
    );
  }

  const formattedDate = new Date(complaint.createdAt).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <CitizenLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 space-y-6 max-w-5xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            to="/citizen/complaints"
            className="inline-flex items-center gap-1 text-xs font-semibold text-civic-teal-700 hover:text-civic-teal-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Complaints</span>
          </Link>
        </div>

        {/* Complaint Title & Meta Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-civic-navy-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-civic-navy-100">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-mono font-bold text-civic-navy-950 bg-civic-sand-100 px-2.5 py-1 rounded border border-civic-navy-200">
                {complaint.id}
              </span>
              <CategoryBadge category={complaint.category} />
              <PriorityBadge priority={complaint.priority} size="xs" />
              <RiskScoreBadge score={complaint.riskScore} />
            </div>
            <div>
              <StatusBadge status={complaint.status} size="md" />
            </div>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-civic-navy-950">
              {complaint.title}
            </h1>
            <p className="text-xs sm:text-sm text-civic-charcoal-700 mt-2 leading-relaxed whitespace-pre-line">
              {complaint.description}
            </p>
          </div>

          {/* Detailed Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-civic-navy-100 text-xs bg-civic-sand-50/70 p-4 rounded-xl border border-civic-navy-100/60">
            <div>
              <span className="text-[10px] font-bold text-civic-charcoal-400 uppercase tracking-wider block">
                Location & Area
              </span>
              <p className="font-semibold text-civic-navy-950 mt-0.5">
                {complaint.address || complaint.location}
              </p>
              {complaint.latitude && complaint.longitude && (
                <span className="text-[10px] font-mono text-civic-teal-700 block mt-0.5">
                  GPS: {complaint.latitude}, {complaint.longitude}
                </span>
              )}
            </div>

            <div>
              <span className="text-[10px] font-bold text-civic-charcoal-400 uppercase tracking-wider block">
                Nearby Landmark
              </span>
              <p className="font-semibold text-civic-navy-950 mt-0.5">
                {complaint.nearbyLandmark || 'Nil'}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-civic-charcoal-400 uppercase tracking-wider block">
                Problem Duration
              </span>
              <p className="font-semibold text-civic-navy-950 mt-0.5">
                {complaint.issueDurationDays ? `${complaint.issueDurationDays} days` : 'Reported on occurrence'}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-civic-charcoal-400 uppercase tracking-wider block">
                Submitted Date
              </span>
              <p className="font-semibold text-civic-navy-950 mt-0.5">
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Attached Image Preview */}
          {complaint.imagePreview && (
            <div className="pt-2">
              <span className="text-xs font-bold text-civic-navy-900 uppercase tracking-wider block mb-2">
                Attached Ground Photo
              </span>
              <div className="rounded-xl overflow-hidden border border-civic-navy-200 max-w-md bg-civic-sand-100">
                <img
                  src={complaint.imagePreview}
                  alt={complaint.title}
                  className="w-full h-56 object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Status Timeline with Reassurance and Audit Logs */}
        <ComplaintTimeline
          statusHistory={complaint.statusHistory}
          currentStatus={complaint.status}
          resolutionNote={complaint.resolutionNote}
          deniedReason={complaint.deniedReason}
        />

        {/* Citizen Non-Modification Notice */}
        <div className="bg-white p-4 rounded-xl border border-civic-navy-200 text-xs text-civic-charcoal-500 flex items-center justify-between">
          <span>Official complaint statuses are updated strictly by municipal dispatch officers.</span>
          <span className="font-mono text-civic-teal-700 font-semibold">Reference: {complaint.id}</span>
        </div>

      </div>
    </CitizenLayout>
  );
}
