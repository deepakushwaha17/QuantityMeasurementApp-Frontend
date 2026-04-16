import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Spinner } from '../components/UI';

export default function OAuth2SuccessPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const username = searchParams.get('username');
    const email = searchParams.get('email') || '';
    const error = searchParams.get('error');

    if (error) {
      toast.error(`Google login failed: ${error}`);
      navigate('/login', { replace: true });
      return;
    }

    if (token && username) {
      login(token, { username, email });
      toast.success(`Welcome, ${username}!`);
      navigate('/dashboard', { replace: true });
    } else {
      toast.error('OAuth login failed. Try again.');
      navigate('/login', { replace: true });
    }
  }, [searchParams, login, navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <Spinner size={32} />
      <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Completing Google sign in...</p>
    </div>
  );
}
