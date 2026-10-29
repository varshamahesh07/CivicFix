import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/public/Home';
import { CitizenLogin, CitizenRegister } from './pages/auth/CitizenAuth';
import { AuthorityLogin, AuthorityRegister } from './pages/auth/AuthorityAuth';

import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ReportComplaint from './pages/citizen/ReportComplaint';
import MyComplaints from './pages/citizen/MyComplaints';

import AuthorityDashboard from './pages/authority/AuthorityDashboard';
import AuthorityComplaints from './pages/authority/AuthorityComplaints';
import Reports from './pages/authority/Reports';

import ComplaintDetail from './pages/shared/ComplaintDetail';
import ProfilePage from './pages/shared/ProfilePage';
import SettingsPage from './pages/shared/SettingsPage';
import NotFound from './pages/shared/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="citizen/login" element={<CitizenLogin />} />
        <Route path="citizen/register" element={<CitizenRegister />} />
        <Route path="authority/login" element={<AuthorityLogin />} />
        <Route path="authority/register" element={<AuthorityRegister />} />
      </Route>

      <Route path="citizen" element={<ProtectedRoute role="citizen"><DashboardLayout role="citizen" /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CitizenDashboard />} />
        <Route path="report" element={<ReportComplaint />} />
        <Route path="complaints" element={<MyComplaints />} />
        <Route path="complaints/:id" element={<ComplaintDetail role="citizen" />} />
        <Route path="profile" element={<ProfilePage role="citizen" />} />
        <Route path="settings" element={<SettingsPage role="citizen" />} />
      </Route>

      <Route path="authority" element={<ProtectedRoute role="authority"><DashboardLayout role="authority" /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AuthorityDashboard />} />
        <Route path="complaints" element={<AuthorityComplaints mode="all" />} />
        <Route path="priority" element={<AuthorityComplaints mode="priority" />} />
        <Route path="complaints/:id" element={<ComplaintDetail role="authority" />} />
        <Route path="reports" element={<Reports />} />
        <Route path="profile" element={<ProfilePage role="authority" />} />
        <Route path="settings" element={<SettingsPage role="authority" />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
