import React from 'react';
import { MapPin, Users } from 'lucide-react';

const JobItem = ({ title, location, candidates, status }) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '20px 0',
      borderBottom: '1px solid var(--glass-border)'
    }}>
      <div>
        <div style={{ fontWeight: '700', fontSize: '1.05rem', marginBottom: '6px', color: 'white' }}>{title}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} color="var(--emerald-green)" /> {location}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={14} color="var(--emerald-green)" /> {candidates} candidates
          </span>
        </div>
      </div>
      <span className={`pill pill-${status.toLowerCase()}`} style={{ 
        fontSize: '0.7rem', 
        padding: '4px 10px',
        backgroundColor: status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
        color: status === 'Active' ? 'var(--emerald-green)' : '#f59e0b',
        borderRadius: '6px',
        fontWeight: 800,
        letterSpacing: '0.05em'
      }}>
        {status.toUpperCase()}
      </span>
    </div>
  );
};

export default JobItem;
