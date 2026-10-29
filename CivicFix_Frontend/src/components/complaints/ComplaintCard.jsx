import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge, PriorityBadge, RiskScoreBadge, CategoryBadge } from '../common/Badge';
import { MapPin, Calendar, ArrowRight, Image as ImageIcon } from 'lucide-react';

export default function ComplaintCard({ complaint, linkPrefix = '/citizen/complaints' }) {
  const formattedDate = new Date(complaint.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-xl border border-civic-navy-200/80 p-5 shadow-sm hover:shadow-md hover:border-civic-teal-300 transition-all flex flex-col justify-between group">
      <div>
        {/* Header: ID, Category & Status */}
        <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs text-civic-navy-900 bg-civic-navy-50 px-2 py-0.5 rounded border border-civic-navy-200">
              {complaint.id}
            </span>
            <CategoryBadge category={complaint.category} />
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        {/* Title */}
        <h4 className="text-sm sm:text-base font-bold text-civic-navy-950 mb-1.5 group-hover:text-civic-teal-700 transition-colors line-clamp-1">
          {complaint.title}
        </h4>

        {/* Description snippet */}
        <p className="text-xs text-civic-charcoal-600 line-clamp-2 mb-4 leading-relaxed">
          {complaint.description}
        </p>

        {/* Location & Image indicator */}
        <div className="space-y-1.5 text-xs text-civic-charcoal-500 mb-4 bg-civic-sand-50 p-2.5 rounded-lg border border-civic-navy-100">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-civic-teal-700 flex-shrink-0" />
            <span className="truncate">{complaint.location}</span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-civic-navy-100/60 text-[11px]">
            <span className="flex items-center gap-1 text-civic-charcoal-400">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
            {complaint.imagePreview ? (
              <span className="inline-flex items-center gap-1 text-civic-teal-700 font-medium">
                <ImageIcon className="w-3 h-3" /> Photo Attached
              </span>
            ) : (
              <span className="text-civic-charcoal-400">No Image</span>
            )}
          </div>
        </div>
      </div>

      {/* Footer: Priority, Risk & Link */}
      <div className="pt-3 border-t border-civic-navy-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <PriorityBadge priority={complaint.priority} size="xs" />
          <RiskScoreBadge score={complaint.riskScore} />
        </div>

        <Link
          to={`${linkPrefix}/${complaint.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-civic-teal-700 hover:text-civic-teal-900 group-hover:translate-x-0.5 transition-all"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
