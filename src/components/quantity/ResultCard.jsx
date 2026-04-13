import React from 'react';
import './ResultCard.css';

function ResultCard({ result }) {
  if (!result) return null;

  const isErr = result.isError;
  return (
    <div className={`result-box show ${isErr ? 'err' : 'ok'}`}>
      <div className="res-lbl">Result</div>
      <div className="res-val">
        {isErr ? result.errorMessage : String(result.value)}
      </div>
      {!isErr && result.unit && (
        <div className="res-unit">Unit: {result.unit}</div>
      )}
    </div>
  );
}

export default ResultCard;
