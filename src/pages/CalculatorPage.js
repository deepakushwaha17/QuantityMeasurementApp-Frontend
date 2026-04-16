import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { quantityAPI } from '../api';
import Layout from '../components/Layout';
import { Card, Button, Input, Select, Badge, Spinner } from '../components/UI';

// ── Unit options per type ─────────────────────────────────────────────────────
const UNITS = {
  LENGTH: [
    { value: 'CENTIMETER', label: 'Centimeter (cm)' },
    { value: 'YARD', label: 'Yard' },
    { value: 'FEET', label: 'Feet' },
    { value: 'INCHES', label: 'Inches' },
  ],
  WEIGHT: [
    { value: 'KILOGRAM', label: 'Kilogram (kg)' },
    { value: 'GRAM', label: 'Gram (g)' },
    { value: 'MILLIGRAM', label: 'Milligram (mg)' },
    { value: 'POUND', label: 'Pound (lb)' },
    { value: 'OUNCE', label: 'Ounce (oz)' },
    { value: 'TON', label: 'Ton' },
  ],
  VOLUME: [
    { value: 'LITER', label: 'Liter (L)' },
    { value: 'MILLILITER', label: 'Milliliter (mL)' },
    { value: 'GALLON', label: 'Gallon' },
  ],
  TEMPERATURE: [
    { value: 'CELSIUS', label: 'Celsius (°C)' },
    { value: 'FAHRENHEIT', label: 'Fahrenheit (°F)' },
  ],
};

const TYPE_OPTIONS = [
  { value: 'LENGTH', label: 'Length' },
  { value: 'WEIGHT', label: 'Weight' },
  { value: 'VOLUME', label: 'Volume' },
  { value: 'TEMPERATURE', label: 'Temperature' },
];

const ALLOWED_OPERATIONS = {
  LENGTH: ["convert", "compare", "add","addWithTarget", "subtract","subtractWithTarget", "multiply", "divide"],
  WEIGHT: ["convert", "compare", "add","addWithTarget", "subtract","subtractWithTarget", "multiply", "divide"],
  VOLUME: ["convert", "compare", "add","addWithTarget", "subtract","subtractWithTarget", "multiply", "divide"],
  TEMPERATURE: ["convert", "compare"] // temperature can have only compare and convert
};
// ── Operations definition ─────────────────────────────────────────────────────
// apiFn     — which quantityAPI function to call
// needsValue2  — requires value2 + unit2
// needsTarget  — requires targetUnit
// needsFactor  — requires factor
const OPERATIONS = [
  {
    key: 'convert',
    label: 'Convert',
    icon: '⟳',
    color: '#3b82f6',
    badgeColor: 'accent',
    desc: 'Convert between units',
    apiFn: (q) => quantityAPI.convert(q),
    needsTarget: true,
  },
  {
    key: 'compare',
    label: 'Compare',
    icon: '⇌',
    color: '#8b5cf6',
    badgeColor: 'purple',
    desc: 'Compare two quantities',
    apiFn: (q) => quantityAPI.compare(q),
    needsValue2: true,
  },
  {
    key: 'add',
    label: 'Add',
    icon: '+',
    color: '#10b981',
    badgeColor: 'success',
    desc: 'Add two quantities',
    apiFn: (q) => quantityAPI.add(q),
    needsValue2: true,
  },
  {
    key: 'addWithTarget',
    label: 'Add → Target',
    icon: '⊕',
    color: '#06b6d4',
    badgeColor: 'accent',
    desc: 'Add and convert to target unit',
    apiFn: (q) => quantityAPI.addWithTarget(q),
    needsValue2: true,
    needsTarget: true,
  },
  {
    key: 'subtract',
    label: 'Subtract',
    icon: '−',
    color: '#f59e0b',
    badgeColor: 'warning',
    desc: 'Subtract two quantities',
    apiFn: (q) => quantityAPI.subtract(q),
    needsValue2: true,
  },
  {
    key: 'subtractWithTarget',
    label: 'Sub → Target',
    icon: '⊖',
    color: '#f97316',
    badgeColor: 'warning',
    desc: 'Subtract and convert to target',
    apiFn: (q) => quantityAPI.subtractWithTarget(q),
    needsValue2: true,
    needsTarget: true,
  },
  {
    key: 'multiply',
    label: 'Multiply',
    icon: '×',
    color: '#a855f7',
    badgeColor: 'purple',
    desc: 'Multiply by a factor',
    apiFn: (q) => quantityAPI.multiply(q),
    needsFactor: true,
    needsTarget: true,
  },
  {
    key: 'divide',
    label: 'Divide',
    icon: '÷',
    color: '#ec4899',
    badgeColor: 'pink',
    desc: 'Divide by a factor',
    apiFn: (q) => quantityAPI.divide(q),
    needsValue2: true,
  },
];

