import React, { useState } from 'react';
import './HistoryTable.css';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'compare', label: 'Compare' },
  { key: 'convert', label: 'Convert' },
  { key: 'add', label: 'Add' },
  { key: 'subtract', label: 'Sub' },
  { key: 'divide', label: 'Divide' },
  { key: 'error', label: 'Errors' },
];

function HistoryTable({ history, onClear, fullWidth = false }) {
  const [filter, setFilter] = useState('all');

  const filtered = history.filter(h => {
    if (filter === 'all') return true;
    if (filter === 'error') return h.isErr;
    return h.op.startsWith(filter);
  });

  return (
    <div className={`hist-sidebar${fullWidth ? ' full-width' : ''}`}>
      <div className="hist-head">
        History
        <button className="btn-clr" onClick={onClear}>CLEAR</button>
      </div>
      <div className="hist-filter">
        {FILTERS.map(f => (
          <div
            key={f.key}
            className={`hchip${filter === f.key ? ' active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </div>
        ))}
      </div>
      <div className="hist-list">
        {filtered.length === 0 ? (
          <div className="hist-empty">No records here.<br />Run something!</div>
        ) : (
          filtered.map((h, i) => (
            <div key={i} className={`h-item${h.isErr ? ' err' : ''}`}>
              <div className="h-op">{h.op.toUpperCase()} · {h.type.replace('Unit', '')}</div>
              <div className="h-val">
                {h.isErr ? '⚠ Error' : `${h.val}${h.unit ? ' ' + h.unit : ''}`}
              </div>
              <div className="h-time">{h.time}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HistoryTable;
