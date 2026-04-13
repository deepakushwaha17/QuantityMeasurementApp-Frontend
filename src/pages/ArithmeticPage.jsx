import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { TypePicker, UnitInputGroup, TargetRow, RunButton } from '../components/quantity/QuantityInput';
import ResultCard from '../components/quantity/ResultCard';
import HistoryTable from '../components/history/HistoryTable';
import { useQuantity } from '../hooks/useQuantity';
import { UNITS, ARITHMETIC_OPS } from '../constants/units';
import { showToast } from '../App';
import './OperationPage.css';
import './ArithmeticPage.css';

function ArithmeticPage() {
  const { loading, result, setResult, history, clearHistory, runArithmetic } = useQuantity();
  const [type, setType] = useState('LengthUnit');
  const [op, setOp] = useState('add');
  const [v1, setV1] = useState('');
  const [u1, setU1] = useState(() => UNITS['LengthUnit'][0]);
  const [v2, setV2] = useState('');
  const [u2, setU2] = useState(() => UNITS['LengthUnit'][1]);
  const [targetUnit, setTargetUnit] = useState(() => UNITS['LengthUnit'][0]);

  const showTarget = op === 'add-with-target-unit' || op === 'subtract-with-target-unit';

  const handleTypeChange = (t) => {
    setType(t);
    setU1(UNITS[t][0]);
    setU2(UNITS[t][1] || UNITS[t][0]);
    setTargetUnit(UNITS[t][0]);
    setResult(null);
  };

  const handleOpChange = (newOp) => {
    setOp(newOp);
    setResult(null);
  };

  const handleRun = async () => {
    if (v1 === '' || isNaN(parseFloat(v1))) { showToast('Please enter Value 1.', 'err'); return; }
    if (v2 === '' || isNaN(parseFloat(v2))) { showToast('Please enter Value 2.', 'err'); return; }
    try {
      await runArithmetic({
        op,
        v1: parseFloat(v1), u1,
        v2: parseFloat(v2), u2,
        targetUnit,
        type,
      });
      showToast('Operation complete ✓', 'ok');
    } catch { showToast('Operation failed', 'err'); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="op-wrap">
        <div className="app-card">
          <div className="app-card-header">➕ Arithmetic Operations</div>
          <div className="app-card-body">
            <TypePicker selected={type} onChange={handleTypeChange} />

            <div className="sec-label">Choose Operation</div>
            <div className="arith-sub">
              <div className="action-tabs">
                {ARITHMETIC_OPS.map(o => (
                  <button
                    key={o.key}
                    className={`action-tab${op === o.key ? ' active' : ''}`}
                    onClick={() => handleOpChange(o.key)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="from-to-grid">
              <UnitInputGroup
                label="Value 1"
                value={v1} unit={u1}
                onValueChange={setV1} onUnitChange={setU1}
                type={type}
              />
              <UnitInputGroup
                label="Value 2"
                value={v2} unit={u2}
                onValueChange={setV2} onUnitChange={setU2}
                type={type}
              />
            </div>

            {showTarget && (
              <TargetRow type={type} value={targetUnit} onChange={setTargetUnit} />
            )}

            <RunButton loading={loading} onClick={handleRun} />
            <ResultCard result={result} />
          </div>
        </div>
        <HistoryTable history={history} onClear={clearHistory} />
      </div>
    </div>
  );
}

export default ArithmeticPage;
