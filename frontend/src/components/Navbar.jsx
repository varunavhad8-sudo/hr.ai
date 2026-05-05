import React from 'react';
import { Briefcase, Home as HomeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="glass" style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '1200px',
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
        <div style={{
          background: 'var(--gradient-main)',
          padding: '8px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Briefcase size={20} color="white" />
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Hr.ai</span>
      </Link>
      
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500, fontSize: '0.95rem' }}>
            <HomeIcon size={18} /> Home
          </Link>
          <a href="/#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>Features</a>
          <a href="/#solutions" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>Pricing</a>
          <Link to="/map" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>Live Map</Link>
        </div>

        <div style={{
          height: '24px',
          width: '1px',
          background: 'var(--glass-border)'
        }}></div>

        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          padding: '6px 12px',
          borderRadius: '20px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--accent-primary)'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--accent-primary)',
            boxShadow: '0 0 10px var(--accent-primary)'
          }}></div>
          5/5 Credits
        </div>

        <Link to="/get-started">
          <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
            Get Started
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
