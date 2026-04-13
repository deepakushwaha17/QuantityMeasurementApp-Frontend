import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

const CARDS = [
  {
    icon: '🔄',
    title: 'Convert',
    desc: 'Convert a value from one unit to another — length, weight, temperature, or volume.',
    to: '/convert',
  },
  {
    icon: '⚖️',
    title: 'Compare',
    desc: 'Check whether two quantities with different units are equal or not.',
    to: '/compare',
  },
  {
    icon: '➕',
    title: 'Arithmetic',
    desc: 'Add, subtract, or divide two quantities. Optionally express the result in a target unit.',
    to: '/arithmetic',
  },
  {
    icon: '📋',
    title: 'History',
    desc: 'Browse all past operations with filtering by type, action, and errors.',
    to: '/history',
  },
];

function DashboardPage() {
  const { email } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="dashboard-wrap">
        <div className="dashboard-welcome">
          <h2>Welcome to Quantity Measurement</h2>
          <p>{email ? `Signed in as ${email}` : 'Choose an operation to get started.'}</p>
        </div>
        <div className="dashboard-grid">
          {CARDS.map(card => (
            <Link key={card.to} to={card.to} className="dash-card">
              <div className="dash-card-icon">{card.icon}</div>
              <div className="dash-card-title">{card.title}</div>
              <div className="dash-card-desc">{card.desc}</div>
              <div className="dash-card-arrow">→</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
