import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CalculatorPage from './pages/CalculatorPage';
import HistoryPage from './pages/HistoryPage';
import OAuth2SuccessPage from './pages/OAuth2SuccessPage';

// Listens for 401 events from axios interceptor → auto logout
function AutoLogout() {
  const { logout } = useAuth();
  useEffect(() => {
    const handler = () => { logout(); };
    window.addEventListener('qma:unauthorized', handler);
    return () => window.removeEventListener('qma:unauthorized', handler);
  }, [logout]);
  return null;
}

function AppRoutes() {
  return (
    <>
      <AutoLogout />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* OAuth2 success — backend redirects here with ?token=...&username=... */}
        <Route path="/auth/oauth2/success" element={<OAuth2SuccessPage />} />

        {/* Protected */}
        <Route path="/dashboard"  element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/calculator" element={<PrivateRoute><CalculatorPage /></PrivateRoute>} />
        <Route path="/history"    element={<PrivateRoute><HistoryPage /></PrivateRoute>} />

        {/* Fallback */}
        <Route path="/"  element={<Navigate to="/dashboard" replace />} />
        <Route path="*"  element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#111827', color: '#f1f5f9',
              border: '1px solid #1e2d45',
              fontFamily: "'Syne', sans-serif",
              fontSize: '14px', fontWeight: 500,
              borderRadius: '10px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#111827' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#111827' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
