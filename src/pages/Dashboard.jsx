import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { UploadCloud } from 'lucide-react';
import { useAppContext } from '../AppContext';
import './Dashboard.css';

export function Dashboard() {
  const navigate = useNavigate();
  const { candidates, currentUser, isLoadingUser } = useAppContext();
  
  const userName = isLoadingUser 
    ? '...' 
    : (currentUser?.name || 'User').split(' ')[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  };

  // Dynamic statistics from the AppContext candidates state
  const total = candidates.length;
  const shortlisted = candidates.filter(c => c.status === 'Shortlisted').length;
  const inReview = candidates.filter(c => c.status === 'In Review').length;
  const onHold = candidates.filter(c => c.status === 'On Hold').length;
  const rejected = candidates.filter(c => c.status === 'Rejected').length;
  
  // Get the most recent calendar month count
  const thisMonthCount = candidates.filter(c => {
    const addedDate = new Date(c.createdAt || Date.now());
    return addedDate.getMonth() === new Date().getMonth();
  }).length;

  const recentCandidates = [...candidates].slice(0, 3);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title">{getGreeting()}, {userName}</h1>
          <p className="dashboard-subtitle">Your personal candidate workspace</p>
        </header>

        <div className="stats-row">
          <div className="stat-card" onClick={() => navigate('/candidates')}>
            <span className="stat-label">TOTAL CANDIDATES</span>
            <span className="stat-value">{total}</span>
          </div>
          <div className="stat-card" onClick={() => navigate('/candidates')}>
            <span className="stat-label">SHORTLISTED</span>
            <span className="stat-value" style={{ color: 'var(--accent-color)' }}>{shortlisted}</span>
          </div>
          <div className="stat-card" onClick={() => navigate('/candidates')}>
            <span className="stat-label">IN REVIEW</span>
            <span className="stat-value" style={{ color: '#eab308' }}>{inReview}</span>
          </div>
        </div>

        {total === 0 ? (
          <div className="empty-state-card">
            <div className="empty-state-icon">
              <UploadCloud size={48} strokeWidth={1.5} />
            </div>
            <h2 className="empty-state-title">Upload Your First Resume</h2>
            <p className="empty-state-subtitle">AI reads the resume and fills everything automatically</p>
            <button className="btn-upload" onClick={() => navigate('/upload')}>
              Upload Resume
            </button>
          </div>
        ) : (
          <div className="dashboard-details-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '24px' }}>
            {/* Left Detail Panel: Recent Candidates */}
            <div className="dashboard-card" style={{ backgroundColor: 'var(--card-surface)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ color: 'var(--text-main)', fontSize: '0.875rem', fontWeight: '700', marginBottom: '16px', letterSpacing: '0.05em' }}>RECENT UPLOADS</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {recentCandidates.map(c => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer' }} onClick={() => navigate(`/candidates/${c.id}`)}>
                    <div>
                      <h4 style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '0.9375rem', marginBottom: '2px' }}>{c.name}</h4>
                      <p style={{ color: 'var(--muted-text)', fontSize: '0.8125rem' }}>{c.role} • {c.experience}</p>
                    </div>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: '600', 
                      padding: '4px 8px', 
                      borderRadius: '12px',
                      backgroundColor: c.status === 'Shortlisted' ? 'rgba(0,200,150,0.1)' : c.status === 'In Review' ? 'rgba(234,179,8,0.1)' : c.status === 'On Hold' ? 'rgba(100,116,139,0.1)' : 'rgba(239,68,68,0.1)',
                      color: c.status === 'Shortlisted' ? 'var(--accent-color)' : c.status === 'In Review' ? '#eab308' : c.status === 'On Hold' ? '#64748b' : '#ef4444'
                    }}>{c.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Detail Panel: Breakdown Stats */}
            <div className="dashboard-card" style={{ backgroundColor: 'var(--card-surface)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ color: 'var(--text-main)', fontSize: '0.875rem', fontWeight: '700', marginBottom: '16px', letterSpacing: '0.05em' }}>STAGE BREAKDOWN</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--muted-text)', fontSize: '0.875rem' }}>Shortlisted</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{shortlisted}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--muted-text)', fontSize: '0.875rem' }}>In Review</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{inReview}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--muted-text)', fontSize: '0.875rem' }}>On Hold</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{onHold}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                  <span style={{ color: 'var(--muted-text)', fontSize: '0.875rem' }}>Rejected</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{rejected}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
