import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Field, Notice, PageHeader } from '../../components/ui';
import { validateProfile } from '../../utils/validation';

export default function ProfilePage({ role }) {
  const { user } = useApp();

  if (role === 'authority') {
    return (
      <>
        <PageHeader title="Profile" subtitle="Your official details as registered." />
        <section className="card">
          <dl className="detail-grid">
            <div><dt>Full name</dt><dd>{user.name}</dd></div>
            <div><dt>Designation</dt><dd>{user.designation}</dd></div>
            <div><dt>Department</dt><dd>{user.department}</dd></div>
            <div><dt>Authority ID</dt><dd className="mono">{user.authorityId}</dd></div>
            <div><dt>Email</dt><dd>{user.email}</dd></div>
            <div><dt>Phone</dt><dd>{user.phone}</dd></div>
          </dl>
          <Notice tone="info">Official details are managed by your administrator. Contact them to request a change.</Notice>
        </section>
      </>
    );
  }

  return <CitizenProfileForm key={user.id} />;
}

function CitizenProfileForm() {
  const { user, updateProfile } = useApp();
  const [form, setForm] = useState({ name: user.name, age: String(user.age), address: user.address, phone: user.phone });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
    setMessage('');
  };

  async function onSubmit(e) {
    e.preventDefault();
    const errs = validateProfile(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    setSubmitError('');
    try {
      await updateProfile(form);
      setMessage('Your profile has been saved.');
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader title="Profile" subtitle="Keep your contact details up to date so authorities can reach you." />
      <form className="card form-grid" onSubmit={onSubmit} noValidate>
        {message && <div className="span-2"><Notice tone="success">{message}</Notice></div>}
        {submitError && <div className="span-2"><Notice tone="error">{submitError}</Notice></div>}
        <Field id="name" label="Full name" value={form.name} onChange={set('name')} error={errors.name} />
        <Field id="age" label="Age" type="number" inputMode="numeric" min="13" max="120" value={form.age} onChange={set('age')} error={errors.age} />
        <div className="span-2">
          <Field id="address" label="Residential address" value={form.address} onChange={set('address')} error={errors.address} />
        </div>
        <Field id="phone" label="Phone number" type="tel" value={form.phone} onChange={set('phone')} error={errors.phone} />
        <Field id="email" label="Email address" value={user.email} readOnly hint="To change your email, contact support. This is not available in the prototype." />
        <div className="span-2">
          <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
        </div>
      </form>
    </>
  );
}
