import { useApp } from '../../context/AppContext';
import { Field, Notice, PageHeader } from '../../components/ui';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

// Controls that need a backend are shown disabled with an explanation. Nothing here pretends to save.
export default function SettingsPage({ role }) {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/', { replace: true });
  }

  return (
    <>
      <PageHeader title="Settings" subtitle="Account, notifications, and privacy." />

      <section className="card section-card" aria-labelledby="acc-heading">
        <h2 id="acc-heading">Account information</h2>
        <dl className="detail-grid">
          <div><dt>Name</dt><dd>{user.name}</dd></div>
          <div><dt>Email</dt><dd>{user.email}</dd></div>
          <div><dt>Account type</dt><dd>{role === 'citizen' ? 'Citizen' : 'Authority'}</dd></div>
        </dl>
      </section>

      <section className="card section-card" aria-labelledby="pw-heading">
        <h2 id="pw-heading">Change password</h2>
        <Notice tone="warning">Password changes need the secure backend. This prototype cannot update credentials safely.</Notice>
        <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
          <Field id="cur-pw" type="password" label="Current password" disabled autoComplete="current-password" />
          <Field id="new-pw" type="password" label="New password" disabled autoComplete="new-password" />
          <div className="span-2">
            <button type="button" className="btn btn-primary" disabled>Update password (requires backend)</button>
          </div>
        </form>
      </section>

      <section className="card section-card" aria-labelledby="notif-heading">
        <h2 id="notif-heading">Notification preferences</h2>
        <Notice tone="info">Notifications are not sent by this prototype. These options will work once the backend is connected.</Notice>
        <fieldset className="checks" disabled>
          <legend className="sr-only">Notification preferences</legend>
          <label><input type="checkbox" defaultChecked={role === 'citizen'} /> Email me when my complaint status changes</label>
          <label><input type="checkbox" /> Text me when a complaint is resolved</label>
        </fieldset>
      </section>

      <section className="card section-card" aria-labelledby="priv-heading">
        <h2 id="priv-heading">Privacy</h2>
        {role === 'citizen' ? (
          <p>Your complaints are visible only to you and to the authorities who handle them. Your contact details are not shown on public pages.</p>
        ) : (
          <p>Citizen contact details are shown only inside the authority workspace and must be used solely for handling complaints.</p>
        )}
        <p className="small muted">Prototype note: demo data is kept in memory and resets when you reload the page. Do not enter real personal data here.</p>
      </section>

      <section className="card section-card">
        <h2>Session</h2>
        <button type="button" className="btn btn-outline" onClick={handleLogout}><LogOut size={18} aria-hidden="true" />Logout</button>
      </section>
    </>
  );
}
