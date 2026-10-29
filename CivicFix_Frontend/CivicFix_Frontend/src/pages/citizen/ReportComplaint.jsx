import { useCallback, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CircleCheck, Crosshair, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import VoiceInput from '../../components/VoiceInput';
import { Field, FileUpload, Notice, PageHeader } from '../../components/ui';
import { CATEGORIES } from '../../utils/constants';
import { formatDateTime } from '../../utils/format';
import { validateComplaint } from '../../utils/validation';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const EMPTY = { title: '', category: '', description: '', address: '', locality: '', nearbyLandmark: '', issueDurationDays: '' };
const GEO_ERRORS = {
  1: 'Location permission was denied. You can enter the address manually.',
  2: 'Your device could not determine its location. Enter the address manually.',
  3: 'Finding your location took too long. Try again or enter the address manually.',
};

export default function ReportComplaint() {
  const { submitComplaint } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState('');
  const [coords, setCoords] = useState(null);
  const [geoMsg, setGeoMsg] = useState('');
  const [geoBusy, setGeoBusy] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [created, setCreated] = useState(null);
  const submittingRef = useRef(false);

  const set = (k) => (e) => {
    const v = e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const appendTranscript = useCallback((text) => {
    setForm((f) => ({ ...f, description: f.description.trim() ? `${f.description.trim()} ${text}` : text }));
    setErrors((er) => ({ ...er, description: undefined }));
  }, []);

  function useMyLocation() {
    setGeoMsg('');
    if (!('geolocation' in navigator)) {
      setGeoMsg('Location is not supported in this browser. Please enter the address manually.');
      return;
    }
    setGeoBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setGeoBusy(false);
        setGeoMsg('Location captured. Please confirm the address and landmark below.');
      },
      (err) => {
        setGeoBusy(false);
        setGeoMsg(GEO_ERRORS[err.code] || 'Location could not be determined. Enter the address manually.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  function handleReview(e) {
    e.preventDefault();
    const errs = validateComplaint(form);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) { document.getElementById(first)?.focus(); return; }
    setReviewing(true);
  }

  async function handleSubmit() {
    if (submittingRef.current) return; // blocks duplicate submissions from repeated clicks
    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError('');
    try {
      const c = await submitComplaint({
        ...form,
        issueDurationDays: Number(form.issueDurationDays),
        nearbyLandmark: form.nearbyLandmark.trim() || 'Nil',
        imageFile,
        imagePreview: imageFile ? URL.createObjectURL(imageFile) : null,
        hasImage: !!imageFile,
        latitude: coords?.latitude ?? null,
        longitude: coords?.longitude ?? null,
      });
      setCreated(c);
    } catch (err) {
      setSubmitError(err.message);
      submittingRef.current = false;
    } finally {
      setSubmitting(false);
    }
  }

  function reportAnother() {
    setForm(EMPTY); setErrors({}); setImageFile(null); setImageError(''); setCoords(null);
    setGeoMsg(''); setReviewing(false); setCreated(null); submittingRef.current = false;
    navigate('/citizen/report', { replace: true });
  }

  if (created) {
    return (
      <section className="card success-card" aria-live="polite">
        <CircleCheck size={44} className="success-icon" aria-hidden="true" />
        <h1>Complaint submitted</h1>
        <p>Your complaint is registered. Keep the ID below to follow its progress.</p>
        <dl className="detail-grid">
          <div><dt>Complaint ID</dt><dd className="mono">{created.id}</dd></div>
          <div><dt>Submitted</dt><dd>{formatDateTime(created.createdAt)}</dd></div>
          <div><dt>Status</dt><dd>Registered</dd></div>
        </dl>
        <div className="btn-row">
          <Link className="btn btn-primary" to={`/citizen/complaints/${created.id}`}>Track Complaint</Link>
          <button type="button" className="btn btn-outline" onClick={reportAnother}>Report another problem</button>
        </div>
      </section>
    );
  }

  const v = form;
  return (
    <>
      <PageHeader title="Report a Complaint" subtitle="Describe the problem in your own words. Only the required fields are marked." />

      <form onSubmit={handleReview} noValidate className="report-form">
        <fieldset className="card form-section" disabled={reviewing}>
          <legend>1. Complaint details</legend>
          <Field id="title" label="Complaint title" maxLength={120} value={v.title} onChange={set('title')} error={errors.title} hint="For example: Deep pothole near the bus stop" />
          <Field as="select" id="category" label="Category" value={v.category} onChange={set('category')} error={errors.category}>
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Field>

          <VoiceInput onTranscript={appendTranscript} disabled={reviewing} />

          <Field
            as="textarea"
            id="description"
            rows={5}
            maxLength={2000}
            label="Detailed description"
            hint="Say what you see, how it affects people, and whether it is a safety risk. At least 20 characters."
            value={v.description}
            onChange={set('description')}
            error={errors.description}
          />
        </fieldset>

        <fieldset className="card form-section" disabled={reviewing}>
          <legend>2. Photo (optional)</legend>
          <FileUpload
            id="image"
            label="Photo of the problem"
            hint="Image analysis is simulated in this prototype."
            accept="image/jpeg,image/png,image/webp"
            types={IMAGE_TYPES}
            typeLabel="JPG, PNG, or WEBP"
            maxMB={5}
            previewable
            file={imageFile}
            error={imageError}
            onChange={(f, msg) => { setImageFile(f); setImageError(msg || ''); }}
          />
        </fieldset>

        <fieldset className="card form-section" disabled={reviewing}>
          <legend>3. Location</legend>
          <Field id="address" label="Address or street" autoComplete="street-address" value={v.address} onChange={set('address')} error={errors.address} />
          <Field id="locality" label="City or locality" value={v.locality} onChange={set('locality')} error={errors.locality} />
          <Field id="nearbyLandmark" label="Nearby landmark (optional)" value={v.nearbyLandmark} onChange={set('nearbyLandmark')} hint="Type Nil if there is no nearby landmark." />

          <div className="geo-box">
            <button type="button" className="btn btn-outline" onClick={useMyLocation} disabled={geoBusy || reviewing}>
              <Crosshair size={18} aria-hidden="true" />{geoBusy ? 'Finding your location…' : 'Use My Location'}
            </button>
            <p className="small muted" aria-live="polite">
              {coords ? (
                <><MapPin size={14} aria-hidden="true" /> Coordinates captured: {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}</>
              ) : 'Optional. Your browser asks for permission before sharing your location.'}
            </p>
            {geoMsg && <p className="small">{geoMsg}</p>}
          </div>
        </fieldset>

        <fieldset className="card form-section" disabled={reviewing}>
          <legend>4. Duration</legend>
          <Field
            id="issueDurationDays"
            label="How many days has this problem existed?"
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            hint="Enter a whole number. Use 0 if it started today."
            value={v.issueDurationDays}
            onChange={set('issueDurationDays')}
            error={errors.issueDurationDays}
          />
        </fieldset>

        {reviewing && (
          <section className="card review-card" aria-labelledby="review-heading">
            <h2 id="review-heading">Review before you submit</h2>
            <dl className="detail-grid">
              <div><dt>Title</dt><dd>{v.title}</dd></div>
              <div><dt>Category</dt><dd>{v.category}</dd></div>
              <div className="span-2"><dt>Description</dt><dd className="pre-wrap">{v.description}</dd></div>
              <div><dt>Photo</dt><dd>{imageFile ? imageFile.name : 'None attached'}</dd></div>
              <div><dt>Address</dt><dd>{v.address}</dd></div>
              <div><dt>City or locality</dt><dd>{v.locality}</dd></div>
              <div><dt>Nearby landmark</dt><dd>{v.nearbyLandmark.trim() || 'Nil'}</dd></div>
              <div><dt>Days existing</dt><dd>{v.issueDurationDays}</dd></div>
            </dl>
            {submitError && <Notice tone="error">{submitError}</Notice>}
            <div className="btn-row">
              <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Analyzing and submitting…' : 'Submit Complaint'}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setReviewing(false)} disabled={submitting}>Edit details</button>
              <Link className="btn btn-ghost" to="/citizen/dashboard">Cancel</Link>
            </div>
          </section>
        )}

        {!reviewing && (
          <div className="btn-row form-actions">
            <button type="submit" className="btn btn-primary">Review Complaint</button>
            <Link className="btn btn-ghost" to="/citizen/dashboard">Cancel</Link>
          </div>
        )}
      </form>
    </>
  );
}
