import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">HR.ai</span>
          <span className="logo-dot"></span>
        </Link>
        
        <div className="navbar-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#docs">Docs</a>
          <a href="#blog">Blog</a>
        </div>
        
        <div className="navbar-actions">
          <Link to="/signin" className="btn btn-ghost">Sign In</Link>
          <button className="btn btn-primary" onClick={() => navigate('/signin')}>Get Started</button>
        </div>
      </div>
    </nav>
  );
}
