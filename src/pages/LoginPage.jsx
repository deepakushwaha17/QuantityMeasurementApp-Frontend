import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/quantity/ErrorAlert';
import { showToast } from '../App';
import './AuthPage.css';

function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) { setError('Please fill all fields.'); return; }
    setLoading(true);
    try {
      await login(email, password);
      showToast('Logged in ✓', 'ok');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleLogin(); };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Quantity Measurement</h1>
          <p>Sign in to start measuring</p>
        </div>

        <div className="auth-tabs">
          <Link to="/login" className="auth-tab active">Login</Link>
          <Link to="/signup" className="auth-tab">Sign Up</Link>
        </div>

        <div className="auth-body">
          <div className="a-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKey}
            />
          </div>
          <div className="a-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKey}
            />
          </div>

          <button className="btn-auth" onClick={handleLogin} disabled={loading}>
            {loading ? <><span className="spin"></span>Please wait…</> : 'Login'}
          </button>

          <ErrorAlert message={error} />

          <div className="or-divider"><span>or</span></div>

          <button className="btn-google" onClick={loginWithGoogle}>
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              width="18" height="18" alt="Google"
            />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
