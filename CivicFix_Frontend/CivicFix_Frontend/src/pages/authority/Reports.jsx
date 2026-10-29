import { Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader, StatGrid } from '../../components/ui';
import { CATEGORIES, PRIORITIES, STATUSES } from '../../utils/constants';
import { countBy, countByStatus } from '../../utils/stats';

function Bars({ title, data, order }) {
  const entries = order.map((k) => [k, data[k] || 0]);
  const max = Math.max(1, ...entries.map(([, v]) => v));
  return (
    <section className="card section-card" aria-labelledby={`bars-${title}`}>
      <h2 id={`bars-${title}`}>{title}</h2>
      <ul className="bar-list">
        {entries.map(([k, v]) => (
          <li key={k} className="bar-row">
            <span className="bar-label">{k}</span>
            <span className="bar-track" aria-hidden="true"><span className="bar-fill" style={{ width: `${(v / max) * 100}%` }} /></span>
            <strong className="bar-value">{v}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}

function toCsv(rows) {
  const header = ['Complaint ID', 'Title', 'Category', 'Citizen', 'Locality', 'Priority', 'Status', 'Days existing', 'Submitted', 'Last updated'];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = rows.map((c) => [c.id, c.title, c.category, c.citizenName, c.locality, c.priority, c.status, c.issueDurationDays, c.createdAt, c.updatedAt].map(esc).join(','));
  return [header.map(esc).join(','), ...lines].join('\n');
}

export default function Reports() {
  const { complaints } = useApp();
  const s = countByStatus(complaints);
  const resolutionRate = s.total ? Math.round((s.Resolved / s.total) * 100) : 0;
  const open = s.Registered + s.Ongoing + s['Waiting List'];

  const stats = [
    { label: 'Total complaints', value: s.total },
    { label: 'Open', value: open, tone: 'info' },
    { label: 'Resolved', value: s.Resolved, tone: 'success' },
    { label: 'Resolution rate', value: `${resolutionRate}%`, tone: 'neutral' },
  ];

  function exportCsv() {
    const blob = new Blob([toCsv(complaints)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `civicfix-complaints-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Summary of complaints in the current data set."
        action={<button type="button" className="btn btn-outline" onClick={exportCsv} disabled={!complaints.length}><Download size={18} aria-hidden="true" />Export CSV</button>}
      />
      <StatGrid stats={stats} />
      <div className="bars-grid">
        <Bars title="By status" data={countBy(complaints, 'status')} order={STATUSES} />
        <Bars title="By priority" data={countBy(complaints, 'priority')} order={PRIORITIES} />
        <Bars title="By category" data={countBy(complaints, 'category')} order={CATEGORIES} />
      </div>
      <p className="small muted">The CSV export excludes citizen contact details.</p>
    </>
  );
}
