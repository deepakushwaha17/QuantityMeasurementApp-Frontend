import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';
import { Button, Input, Card, Divider } from '../components/UI';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  // Handle OAuth2 redirect — token comes as query param
  useEffect(() => {
    const token = searchParams.get('token');
    const username = searchParams.get('username');
    const email = searchParams.get('email') || '';
    if (token && username) {
      login(token, { username, email });
      toast.success(`Welcome, ${username}!`);
      navigate('/dashboard', { replace: true });
    }
    const oauthError = searchParams.get('error');
    if (oauthError) {
      toast.error(`Google login failed: ${oauthError}`);
    }
  }, [searchParams, login, navigate]);

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const validate = () => {
    const e = {};
    if (!form.usernameOrEmail.trim()) e.usernameOrEmail = 'Username or email required';
    if (!form.password) e.password = 'Password required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authAPI.login({
        usernameOrEmail: form.usernameOrEmail,
        password: form.password,
      });

      // AuthController returns flat: { success, message, token, username, email }
      const { token, username, email, message } = res.data;

      if (token) {
        login(token, { username, email });
        toast.success(`Welcome back, ${username}!`);
        navigate(from, { replace: true });
      } else {
        toast.error(message || 'Login failed. Check your credentials.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, height: 500, background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '400px', animation: 'fadeIn 0.5s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, var(--accent), #6366f1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 800, color: '#fff', margin: '0 auto 16px', boxShadow: '0 0 32px rgba(59,130,246,0.4)' }}>Q</div>
          <h1 style={{ fontWeight: 800, fontSize: '24px', letterSpacing: '-0.02em', marginBottom: '6px' }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Sign in to your QMA account</p>
        </div>

        <Card glow>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Username or Email"
              type="text"
              placeholder="Enter username or email"
              value={form.usernameOrEmail}
              onChange={e => setForm(f => ({ ...f, usernameOrEmail: e.target.value }))}
              error={errors.usernameOrEmail}
              autoComplete="username"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              error={errors.password}
              autoComplete="current-password"
            />
            <Button type="submit" loading={loading} fullWidth style={{ marginTop: '4px' }}>
              Sign In
            </Button>
          </form>

          <Divider label="or continue with" />

          <div style={{ marginTop: '16px' }}>
            <Button
              variant="google" fullWidth
              onClick={() => { window.location.href = authAPI.getGoogleLoginUrl(); }}
              icon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
          </div>
        </Card>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-bright)', textDecoration: 'none', fontWeight: 600 }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
