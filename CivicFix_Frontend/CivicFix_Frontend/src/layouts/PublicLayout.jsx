import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '../components/Logo';

export default function PublicLayout() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="public">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label="CivicFix home" onClick={close}><Logo /></Link>
          <button
            type="button"
            className="icon-btn nav-toggle"
            aria-expanded={open}
            aria-controls="site-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
          <nav id="site-nav" className={`site-nav${open ? ' open' : ''}`} aria-label="Main">
            <NavLink to="/" end onClick={close}>Home</NavLink>
            <Link to="/#features" onClick={close}>Features</Link>
            <Link to="/#how-it-works" onClick={close}>How It Works</Link>
            <div className="nav-group" role="group" aria-label="Citizen access">
              <span className="nav-group-label">Citizen</span>
              <NavLink to="/citizen/login" onClick={close}>Log in</NavLink>
              <NavLink to="/citizen/register" className="btn btn-outline btn-sm" onClick={close}>Sign up</NavLink>
            </div>
            <div className="nav-group nav-group-authority" role="group" aria-label="Authority access">
              <span className="nav-group-label">Authority</span>
              <NavLink to="/authority/login" onClick={close}>Log in</NavLink>
              <NavLink to="/authority/register" className="btn btn-navy btn-sm" onClick={close}>Sign up</NavLink>
            </div>
          </nav>
        </div>
      </header>

      <main id="main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <Logo size={24} />
          <p className="small muted">
            CivicFix is a prototype civic complaint platform. It is not an official government service.
          </p>
        </div>
      </footer>
    </div>
  );
}
