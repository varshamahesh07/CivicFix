import { PRIORITY_RANK } from './constants';

export const defaultFilters = { q: '', status: '', category: '', priority: '', location: '', minRisk: '', sort: 'newest' };

export function sortRows(rows, sort) {
  const r = [...rows];
  if (sort === 'oldest') r.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  else if (sort === 'priority') {
    // Priority first, then higher risk score, then earlier submission.
    r.sort(
      (a, b) =>
        (PRIORITY_RANK[a.priority] ?? 9) - (PRIORITY_RANK[b.priority] ?? 9) ||
        (b.riskScore ?? -1) - (a.riskScore ?? -1) ||
        a.createdAt.localeCompare(b.createdAt)
    );
  } else r.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return r;
}

export function applyFilters(list, f) {
  const q = f.q.trim().toLowerCase();
  const loc = f.location.trim().toLowerCase();
  const rows = list.filter(
    (c) =>
      (!q || c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || (c.citizenName || '').toLowerCase().includes(q)) &&
      (!f.status || c.status === f.status) &&
      (!f.category || c.category === f.category) &&
      (!f.priority || c.priority === f.priority) &&
      (!loc || `${c.address} ${c.locality}`.toLowerCase().includes(loc)) &&
      (!f.minRisk || (c.riskScore != null && c.riskScore >= Number(f.minRisk)))
  );
  return sortRows(rows, f.sort);
}
