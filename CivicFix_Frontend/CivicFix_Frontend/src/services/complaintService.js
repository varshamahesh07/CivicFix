import { store } from './demoStore';
import { analyzeComplaint } from './analysisService';
import { STATUSES } from '../utils/constants';
import { assertDemoMode } from './api';

// Access rules (enforced here for the demo; a backend must enforce them too):
//  - Citizens see only their own complaints, without internal analysis, risk, or authority-only fields.
//  - Authorities see all complaints.
const canView = (c, user) => !!user && (user.role === 'authority' || c.citizenId === user.id);

function sanitize(c, user) {
  if (user.role === 'authority') return { ...c };
  const { citizenContact, analysis, riskScore, suggestedDepartment, ...citizenView } = c; // eslint-disable-line no-unused-vars
  return citizenView;
}

export function listComplaints(user) {
  return store.complaints.filter((c) => canView(c, user)).map((c) => sanitize(c, user));
}

function nextId() {
  const max = store.complaints.reduce((m, c) => Math.max(m, Number(c.id.split('-')[2]) || 0), 0);
  return `CF-${new Date().getFullYear()}-${String(max + 1).padStart(4, '0')}`;
}

export async function createComplaint(payload, user) {
  assertDemoMode('Complaint submission');
  if (!user || user.role !== 'citizen') throw new Error('Only signed-in citizens can submit complaints.');

  const analysis = await analyzeComplaint({ ...payload, existing: store.complaints });
  const now = new Date().toISOString();
  const complaint = {
    id: nextId(),
    citizenId: user.id,
    citizenName: user.name,
    citizenContact: { email: user.email, phone: user.phone },
    title: payload.title.trim(),
    category: payload.category,
    description: payload.description.trim(),
    imageName: payload.imageFile?.name || '',
    imagePreview: payload.imagePreview || null,
    address: payload.address.trim(),
    locality: payload.locality.trim(),
    nearbyLandmark: payload.nearbyLandmark || 'Nil',
    latitude: payload.latitude ?? null,
    longitude: payload.longitude ?? null,
    issueDurationDays: payload.issueDurationDays,
    status: 'Registered',
    priority: analysis.priority,
    riskScore: null,
    suggestedDepartment: analysis.suggestedDepartment,
    analysis: {
      classification: analysis.classification,
      state: 'simulated',
      duplicateOf: analysis.duplicateOf,
      imageState: analysis.imageState,
    },
    createdAt: now,
    updatedAt: now,
    statusHistory: [{ status: 'Registered', at: now, note: 'Complaint submitted successfully.', by: 'System' }],
    resolutionNote: '',
    decisionReason: '',
  };
  store.complaints.unshift(complaint);
  return sanitize(complaint, user);
}

export async function updateComplaintStatus(id, { status, note = '' }, user) {
  assertDemoMode('Status update');
  if (!user || user.role !== 'authority') throw new Error('Only authorities can change complaint status.');
  if (!STATUSES.includes(status)) throw new Error('Invalid status.');
  const c = store.complaints.find((x) => x.id === id);
  if (!c) throw new Error('Complaint not found.');

  const now = new Date().toISOString();
  const cleanNote = note.trim();
  c.status = status;
  c.updatedAt = now;
  c.statusHistory.push({ status, at: now, note: cleanNote, by: user.name });
  if (status === 'Resolved') c.resolutionNote = cleanNote;
  if (status === 'Denied') c.decisionReason = cleanNote;
  return { ...c };
}
