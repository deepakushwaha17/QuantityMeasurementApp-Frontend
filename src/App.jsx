import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OAuth2CallbackPage from './pages/OAuth2CallbackPage';
import DashboardPage from './pages/DashboardPage';
import ConverterPage from './pages/ConverterPage';
import ComparePage from './pages/ComparePage';
import ArithmeticPage from './pages/ArithmeticPage';
import HistoryPage from './pages/HistoryPage';

// Global Toast
let toastTimer;
export function showToast(msg, type = 'ok') {
  const el = document.getElementById('global-toast');
  if (!el) return;
  el.textContent = msg;
  el.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.className = 'toast'; }, 3000);
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/convert" element={<ProtectedRoute><ConverterPage /></ProtectedRoute>} />
          <Route path="/compare" element={<ProtectedRoute><ComparePage /></ProtectedRoute>} />
          <Route path="/arithmetic" element={<ProtectedRoute><ArithmeticPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <div id="global-toast" className="toast"></div>
    </AuthProvider>
  );
}

export default App;