// ── Result display helper ─────────────────────────────────────────────────────
function ResultPanel({ result, op, loading }) {
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 180, gap: 12 }}>
        <Spinner size={28} />
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Calculating...</span>
      </div>
    );
  }

  if (!result) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 180, gap: 10, opacity: 0.5 }}>
        <span style={{ fontSize: 36 }}>{op?.icon || '◈'}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Fill in values and calculate</span>
      </div>
    );
  }

  // Render every key in the result object so nothing is hidden
  const skip = new Set(['id', 'userId', 'username', 'createdAt', 'updatedAt']);
  const entries = Object.entries(result).filter(([k, v]) => !skip.has(k) && v !== null && v !== undefined && v !== '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'fadeIn 0.3s ease' }}>
      <Badge color={op?.badgeColor || 'accent'}>{op?.label}</Badge>

      {op?.key === "compare" && (
        <div style={{ fontWeight: 700, fontSize: 18 }}>
          {result.result === 1 ? "EQUAL" : "NOT EQUAL"}
        </div>
      )}

      {/* Primary result */}
      {(result.resultValue !== undefined || result.result !== undefined) && (
        <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Result</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>
            {result.resultValue ?? result.result}
          </div>
          {result.resultUnit && (
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
              {result.resultUnit}
            </div>
          )}
        </div>
      )}

      {/* All other fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {entries
          .filter(([k]) => !['resultValue', 'result', 'resultUnit'].includes(k))
          .map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, gap: 8 }}>
              <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {k.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
                {String(v)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default function CalculatorPage() {
  const [quantityType, setQuantityType] = useState('LENGTH');
  const [value1, setValue1] = useState('');
  const [unit1, setUnit1] = useState('FEET');
  const [value2, setValue2] = useState('');
  const [unit2, setUnit2] = useState('FEET');
  const [targetUnit, setTargetUnit] = useState('FEET');
  const [factor, setFactor] = useState('');
  const [selectedOpKey, setSelectedOpKey] = useState('convert');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const units = UNITS[quantityType] || [];
  const op = OPERATIONS.find(o => o.key === selectedOpKey);
  const allowedOps = ALLOWED_OPERATIONS[quantityType] || [];

  useEffect(() => {
    if (!allowedOps.includes(selectedOpKey)) {
      setSelectedOpKey("convert");
    }
  }, [quantityType, selectedOpKey]);

  const handleTypeChange = (val) => {
    setQuantityType(val);
    const u = UNITS[val] || [];
    setUnit1(u[0]?.value || '');
    setUnit2(u[1]?.value || u[0]?.value || '');
    setTargetUnit(u[1]?.value || u[0]?.value || '');
    setResult(null);
  };

  const handleOpChange = (key) => {
    setSelectedOpKey(key);
    setResult(null);
  };

  const validate = () => {
    if (!value1 || isNaN(parseFloat(value1))) { toast.error('Enter a valid first value'); return false; }
    if (op?.needsValue2 && (!value2 || isNaN(parseFloat(value2)))) { toast.error('Enter a valid second value'); return false; }
    if (op?.needsFactor && (!factor || isNaN(parseFloat(factor)))) { toast.error('Enter a valid factor'); return false; }
    if (op?.needsFactor && selectedOpKey === 'divide' && parseFloat(factor) === 0) { toast.error('Cannot divide by zero'); return false; }
    return true;
  };

 const handleCalculate = async () => {
  if (!validate()) return;
  setLoading(true);
  setResult(null);

  const payload = {
    value: Number(value1),
    unit: unit1?.toUpperCase(),
    type: quantityType?.toUpperCase(),
  };

  if (op?.needsValue2) {
    payload.secondValue = Number(value2);
    payload.secondUnit = unit2?.toUpperCase();
  }

  if (op?.needsFactor) {
    payload.secondValue = Number(factor);
  }

  if (op?.needsTarget) {
    payload.targetUnit = targetUnit?.toUpperCase();
  }

  try {
    const res = await op.apiFn(payload);
    setResult(res.data);
//equal
    if (selectedOpKey === "compare") {
      if (res.data.result === 1) {
        toast.success("EQUAL");
      } else {
        toast.error("NOT EQUAL");
      }
    }

    toast.success('Calculation complete!');
  } catch (err) {
    console.log(err.response?.data);
    toast.error(
      err.response?.data?.message ||
      err.response?.data?.error ||
      'Bad Request'
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeIn 0.4s ease' }}>

        {/* Header */}
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>Quantity Calculator</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
            8 operations — convert, compare, add, subtract, multiply, divide and more
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

          {/* ── Left: controls ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Operation selector — 4×2 grid */}
            <Card>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                Select Operation
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {OPERATIONS.map(o => {
                  const active = selectedOpKey === o.key;
                  const disabled = !allowedOps.includes(o.key);
              
                  return (
                    <button
                      key={o.key}
                      //onClick={() => handleOpChange(o.key)}
                      onClick={() => !disabled && handleOpChange(o.key)}
                      disabled={disabled}
                      //itle={o.desc}
                      title={disabled ? "Not allowed for Temperature" : o.desc}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                        padding: '12px 6px',
                        background: active ? `${o.color}18` : 'transparent',
                        border: `1px solid ${active ? o.color : 'var(--border)'}`,
                        borderRadius: 'var(--radius-sm)',
                        color: active ? o.color : 'var(--text-muted)',
                        transition: 'all 0.18s',       
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        opacity: disabled ? 0.3 : 1,
                      }}
                      onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = o.color; e.currentTarget.style.color = o.color; } }}
                      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; } }}
                    >
                      <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{o.icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>{o.label}</span>
                    </button>
                  );
                })}
              </div>
              {op && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  <span style={{ color: op.color, fontWeight: 700 }}>{op.label}:</span> {op.desc}
                </p>
              )}
            </Card>

            {/* Inputs */}
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Quantity Type */}
                <Select
                  label="Quantity Type"
                  value={quantityType}
                  onChange={e => handleTypeChange(e.target.value)}
                  options={TYPE_OPTIONS}
                />

                {/* Value 1 + Unit 1 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Input
                    label="Value 1"
                    type="number"
                    placeholder="e.g. 100"
                    value={value1}
                    onChange={e => setValue1(e.target.value)}
                  />
                  <Select
                    label="Unit 1"
                    value={unit1}
                    onChange={e => setUnit1(e.target.value)}
                    options={units}
                  />
                </div>

                {/* Value 2 + Unit 2 — for add, subtract, compare, addWithTarget, subtractWithTarget */}
                {op?.needsValue2 && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Input
                      label="Value 2"
                      type="number"
                      placeholder="e.g. 50"
                      value={value2}
                      onChange={e => setValue2(e.target.value)}
                    />
                    <Select
                      label="Unit 2"
                      value={unit2}
                      onChange={e => setUnit2(e.target.value)}
                      options={units}
                    />
                  </div>
                )}

                {/* Target Unit — for convert, addWithTarget, subtractWithTarget */}
                {op?.needsTarget && (
                  <Select
                    label="Target Unit"
                    value={targetUnit}
                    onChange={e => setTargetUnit(e.target.value)}
                    options={units}
                  />
                )}

                {/* Factor — for divide */}
                {selectedOpKey === 'multiply' && (
                  <Input
                    label="Multiplier"
                    type="number"
                    placeholder="e.g. 3"
                    value={factor}
                    onChange={e => setFactor(e.target.value)}
                  />
                )}

                <Button
                  fullWidth loading={loading}
                  onClick={handleCalculate}
                  style={{ background: op?.color, boxShadow: `0 0 20px ${op?.color}40`, marginTop: 4 }}
                >
                  {op?.icon} Calculate
                </Button>
              </div>
            </Card>
          </div>

          {/* ── Right: result ── */}
          <div style={{ position: 'sticky', top: 80 }}>
            <Card glow style={{ minHeight: 220 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
                Result
              </p>
              <ResultPanel result={result} op={op} loading={loading} />
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
