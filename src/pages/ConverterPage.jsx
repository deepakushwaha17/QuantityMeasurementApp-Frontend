import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { TypePicker, UnitInputGroup, RunButton } from '../components/quantity/QuantityInput';
import ResultCard from '../components/quantity/ResultCard';
import HistoryTable from '../components/history/HistoryTable';
import { useQuantity } from '../hooks/useQuantity';
import { UNITS } from '../constants/units';
import { showToast } from '../App';
import './OperationPage.css';

function ConverterPage() {
  const { loading, result, setResult, history, clearHistory, runConvert } = useQuantity();
  const [type, setType] = useState('LengthUnit');
  const [v1, setV1] = useState('');
  const [u1, setU1] = useState(() => UNITS['LengthUnit'][0]);
  const [u2, setU2] = useState(() => UNITS['LengthUnit'][1]);

  const handleTypeChange = (t) => {
    setType(t);
    setU1(UNITS[t][0]);
    setU2(UNITS[t][1] || UNITS[t][0]);
    setResult(null);
  };

  const handleRun = async () => {
    if (v1 === '' || isNaN(parseFloat(v1))) {
      showToast('Please enter a value.', 'err'); return;
    }
    try {
      await runConvert({ v1: parseFloat(v1), u1, u2, type });
      showToast('Operation complete ✓', 'ok');
    } catch { showToast('Operation failed', 'err'); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="op-wrap">
        <div className="app-card">
          <div className="app-card-header">🔄 Unit Conversion</div>
          <div className="app-card-body">
            <TypePicker selected={type} onChange={handleTypeChange} />

            <div className="from-to-grid">
              <UnitInputGroup
                label="Value"
                value={v1}
                unit={u1}
                onValueChange={setV1}
                onUnitChange={setU1}
                type={type}
              />
              <div className="ft-group">
                <div className="ft-lbl">Convert To (Target Unit)</div>
                <select
                  className="sel"
                  value={u2}
                  onChange={e => setU2(e.target.value)}
                  style={{ marginTop: 32 }}
                >
                  {UNITS[type].map(u => (
                    <option key={u} value={u}>{u.charAt(0) + u.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>
            </div>

            <RunButton loading={loading} onClick={handleRun} />
            <ResultCard result={result} />
          </div>
        </div>
        <HistoryTable history={history} onClear={clearHistory} />
      </div>
    </div>
  );
}

export default ConverterPage;
