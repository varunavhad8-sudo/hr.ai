import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Infinity, Library, Award, Check, Lock, X } from 'lucide-react';
import './Storage.css';

export function Storage() {
  const [progress, setProgress] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(5), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setShowUpgradeModal(false);
      setEmail('');
    }, 2000);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main storage-main">
        <Lock className="storage-bg-lock" size={120} />
        
        <div className="storage-container">
          {/* TOP SECTION */}
          <header className="storage-header">
            <h1 className="storage-title">Storage</h1>
            <p className="storage-subtitle">Your personal candidate archive</p>
          </header>

          <section className="storage-usage-card">
            <div className="usage-left">
              <span className="usage-label">STORAGE USED</span>
              <h2 className="usage-value">2.4 MB of 50 MB</h2>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${progress}%`, transition: 'width 1s ease-out' }}></div>
              </div>
            </div>
            <div className="usage-right">
              <span className="badge-free">Free Plan</span>
              <button className="btn-upgrade" onClick={() => setShowUpgradeModal(true)}>Upgrade</button>
            </div>
          </section>

          {/* MIDDLE SECTION */}
          <section className="storage-features">
            <div className="features-header">
              <h2 className="features-title">Unlock Full Storage</h2>
              <p className="features-subtitle">Available in Premium plan only</p>
            </div>

            <div className="feature-cards-row">
              {/* Card 1 */}
              <div className="feature-card">
                <Infinity className="feature-icon" size={32} />
                <h3 className="feature-heading">Unlimited Candidates</h3>
                <p className="feature-text">
                  Store every candidate you have ever interacted with. No limits. No deletions. Forever.
                </p>
                <span className="badge-premium">Premium</span>
              </div>

              {/* Card 2 */}
              <div className="feature-card">
                <Library className="feature-icon" size={32} />
                <h3 className="feature-heading">A-Z Library System</h3>
                <p className="feature-text">
                  Every candidate organised alphabetically and by category. Find anyone in seconds, no matter how many years ago.
                </p>
                <span className="badge-premium">Premium</span>
              </div>

              {/* Card 3 */}
              <div className="feature-card">
                <Award className="feature-icon" size={32} />
                <h3 className="feature-heading">Career Portfolio</h3>
                <p className="feature-text">
                  Auto-generated report of every candidate you have ever managed. Your professional proof of work across every company.
                </p>
                <span className="badge-premium">Premium</span>
              </div>
            </div>
          </section>

          {/* BOTTOM SECTION */}
          <section className="premium-upgrade-card">
            <div className="premium-left">
              <span className="badge-premium-dark">PREMIUM PLAN</span>
              <h2 className="premium-heading">Your Library. Your Career. Forever.</h2>
              <p className="premium-text">
                Everything you build here stays with you. Switch companies. Change roles. Your candidate library never disappears.
              </p>
              <ul className="premium-feature-list">
                <li><Check size={16} className="check-icon" /> Unlimited candidate storage</li>
                <li><Check size={16} className="check-icon" /> A-Z library organisation</li>
                <li><Check size={16} className="check-icon" /> Career portfolio export</li>
                <li><Check size={16} className="check-icon" /> Advanced folder system</li>
                <li><Check size={16} className="check-icon" /> Priority AI parsing</li>
                <li><Check size={16} className="check-icon" /> Excel + PDF export</li>
              </ul>
            </div>
            
            <div className="premium-right">
              <div className="price-display">
                <span className="price-amount">₹499</span>
                <span className="price-period">/month</span>
              </div>
              <p className="price-subtext">Cancel anytime</p>
              <button className="btn-upgrade-large" onClick={() => setShowUpgradeModal(true)}>Upgrade to Premium</button>
              <p className="secure-payment">🔒 Secure payment · Indian servers</p>
            </div>
          </section>
        </div>

        {showUpgradeModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header" style={{borderBottom: 'none', paddingBottom: '0'}}>
                <h2 style={{color: 'var(--text-main)'}}>Upgrade to Premium</h2>
                <button className="btn-close" onClick={() => setShowUpgradeModal(false)}><X size={20} /></button>
              </div>
              <div className="modal-body" style={{ textAlign: 'center', marginTop: '10px', marginBottom: '20px' }}>
                {isSuccess ? (
                  <div style={{ color: '#00c896', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', margin: '20px 0' }}>
                    <Check size={48} />
                    <p style={{ color: 'var(--text-main)', fontSize: '1rem', fontWeight: '500' }}>You are on the list! We will notify you when Premium launches.</p>
                  </div>
                ) : (
                  <>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9375rem' }}>Coming soon. We will notify you when Premium launches.</p>
                    <form onSubmit={handleNotifySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email" 
                          style={{ backgroundColor: '#ffffff', color: '#111111', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', outline: 'none', width: '100%', fontSize: '14px' }}
                          autoFocus
                        />
                        {emailError && <span style={{ color: '#ef4444', fontSize: '12px' }}>{emailError}</span>}
                      </div>
                      <div className="modal-actions" style={{ justifyContent: 'flex-end', marginTop: '8px', padding: 0, border: 'none' }}>
                        <button type="button" className="btn-cancel" onClick={() => setShowUpgradeModal(false)}>Cancel</button>
                        <button type="submit" className="btn-create" style={{ backgroundColor: '#00c896', color: '#ffffff', border: 'none' }}>Notify Me</button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
