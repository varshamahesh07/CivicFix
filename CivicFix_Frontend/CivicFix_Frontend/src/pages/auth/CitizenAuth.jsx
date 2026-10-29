import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CircleCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Field, Notice, PasswordField, PasswordStrength } from '../../components/ui';
import { validateCitizenRegistration, validateLogin } from '../../utils/validation';

export function CitizenLogin() {
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
      await login('citizen', form);
      navigate('/citizen/dashboard');
    } catch (err) {
      setSubmitError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <p className="eyebrow">Citizen portal</p>
        <h1>Log in</h1>
        <form onSubmit={onSubmit} noValidate>
          {submitError && <Notice tone="error">{submitError}</Notice>}
          <Field id="identifier" label="Email or phone number" autoComplete="username" value={form.identifier} onChange={set('identifier')} error={errors.identifier} />
          <PasswordField id="password" label="Password" autoComplete="current-password" value={form.password} onChange={set('password')} error={errors.password} />
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
        </form>
        <p className="auth-switch">New to CivicFix? <Link to="/citizen/register">Create a citizen account</Link></p>
        <Notice tone="info" title="Demo account (prototype only)">
          Email <code>citizen@demo.civicfix</code> · Password <code>Citizen@123</code>
        </Notice>
      </div>
    </div>
  );
}

export function CitizenRegister() {
  const { registerCitizen } = useApp();
  const [form, setForm] = useState({ name: '', age: '', address: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (busy) return;
    setSubmitError('');
    const errs = validateCitizenRegistration(form);
    setErrors(errs);
    const firstError = Object.keys(errs)[0];
    if (firstError) { document.getElementById(firstError)?.focus(); return; }
    setBusy(true);
    try {
      await registerCitizen(form);
      setDone(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-card card">
          <Notice tone="success" title="Account created">
            Your citizen account is ready. You can now log in and report civic problems.
          </Notice>
          <Link className="btn btn-primary btn-block" to="/citizen/login">Go to log in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide card">
        <p className="eyebrow">Citizen portal</p>
        <h1>Create your citizen account</h1>
        <p className="muted small">Fields marked as required must be completed. Your details are used only to manage your complaints.</p>
        <form onSubmit={onSubmit} noValidate className="form-grid">
          {submitError && <div className="span-2"><Notice tone="error">{submitError}</Notice></div>}
          <Field id="name" label="Full name" autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />
          <Field id="age" label="Age" type="number" inputMode="numeric" min="13" max="120" value={form.age} onChange={set('age')} error={errors.age} />
          <div className="span-2">
            <Field id="address" label="Residential address" autoComplete="street-address" value={form.address} onChange={set('address')} error={errors.address} />
          </div>
          <Field id="email" label="Email address" type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
          <Field id="phone" label="Phone number" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} error={errors.phone} />
          <PasswordField id="password" label="Password" value={form.password} onChange={set('password')} error={errors.password} hint="Use 8+ characters with three of: uppercase, lowercase, number, symbol.">
            <PasswordStrength value={form.password} />
          </PasswordField>
          <PasswordField id="confirmPassword" label="Confirm password" value={form.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} />
          <div className="span-2">
            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
          </div>
        </form>
        <p className="auth-switch">Already registered? <Link to="/citizen/login">Log in</Link></p>
      </div>
    </div>
  );
}
