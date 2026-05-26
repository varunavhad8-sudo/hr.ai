import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { UploadCloud } from 'lucide-react';
import { useAppContext } from '../AppContext';
import './Dashboard.css';

export function Dashboard() {
  const navigate = useNavigate();
  const { stats } = useAppContext();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title">{getGreeting()}, Alex</h1>
          <p className="dashboard-subtitle">Your personal candidate workspace</p>
        </header>

        <div className="stats-row">
          <div className="stat-card" onClick={() => navigate('/candidates')}>
            <span className="stat-label">TOTAL CANDIDATES</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-card" onClick={() => navigate('/candidates')}>
            <span className="stat-label">THIS MONTH</span>
            <span className="stat-value">{stats.thisMonth}</span>
          </div>
          <div className="stat-card" onClick={() => navigate('/candidates')}>
            <span className="stat-label">SAVED PROFILES</span>
            <span className="stat-value">{stats.saved}</span>
          </div>
        </div>

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
      </main>
    </div>
  );
}
