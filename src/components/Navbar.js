import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: '⬡' },
  { to: '/calculator', label: 'Calculator', icon: '◈' },
  { to: '/history', label: 'History', icon: '◷' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(8,12,20,0.9)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)', height: '60px',
      display: 'flex', alignItems: 'center', padding: '0 24px',
    }}>
      <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginRight: '32px', flexShrink: 0 }}>
        <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg, var(--accent), #6366f1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: '#fff', boxShadow: '0 0 16px rgba(59,130,246,0.4)' }}>Q</div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--text-primary)', letterSpacing: '0.02em' }}>QMA</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
        {NAV_LINKS.map(link => {
          const active = location.pathname === link.to;
          return (
            <Link key={link.to} to={link.to} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: 'var(--radius-sm)', textDecoration: 'none', fontSize: '13px', fontWeight: 600, letterSpacing: '0.03em', background: active ? 'var(--accent-subtle)' : 'transparent', color: active ? 'var(--accent-bright)' : 'var(--text-muted)', border: active ? '1px solid var(--border-accent)' : '1px solid transparent', transition: 'all 0.2s' }}>
              <span style={{ fontSize: '15px' }}>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '100px' }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#fff' }}>
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {user?.username || 'User'}
          </span>
        </div>
        <button
          onClick={handleLogout}
          style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '6px 14px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', fontFamily: 'var(--font-display)', fontWeight: 600, transition: 'all 0.2s' }}
          onMouseEnter={e => { e.target.style.borderColor = 'var(--error)'; e.target.style.color = 'var(--error)'; }}
          onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-muted)'; }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
