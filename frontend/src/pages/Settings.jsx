import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { 
  Building2, 
  Share2, 
  Bell, 
  CreditCard, 
  Upload, 
  Globe, 
  Users, 
  MapPin, 
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Download,
  ArrowUpRight,
  Shield,
  Smartphone,
  Laptop
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
  const [activeSubNav, setActiveSubNav] = useState('Company Profile');

  const subNavLinks = [
    { name: 'Company Profile', icon: <Building2 size={18} /> },
    { name: 'Connected Platforms', icon: <Share2 size={18} /> },
    { name: 'Security Settings', icon: <Shield size={18} /> },
    { name: 'Notifications', icon: <Bell size={18} /> },
    { name: 'Billing & Plan', icon: <CreditCard size={18} /> },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="dashboard-main">
        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Settings</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>Manage your account, integrations, and preferences</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px', alignItems: 'flex-start' }}>
          {/* Sub-navigation */}
          <div className="card" style={{ padding: '12px' }}>
            {subNavLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => setActiveSubNav(link.name)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeSubNav === link.name ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                  color: activeSubNav === link.name ? 'var(--emerald-green)' : 'var(--text-light)',
                  fontWeight: activeSubNav === link.name ? 700 : 500,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  marginBottom: '4px'
                }}
              >
                {link.icon}
                {link.name}
              </button>
            ))}
          </div>

          {/* Content Panel */}
          <div className="card" style={{ padding: '40px', minHeight: '600px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSubNav}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeSubNav === 'Company Profile' && <CompanyProfilePanel />}
                {activeSubNav === 'Connected Platforms' && <PlatformsPanel />}
                {activeSubNav === 'Security Settings' && <SecurityPanel />}
                {activeSubNav === 'Notifications' && <NotificationsPanel />}
                {activeSubNav === 'Billing & Plan' && <BillingPanel />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

const CompanyProfilePanel = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
    <div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Company Profile</h2>
      <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>Update your organization's public information.</p>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '32px', padding: '24px', background: '#f8f9fb', borderRadius: '16px' }}>
      <div style={{ 
        width: '100px', 
        height: '100px', 
        borderRadius: '20px', 
        background: 'white', 
        border: '2px dashed var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        color: 'var(--text-light)',
        cursor: 'pointer'
      }}>
        <Upload size={24} />
        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Upload Logo</span>
      </div>
      <div>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Company Logo</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>PNG or JPG. Max size of 800K.</p>
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      <div className="form-group">
        <label className="form-label">Company Name</label>
        <input type="text" className="form-input" defaultValue="Acme Inc." />
      </div>
      <div className="form-group">
        <label className="form-label">Industry</label>
        <input type="text" className="form-input" defaultValue="Technology" />
      </div>
      <div className="form-group">
        <label className="form-label">City</label>
        <div style={{ position: 'relative' }}>
          <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input type="text" className="form-input" style={{ paddingLeft: '36px' }} defaultValue="Mumbai" />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Website</label>
        <div style={{ position: 'relative' }}>
          <Globe size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input type="text" className="form-input" style={{ paddingLeft: '36px' }} defaultValue="https://acme.inc" />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Company Size</label>
        <select className="form-input">
          <option>1-10 employees</option>
          <option selected>11-50 employees</option>
          <option>51-200 employees</option>
          <option>201-500 employees</option>
          <option>500+ employees</option>
        </select>
      </div>
    </div>

    <button className="btn-emerald" style={{ alignSelf: 'flex-start', padding: '12px 32px' }}>Save Changes</button>
  </div>
);

const PlatformsPanel = () => {
  const platforms = [
    { name: 'LinkedIn', color: '#0077b5', status: 'Connected', desc: 'Connected since Oct 2023', icon: 'LI' },
    { name: 'Naukri', color: '#2e3192', status: 'Connected', desc: 'Connected since Oct 2023', icon: 'N' },
    { name: 'Indeed', color: '#2164f3', status: 'Not connected', desc: 'Connect to search candidates', icon: 'I' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Connected Platforms</h2>
        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>Connect to search and import candidates automatically.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {platforms.map(p => (
          <div key={p.name} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '24px', 
            borderRadius: '16px', 
            border: '1px solid var(--border-light)',
            gap: '20px'
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '10px', 
              background: p.color, 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem'
            }}>
              {p.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h4 style={{ fontSize: '1.1rem' }}>{p.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, color: p.status === 'Connected' ? 'var(--emerald-green)' : 'var(--text-light)' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: p.status === 'Connected' ? 'var(--emerald-green)' : '#94a3b8' }} />
                  {p.status}
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{p.desc}</p>
            </div>
            <button style={{ 
              padding: '10px 20px', 
              borderRadius: '8px', 
              border: '1px solid var(--border-light)', 
              background: 'white', 
              fontWeight: 700, 
              fontSize: '0.9rem',
              cursor: 'pointer',
              color: p.status === 'Connected' ? '#ef4444' : 'var(--text-dark)'
            }}>
              {p.status === 'Connected' ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const NotificationsPanel = () => {
  const [notifs, setNotifs] = useState({
    matches: true,
    reminders: true,
    replies: true,
    summary: false
  });

  const toggle = (key) => setNotifs(prev => ({ ...prev, [key]: !prev[key] }));

  const items = [
    { key: 'matches', label: 'New candidate matches found', desc: 'Get notified when AI finds new profiles for your jobs.' },
    { key: 'reminders', label: 'Interview reminders', desc: 'Receive alerts 30 minutes before your scheduled interviews.' },
    { key: 'replies', label: 'Candidate replied to message', desc: 'Instant notification when a candidate responds to your outreach.' },
    { key: 'summary', label: 'Weekly hiring summary email', desc: 'A weekly digest of your sourcing activity and stats.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Notifications</h2>
        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>Control how and when you want to be notified.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {items.map(item => (
          <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, marginBottom: '4px' }}>{item.label}</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{item.desc}</p>
            </div>
            <div 
              onClick={() => toggle(item.key)}
              style={{ 
                width: '48px', 
                height: '24px', 
                background: notifs[item.key] ? 'var(--emerald-green)' : '#e2e8f0', 
                borderRadius: '12px', 
                position: 'relative', 
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ 
                width: '18px', 
                height: '18px', 
                background: 'white', 
                borderRadius: '50%', 
                position: 'absolute', 
                top: '3px', 
                left: notifs[item.key] ? '27px' : '3px',
                transition: 'all 0.3s'
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BillingPanel = () => {
  const invoices = [
    { date: 'May 1, 2024', amount: '₹2,499', id: 'INV-008' },
    { date: 'Apr 1, 2024', amount: '₹2,499', id: 'INV-007' },
    { date: 'Mar 1, 2024', amount: '₹2,499', id: 'INV-006' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Billing & Plan</h2>
        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>Manage your subscription and billing history.</p>
      </div>

      <div style={{ padding: '32px', borderRadius: '16px', background: 'var(--dark-green)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ opacity: 0.8, fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '8px' }}>Current Plan</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '4px' }}>Growth Plan</div>
          <div style={{ opacity: 0.8, fontSize: '1rem' }}>₹2,499 / month • Next billing June 1, 2024</div>
        </div>
        <button className="btn-emerald" style={{ background: 'white', color: 'var(--dark-green)' }}>
          Upgrade Plan <ArrowUpRight size={18} />
        </button>
      </div>

      <div>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Plan Features</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {['100 AI Sourcing Credits', 'Unlimited Job Posts', 'Premium Candidate Profiles', 'Direct Messaging', 'ATS Integration', 'Priority Support'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-dark)', fontWeight: 600, fontSize: '0.95rem' }}>
              <CheckCircle2 size={18} color="var(--emerald-green)" /> {f}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Billing History</h4>
        <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-light)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f8f9fb', borderBottom: '1px solid var(--border-light)' }}>
              <tr>
                <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)' }}>Date</th>
                <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)' }}>Amount</th>
                <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)' }}>Invoice ID</th>
                <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)' }}></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => (
                <tr key={inv.id} style={{ borderBottom: i === invoices.length - 1 ? 'none' : '1px solid var(--border-light)' }}>
                  <td style={{ padding: '16px 24px', fontWeight: 600 }}>{inv.date}</td>
                  <td style={{ padding: '16px 24px', fontWeight: 600 }}>{inv.amount}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-light)', fontSize: '0.9rem' }}>{inv.id}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--emerald-green)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
                      <Download size={16} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SecurityPanel = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const activeSessions = [
    { device: 'MacBook Pro - Chrome', location: 'Mumbai, India', lastActive: 'Active now', icon: <Laptop size={20} /> },
    { device: 'iPhone 14 - Safari', location: 'Mumbai, India', lastActive: '2 hours ago', icon: <Smartphone size={20} /> },
  ];

  const loginHistory = [
    { date: 'May 15, 2024 - 10:30 AM', device: 'MacBook Pro', location: 'Mumbai, IN', status: 'Success' },
    { date: 'May 14, 2024 - 09:15 PM', device: 'iPhone 14', location: 'Mumbai, IN', status: 'Success' },
    { date: 'May 12, 2024 - 02:45 AM', device: 'Unknown Device', location: 'Moscow, RU', status: 'Failed' },
    { date: 'May 10, 2024 - 11:20 AM', device: 'MacBook Pro', location: 'Mumbai, IN', status: 'Success' },
    { date: 'May 08, 2024 - 08:00 AM', device: 'MacBook Pro', location: 'Pune, IN', status: 'Success' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Security Settings</h2>
        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>Manage your account security and active sessions.</p>
      </div>

      {/* Two-Factor Authentication */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '32px', borderBottom: '1px solid var(--border-light)' }}>
        <div>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} color="var(--emerald-green)" /> Two-Factor Authentication (2FA)
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Add an extra layer of security to your account.</p>
        </div>
        <div 
          onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
          style={{ 
            width: '48px', 
            height: '24px', 
            background: twoFactorEnabled ? 'var(--emerald-green)' : '#e2e8f0', 
            borderRadius: '12px', 
            position: 'relative', 
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          <div style={{ 
            width: '18px', 
            height: '18px', 
            background: 'white', 
            borderRadius: '50%', 
            position: 'absolute', 
            top: '3px', 
            left: twoFactorEnabled ? '27px' : '3px',
            transition: 'all 0.3s'
          }} />
        </div>
      </div>

      {/* Active Sessions */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '1.1rem' }}>Active Sessions</h4>
          <button style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
            Sign out all devices
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeSessions.map((session, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '1px solid var(--border-light)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)' }}>
                {session.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 700 }}>{session.device}</span>
                  {session.lastActive === 'Active now' && (
                    <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--emerald-green)', padding: '2px 6px', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase' }}>Current</span>
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '2px' }}>
                  {session.location} • {session.lastActive}
                </div>
              </div>
              <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-light)', background: 'transparent', color: 'var(--text-light)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                Sign out
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Login History */}
      <div>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Login History</h4>
        <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-light)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f8f9fb', borderBottom: '1px solid var(--border-light)' }}>
              <tr>
                <th style={{ padding: '12px 24px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)' }}>Date & Time</th>
                <th style={{ padding: '12px 24px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)' }}>Device</th>
                <th style={{ padding: '12px 24px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)' }}>Location</th>
                <th style={{ padding: '12px 24px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loginHistory.map((login, i) => (
                <tr key={i} style={{ borderBottom: i === loginHistory.length - 1 ? 'none' : '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px 24px', fontSize: '0.85rem', fontWeight: 500 }}>{login.date}</td>
                  <td style={{ padding: '12px 24px', fontSize: '0.85rem', fontWeight: 500 }}>{login.device}</td>
                  <td style={{ padding: '12px 24px', fontSize: '0.85rem', color: 'var(--text-light)' }}>{login.location}</td>
                  <td style={{ padding: '12px 24px' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      color: login.status === 'Success' ? 'var(--emerald-green)' : '#ef4444',
                      background: login.status === 'Success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      {login.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Settings;
