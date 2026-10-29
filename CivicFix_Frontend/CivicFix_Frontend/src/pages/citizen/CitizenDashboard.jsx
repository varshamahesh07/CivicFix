import { Link } from 'react-router-dom';
import { FilePlus2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ComplaintTable from '../../components/ComplaintTable';
import { EmptyState, PageHeader, StatGrid } from '../../components/ui';
import { firstName } from '../../utils/format';
import { countByStatus } from '../../utils/stats';

export default function CitizenDashboard() {
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
  const recent = [...complaints].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return (
    <>
      <PageHeader
        title={`Welcome, ${firstName(user.name)}`}
        subtitle="Here is a summary of the civic complaints you have reported."
        action={<Link className="btn btn-primary" to="/citizen/report"><FilePlus2 size={18} aria-hidden="true" />Report a Complaint</Link>}
      />
      <StatGrid stats={stats} />

      <section className="card section-card" aria-labelledby="recent-heading">
        <div className="card-head">
          <h2 id="recent-heading">Recent complaints</h2>
          {complaints.length > 0 && <Link to="/citizen/complaints">View all</Link>}
        </div>
        {recent.length === 0 ? (
          <EmptyState icon={FilePlus2} title="You have not reported anything yet">
            When you report a problem, it appears here so you can follow its progress.
          </EmptyState>
        ) : (
          <ComplaintTable rows={recent} detailBase="/citizen/complaints" caption="Recent complaints" />
        )}
      </section>
    </>
  );
}
