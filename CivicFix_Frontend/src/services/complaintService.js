import apiClient, { IS_DEMO_MODE } from './api';
import { INITIAL_COMPLAINTS } from '../data/mockComplaints';
import { analyzeComplaint } from './analysisService';

const COMPLAINTS_STORAGE_KEY = 'civicfix_demo_complaints_v2';

export const VALID_STATUSES = ['Registered', 'Ongoing', 'Waiting List', 'Resolved', 'Denied'];

function getStoredComplaints() {
  try {
    const raw = localStorage.getItem(COMPLAINTS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to read stored complaints', err);
  }
  // Initialize with initial seed
  localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(INITIAL_COMPLAINTS));
  return INITIAL_COMPLAINTS;
}

function saveStoredComplaints(complaints) {
  try {
    localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(complaints));
  } catch (err) {
    console.error('Failed to save complaints to storage', err);
  }
}

export const complaintService = {
  // Fetch all complaints
  async getAllComplaints() {
    if (!IS_DEMO_MODE) {
      const response = await apiClient.get('/complaints');
      return response.data;
    }
    return getStoredComplaints();
  },

  // Get single complaint by ID
  async getComplaintById(id) {
    if (!IS_DEMO_MODE) {
      const response = await apiClient.get(`/complaints/${id}`);
      return response.data;
    }
    const complaints = getStoredComplaints();
    const found = complaints.find((c) => c.id.toUpperCase() === id.toUpperCase());
    if (!found) {
      throw new Error(`Complaint with ID ${id} was not found.`);
    }
    return found;
  },

  // Citizen: Create new complaint
  async createComplaint(complaintData, currentUser) {
    if (!IS_DEMO_MODE) {
      const response = await apiClient.post('/complaints', complaintData);
      return response.data;
    }

    const complaints = getStoredComplaints();
    const currentYear = new Date().getFullYear();
    const nextNumber = String(complaints.length + 1).padStart(4, '0');
    const newId = `CF-${currentYear}-${nextNumber}`;

    // Perform deterministic assessment
    const analysis = analyzeComplaint(complaintData, complaints);

    const nowIso = new Date().toISOString();
    const newComplaint = {
      id: newId,
      citizenId: currentUser?.id || 'citizen-demo-01',
      citizenName: currentUser?.name || 'Demo Citizen',
      citizenEmail: currentUser?.email || 'citizen@example.com',
      citizenPhone: currentUser?.phone || '+91 98000 00000',
      citizenAge: currentUser?.age || 28,
      citizenAddress: currentUser?.address || 'Citizen Registered Locality',
      title: complaintData.title.trim(),
      category: complaintData.category,
      description: complaintData.description.trim(),
      address: complaintData.address?.trim() || complaintData.location?.trim() || 'Manual Address',
      location: complaintData.location?.trim() || 'Locality',
      nearbyLandmark: complaintData.nearbyLandmark?.trim() || 'Nil',
      issueDurationDays: Number(complaintData.issueDurationDays) || 1,
      latitude: complaintData.latitude || null,
      longitude: complaintData.longitude || null,
      imagePreview: complaintData.imagePreview || null,
      createdAt: nowIso,
      updatedAt: nowIso,
      status: 'Registered',
      priority: analysis.priority,
      riskScore: analysis.riskScore,
      suggestedDepartment: analysis.suggestedDepartment,
      duplicateResult: analysis.duplicateResult,
      analysisStatus: analysis.analysisStatus,
      analysisDetails: analysis.analysisDetails,
      statusHistory: [
        {
          status: 'Registered',
          timestamp: nowIso,
          note: 'Complaint successfully registered via CivicFix citizen portal.',
          updatedBy: `${currentUser?.name || 'Citizen'} (Citizen)`
        }
      ],
      resolutionNote: null,
      deniedReason: null
    };

    const updated = [newComplaint, ...complaints];
    saveStoredComplaints(updated);

    return newComplaint;
  },

  // Authority: Update complaint status
  async updateStatus(id, newStatus, note, authorityUser) {
    if (!VALID_STATUSES.includes(newStatus)) {
      throw new Error(`Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}`);
    }

    if (!IS_DEMO_MODE) {
      const response = await apiClient.patch(`/complaints/${id}/status`, {
        status: newStatus,
        note,
        resolutionNote: newStatus === 'Resolved' ? note : null,
        deniedReason: newStatus === 'Denied' ? note : null
      });
      return response.data;
    }

    const complaints = getStoredComplaints();
    const index = complaints.findIndex((c) => c.id.toUpperCase() === id.toUpperCase());
    if (index === -1) {
      throw new Error(`Complaint ${id} not found.`);
    }

    const nowIso = new Date().toISOString();
    const target = { ...complaints[index] };
    target.status = newStatus;
    target.updatedAt = nowIso;

    if (newStatus === 'Resolved') {
      target.resolutionNote = note || 'Issue resolved and verified on ground by municipal crew.';
      target.deniedReason = null;
    } else if (newStatus === 'Denied') {
      target.deniedReason = note || 'Complaint rejected following departmental inspection.';
      target.resolutionNote = null;
    }

    const historyEntry = {
      status: newStatus,
      timestamp: nowIso,
      note: note || `Status transitioned to ${newStatus}.`,
      updatedBy: `${authorityUser?.name || 'Authority'} (Civic Operations)`
    };

    target.statusHistory = [...(target.statusHistory || []), historyEntry];

    complaints[index] = target;
    saveStoredComplaints(complaints);
    return target;
  },

  // Reset demo storage to initial mock state
  resetDemoData() {
    localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(INITIAL_COMPLAINTS));
    return INITIAL_COMPLAINTS;
  }
};
