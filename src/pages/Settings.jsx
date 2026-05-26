import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { User, Lock, Sliders, Palette, AlertTriangle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../AppContext';
import './Settings.css';

export function Settings() {
  const { theme, setTheme } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profile, setProfile] = useState({
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex.morgan@example.com',
    jobTitle: 'HR Manager',
    company: 'TechCorp Inc.'
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const photoInputRef = React.useRef(null);
  
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    weeklyReport: false,
    autoSave: true
  });

  const togglePref = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      setToastMessage('Profile updated successfully');
      setTimeout(() => setToastMessage(''), 2000);
    }, 1000);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setPassError('Passwords do not match');
      return;
    }
    setPassError('');
    setToastMessage('Password updated successfully');
    setTimeout(() => setToastMessage(''), 2000);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const confirmDelete = () => {
    setToastMessage('Account deleted');
    setTimeout(() => navigate('/'), 1000);
  };

  const tabs = [
    { id: 'Profile', icon: User },
    { id: 'Password', icon: Lock },
    { id: 'Preferences', icon: Sliders },
    { id: 'Appearance', icon: Palette },
    { id: 'Danger Zone', icon: AlertTriangle }
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main settings-main">
        
        <div className="settings-container">
          {/* Left Column */}
          <div className="settings-nav">
            <div className="settings-nav-header">Settings</div>
            <ul className="settings-nav-list">
              {tabs.map(tab => (
                <li key={tab.id}>
                  <button 
                    className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <tab.icon size={18} className="settings-nav-icon" />
                    {tab.id}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column */}
          <div className="settings-content">
            
            {activeTab === 'Profile' && (
              <div className="settings-section">
                <div className="settings-section-header">
                  <h2 className="settings-title">Profile</h2>
                  <p className="settings-subtitle">Manage your personal information</p>
                </div>
                <hr className="settings-divider" />

                <div className="profile-avatar-area">
                  <div className="profile-avatar-circle">
                    AM
                  </div>
                  <div className="profile-avatar-info">
                    <input type="file" hidden accept=".jpg,.jpeg,.png" ref={photoInputRef} />
                    <button className="btn-link-teal" onClick={() => photoInputRef.current?.click()}>Change Photo</button>
                    <p className="avatar-hint">JPG or PNG, max 2MB</p>
                  </div>
                </div>

                <form className="settings-form" onSubmit={handleProfileSave}>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>First Name</label>
                      <input type="text" value={profile.firstName} onChange={e => setProfile({...profile, firstName: e.target.value})} placeholder="First Name" style={{backgroundColor: '#ffffff', color: '#111111'}} />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input type="text" value={profile.lastName} onChange={e => setProfile({...profile, lastName: e.target.value})} placeholder="Last Name" style={{backgroundColor: '#ffffff', color: '#111111'}} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={profile.email} disabled className="input-readonly" style={{opacity: 0.6}} />
                  </div>

                  <div className="form-group">
                    <label>Job Title</label>
                    <input type="text" value={profile.jobTitle} onChange={e => setProfile({...profile, jobTitle: e.target.value})} placeholder="Job Title" />
                  </div>

                  <div className="form-group">
                    <label>Company Name</label>
                    <input type="text" value={profile.company} onChange={e => setProfile({...profile, company: e.target.value})} placeholder="Company Name" />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={isSavingProfile}>
                      {isSavingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'Password' && (
              <div className="settings-section">
                <div className="settings-section-header">
                  <h2 className="settings-title">Password</h2>
                  <p className="settings-subtitle">Update your account password</p>
                </div>
                <hr className="settings-divider" />

                <div className="security-tip-card">
                  <Lock size={20} className="security-tip-icon" />
                  <p>Use at least 8 characters with uppercase, numbers and symbols</p>
                </div>

                <form className="settings-form" onSubmit={handlePasswordUpdate}>
                  <div className="form-group password-group">
                    <label>Current Password</label>
                    <div className="input-with-icon">
                      <input type={showCurrentPassword ? "text" : "password"} value={currentPass} onChange={e => setCurrentPass(e.target.value)} placeholder="Enter current password" />
                      <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="btn-icon">
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group password-group">
                    <label>New Password</label>
                    <div className="input-with-icon">
                      <input type={showNewPassword ? "text" : "password"} value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Enter new password" />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="btn-icon">
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group password-group">
                    <label>Confirm New Password</label>
                    <div className="input-with-icon">
                      <input type={showConfirmPassword ? "text" : "password"} value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Confirm new password" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="btn-icon">
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {passError && <p style={{color: '#ef4444', fontSize: '14px', marginTop: '4px'}}>{passError}</p>}

                  <div className="form-actions">
                    <button type="submit" className="btn-primary">Update Password</button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'Preferences' && (
              <div className="settings-section">
                <div className="settings-section-header">
                  <h2 className="settings-title">Preferences</h2>
                  <p className="settings-subtitle">Customise your experience</p>
                </div>
                <hr className="settings-divider" />

                <div className="preference-rows">
                  <div className="preference-row">
                    <div className="preference-info">
                      <h3>Email Notifications</h3>
                      <p>Receive updates about your candidate activity</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={preferences.emailNotifications} onChange={() => togglePref('emailNotifications')} />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="preference-row">
                    <div className="preference-info">
                      <h3>Weekly Summary Report</h3>
                      <p>Get a weekly digest of your hiring progress</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={preferences.weeklyReport} onChange={() => togglePref('weeklyReport')} />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="preference-row">
                    <div className="preference-info">
                      <h3>Auto-save Candidates</h3>
                      <p>Automatically save candidates when uploading resumes</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={preferences.autoSave} onChange={() => togglePref('autoSave')} />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Appearance' && (
              <div className="settings-section">
                <div className="settings-section-header">
                  <h2 className="settings-title">Appearance</h2>
                  <p className="settings-subtitle">Choose your preferred theme</p>
                </div>
                <hr className="settings-divider" />

                <div className="theme-cards">
                  <div className={`theme-card ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>
                    <div className="theme-preview dark-preview">
                      <div className="theme-sidebar"></div>
                      <div className="theme-main"></div>
                    </div>
                    <div className="theme-info">
                      <h3>Dark</h3>
                      <p>Sleek dark theme</p>
                    </div>
                    {theme === 'dark' && <CheckCircle2 size={20} className="theme-check" />}
                  </div>

                  <div className={`theme-card ${theme === 'midnight' ? 'active' : ''}`} onClick={() => setTheme('midnight')}>
                    <div className="theme-preview midnight-preview">
                      <div className="theme-sidebar"></div>
                      <div className="theme-main"></div>
                    </div>
                    <div className="theme-info">
                      <h3>Midnight</h3>
                      <p>Purple accent</p>
                    </div>
                    {theme === 'midnight' && <CheckCircle2 size={20} className="theme-check" />}
                  </div>

                  <div className={`theme-card ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>
                    <div className="theme-preview light-preview">
                      <div className="theme-sidebar"></div>
                      <div className="theme-main"></div>
                    </div>
                    <div className="theme-info">
                      <h3>Light</h3>
                      <p>Default theme (clean white)</p>
                    </div>
                    {theme === 'light' && <CheckCircle2 size={20} className="theme-check" />}
                  </div>

                  <div className={`theme-card ${theme === 'ocean' ? 'active' : ''}`} onClick={() => setTheme('ocean')}>
                    <div className="theme-preview ocean-preview">
                      <div className="theme-sidebar"></div>
                      <div className="theme-main"></div>
                    </div>
                    <div className="theme-info">
                      <h3>Ocean</h3>
                      <p>Blue accent</p>
                    </div>
                    {theme === 'ocean' && <CheckCircle2 size={20} className="theme-check" />}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Danger Zone' && (
              <div className="settings-section">
                <div className="settings-section-header">
                  <h2 className="settings-title danger-text">Danger Zone</h2>
                  <p className="settings-subtitle">Irreversible actions</p>
                </div>
                <hr className="settings-divider danger-divider" />

                <div className="danger-card">
                  <div className="danger-info">
                    <h3>Delete Account</h3>
                    <p>Permanently delete your account and all candidate data.<br/>This cannot be undone.</p>
                  </div>
                  <button className="btn-danger-ghost" onClick={() => setShowDeleteModal(true)}>Delete Account</button>
                </div>
              </div>
            )}

          </div>
        </div>

        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content delete-modal">
              <div className="modal-body" style={{ textAlign: 'center', marginTop: '10px', marginBottom: '20px' }}>
                <h2 style={{ color: 'white', marginBottom: '10px', fontSize: '1.25rem', fontWeight: '700' }}>Are you sure?</h2>
                <p style={{ color: '#888', fontSize: '0.9375rem' }}>This will permanently delete your account and all candidate data. This cannot be undone.</p>
              </div>
              <div className="modal-actions" style={{ justifyContent: 'center' }}>
                <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button className="btn-create" style={{ backgroundColor: '#ef4444', color: 'white' }} onClick={confirmDelete}>Delete Account</button>
              </div>
            </div>
          </div>
        )}

        {toastMessage && (
          <div className="toast-notification" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <CheckCircle2 size={18} />
            {toastMessage}
          </div>
        )}

      </main>
    </div>
  );
}
