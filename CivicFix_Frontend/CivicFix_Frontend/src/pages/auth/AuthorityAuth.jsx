import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AUTHORITY_DEPARTMENTS } from '../../utils/constants';
import { Field, FileUpload, Notice, PasswordField, PasswordStrength } from '../../components/ui';
import { validateAuthorityRegistration, validateLogin } from '../../utils/validation';

const ID_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

export function AuthorityLogin() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (busy) return;
    setSubmitError('');
    const errs = validateLogin(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      await login('authority', form);
      navigate('/authority/dashboard');
    } catch (err) {
      setSubmitError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <p className="eyebrow eyebrow-navy">Authority portal</p>
        <h1>Authority log in</h1>
        <form onSubmit={onSubmit} noValidate>
          {submitError && <Notice tone="error">{submitError}</Notice>}
          <Field id="identifier" label="Authority ID or registered email" autoComplete="username" value={form.identifier} onChange={set('identifier')} error={errors.identifier} />
          <PasswordField id="password" label="Password" autoComplete="current-password" value={form.password} onChange={set('password')} error={errors.password} />
          <button type="submit" className="btn btn-navy btn-block" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
        </form>
        <p className="auth-switch">Need access? <Link to="/authority/register">Register as an authority</Link></p>
        <Notice tone="info" title="Demo access (prototype only)">
          ID <code>AUTH-DEMO-001</code> · Password <code>Authority@123</code>
        </Notice>
      </div>
    </div>
  );
}

export function AuthorityRegister() {
  const { registerAuthority } = useApp();
  const [form, setForm] = useState({ name: '', designation: '', department: '', authorityId: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [idFile, setIdFile] = useState(null);
  const [idError, setIdError] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (busy) return;
    setSubmitError('');
    const errs = validateAuthorityRegistration(form, idFile);
    setErrors(errs);
    const firstError = Object.keys(errs)[0];
    if (firstError) { document.getElementById(firstError)?.focus(); return; }
    setBusy(true);
    try {
      await registerAuthority(form, idFile);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <div className="auth-page">
        <div className="auth-card card">
          <Notice tone="warning" title="Verification pending">
            Your application has been received. Authority access is granted only after an authorized verification review.
          </Notice>
          <p className="small muted">Uploading an ID document does not verify your identity. Until your account is approved, you cannot access the authority portal.</p>
          <Link className="btn btn-navy btn-block" to="/authority/login">Back to authority log in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide card">
        <p className="eyebrow eyebrow-navy">Authority portal</p>
        <h1>Register as an authority</h1>
        <p className="muted small">Registration is reviewed before any portal access is granted.</p>
        <form onSubmit={onSubmit} noValidate className="form-grid">
          {submitError && <div className="span-2"><Notice tone="error">{submitError}</Notice></div>}
          <Field id="name" label="Full name" value={form.name} onChange={set('name')} error={errors.name} />
          <Field id="designation" label="Designation" value={form.designation} onChange={set('designation')} error={errors.designation} />
          <Field as="select" id="department" label="Department" value={form.department} onChange={set('department')} error={errors.department}>
            <option value="">Select a department</option>
            {AUTHORITY_DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </Field>
          <Field id="authorityId" label="Official employee or authority ID" value={form.authorityId} onChange={set('authorityId')} error={errors.authorityId} />
          <div className="span-2">
            <FileUpload
              id="idDocument"
              label="ID-proof document"
              hint="Upload an official ID card or letter. Accepted: PDF, JPG, or PNG, up to 5 MB."
              accept=".pdf,image/jpeg,image/png"
              types={ID_TYPES}
              typeLabel="a PDF, JPG, or PNG file"
              maxMB={5}
              previewable
              file={idFile}
              error={idError || errors.idDocument}
              onChange={(f, msg) => { setIdFile(f); setIdError(msg || ''); setErrors((er) => ({ ...er, idDocument: undefined })); }}
            />
          </div>
          <Field id="email" label="Official email address" type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
          <Field id="phone" label="Phone number" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} error={errors.phone} />
          <PasswordField id="password" label="Password" value={form.password} onChange={set('password')} error={errors.password} hint="Use 8+ characters with three of: uppercase, lowercase, number, symbol.">
            <PasswordStrength value={form.password} />
          </PasswordField>
          <PasswordField id="confirmPassword" label="Confirm password" value={form.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} />
          <div className="span-2">
            <button type="submit" className="btn btn-navy btn-block" disabled={busy}>{busy ? 'Submitting…' : 'Submit for verification'}</button>
          </div>
        </form>
        <p className="auth-switch">Already registered? <Link to="/authority/login">Log in</Link></p>
      </div>
    </div>
  );
}
