import React, { useState, useEffect, useCallback } from 'react';
import { quantityAPI } from '../api';
import Layout from '../components/Layout';
import { Card, Badge, Spinner, EmptyState } from '../components/UI';
import toast from 'react-hot-toast';

const FILTER_OPTIONS = [
  { value: 'ALL',                label: 'All Operations' },
  { value: 'CONVERT',            label: 'Convert' },
  { value: 'COMPARE',            label: 'Compare' },
  { value: 'ADD',                label: 'Add' },
  { value: 'ADD_WITH_TARGET',    label: 'Add → Target' },
  { value: 'SUBTRACT',          label: 'Subtract' },
  { value: 'SUBTRACT_WITH_TARGET', label: 'Sub → Target' },
  { value: 'MULTIPLY',          label: 'Multiply' },
  { value: 'DIVIDE',            label: 'Divide' },
];

const OP_BADGE = {
  CONVERT:              'accent',
  COMPARE:              'purple',
  ADD:                  'success',
  ADD_WITH_TARGET:      'success',
  SUBTRACT:             'warning',
  SUBTRACT_WITH_TARGET: 'warning',
  MULTIPLY:             'purple',
  DIVIDE:               'pink',
};

const OP_ICON = {
  CONVERT: '⟳', COMPARE: '⇌', ADD: '+', ADD_WITH_TARGET: '⊕',
  SUBTRACT: '−', SUBTRACT_WITH_TARGET: '⊖', MULTIPLY: '×', DIVIDE: '÷',
};

function HistoryRow({ item, index }) {
  const op = (item.operation || 'UNKNOWN').toUpperCase().replace(/-/g, '_');
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '14px 16px',
      background: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
      borderBottom: '1px solid var(--border)',
      animation: 'fadeIn 0.3s ease',
      animationDelay: `${Math.min(index * 25, 300)}ms`,
      animationFillMode: 'both',
    }}>
      <div style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, background: 'var(--accent-subtle)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>
        {OP_ICON[op] || '?'}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-mono)' }}>
            {item.value1 ?? item.inputValue} {item.unit1 ?? item.inputUnit}
          </span>
          {(item.value2 ?? item.secondValue) !== undefined && (item.value2 ?? item.secondValue) !== null && (
            <>
              <span style={{ color: 'var(--text-muted)' }}>&amp;</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>
                {item.value2 ?? item.secondValue} {item.unit2 ?? item.secondUnit}
              </span>
            </>
          )}
          <span style={{ color: 'var(--text-muted)' }}>→</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--success)' }}>
            {item.resultValue ?? item.result ?? '—'} {item.resultUnit ?? ''}
          </span>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 3, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <span>{item.quantityType}</span>
          {item.createdAt && <span>{new Date(item.createdAt).toLocaleString()}</span>}
          {item.username && <span>by {item.username}</span>}
        </div>
      </div>

      <Badge color={OP_BADGE[op] || 'accent'}>{op.replace(/_/g, ' ')}</Badge>
    </div>
  );
}

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOp, setFilterOp] = useState('ALL');
  const [search, setSearch] = useState('');

  const load = useCallback(async (op) => {
    setLoading(true);
    try {
      const res = op === 'ALL'
        ? await quantityAPI.getHistory()
        : await quantityAPI.getHistoryByOperation(op);
      setHistory(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load history');
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(filterOp); }, [filterOp, load]);

  const filtered = history.filter(item => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      String(item.value1 ?? item.inputValue ?? '').includes(q) ||
      (item.unit1 ?? item.inputUnit ?? '').toLowerCase().includes(q) ||
      (item.resultUnit ?? '').toLowerCase().includes(q) ||
      (item.quantityType ?? '').toLowerCase().includes(q) ||
      (item.operation ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeIn 0.4s ease' }}>

        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>Calculation History</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>All your past quantity operations</p>
        </div>

        {/* Filters row */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>

          {/* Operation filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 200 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Filter by Operation</label>
            <select
              value={filterOp}
              onChange={e => setFilterOp(e.target.value)}
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontSize: 14, outline: 'none', cursor: 'pointer' }}
            >
              {FILTER_OPTIONS.map(o => <option key={o.value} value={o.value} style={{ background: 'var(--bg-card)' }}>{o.label}</option>)}
            </select>
          </div>

          {/* Search */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: '1 1 220px', maxWidth: 360 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Search</label>
            <input
              type="text"
              placeholder="value, unit, type..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontSize: 14, outline: 'none', width: '100%' }}
              onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 13, paddingBottom: 2 }}>
            {!loading && <span><strong style={{ color: 'var(--text-secondary)' }}>{filtered.length}</strong> entries</span>}
          </div>
        </div>

        {/* Table */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {/* Head */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 36 }} />
            <div style={{ flex: 1, fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Calculation</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Operation</div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner size={28} /></div>
          ) : filtered.length === 0 ? (
            <EmptyState icon="◷" title="No results found" subtitle={search ? 'Try different keywords' : 'Start calculating to build history'} />
          ) : (
            filtered.map((item, i) => <HistoryRow key={item.id || i} item={item} index={i} />)
          )}
        </Card>
      </div>
    </Layout>
  );
}
