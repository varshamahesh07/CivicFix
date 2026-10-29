import { Link } from 'react-router-dom';
import { ListOrdered } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader, PriorityBadge, StatGrid, StatusBadge } from '../../components/ui';
import { countByStatus } from '../../utils/stats';
import { sortRows } from '../../utils/filters';
import { formatDate } from '../../utils/format';

export default function AuthorityDashboard() {
  const { user, complaints } = useApp();
  const s = countByStatus(complaints);
  const stats = [
    { label: 'Total Complaints', value: s.total },
    { label: 'Registered', value: s.Registered },
    { label: 'Ongoing', value: s.Ongoing, tone: 'info' },
    { label: 'Waiting List', value: s['Waiting List'], tone: 'warning' },
    { label: 'Resolved', value: s.Resolved, tone: 'success' },
    { label: 'Denied', value: s.Denied, tone: 'danger' },
  ];
  const top = sortRows(complaints.filter((c) => c.status !== 'Resolved' && c.status !== 'Denied'), 'priority').slice(0, 5);

  return (
    <>
      <PageHeader
        title={`Welcome, ${user.name.split(' ')[0]}`}
        subtitle={`${user.department} · Figures are calculated from current complaint records.`}
        action={<Link className="btn btn-navy" to="/authority/priority"><ListOrdered size={18} aria-hidden="true" />Open Priority Queue</Link>}
      />
      <StatGrid stats={stats} />

      <section className="card section-card" aria-labelledby="top-heading">
        <div className="card-head">
          <h2 id="top-heading">Open complaints needing attention</h2>
          <Link to="/authority/complaints">All complaints</Link>
        </div>
        {top.length === 0 ? (
          <p className="muted">No open complaints right now.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <caption className="sr-only">Top open complaints by priority</caption>
              <thead>
                <tr><th scope="col">ID</th><th scope="col">Title</th><th scope="col">Priority</th><th scope="col">Status</th><th scope="col">Submitted</th><th scope="col"><span className="sr-only">Actions</span></th></tr>
              </thead>
              <tbody>
                {top.map((c) => (
                  <tr key={c.id}>
                    <td className="mono">{c.id}</td>
                    <td>{c.title}</td>
                    <td><PriorityBadge priority={c.priority} /></td>
                    <td><StatusBadge status={c.status} /></td>
                    <td>{formatDate(c.createdAt)}</td>
                    <td><Link className="btn btn-outline btn-sm" to={`/authority/complaints/${c.id}`}>View Details<span className="sr-only"> for {c.id}</span></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
