import React from 'react';
import Navbar from '../components/layout/Navbar';
import HistoryTable from '../components/history/HistoryTable';
import { useQuantity } from '../hooks/useQuantity';
import { showToast } from '../App';
import './HistoryPage.css';

function HistoryPage() {
  const { history, clearHistory } = useQuantity();

  const handleClear = () => {
    clearHistory();
    showToast('History cleared', 'ok');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="history-wrap">
        <HistoryTable history={history} onClear={handleClear} fullWidth />
      </div>
    </div>
  );
}

export default HistoryPage;
