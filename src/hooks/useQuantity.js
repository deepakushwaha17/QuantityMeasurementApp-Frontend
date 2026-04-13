import { useState, useCallback } from 'react';
import {
  compareApi, convertApi,
  addApi, addWithTargetApi,
  subtractApi, subtractWithTargetApi,
  divideApi,
} from '../api/quantityApi';

const HIST_KEY = 'qm_hist';

function loadHist() {
  try { return JSON.parse(localStorage.getItem(HIST_KEY) || '[]'); }
  catch { return []; }
}
function saveHist(h) {
  localStorage.setItem(HIST_KEY, JSON.stringify(h));
}

export function useQuantity() {
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);  // { value, unit, isError, errorMessage }
  const [history, setHistory] = useState(loadHist);

  const pushHist = useCallback((op, type, res, isErr) => {
    const entry = {
      op,
      type,
      isErr,
      val: isErr
        ? res.errorMessage
        : (res.resultString
          ? (res.resultString === 'Equal' ? '✅ EQUAL' : '❌ NOT EQUAL')
          : (res.resultValue ?? res.value ?? '?')),
      unit: res.resultUnit || res.unit || '',
      time: new Date().toLocaleTimeString(),
    };
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 100);
      saveHist(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HIST_KEY);
  }, []);

  const parseResult = (data) => {
    if (data.error || data.errorMessage) {
      return { isError: true, errorMessage: data.errorMessage || 'Unknown error' };
    }
    let displayValue;
    if (data.resultValue === true || data.resultValue === false) {
      displayValue = data.resultValue ? '✅ EQUAL' : '❌ NOT EQUAL';
    } else if (data.resultString) {
      displayValue = data.resultString === 'Equal' ? '✅ EQUAL' : '❌ NOT EQUAL';
    } else if (typeof data.resultValue === 'number') {
      displayValue = data.resultValue;
    } else {
      displayValue = data.resultValue !== undefined ? data.resultValue : data.value;
    }
    return {
      isError: false,
      value: displayValue,
      unit: data.resultUnit || data.unit || '',
    };
  };

  const runCompare = useCallback(async ({ v1, u1, v2, u2, type }) => {
    setLoading(true);
    setResult(null);
    try {
      const thisQ = { value: v1, unit: u1, measurementType: type };
      const thatQ = { value: v2, unit: u2, measurementType: type };
      const data = await compareApi(thisQ, thatQ);
      const r = parseResult(data);
      setResult(r);
      pushHist('compare', type, data, r.isError);
      return r;
    } catch (err) {
      const r = { isError: true, errorMessage: err.response?.data?.message || err.message };
      setResult(r);
      pushHist('compare', type, { errorMessage: r.errorMessage }, true);
      throw err;
    } finally { setLoading(false); }
  }, [pushHist]);

  const runConvert = useCallback(async ({ v1, u1, u2, type }) => {
    setLoading(true);
    setResult(null);
    try {
      const thisQ = { value: v1, unit: u1, measurementType: type };
      const thatQ = { value: 0.0, unit: u2, measurementType: type };
      const data = await convertApi(thisQ, thatQ);
      const r = parseResult(data);
      setResult(r);
      pushHist('convert', type, data, r.isError);
      return r;
    } catch (err) {
      const r = { isError: true, errorMessage: err.response?.data?.message || err.message };
      setResult(r);
      pushHist('convert', type, { errorMessage: r.errorMessage }, true);
      throw err;
    } finally { setLoading(false); }
  }, [pushHist]);

  const runArithmetic = useCallback(async ({ op, v1, u1, v2, u2, targetUnit, type }) => {
    setLoading(true);
    setResult(null);
    try {
      const thisQ = { value: v1, unit: u1, measurementType: type };
      const thatQ = { value: v2, unit: u2, measurementType: type };
      let data;
      if (op === 'add') data = await addApi(thisQ, thatQ);
      else if (op === 'add-with-target-unit') {
        const targetQ = { value: 0.0, unit: targetUnit, measurementType: type };
        data = await addWithTargetApi(thisQ, thatQ, targetQ);
      } else if (op === 'subtract') data = await subtractApi(thisQ, thatQ);
      else if (op === 'subtract-with-target-unit') {
        const targetQ = { value: 0.0, unit: targetUnit, measurementType: type };
        data = await subtractWithTargetApi(thisQ, thatQ, targetQ);
      } else if (op === 'divide') data = await divideApi(thisQ, thatQ);
      const r = parseResult(data);
      setResult(r);
      pushHist(op, type, data, r.isError);
      return r;
    } catch (err) {
      const r = { isError: true, errorMessage: err.response?.data?.message || err.message };
      setResult(r);
      pushHist(op, type, { errorMessage: r.errorMessage }, true);
      throw err;
    } finally { setLoading(false); }
  }, [pushHist]);

  return { loading, result, setResult, history, clearHistory, runCompare, runConvert, runArithmetic };
}
