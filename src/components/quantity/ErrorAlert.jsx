import React from 'react';
import './ErrorAlert.css';

function ErrorAlert({ message }) {
  if (!message) return null;
  return <div className="a-error show">{message}</div>;
}

export default ErrorAlert;
