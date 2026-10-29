import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useComplaints } from '../../context/ComplaintContext';
import {
  CheckCircle2, Wrench, Clock, XCircle, Hourglass, AlertCircle
} from 'lucide-react';

export default function StatusUpdateModal({ isOpen, onClose, complaint, onUpdated }) {
  const { updateComplaintStatus } = useComplaints();
  const [selectedStatus, setSelectedStatus] = useState(complaint?.status || 'Ongoing');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmStep, setConfirmStep] = useState(false);

  if (!complaint) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (selectedStatus === 'Resolved' && !note.trim()) {
      setError('A resolution note is required when marking a complaint as Resolved.');
      return;
    }

    if (selectedStatus === 'Denied' && !note.trim()) {
      setError('A respectful reason is required when marking a complaint as Denied.');
      return;
    }

    // Require confirmation step for Resolved or Denied
    if ((selectedStatus === 'Resolved' || selectedStatus === 'Denied') && !confirmStep) {
      setConfirmStep(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const updated = await updateComplaintStatus(
        complaint.id,
        selectedStatus,
        note.trim() || `Status updated to ${selectedStatus} by operations officer.`
      );
      if (onUpdated) onUpdated(updated);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update complaint status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    { id: 'Registered', label: 'Registered', icon: Clock, color: 'text-slate-600' },
    { id: 'Ongoing', label: 'Ongoing', icon: Wrench, color: 'text-blue-600' },
    { id: 'Waiting List', label: 'Waiting List', icon: Hourglass, color: 'text-amber-700' },
    { id: 'Resolved', label: 'Resolved', icon: CheckCircle2, color: 'text-emerald-600' },
    { id: 'Denied', label: 'Denied', icon: XCircle, color: 'text-rose-600' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Update Operations Status: ${complaint.id}`}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-2">
            Target Platform Status
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {statusOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedStatus === option.id;
              return (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => {
                    setSelectedStatus(option.id);
                    setConfirmStep(false);
                  }}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? 'border-civic-teal-600 bg-civic-teal-50 text-civic-teal-900 ring-2 ring-civic-teal-500/20 shadow-xs'
                      : 'border-civic-navy-200 bg-white text-civic-charcoal-700 hover:bg-civic-sand-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1 ${option.color}`} />
                  <span className="text-[11px] text-center">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="status-note" className="block text-xs font-bold text-civic-navy-900 uppercase tracking-wider mb-1">
            {selectedStatus === 'Resolved'
              ? 'Resolution Verification Note *'
              : selectedStatus === 'Denied'
              ? 'Reason for Denial *'
              : 'Operational Progress Note (Optional)'}
          </label>
          <p className="text-[11px] text-civic-charcoal-500 mb-2">
            {selectedStatus === 'Resolved'
              ? 'Specify what repair, cleaning, or maintenance was executed on the ground.'
              : selectedStatus === 'Denied'
              ? 'Explain respectfully why this report cannot be resolved (e.g. private property, duplicate, out of jurisdiction).'
              : selectedStatus === 'Waiting List'
              ? 'Detail equipment/crew queue dependencies (e.g. awaiting excavator availability).'
              : 'Add details regarding work orders, dispatched field teams, or schedules.'}
          </p>
          <textarea
            id="status-note"
            rows={3}
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setConfirmStep(false);
            }}
            placeholder={
              selectedStatus === 'Resolved'
                ? 'e.g. Zone 4 asphalt crew completed pothole filling with bitumen. Verified on ground at 14:30.'
                : selectedStatus === 'Denied'
                ? 'e.g. Complaint pertains to private interior plumbing outside municipal public utility jurisdiction.'
                : selectedStatus === 'Waiting List'
                ? 'e.g. Queued for seasonal heavy machinery tender commencing next Monday.'
                : 'e.g. Field engineer dispatched. Work order #4092 created with Electrical maintenance wing.'
            }
            className="w-full text-xs rounded-lg border border-civic-navy-200 p-3 focus:outline-none focus:ring-2 focus:ring-civic-teal-500/50 text-civic-navy-950"
          />
        </div>

        {confirmStep && (
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              Please Confirm: Transitioning to {selectedStatus}
            </span>
            <p className="text-[11px] leading-relaxed text-amber-800">
              This action will mark the ticket as <strong>{selectedStatus}</strong>, record your note in the public audit timeline, and notify the citizen. Click "Confirm Status Update" below to finalize.
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-800 text-xs rounded-lg border border-rose-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-civic-sand-50 p-3 rounded-lg border border-civic-navy-100 text-[11px] text-civic-charcoal-600">
          <p>
            Updating this status will immediately record a timestamped audit entry in the complaint's history and refresh operational metrics.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-civic-navy-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-civic-charcoal-600 hover:bg-civic-sand-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-civic-teal-600 hover:bg-civic-teal-700 shadow-xs transition-all disabled:opacity-50"
          >
            {isSubmitting
              ? 'Updating...'
              : confirmStep
              ? `Confirm & Mark as ${selectedStatus}`
              : 'Save Status Update'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
