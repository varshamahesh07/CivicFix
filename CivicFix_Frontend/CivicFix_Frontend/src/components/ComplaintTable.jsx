import { Link } from 'react-router-dom';
import { formatDate } from '../utils/format';
import { PriorityBadge, StatusBadge } from './ui';

// Citizen-facing table. Desktop shows a table; mobile shows readable cards.
export default function ComplaintTable({ rows, detailBase, caption = 'Your complaints' }) {
  return (
    <>
      <div className="table-wrap table-desktop">
        <table className="data-table">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              <th scope="col">Complaint ID</th>
              <th scope="col">Title</th>
              <th scope="col">Location</th>
              <th scope="col">Reported</th>
              <th scope="col">Priority</th>
              <th scope="col">Status</th>
              <th scope="col"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                <td className="mono">{c.id}</td>
                <td>{c.title}</td>
                <td>{c.locality}</td>
                <td><time dateTime={c.createdAt}>{formatDate(c.createdAt)}</time></td>
                <td><PriorityBadge priority={c.priority} /></td>
                <td><StatusBadge status={c.status} /></td>
                <td>
                  <Link className="btn btn-outline btn-sm" to={`${detailBase}/${c.id}`}>
                    View Details<span className="sr-only"> for {c.id}</span>
                  </Link>
                </td>
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
            <p className="small muted">{c.locality} · Reported {formatDate(c.createdAt)}</p>
            <div className="item-card-foot">
              <PriorityBadge priority={c.priority} />
              <Link className="btn btn-outline btn-sm" to={`${detailBase}/${c.id}`}>
                View Details<span className="sr-only"> for {c.id}</span>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
