import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmptyState, Field, Notice, PageHeader, PriorityBadge, StatusBadge } from '../../components/ui';
import { CATEGORIES, PRIORITIES, STATUSES } from '../../utils/constants';
import { applyFilters, defaultFilters } from '../../utils/filters';
import { formatDate } from '../../utils/format';

export default function AuthorityComplaints({ mode = 'all' }) {
  const { complaints } = useApp();
  const initial = { ...defaultFilters, sort: mode === 'priority' ? 'priority' : 'newest' };
  const [f, setF] = useState(initial);
  const hasRisk = complaints.some((c) => c.riskScore != null);
  const rows = useMemo(() => applyFilters(complaints, f), [complaints, f]);

  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const reset = () => setF(initial);
  const isPriority = mode === 'priority';

  return (
    <>
      <PageHeader
        title={isPriority ? 'Priority Queue' : 'All Complaints'}
        subtitle={isPriority ? 'Ordered Critical → High → Medium → Low.' : 'Review, filter, and open citizen complaints.'}
      />

      {isPriority && (
        <Notice tone="info">
          Priority and risk estimates support your decisions. They do not decide the outcome. Ties are ordered by risk score when available, then by submission time (earlier first).
        </Notice>
      )}

      <form className="card filter-bar" role="search" onSubmit={(e) => e.preventDefault()}>
        <div className="filter-search">
          <Field id="q" type="search" label="Search by ID, title, or citizen name" value={f.q} onChange={set('q')} />
        </div>
        <Field as="select" id="status" label="Status" value={f.status} onChange={set('status')}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Field>
        <Field as="select" id="category" label="Category" value={f.category} onChange={set('category')}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </Field>
        <Field as="select" id="priority" label="Priority" value={f.priority} onChange={set('priority')}>
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </Field>
        <Field id="location" label="Location (contains)" value={f.location} onChange={set('location')} />
        {hasRisk ? (
          <Field id="minRisk" type="number" min="0" max="100" label="Minimum risk score" value={f.minRisk} onChange={set('minRisk')} />
        ) : (
          <p className="small muted filter-note">Risk-score filter appears once analysis scores are available.</p>
        )}
        <Field as="select" id="sort" label="Sort by" value={f.sort} onChange={set('sort')}>
          <option value="priority">Priority</option>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </Field>
        <div className="filter-actions">
          <button type="button" className="btn btn-ghost" onClick={reset}>Reset filters</button>
        </div>
      </form>

      <p className="muted small" aria-live="polite">Showing {rows.length} of {complaints.length} complaints</p>

      {rows.length === 0 ? (
        <EmptyState icon={Search} title="No complaints match these filters">Try different filters, or reset them.</EmptyState>
      ) : (
        <>
          <div className="table-wrap table-desktop">
            <table className="data-table">
              <caption className="sr-only">Citizen complaints</caption>
              <thead>
                <tr>
                  <th scope="col">Complaint ID</th><th scope="col">Title</th><th scope="col">Category</th>
                  <th scope="col">Citizen</th><th scope="col">Location</th><th scope="col">Priority</th>
                  <th scope="col">Risk</th><th scope="col">Submitted</th><th scope="col">Status</th>
                  <th scope="col"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id}>
                    <td className="mono">{c.id}</td>
                    <td>{c.title}</td>
                    <td>{c.category}</td>
                    <td>{c.citizenName}</td>
                    <td>{c.locality}</td>
                    <td><PriorityBadge priority={c.priority} /></td>
                    <td>{c.riskScore ?? <span className="muted">N/A</span>}</td>
                    <td>{formatDate(c.createdAt)}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td><Link className="btn btn-outline btn-sm" to={`/authority/complaints/${c.id}`}>View Details<span className="sr-only"> for {c.id}</span></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="complaint-cards table-mobile">
            {rows.map((c) => (
              <li key={c.id} className="card item-card">
                <div className="item-card-head">
                  <span className="mono muted small">{c.id}</span>
                  <StatusBadge status={c.status} />
                </div>
                <h3>{c.title}</h3>
                <p className="small muted">{c.category} · {c.citizenName} · {c.locality}</p>
                <div className="item-card-foot">
                  <PriorityBadge priority={c.priority} />
                  <Link className="btn btn-outline btn-sm" to={`/authority/complaints/${c.id}`}>View Details<span className="sr-only"> for {c.id}</span></Link>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
