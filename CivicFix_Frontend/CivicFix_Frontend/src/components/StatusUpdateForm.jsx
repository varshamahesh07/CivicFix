import { useEffect, useState } from 'react';
import { STATUSES } from '../utils/constants';
import { Field, Notice } from './ui';

export default function StatusUpdateForm({ complaint, onUpdate }) {
  const [status, setStatus] = useState(complaint.status);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setStatus(complaint.status); }, [complaint.status]);

  const needsNote = status === 'Denied';
  const important = status === 'Resolved' || status === 'Denied';

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (status === complaint.status && !note.trim()) {
      setError('Choose a different status or add a note before saving.');
      return;
    }
    if (needsNote && !note.trim()) {
      setError('Enter the reason for denial. The citizen will see this note.');
      return;
    }
    if (important && !confirming) {
      setConfirming(true);
      return;
    }
    save();
  }

  async function save() {
    if (busy) return;
    setBusy(true);
    try {
      await onUpdate(complaint.id, { status, note });
      setSuccess(`Status updated to ${status}. The citizen's view has been updated.`);
      setNote('');
      setConfirming(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit} noValidate aria-labelledby="status-heading">
      <h2 id="status-heading">Update status</h2>
      <Field as="select" id="new-status" label="New status" value={status} onChange={(e) => { setStatus(e.target.value); setConfirming(false); }}>
        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </Field>
      <Field
        as="textarea"
        id="status-note"
        rows={4}
        maxLength={500}
        label={needsNote ? 'Reason for denial (required)' : 'Note for the citizen (optional)'}
        hint="Notes are saved in the complaint history and are visible to the citizen."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      {error && <Notice tone="error">{error}</Notice>}
      {success && <Notice tone="success">{success}</Notice>}
      {confirming ? (
        <Notice tone="warning" title={`Confirm change to ${status}?`}>
          <p>This change is recorded in the history and shown to the citizen.</p>
          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={save} disabled={busy}>Confirm {status}</button>
            <button type="button" className="btn btn-ghost" onClick={() => setConfirming(false)}>Go back</button>
          </div>
        </Notice>
      ) : (
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Saving…' : 'Save status'}
        </button>
      )}
    </form>
  );
}
