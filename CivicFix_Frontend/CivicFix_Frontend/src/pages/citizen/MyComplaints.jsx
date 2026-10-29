import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ListChecks, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ComplaintTable from '../../components/ComplaintTable';
import { EmptyState, Field, PageHeader } from '../../components/ui';
import { CATEGORIES, STATUSES } from '../../utils/constants';
import { applyFilters, defaultFilters } from '../../utils/filters';

export default function MyComplaints() {
  const { complaints } = useApp();
  const [f, setF] = useState({ ...defaultFilters, sort: 'newest' });
  const rows = useMemo(() => applyFilters(complaints, f), [complaints, f]);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const reset = () => setF({ ...defaultFilters, sort: 'newest' });

  return (
    <>
      <PageHeader title="My Complaints" subtitle="Search, filter, and open any complaint you have reported." />

      {complaints.length === 0 ? (
        <EmptyState icon={ListChecks} title="No complaints yet" action={<Link className="btn btn-primary" to="/citizen/report">Report a Complaint</Link>}>
          Your complaints will appear here after you submit them.
        </EmptyState>
      ) : (
        <>
          <form className="card filter-bar" role="search" onSubmit={(e) => e.preventDefault()}>
            <div className="filter-search">
              <Field id="q" type="search" label="Search by complaint ID or title" value={f.q} onChange={set('q')} />
            </div>
            <Field as="select" id="status" label="Status" value={f.status} onChange={set('status')}>
              <option value="">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Field>
            <Field as="select" id="category" label="Category" value={f.category} onChange={set('category')}>
              <option value="">All categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Field>
            <Field as="select" id="sort" label="Sort by" value={f.sort} onChange={set('sort')}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </Field>
            <div className="filter-actions">
              <button type="button" className="btn btn-ghost" onClick={reset}>Reset filters</button>
            </div>
          </form>

          <p className="muted small" aria-live="polite">Showing {rows.length} of {complaints.length} complaints</p>

          {rows.length === 0 ? (
            <EmptyState icon={Search} title="No complaints match these filters">
              Try a different search, or reset the filters.
            </EmptyState>
          ) : (
            <ComplaintTable rows={rows} detailBase="/citizen/complaints" caption="My complaints" />
          )}
        </>
      )}
    </>
  );
}
