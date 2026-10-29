import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import AuthorityLayout from '../../components/layout/AuthorityLayout';
import { StatusBadge, PriorityBadge, RiskScoreBadge, CategoryBadge } from '../../components/common/Badge';
import AnalysisCard from '../../components/complaints/AnalysisCard';
import ComplaintTimeline from '../../components/complaints/ComplaintTimeline';
import StatusUpdateModal from '../../components/complaints/StatusUpdateModal';
import {
  ArrowLeft, MapPin, Calendar, User, Phone, Mail, Building2,
  Edit3, ShieldAlert, Image as ImageIcon, Landmark, Clock
} from 'lucide-react';

export default function AuthorityComplaintDetailPage() {
  const { id } = useParams();
  const { complaints } = useComplaints();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const complaint = complaints.find((c) => c.id.toUpperCase() === id.toUpperCase());

  if (!complaint) {
    return (
      <AuthorityLayout>
        <div className="py-16 px-4 flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-civic-navy-200 text-center space-y-4 shadow-md">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-civic-navy-950">Complaint Reference Not Found</h2>
            <p className="text-xs text-civic-charcoal-600">
              No active operational record found for ID <strong className="font-mono">{id}</strong>.
            </p>
            <div className="pt-2">
              <Link
                to="/authority/complaints"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-civic-navy-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Complaints Queue</span>
              </Link>
            </div>
          </div>
        </div>
      </AuthorityLayout>
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
    <AuthorityLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/authority/complaints"
            className="inline-flex items-center gap-1 text-xs font-semibold text-civic-teal-700 hover:text-civic-teal-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Complaints</span>
          </Link>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-civic-teal-600 hover:bg-civic-teal-700 shadow-xs transition-all"
          >
            <Edit3 className="w-4 h-4" />
            <span>Update Complaint Status</span>
          </button>
        </div>

        {/* Top Header Card */}
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

            <div className="flex items-center gap-3">
              <span className="text-xs text-civic-charcoal-400 font-mono">Current State:</span>
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

          {/* Citizen Contact Information & Incident Details (Authorized Personnel Only) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-civic-navy-100 text-xs bg-civic-sand-50/70 p-4 rounded-xl border border-civic-navy-100/60">
            <div>
              <span className="text-[10px] font-bold text-civic-charcoal-400 uppercase tracking-wider block mb-1">
                Citizen Reporter Profile
              </span>
              <p className="font-bold text-civic-navy-950">{complaint.citizenName}</p>
              <p className="text-civic-charcoal-500 font-mono">{complaint.citizenEmail}</p>
              <p className="text-civic-charcoal-500 font-mono">{complaint.citizenPhone || '+91 98000 00000'}</p>
              {complaint.citizenAge && (
                <p className="text-[11px] text-civic-charcoal-400 mt-0.5">Age: {complaint.citizenAge} yrs</p>
              )}
            </div>

            <div>
              <span className="text-[10px] font-bold text-civic-charcoal-400 uppercase tracking-wider block mb-1">
                Reported Location
              </span>
              <p className="font-semibold text-civic-navy-950">{complaint.address || complaint.location}</p>
              <p className="text-[11px] text-civic-charcoal-500">Locality: {complaint.location}</p>
              {complaint.latitude && complaint.longitude ? (
                <p className="text-[11px] font-mono text-civic-teal-700 mt-0.5">
                  GPS: {complaint.latitude}, {complaint.longitude}
                </p>
              ) : (
                <p className="text-[11px] text-civic-charcoal-400">Manual address entry</p>
              )}
            </div>

            <div>
              <span className="text-[10px] font-bold text-civic-charcoal-400 uppercase tracking-wider block mb-1">
                Landmark & Duration
              </span>
              <p className="font-medium text-civic-navy-950">
                Landmark: <span className="font-semibold">{complaint.nearbyLandmark || 'Nil'}</span>
              </p>
              <p className="text-civic-charcoal-500 mt-0.5">
                Existed for: <strong className="text-civic-navy-900">{complaint.issueDurationDays || 1} days</strong>
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-civic-charcoal-400 uppercase tracking-wider block mb-1">
                Intake Timestamp
              </span>
              <p className="font-medium text-civic-navy-950">{formattedDate}</p>
              <p className="text-[11px] text-civic-charcoal-500 font-mono mt-0.5">
                Channel: Citizen Web Intake
              </p>
            </div>
          </div>
        </div>

        {/* Operational Analysis & Timeline Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Analysis Card & Evidence */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Module 3: Intelligent Analysis Output */}
            <AnalysisCard complaint={complaint} />

            {/* Photographic Ground Documentation */}
            <div className="bg-white rounded-xl border border-civic-navy-200/90 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-civic-navy-100 pb-2">
                <span className="text-xs font-bold text-civic-navy-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-civic-teal-700" />
                  Photographic Ground Documentation
                </span>
                <span className="text-[11px] font-mono text-civic-charcoal-400">
                  {complaint.imagePreview ? '1 Photo Attached' : 'No photo uploaded'}
                </span>
              </div>

              {complaint.imagePreview ? (
                <div className="rounded-xl overflow-hidden border border-civic-navy-200 bg-civic-sand-100">
                  <img
                    src={complaint.imagePreview}
                    alt={complaint.title}
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-3 bg-white text-xs text-civic-charcoal-600 flex items-center justify-between">
                    <span>Evidence photograph submitted by {complaint.citizenName}</span>
                    <a
                      href={complaint.imagePreview}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-civic-teal-700 hover:underline text-[11px]"
                    >
                      Open Full Size &rarr;
                    </a>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-civic-charcoal-400 bg-civic-sand-50 rounded-lg border border-dashed border-civic-navy-200">
                  <span>Citizen did not attach a photograph for this complaint.</span>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Timeline & Resolution Audit */}
          <div className="lg:col-span-5 space-y-6">
            <ComplaintTimeline
              statusHistory={complaint.statusHistory}
              currentStatus={complaint.status}
              resolutionNote={complaint.resolutionNote}
              deniedReason={complaint.deniedReason}
            />

            {/* Operations Action Box */}
            <div className="bg-civic-navy-950 text-white rounded-xl p-5 border border-civic-navy-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-civic-teal-300">
                Operations Status Management
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dispatch field crews, queue for machinery, or mark complete with mandatory resolution documentation.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-lg text-xs font-bold text-civic-navy-950 bg-civic-teal-400 hover:bg-civic-teal-300 transition-colors shadow-xs"
              >
                Change Operational Status (5 Statuses)
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Status Update Modal */}
      {isModalOpen && (
        <StatusUpdateModal
          isOpen={isModalOpen}
          complaint={complaint}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </AuthorityLayout>
  );
}
