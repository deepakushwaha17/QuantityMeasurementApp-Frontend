import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('qma_token');
    const storedUser = localStorage.getItem('qma_user');
    if (storedToken && storedUser) {
      try {
        const claims = parseJwt(storedToken);
        const now = Date.now() / 1000;
        if (claims && claims.exp && claims.exp > now) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          localStorage.removeItem('qma_token');
          localStorage.removeItem('qma_user');
        }
      } catch {
        localStorage.removeItem('qma_token');
        localStorage.removeItem('qma_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((tokenVal, userInfo) => {
    // Always decode userId from JWT claims (field name: "userId")
    const claims = parseJwt(tokenVal);
    const enriched = {
      ...userInfo,
      id: claims?.userId ?? userInfo.id ?? null,
    };
    localStorage.setItem('qma_token', tokenVal);
    localStorage.setItem('qma_user', JSON.stringify(enriched));
    setToken(tokenVal);
    setUser(enriched);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('qma_token');
    localStorage.removeItem('qma_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
