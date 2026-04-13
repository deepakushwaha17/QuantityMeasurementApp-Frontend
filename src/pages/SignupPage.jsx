import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/quantity/ErrorAlert';
import { showToast } from '../App';
import './AuthPage.css';

function SignupPage() {
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError('');
    if (!email || !password) { setError('Please fill all fields.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      const data = await signup(email, password);
      if (data.token) {
        showToast('Account created ✓', 'ok');
        navigate('/');
      } else {
        showToast('Account created! Please log in.', 'ok');
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleSignup(); };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Quantity Measurement</h1>
          <p>Create your account</p>
        </div>

        <div className="auth-tabs">
          <Link to="/login" className="auth-tab">Login</Link>
          <Link to="/signup" className="auth-tab active">Sign Up</Link>
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
              placeholder="Min 8 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKey}
            />
          </div>

          <button className="btn-auth" onClick={handleSignup} disabled={loading}>
            {loading ? <><span className="spin"></span>Please wait…</> : 'Create Account'}
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

export default SignupPage;
