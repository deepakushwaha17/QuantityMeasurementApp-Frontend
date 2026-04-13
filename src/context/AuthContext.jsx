import React, { createContext, useContext, useState, useCallback } from 'react';
import { loginApi, signupApi, getGoogleAuthUrl } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('qm_token'));
  const [email, setEmail] = useState(() => localStorage.getItem('qm_email') || '');

  const login = useCallback(async (emailVal, password) => {
    const data = await loginApi(emailVal, password);
    setToken(data.token);
    setEmail(emailVal);
    localStorage.setItem('qm_token', data.token);
    localStorage.setItem('qm_email', emailVal);
    return data;
  }, []);

  const signup = useCallback(async (emailVal, password) => {
    const data = await signupApi(emailVal, password);
    if (data.token) {
      setToken(data.token);
      setEmail(emailVal);
      localStorage.setItem('qm_token', data.token);
      localStorage.setItem('qm_email', emailVal);
    }
    return data;
  }, []);

  const loginWithGoogle = useCallback(() => {
    window.location.href = getGoogleAuthUrl();
  }, []);

  const setOAuthSession = useCallback((tok, em) => {
  setToken(tok);
  setEmail(em || '');
  localStorage.setItem('qm_token', tok);
  if (em) localStorage.setItem('qm_email', em);
}, []);

  const logout = useCallback(() => {
    setToken(null);
    setEmail('');
    localStorage.removeItem('qm_token');
    localStorage.removeItem('qm_email');
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, email, isAuthenticated, login, signup, loginWithGoogle, setOAuthSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
