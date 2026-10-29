import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AnalysisSummary from '../../components/AnalysisSummary';
import StatusUpdateForm from '../../components/StatusUpdateForm';
import { EmptyState, Notice, PriorityBadge, StatusBadge, Timeline } from '../../components/ui';
import { STATUS_MESSAGES } from '../../utils/constants';
import { formatDate, formatDateTime } from '../../utils/format';

// Note: complaints are already filtered to what this user may see (see AppContext / complaintService).
export default function ComplaintDetail({ role }) {
  const { id } = useParams();
  const { complaints, updateStatus } = useApp();
  const base = role === 'citizen' ? '/citizen/complaints' : '/authority/complaints';
  const c = complaints.find((x) => x.id === id);

  if (!c) {
    return (
      <EmptyState icon={ShieldAlert} title="Complaint not found" action={<Link className="btn btn-primary" to={base}>Back to complaints</Link>}>
        This complaint does not exist, or your account does not have access to it.
      </EmptyState>
    );
  }

  const isAuthority = role === 'authority';
  const decisionEntry = [...c.statusHistory].reverse().find((h) => h.status === c.status);
  const tone = c.status === 'Denied' ? 'error' : c.status === 'Resolved' ? 'success' : c.status === 'Waiting List' ? 'warning' : 'info';

  return (
    <article className="detail-page">
      <Link className="back-link" to={base}><ArrowLeft size={16} aria-hidden="true" />Back to complaints</Link>

      <header className="page-header">
        <div>
          <p className="mono muted small">{c.id}</p>
          <h1>{c.title}</h1>
          <div className="badge-row">
            <StatusBadge status={c.status} />
            <PriorityBadge priority={c.priority} />
          </div>
        </div>
      </header>

      <Notice tone={tone} title={c.status}>
        <p>{STATUS_MESSAGES[c.status]}</p>
        <p className="small">Submitted {formatDate(c.createdAt)} · Last updated {formatDateTime(c.updatedAt)}</p>
      </Notice>

      {c.status === 'Resolved' && (
        <section className="card" aria-labelledby="res-heading">
          <h2 id="res-heading">Resolution</h2>
          <dl className="detail-grid">
            <div><dt>Resolution date</dt><dd>{decisionEntry ? formatDate(decisionEntry.at) : '—'}</dd></div>
            <div><dt>Authority note</dt><dd>{c.resolutionNote || 'No note was provided.'}</dd></div>
          </dl>
        </section>
      )}

      {c.status === 'Denied' && (
        <section className="card" aria-labelledby="den-heading">
          <h2 id="den-heading">Decision</h2>
          <dl className="detail-grid">
            <div><dt>Date of decision</dt><dd>{decisionEntry ? formatDate(decisionEntry.at) : '—'}</dd></div>
            <div className="span-2"><dt>Reason</dt><dd>{c.decisionReason || 'No reason was recorded. Contact the responsible office for details.'}</dd></div>
          </dl>
        </section>
      )}

      <div className="detail-layout">
        <div className="detail-main">
          <section className="card" aria-labelledby="info-heading">
            <h2 id="info-heading">Complaint information</h2>
            <p className="small muted">Provided by the citizen.</p>
            <dl className="detail-grid">
              <div><dt>Complaint ID</dt><dd className="mono">{c.id}</dd></div>
              <div><dt>Category</dt><dd>{c.category}</dd></div>
              <div><dt>Submitted</dt><dd>{formatDateTime(c.createdAt)}</dd></div>
              <div><dt>Days the problem has existed</dt><dd>{c.issueDurationDays}</dd></div>
              <div><dt>Address</dt><dd>{c.address}</dd></div>
              <div><dt>City or locality</dt><dd>{c.locality}</dd></div>
              <div><dt>Nearby landmark</dt><dd>{c.nearbyLandmark || 'Nil'}</dd></div>
              <div><dt>Photo</dt><dd>{c.imageName || 'None attached'}</dd></div>
              {isAuthority && (
                <div>
                  <dt>GPS coordinates</dt>
                  <dd>{c.latitude != null ? `${c.latitude.toFixed(5)}, ${c.longitude.toFixed(5)}` : 'Not provided'}</dd>
                </div>
              )}
            </dl>
            <div className="span-full">
              <h3>Description</h3>
              <p className="pre-wrap">{c.description}</p>
            </div>
            {c.imagePreview && (
              <figure className="complaint-photo">
                <img src={c.imagePreview} alt={`Photo submitted with complaint ${c.id}`} />
              </figure>
            )}
          </section>

          {isAuthority && (
            <section className="card" aria-labelledby="contact-heading">
              <h2 id="contact-heading">Citizen contact (authority only)</h2>
              <dl className="detail-grid">
                <div><dt>Name</dt><dd>{c.citizenName}</dd></div>
                <div><dt>Email</dt><dd>{c.citizenContact?.email}</dd></div>
                <div><dt>Phone</dt><dd>{c.citizenContact?.phone}</dd></div>
              </dl>
            </section>
          )}

          <section className="card" aria-labelledby="hist-heading">
            <h2 id="hist-heading">Status history</h2>
            <Timeline history={c.statusHistory} />
          </section>
        </div>

        {isAuthority && (
          <aside className="detail-side">
            <AnalysisSummary complaint={c} />
            <StatusUpdateForm complaint={c} onUpdate={updateStatus} />
          </aside>
        )}
      </div>

      {!isAuthority && (
        <p className="small muted">Only the responsible authority can change this complaint's status.</p>
      )}
    </article>
  );
}
