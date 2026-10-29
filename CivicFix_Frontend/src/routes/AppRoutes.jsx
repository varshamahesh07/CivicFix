import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import HomePage from '../pages/public/HomePage';
import AboutPage from '../pages/public/AboutPage';
import HowItWorksPage from '../pages/public/HowItWorksPage';
import CitizenLoginPage from '../pages/public/CitizenLoginPage';
import CitizenRegisterPage from '../pages/public/CitizenRegisterPage';
import AuthorityLoginPage from '../pages/public/AuthorityLoginPage';
import AuthorityRegisterPage from '../pages/public/AuthorityRegisterPage';
import NotFoundPage from '../pages/public/NotFoundPage';

// Citizen Pages
import CitizenDashboardPage from '../pages/citizen/CitizenDashboardPage';
import ReportComplaintPage from '../pages/citizen/ReportComplaintPage';
import MyComplaintsPage from '../pages/citizen/MyComplaintsPage';
import ComplaintTrackingPage from '../pages/citizen/ComplaintTrackingPage';
import CitizenProfilePage from '../pages/citizen/CitizenProfilePage';
import CitizenSettingsPage from '../pages/citizen/CitizenSettingsPage';

// Authority Pages
import AuthorityDashboardPage from '../pages/authority/AuthorityDashboardPage';
import AllComplaintsPage from '../pages/authority/AllComplaintsPage';
import AuthorityComplaintDetailPage from '../pages/authority/AuthorityComplaintDetailPage';
import AuthorityReportsPage from '../pages/authority/AuthorityReportsPage';
import AuthorityProfilePage from '../pages/authority/AuthorityProfilePage';
import AuthoritySettingsPage from '../pages/authority/AuthoritySettingsPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/citizen/login" element={<CitizenLoginPage />} />
      <Route path="/citizen/register" element={<CitizenRegisterPage />} />
      <Route path="/authority/login" element={<AuthorityLoginPage />} />
      <Route path="/authority/register" element={<AuthorityRegisterPage />} />

      {/* Citizen Protected Routes */}
      <Route
        path="/citizen/dashboard"
        element={
          <ProtectedRoute allowedRole="citizen">
            <CitizenDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/report"
        element={
          <ProtectedRoute allowedRole="citizen">
            <ReportComplaintPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/complaints"
        element={
          <ProtectedRoute allowedRole="citizen">
            <MyComplaintsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/complaints/:id"
        element={
          <ProtectedRoute allowedRole="citizen">
            <ComplaintTrackingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/profile"
        element={
          <ProtectedRoute allowedRole="citizen">
            <CitizenProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/settings"
        element={
          <ProtectedRoute allowedRole="citizen">
            <CitizenSettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Authority Protected Routes */}
      <Route
        path="/authority/dashboard"
        element={
          <ProtectedRoute allowedRole="authority">
            <AuthorityDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/authority/complaints"
        element={
          <ProtectedRoute allowedRole="authority">
            <AllComplaintsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/authority/complaints/:id"
        element={
          <ProtectedRoute allowedRole="authority">
            <AuthorityComplaintDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/authority/reports"
        element={
          <ProtectedRoute allowedRole="authority">
            <AuthorityReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/authority/profile"
        element={
          <ProtectedRoute allowedRole="authority">
            <AuthorityProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/authority/settings"
        element={
          <ProtectedRoute allowedRole="authority">
            <AuthoritySettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback & 404 */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
