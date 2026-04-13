import React from 'react';
import { UNITS, LABELS, MEASUREMENT_TYPES } from '../../constants/units';
import './QuantityInput.css';

/**
 * Reusable unit input group: value + unit selector
 */
export function UnitInputGroup({ label, value, unit, onValueChange, onUnitChange, type, hideValue = false }) {
  const units = UNITS[type] || [];
  return (
    <div className="ft-group">
      <div className="ft-lbl">{label}</div>
      {!hideValue && (
        <input
          className="inp"
          type="number"
          step="any"
          placeholder="e.g. 1"
          value={value}
          onChange={e => onValueChange(e.target.value)}
        />
      )}
      <select className="sel" value={unit} onChange={e => onUnitChange(e.target.value)}>
        {units.map(u => (
          <option key={u} value={u}>{LABELS[u] || u}</option>
        ))}
      </select>
    </div>
  );
}

/**
 * Measurement type picker grid
 */
export function TypePicker({ selected, onChange }) {
  return (
    <>
      <div className="sec-label">Choose Type</div>
      <div className="type-grid">
        {MEASUREMENT_TYPES.map(t => (
          <div
            key={t.key}
            className={`type-card${selected === t.key ? ' active' : ''}`}
            onClick={() => onChange(t.key)}
          >
            <span className="type-icon">{t.icon}</span>
            <div className="type-name">{t.label}</div>
          </div>
        ))}
      </div>
    </>
  );
}

/**
 * Target unit selector row
 */
export function TargetRow({ type, value, onChange }) {
  const units = UNITS[type] || [];
  return (
    <div className="target-row">
      <span className="ft-lbl">Express Result In (Target Unit)</span>
      <div className="target-inner" style={{ marginTop: 8 }}>
        <select className="sel sel-full" value={value} onChange={e => onChange(e.target.value)}>
          {units.map(u => (
            <option key={u} value={u}>{LABELS[u] || u}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

/**
 * Run button
 */
export function RunButton({ loading, onClick }) {
  return (
    <button className="btn-run" disabled={loading} onClick={onClick}>
      {loading ? <><span className="spin"></span>Running…</> : 'Run Operation'}
    </button>
  );
}
