import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../App';
import './Navbar.css';

function Navbar() {
  const { email, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Logged out', 'ok');
    navigate('/login');
  };

  return (
    <nav className="topnav">
      <Link to="/" className="nav-logo">
        Quantity <span>Measurement</span>
      </Link>
      <div className="nav-right">
        <span className="nav-email">{email}</span>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
