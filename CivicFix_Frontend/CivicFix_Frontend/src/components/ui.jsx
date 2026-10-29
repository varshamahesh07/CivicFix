import { useMemo, useState } from 'react';
import {
  AlertCircle, AlertTriangle, CircleCheck, CircleX, Clock, Eye, EyeOff, FileText, Flag, Hourglass, RefreshCw, Upload, X,
} from 'lucide-react';
import { validateFile, passwordStrength } from '../utils/validation';
import { formatDateTime } from '../utils/format';

export function Field({ id, label, error, hint, as = 'input', children, ...props }) {
  const Tag = as;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {hint && <p className="hint" id={`${id}-hint`}>{hint}</p>}
      <Tag
        id={id}
        className={`input${error ? ' input-error' : ''}`}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        {...props}
      >
        {children}
      </Tag>
      {error && (
        <p className="error-text" id={`${id}-error`}>
          <AlertCircle size={15} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

export function PasswordField({ id, label, error, hint, value, onChange, autoComplete = 'new-password', children }) {
  const [show, setShow] = useState(false);
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {hint && <p className="hint" id={`${id}-hint`}>{hint}</p>}
      <div className="input-wrap">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          className={`input${error ? ' input-error' : ''}`}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
        />
        <button
          type="button"
          className="icon-btn input-action"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          aria-pressed={show}
        >
          {show ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </div>
      {children}
      {error && (
        <p className="error-text" id={`${id}-error`}>
          <AlertCircle size={15} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

export function PasswordStrength({ value }) {
  const { score, label } = passwordStrength(value);
  if (!value) return null;
  return (
    <div className="strength" aria-live="polite">
      <div className="strength-bar" data-score={score} aria-hidden="true"><span /></div>
      <span>Password strength: <strong>{label}</strong></span>
    </div>
  );
}

export function FileUpload({ id, label, hint, accept, types, typeLabel, maxMB, file, onChange, previewable = false, error }) {
  const previewUrl = useMemo(() => (previewable && file ? URL.createObjectURL(file) : null), [file, previewable]);

  function handleSelect(e) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    const msg = validateFile(f, { types, maxMB, typeLabel });
    onChange(msg ? null : f, msg);
  }

  return (
    <div className="field">
      <span className="field-label">{label}</span>
      {hint && <p className="hint" id={`${id}-hint`}>{hint}</p>}
      {!file ? (
        <label htmlFor={id} className="dropzone">
          <Upload size={22} aria-hidden="true" />
          <span>Choose a file ({typeLabel}, up to {maxMB} MB)</span>
        </label>
      ) : (
        <div className="file-row">
          {previewUrl && <img src={previewUrl} alt="Preview of the selected image" className="preview" />}
          <div className="file-meta">
            <strong>{file.name}</strong>
            <small>{(file.size / 1024 / 1024).toFixed(2)} MB</small>
          </div>
          <div className="btn-row">
            <label htmlFor={id} className="btn btn-ghost btn-sm">
              <RefreshCw size={14} aria-hidden="true" />Replace
            </label>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange(null, null)}>
              <X size={14} aria-hidden="true" />Remove
            </button>
          </div>
        </div>
      )}
      <input id={id} type="file" accept={accept} onChange={handleSelect} className="sr-only" aria-describedby={hint ? `${id}-hint` : undefined} />
      {error && (
        <p className="error-text" role="alert">
          <AlertCircle size={15} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

export function Notice({ tone = 'info', title, children }) {
  const Icon = { success: CircleCheck, error: CircleX, warning: AlertTriangle, info: FileText }[tone];
  return (
    <div className={`notice notice-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon size={18} aria-hidden="true" />
      <div>
        {title && <strong className="notice-title">{title}</strong>}
        <div>{children}</div>
      </div>
    </div>
  );
}

const STATUS_STYLE = {
  Registered: { Icon: FileText, cls: 'badge-registered' },
  Ongoing: { Icon: Clock, cls: 'badge-ongoing' },
  Resolved: { Icon: CircleCheck, cls: 'badge-resolved' },
  Denied: { Icon: CircleX, cls: 'badge-denied' },
  'Waiting List': { Icon: Hourglass, cls: 'badge-waiting' },
};

export function StatusBadge({ status }) {
  const { Icon, cls } = STATUS_STYLE[status] || STATUS_STYLE.Registered;
  return (
    <span className={`badge ${cls}`}>
      <Icon size={14} aria-hidden="true" />
      {status}
    </span>
  );
}

const PRIORITY_CLS = { Critical: 'badge-critical', High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' };

export function PriorityBadge({ priority }) {
  if (!priority) return <span className="muted">Not assessed</span>;
  return (
    <span className={`badge ${PRIORITY_CLS[priority]}`}>
      <Flag size={14} aria-hidden="true" />
      {priority}
    </span>
  );
}

export function Timeline({ history }) {
  return (
    <ol className="timeline">
      {history.map((h, i) => (
        <li key={`${h.at}-${i}`} className="timeline-item">
          <span className="timeline-dot" aria-hidden="true" />
          <div className="timeline-body">
            <div className="timeline-head">
              <StatusBadge status={h.status} />
              <time dateTime={h.at}>{formatDateTime(h.at)}</time>
            </div>
            {h.note && <p>{h.note}</p>}
            <small className="muted">Recorded by {h.by}</small>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function EmptyState({ icon: Icon, title, children, action }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={36} aria-hidden="true" />}
      <h2>{title}</h2>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

export function StatGrid({ stats }) {
  return (
    <ul className="stat-grid">
      {stats.map(({ label, value, tone }) => (
        <li key={label} className={`stat stat-${tone || 'neutral'}`}>
          <span className="stat-value">{value}</span>
          <span className="stat-label">{label}</span>
        </li>
      ))}
    </ul>
  );
}
