import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gauge, Mic, ScanSearch, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const TAGLINE = 'Every Voice Matters, Every Issue Counts.';
const SUPPORT = 'Report civic problems. Track progress. Build better communities.';

const FEATURES = [
  { icon: ScanSearch, title: 'Image Analysis', text: 'Extract useful information from submitted problem images.' },
  { icon: Mic, title: 'NLP & Voice', text: 'Convert spoken or written complaints into structured reports.' },
  { icon: Gauge, title: 'Smart Priority', text: 'Help authorities identify complaints that need urgent attention.' },
  { icon: ShieldAlert, title: 'Risk Assessment', text: 'Highlight potential risks to support timely decisions.' },
];

const STEPS = [
  { title: 'Report the Issue', text: 'Describe the problem, add a photo, and share where it is.' },
  { title: 'Analyze and Prioritize', text: 'The complaint is grouped by category and urgency for review.' },
  { title: 'Authority Takes Action', text: 'Officials review the complaint and record each status change.' },
  { title: 'Track the Outcome', text: 'Follow every update until a decision is recorded.' },
];

export default function Home() {
  const { user } = useApp();
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash]);

  const reportTarget = user?.role === 'authority' ? '/authority/dashboard' : user ? '/citizen/report' : '/citizen/login';

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <p className="eyebrow">Civic Operations · Human-Centered Intelligence</p>
          <h1>CivicFix</h1>
          <p className="hero-tagline">{TAGLINE}</p>
          <p className="hero-support">{SUPPORT}</p>
          <div className="btn-row hero-actions">
            <Link className="btn btn-primary btn-lg" to={reportTarget}>Report a Problem</Link>
            <Link className="btn btn-navy btn-lg" to="/authority/login">Authority Portal</Link>
          </div>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[0, 1].map((g) => (
            <div className="ticker-group" key={g}>
              {[0, 1, 2].map((r) => (
                <span key={r}>{TAGLINE} <i>◆</i> {SUPPORT} <i>◆</i></span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section id="features" className="section container" aria-labelledby="features-heading">
        <h2 id="features-heading">Core capabilities</h2>
        <p className="small muted">These features are simulated in this prototype. They are not live AI processing yet.</p>
        <ul className="feature-grid">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <li className="card feature" key={title}>
              <span className="feature-icon"><Icon size={22} aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="how-it-works" className="section section-alt" aria-labelledby="how-heading">
        <div className="container">
          <h2 id="how-heading">How It Works</h2>
          <ol className="steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className="step">
                <span className="step-num" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section container cta" aria-labelledby="cta-heading">
        <h2 id="cta-heading">Have a problem in your neighbourhood?</h2>
        <p className="muted">Create a free citizen account to report it and follow its progress.</p>
        <div className="btn-row">
          <Link className="btn btn-primary" to="/citizen/register">Create citizen account</Link>
          <Link className="btn btn-outline" to="/citizen/login">Citizen log in</Link>
        </div>
      </section>
    </>
  );
}
