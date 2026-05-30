import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Folder, Upload, Settings, Database } from 'lucide-react';
import { useAppContext } from '../AppContext';
import './Sidebar.css';

export function Sidebar() {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'My Candidates', path: '/candidates', icon: <Users size={20} /> },
    { label: 'Folders', path: '/folders', icon: <Folder size={20} /> },
    { label: 'Upload Resume', path: '/upload', icon: <Upload size={20} /> },
    { label: 'Storage', path: '/storage', icon: <Database size={20} /> },
    { label: 'Settings', path: '/settings', icon: <Settings size={20} /> }
  ];

  const { currentUser, isLoadingUser } = useAppContext();

  const userName = isLoadingUser ? '...' : (currentUser?.name || 'User');
  const userEmail = currentUser?.email || '';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/dashboard" className="sidebar-logo">
          <span className="logo-text">HR.ai</span>
          <span className="logo-dot"></span>
        </Link>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.label} 
              to={item.path} 
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Link to="/settings" className="sidebar-footer" style={{ textDecoration: 'none' }}>
        <div className="user-avatar">
          {(userName[0] || 'U').toUpperCase()}
        </div>
        <div className="user-info">
          <span className="user-name">{userName}</span>
          <span className="user-role">{userEmail || 'HR Manager'}</span>
        </div>
      </Link>
    </aside>
  );
}
