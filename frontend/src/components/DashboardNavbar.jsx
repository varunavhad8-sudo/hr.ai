import React from 'react';
import { Briefcase, Home as HomeIcon, Bell, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardNavbar = () => {
  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: '20px',
      margin: '0 auto',
      width: '100%',
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000,
      marginBottom: '40px'
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

        <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bell size={22} color="var(--text-secondary)" />
          <div style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            background: '#ef4444',
            color: 'white',
            fontSize: '0.65rem',
            fontWeight: 800,
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #0d1117'
          }}>
            3
          </div>
        </div>

        <button style={{ 
          padding: '10px 16px', 
          fontSize: '0.9rem', 
          background: 'rgba(16, 185, 129, 0.1)', 
          border: '1px solid rgba(16, 185, 129, 0.3)', 
          borderRadius: '10px',
          color: 'var(--emerald-green)',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s'
        }}>
          <Sparkles size={16} /> AI Assistant
        </button>

        <Link to="/post-job" style={{ textDecoration: 'none' }}>
          <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
            Post a Job
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
