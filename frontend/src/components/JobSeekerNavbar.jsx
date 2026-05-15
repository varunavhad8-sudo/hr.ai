import React from 'react';
import { Briefcase, Home as HomeIcon, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const JobSeekerNavbar = () => {
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
          background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
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

        <Link to="/profile" style={{ textDecoration: 'none' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.95rem'
          }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '50%', 
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={18} />
            </div>
            <span>My Profile</span>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default JobSeekerNavbar;
