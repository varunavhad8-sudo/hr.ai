import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-container">
      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-logo">Hr.ai</div>
          {children}
        </div>
      </div>
      <div className="auth-info-side">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '32px', lineHeight: '1.1', color: 'white' }}>
            Join 500+ founders hiring smarter
          </h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '16px', fontSize: '1.15rem', color: 'rgba(255,255,255,0.9)' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                background: 'rgba(16, 185, 129, 0.2)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--emerald-green)',
                fontWeight: 800,
                fontSize: '0.9rem'
              }}>✓</div>
              Find candidates from Naukri, LinkedIn & Indeed
            </li>
            <li style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '16px', fontSize: '1.15rem', color: 'rgba(255,255,255,0.9)' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                background: 'rgba(16, 185, 129, 0.2)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--emerald-green)',
                fontWeight: 800,
                fontSize: '0.9rem'
              }}>✓</div>
              AI ranks the best matches for your role
            </li>
            <li style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '16px', fontSize: '1.15rem', color: 'rgba(255,255,255,0.9)' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                background: 'rgba(16, 185, 129, 0.2)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--emerald-green)',
                fontWeight: 800,
                fontSize: '0.9rem'
              }}>✓</div>
              Hire in hours, not weeks
            </li>
          </ul>
        </div>

        {/* Watermark Logo */}
        <div style={{ 
          position: 'absolute', 
          bottom: '40px', 
          left: '80px', 
          fontSize: '3rem', 
          fontWeight: 900, 
          opacity: 0.05, 
          letterSpacing: '-2px',
          color: 'white',
          userSelect: 'none'
        }}>
          Hr.ai
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
