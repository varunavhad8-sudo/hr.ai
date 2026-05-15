import React from 'react';

const CandidateCard = ({ name, role, exp, source, matchScore }) => {
  const getSourceStyle = (s) => {
    if (s.includes('LinkedIn')) return { backgroundColor: 'rgba(0, 119, 181, 0.15)', color: '#00a0dc' };
    if (s.includes('Naukri')) return { backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' };
    if (s.includes('Indeed')) return { backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' };
    return { backgroundColor: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8' };
  };

  const sourceStyle = getSourceStyle(source);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '16px 0',
      borderBottom: '1px solid var(--glass-border)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ 
          width: '42px', 
          height: '42px', 
          borderRadius: '12px', 
          background: 'rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
          border: '1px solid var(--glass-border)'
        }}>
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} 
            alt={name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div>
          <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'white' }}>{name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: '500' }}>
            {role} • {exp}
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ 
          display: 'inline-block',
          fontSize: '0.65rem',
          fontWeight: '800',
          padding: '2px 8px',
          borderRadius: '4px',
          letterSpacing: '0.02em',
          marginBottom: '6px',
          ...sourceStyle
        }}>
          {source.toUpperCase()}
        </div>
        <div style={{ 
          color: 'var(--emerald-green)', 
          fontWeight: '900', 
          fontSize: '1rem',
          letterSpacing: '-0.02em'
        }}>
          {matchScore}
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
