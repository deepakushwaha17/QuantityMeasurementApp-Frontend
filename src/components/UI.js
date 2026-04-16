import React from 'react';

export function Spinner({ size = 20, color = 'var(--accent)' }) {
  return (
    <span style={{
      display: 'inline-block', width: size, height: size,
      border: `2px solid rgba(255,255,255,0.1)`,
      borderTop: `2px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite', flexShrink: 0,
    }} />
  );
}

export function Button({ children, loading, variant = 'primary', fullWidth, small, icon, style, ...props }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: '8px', fontFamily: 'var(--font-display)', fontWeight: 600,
    fontSize: small ? '13px' : '14px', letterSpacing: '0.02em',
    cursor: props.disabled || loading ? 'not-allowed' : 'pointer',
    border: 'none', borderRadius: 'var(--radius-sm)',
    transition: 'all 0.2s ease',
    opacity: props.disabled || loading ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    padding: small ? '8px 14px' : '11px 20px',
    whiteSpace: 'nowrap',
  };
  const variants = {
    primary:   { background: 'var(--accent)', color: '#fff', boxShadow: '0 0 20px rgba(59,130,246,0.3)' },
    secondary: { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)' },
    ghost:     { background: 'var(--accent-subtle)', color: 'var(--accent-bright)', border: '1px solid var(--border-accent)' },
    danger:    { background: 'rgba(239,68,68,0.1)', color: 'var(--error)', border: '1px solid rgba(239,68,68,0.3)' },
    google:    { background: '#fff', color: '#1a1a1a', fontWeight: 600 },
  };
  return (
    <button style={{ ...base, ...variants[variant], ...style }} {...props}>
      {loading ? <Spinner size={16} color={variant === 'google' ? '#666' : '#fff'} /> : icon}
      {children}
    </button>
  );
}

export function Input({ label, error, icon, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</label>}
      <div style={{ position: 'relative' }}>
        {icon && <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', pointerEvents: 'none' }}>{icon}</span>}
        <input
          style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${error ? 'var(--error)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', padding: icon ? '10px 12px 10px 38px' : '10px 12px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
          onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)'; }}
          onBlur={e => { e.target.style.borderColor = error ? 'var(--error)' : 'var(--border)'; e.target.style.boxShadow = 'none'; }}
          {...props}
        />
      </div>
      {error && <span style={{ fontSize: '12px', color: 'var(--error)' }}>{error}</span>}
    </div>
  );
}

export function Select({ label, options = [], ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</label>}
      <select
        style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontSize: '14px', outline: 'none', cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
        onFocus={e => { e.target.style.borderColor = 'var(--accent)'; }}
        onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
        {...props}
      >
        {options.map(o => <option key={o.value} value={o.value} style={{ background: 'var(--bg-card)' }}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function Card({ children, style, glow }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px', boxShadow: glow ? 'var(--shadow), var(--shadow-accent)' : 'var(--shadow)', ...style }}>
      {children}
    </div>
  );
}

export function Badge({ children, color = 'accent' }) {
  const colors = {
    accent:  { bg: 'var(--accent-subtle)', text: 'var(--accent-bright)', border: 'var(--border-accent)' },
    success: { bg: 'var(--success-glow)', text: 'var(--success)', border: 'rgba(16,185,129,0.3)' },
    error:   { bg: 'var(--error-glow)', text: 'var(--error)', border: 'rgba(239,68,68,0.3)' },
    warning: { bg: 'rgba(245,158,11,0.1)', text: 'var(--warning)', border: 'rgba(245,158,11,0.3)' },
    purple:  { bg: 'rgba(139,92,246,0.1)', text: '#a78bfa', border: 'rgba(139,92,246,0.3)' },
    pink:    { bg: 'rgba(236,72,153,0.1)', text: '#f472b6', border: 'rgba(236,72,153,0.3)' },
  };
  const c = colors[color] || colors.accent;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', background: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: '100px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}

export function EmptyState({ icon, title, subtitle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', gap: '12px', textAlign: 'center' }}>
      <div style={{ fontSize: '40px', opacity: 0.4 }}>{icon}</div>
      <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{title}</p>
      {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{subtitle}</p>}
    </div>
  );
}

export function Divider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      {label && <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 500 }}>{label}</span>}
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  );
}
