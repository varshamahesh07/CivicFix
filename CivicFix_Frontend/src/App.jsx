import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ComplaintProvider } from './context/ComplaintContext';
import DemoBanner from './components/common/DemoBanner';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ComplaintProvider>
          <div className="min-h-screen flex flex-col bg-civic-sand-50 text-civic-navy-950 font-sans antialiased selection:bg-civic-teal-100 selection:text-civic-teal-900">
            {/* Top Reviewer Demo Bar */}
            <DemoBanner />

            {/* Main Navigation Bar */}
            <Navbar />

            {/* Route Content Area */}
            <main className="flex-1">
              <AppRoutes />
            </main>

            {/* Platform Footer */}
            <Footer />
          </div>
        </ComplaintProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
