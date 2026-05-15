import React from 'react';
import Sidebar from '../components/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';

const PlaceholderPage = ({ title }) => (
  <div className="dashboard-layout">
    <Sidebar />
    <main className="dashboard-main" style={{ 
      padding: '24px 48px'
    }}>
      <DashboardNavbar />
      <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', fontWeight: 800, color: 'white' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}> This feature is coming soon to your recruitment engine.</p>
      </div>
    </main>
  </div>
);

export const MyJobs = () => <PlaceholderPage title="My Jobs" />;
export const Messages = () => <PlaceholderPage title="Messages" />;
