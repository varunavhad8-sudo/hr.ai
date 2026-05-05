import React from 'react';
import { Briefcase } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="glass" style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '1100px',
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
        <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>hr.ai</span>
      </div>
      
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>Features</a>
        <a href="#pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>Solutions</a>
        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
