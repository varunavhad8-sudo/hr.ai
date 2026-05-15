import React from 'react';

const StatCard = ({ title, value, icon, color, subtitle, subtitleColor, trendData }) => {
  // Simple sparkline path generator
  const getSparklinePath = (data) => {
    if (!data || data.length === 0) return '';
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 80;
    const height = 24;
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d - min) / range) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    return points;
  };

  const getSubtitleColor = (colorName) => {
    switch (colorName) {
      case 'teal': return 'var(--emerald-green)';
      case 'amber': return '#f59e0b';
      case 'gray': return '#94a3b8';
      default: return 'var(--emerald-green)';
    }
  };

  const actualSubtitleColor = getSubtitleColor(subtitleColor);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ 
          fontSize: '1.2rem', 
          backgroundColor: 'rgba(255, 255, 255, 0.05)', 
          width: '48px', 
          height: '48px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderRadius: '12px',
          color: color || 'var(--emerald-green)'
        }}>
          {icon}
        </div>
        {trendData && (
          <div style={{ width: '80px', height: '24px', opacity: 0.8 }}>
            <svg width="100%" height="100%" viewBox="0 -2 80 28" preserveAspectRatio="none">
              <path 
                d={getSparklinePath(trendData)} 
                fill="none" 
                stroke={actualSubtitleColor} 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </div>
        )}
      </div>
      <div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: '600', marginBottom: '8px' }}>
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
          <div style={{ fontSize: '2.4rem', fontWeight: '800', color: 'white', lineHeight: 1 }}>
            {value}
          </div>
          {subtitle && (
            <div style={{ 
              fontSize: '0.8rem', 
              fontWeight: 700, 
              color: actualSubtitleColor,
              marginBottom: '4px'
            }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
