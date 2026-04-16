import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quantityAPI } from '../api';
import Layout from '../components/Layout';
import { Card, Badge, Spinner, EmptyState } from '../components/UI';

const OP_ICON = {
  CONVERT: '⟳', COMPARE: '⇌', ADD: '+', ADD_WITH_TARGET: '⊕',
  SUBTRACT: '−', SUBTRACT_WITH_TARGET: '⊖', MULTIPLY: '×', DIVIDE: '÷',
};
const OP_BADGE = {
  CONVERT: 'accent', COMPARE: 'purple', ADD: 'success', ADD_WITH_TARGET: 'success',
  SUBTRACT: 'warning', SUBTRACT_WITH_TARGET: 'warning', MULTIPLY: 'purple', DIVIDE: 'pink',
};

function StatCard({ label, value, icon, color, loading }) {
  return (
    <Card style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: `${color}20`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>
          {loading ? <Spinner size={18} /> : value}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginTop: 2 }}>{label}</div>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    quantityAPI.getHistory()
      .then(res => setHistory(Array.isArray(res.data) ? res.data : []))
      .catch(() => setHistory([]))
      .finally(() => setLoadingHistory(false));
  }, []);

  const total = history.length;
  const converts = history.filter(h => (h.operation || '').toUpperCase() === 'CONVERT').length;
  const compares = history.filter(h => (h.operation || '').toUpperCase() === 'COMPARE').length;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, animation: 'fadeIn 0.4s ease' }}>

        {/* Welcome banner */}
        <div style={{ padding: '28px 32px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{greeting()},</p>
              <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>{user?.username || 'User'} 👋</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 6 }}>{user?.email}</p>
              {user?.id && <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2, fontFamily: 'var(--font-mono)' }}>ID: {user.id}</p>}
            </div>
            <Link to="/calculator" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--accent)', color: '#fff', padding: '10px 20px', borderRadius: 'var(--radius-sm)', textDecoration: 'none', fontWeight: 700, fontSize: 14, boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}>
              ◈ New Calculation
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
          <StatCard label="Total Calculations" icon="◈" color="var(--accent)" value={total} loading={loadingHistory} />
          <StatCard label="Conversions" icon="⟳" color="#6366f1" value={converts} loading={loadingHistory} />
          <StatCard label="Comparisons" icon="⇌" color="#8b5cf6" value={compares} loading={loadingHistory} />
          <StatCard label="Other Ops" icon="⊕" color="var(--success)" value={total - converts - compares} loading={loadingHistory} />
        </div>

        {/* Quick actions */}
        <div>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {[
              { to: '/calculator', icon: '◈', label: 'New Calculation', desc: 'Convert, compare & compute', color: 'var(--accent)' },
              { to: '/history', icon: '◷', label: 'View History', desc: 'Browse past calculations', color: '#6366f1' },
            ].map(item => (
              <Link key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
                <div
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18, display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = item.color; e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: `${item.color}15`, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: item.color }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{item.label}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{item.desc}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent history */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Recent Activity</h2>
            <Link to="/history" style={{ fontSize: 13, color: 'var(--accent-bright)', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
          </div>
          <Card>
            {loadingHistory ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><Spinner size={24} /></div>
            ) : history.length === 0 ? (
              <EmptyState icon="◷" title="No calculations yet" subtitle="Start by using the calculator" />
            ) : (
              history.slice(0, 6).map((item, i) => {
                const op = (item.operation || 'UNKNOWN').toUpperCase().replace(/-/g, '_');
                return (
                  <div key={item.id || i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 5 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-subtle)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        {OP_ICON[op] || '?'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, fontFamily: 'var(--font-mono)' }}>
                          {item.value1 ?? item.inputValue} {item.unit1 ?? item.inputUnit} → {item.resultValue ?? item.result ?? '?'} {item.resultUnit ?? ''}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{item.quantityType}</div>
                      </div>
                    </div>
                    <Badge color={OP_BADGE[op] || 'accent'}>{op.replace(/_/g, ' ')}</Badge>
                  </div>
                );
              })
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}
