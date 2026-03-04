import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import OtpLogin from './pages/OtpLogin';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import HotelStore from './pages/HotelStore';
import ThankYou from './pages/ThankYou';
import Landing from './pages/Landing';
import StaffLogin from './pages/StaffLogin';
import { supabase } from './supabaseClient';

import { getSubdomain } from './utils/domain';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const subdomain = getSubdomain();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading && window.location.pathname !== '/') {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white', fontSize: '18px', fontWeight: '600' }}>Loading Hoteltec...</div>;
  }

  // If we are on a hotel subdomain, restrict to the store experience
  if (subdomain) {
    return (
      <Router>
        <div className="app-container">
          <Routes>
            {/* The root on a subdomain is the store itself */}
            <Route path="/" element={<HotelStore presetSlug={subdomain} />} />
            <Route path="/store" element={<HotelStore presetSlug={subdomain} />} />
            
            {/* Store related paths */}
            <Route path="/store/products" element={<HotelStore presetSlug={subdomain} />} />
            <Route path="/store/cart" element={<HotelStore presetSlug={subdomain} />} />
            <Route path="/success" element={<ThankYou />} />
            <Route path="/store/success" element={<ThankYou />} />

            {/* Fallback to store root if path not found on subdomain */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={!session ? <Login /> : <Navigate to="/dash" replace />} />
          <Route path="/otp" element={!session ? <OtpLogin /> : <Navigate to="/dash" replace />} />
          <Route path="/signup" element={!session ? <Signup /> : <Navigate to="/dash" replace />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/staff/:storeId" element={<StaffLogin />} />

          {/* Dashboard Routes (Protected) */}
          <Route path="/dash" element={session ? <Dashboard activeTab="Orders" /> : <Navigate to="/login" replace />} />
          <Route path="/dash/mystore" element={session ? <Dashboard activeTab="My Store" /> : <Navigate to="/login" replace />} />
          <Route path="/dash/stories" element={session ? <Dashboard activeTab="Stories" /> : <Navigate to="/login" replace />} />
          <Route path="/dash/analytics" element={session ? <Dashboard activeTab="Analytics" /> : <Navigate to="/login" replace />} />
          <Route path="/dash/billing" element={session ? <Dashboard activeTab="Billing" /> : <Navigate to="/login" replace />} />
          <Route path="/dash/settings" element={session ? <Dashboard activeTab="Settings" /> : <Navigate to="/login" replace />} />
          <Route path="/dash/team" element={session ? <Dashboard activeTab="Team" /> : <Navigate to="/login" replace />} />

          {/* Store Front (Public) */}
          <Route path="/store" element={<HotelStore />} />
          <Route path="/store/:slug" element={<HotelStore />} />
          <Route path="/store/:slug/success" element={<ThankYou />} />

          {/* Default Redirects */}
          <Route path="/" element={<Landing />} />
          <Route path="*" element={<Navigate to={session ? "/dash" : "/"} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
