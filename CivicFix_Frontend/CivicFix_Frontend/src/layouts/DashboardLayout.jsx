import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BarChart3, FilePlus2, LayoutDashboard, ListChecks, ListOrdered, LogOut, Menu, Settings, UserRound, X,
} from 'lucide-react';
import Logo from '../components/Logo';
import { useApp } from '../context/AppContext';

const NAV = {
  citizen: [
    { to: '/citizen/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/citizen/report', label: 'Report a Complaint', icon: FilePlus2 },
    { to: '/citizen/complaints', label: 'My Complaints', icon: ListChecks },
    { to: '/citizen/profile', label: 'Profile', icon: UserRound },
    { to: '/citizen/settings', label: 'Settings', icon: Settings },
  ],
  authority: [
    { to: '/authority/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/authority/complaints', label: 'All Complaints', icon: ListChecks },
    { to: '/authority/priority', label: 'Priority Queue', icon: ListOrdered },
    { to: '/authority/reports', label: 'Reports', icon: BarChart3 },
    { to: '/authority/profile', label: 'Profile', icon: UserRound },
    { to: '/authority/settings', label: 'Settings', icon: Settings },
  ],
};

export default function DashboardLayout({ role }) {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/', { replace: true });
  }

  return (
    <div className={`app-shell app-shell-${role}`}>
      <a className="skip-link" href="#dash-main">Skip to content</a>
      <aside id="sidebar" className={`sidebar${open ? ' open' : ''}`} aria-label={`${role === 'citizen' ? 'Citizen' : 'Authority'} navigation`}>
        <div className="sidebar-top">
          <Logo size={28} />
          <span className={`role-chip role-${role}`}>{role === 'citizen' ? 'Citizen' : 'Authority'}</span>
        </div>
        <nav>
          <ul className="side-nav">
            {NAV[role].map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink to={to} onClick={() => setOpen(false)}>
                  <Icon size={18} aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <button type="button" className="btn btn-ghost sidebar-logout" onClick={handleLogout}>
          <LogOut size={18} aria-hidden="true" />Logout
        </button>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <button
            type="button"
            className="icon-btn menu-toggle"
            aria-expanded={open}
            aria-controls="sidebar"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
          <p className="topbar-user">Signed in as <strong>{user.name}</strong></p>
        </header>
        <main id="dash-main" className="dash-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
