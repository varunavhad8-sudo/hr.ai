import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { User, Lock, Sliders, Palette, AlertTriangle, Eye, EyeOff, CheckCircle2, CreditCard, Loader2 } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { API_BASE_URL } from '../config';
import getAuthToken from '../utils/getAuthToken';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import './Settings.css';

// Dynamic script loader for Razorpay Checkout SDK
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const existingScript = document.getElementById('razorpay-checkout-sdk');
    if (existingScript) return resolve(true);

    const script = document.createElement('script');
    script.id = 'razorpay-checkout-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export function Settings() {
  const { theme, setTheme, currentUser, isLoadingUser } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    jobTitle: '',
    company: ''
  });


  useEffect(() => {
    // Only update profile when we have real user data — never use stale localStorage
    if (!currentUser) return;
    const name = currentUser.name || '';
    const email = currentUser.email || '';
    const nameParts = name.trim().split(' ');
    setProfile(prev => ({
      ...prev,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: email,
      jobTitle: currentUser.jobTitle || prev.jobTitle || '',
      company: currentUser.company || prev.company || ''
    }));
  }, [currentUser]);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');

  // Dynamic Billing States
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [region, setRegion] = useState('US'); // 'US' (Dodo Payments) | 'IN' (Razorpay)
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState({
    plan: 'free',
    billingCycle: 'monthly',
    status: 'active',
    parsesUsed: 0,
    parsesLimit: 10,
    parsesRemaining: 10,
    currentPeriodEnd: null
  });
  const [isLoadingBilling, setIsLoadingBilling] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Fetch subscription & plans list from backend
  const fetchBillingData = async () => {
    setIsLoadingBilling(true);
    try {
      const token = await getAuthToken();

      // 1. Fetch Subscription & Usage
      const subResponse = await fetch(`${API_BASE_URL}/api/plans/my`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (subResponse.ok) {
        const subData = await subResponse.json();
        setSubscription(subData);
      }

      // 2. Fetch Plans list based on selected region
      const plansResponse = await fetch(`${API_BASE_URL}/api/plans?region=${region}`);
      if (plansResponse.ok) {
        const plansData = await plansResponse.json();
        setPlans(plansData.plans);
      }
    } catch (err) {
      console.warn('[Settings] Offline / mock billing mode active:', err.message);
      // fallback to mock configurations if backend plans are offline
      setPlans([
        { id: 'free', name: 'Free', parsesPerMonth: 10, currency: region === 'IN' ? 'INR' : 'USD', monthlyPrice: 0, annualPrice: 0, features: ['10 resume parses/month', 'AI-powered resume parsing', 'Personal candidate library'] },
        { id: 'starter', name: 'Starter', parsesPerMonth: 200, currency: region === 'IN' ? 'INR' : 'USD', monthlyPrice: region === 'IN' ? 399 : 10, annualPrice: region === 'IN' ? 4308 : 108, features: ['200 resume parses/month', 'AI-powered resume parsing', 'Priority Claude AI parser', 'Cloudflare R2 secure storage'] },
        { id: 'pro', name: 'Pro', parsesPerMonth: 500, currency: region === 'IN' ? 'INR' : 'USD', monthlyPrice: region === 'IN' ? 699 : 20, annualPrice: region === 'IN' ? 7548 : 216, features: ['500 resume parses/month', 'Everything in Starter', 'Unlimited custom team folders', 'Priority support'] }
      ]);
    } finally {
      setIsLoadingBilling(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'Billing') {
      fetchBillingData();
    }
  }, [activeTab, region]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: `${profile.firstName} ${profile.lastName}`.trim(),
          jobTitle: profile.jobTitle,
          company: profile.company
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setCurrentUser(data.user); // Update global state
      
      setToastMessage('Profile updated successfully');
    } catch (err) {
      console.error(err);
      setToastMessage('Error updating profile');
    } finally {
      setIsSavingProfile(false);
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPassError('');

    if (!currentPass) {
      setPassError('Please enter your current password.');
      return;
    }
    if (newPass.length < 8) {
      setPassError('New password must be at least 8 characters.');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('New passwords do not match.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) throw new Error('You are not signed in.');
      if (!user.email) throw new Error('Cannot update password for accounts without an email.');

      // Firebase requires re-authentication before sensitive changes
      const credential = EmailAuthProvider.credential(user.email, currentPass);
      await reauthenticateWithCredential(user, credential);

      // Now update the password
      await updatePassword(user, newPass);

      setToastMessage('Password updated successfully!');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setPassError('Current password is incorrect.');
      } else if (err.code === 'auth/requires-recent-login') {
        setPassError('Session expired. Please sign out and sign in again, then retry.');
      } else if (err.code === 'auth/weak-password') {
        setPassError('New password is too weak. Use at least 8 characters.');
      } else {
        setPassError('Failed to update password: ' + err.message);
      }
    } finally {
      setIsUpdatingPassword(false);
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const confirmDelete = () => {
    // TODO: Implement actual backend deletion API call
    setToastMessage('Account deleted (Frontend Demo)');
    setTimeout(() => {
      setShowDeleteModal(false);
      setDeleteConfirmEmail('');
      navigate('/');
    }, 1000);
  };

  // Checkout handling for Dodo Payments and Razorpay
  const handleUpgrade = async (planId, planGateway) => {
    if (planId === 'free' || planId === subscription.plan) return;
    setIsCheckingOut(true);
    setToastMessage('Redirecting to checkout page...');
    
    try {
      const token = await getAuthToken();

      if (planGateway === 'dodo') {
        // Dodo Payments hosted checkout
        const response = await fetch(`${API_BASE_URL}/api/dodo/create-checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ plan: planId, billingCycle })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
            return;
          }
        }
        throw new Error('Dodo Payments checkout failed');

      } else if (planGateway === 'razorpay') {
        // Razorpay Custom Checkout popup
        const response = await fetch(`${API_BASE_URL}/api/razorpay/create-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ plan: planId, billingCycle })
        });

        if (!response.ok) throw new Error('Failed to create Razorpay subscription');
        const orderData = await response.json();

        // Load Razorpay Script SDK
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) throw new Error('Razorpay SDK failed to load');

        const options = {
          key: orderData.key,
          subscription_id: orderData.subscriptionId,
          name: 'HR.ai',
          description: `Upgrade to ${planId.toUpperCase()} (${billingCycle})`,
          handler: async (paymentResult) => {
            setIsCheckingOut(true);
            setToastMessage('Verifying payment details...');
            try {
              const verifyRes = await fetch(`${API_BASE_URL}/api/razorpay/verify`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  razorpay_payment_id: paymentResult.razorpay_payment_id,
                  razorpay_subscription_id: paymentResult.razorpay_subscription_id,
                  razorpay_signature: paymentResult.razorpay_signature,
                  plan: planId,
                  billingCycle
                })
              });
              if (verifyRes.ok) {
                setToastMessage('Plan activated successfully!');
                await fetchBillingData();
              } else {
                setToastMessage('Payment verification failed.');
              }
            } catch (err) {
              setToastMessage('Verification error.');
            } finally {
              setIsCheckingOut(false);
              setTimeout(() => setToastMessage(''), 2000);
            }
          },
          prefill: {
            email: localStorage.getItem('user-email') || '',
            name: localStorage.getItem('user-name') || ''
          },
          theme: {
            color: '#00c896'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error('[Billing Checkout] Failed:', err.message);
      setToastMessage('Checkout Error: ' + err.message);
      setTimeout(() => setToastMessage(''), 3000);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsCheckingOut(true);
    setToastMessage('Processing cancellation...');
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/razorpay/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setToastMessage('Subscription cancelled at period end.');
        await fetchBillingData();
      } else {
        throw new Error('Failed to cancel subscription');
      }
    } catch (err) {
      setToastMessage('Cancellation failed: ' + err.message);
    } finally {
      setIsCheckingOut(false);
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const tabs = [
    { id: 'Profile', icon: User },
    { id: 'Password', icon: Lock },
    { id: 'Appearance', icon: Palette },
    { id: 'Billing', icon: CreditCard },
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
                  <div className="profile-avatar-circle" style={{ backgroundColor: 'var(--accent-color)', color: '#0a0a0a' }}>
                    {(profile.firstName?.[0] || currentUser?.name?.[0] || 'U').toUpperCase()}
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
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      style={{ backgroundColor: 'var(--accent-color)', color: '#0a0a0a', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: isSavingProfile ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: isSavingProfile ? 0.7 : 1 }}
                    >
                      {isSavingProfile ? <><Loader2 size={16} className="spinner" /> Saving...</> : 'Save Changes'}
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
                    <button
                      type="submit"
                      disabled={isUpdatingPassword}
                      style={{ backgroundColor: 'var(--accent-color)', color: '#0a0a0a', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: isUpdatingPassword ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: isUpdatingPassword ? 0.7 : 1 }}
                    >
                      {isUpdatingPassword ? <><Loader2 size={16} className="spinner" /> Updating...</> : 'Update Password'}
                    </button>
                  </div>
                </form>
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

            {activeTab === 'Billing' && (
              <div className="settings-section">
                <div className="settings-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <h2 className="settings-title">Billing & Subscriptions</h2>
                    <p className="settings-subtitle">Manage plan levels, limits, and sync payment gateways</p>
                  </div>
                  {/* Currency/Gateway region switcher */}
                  <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '2px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                    <button 
                      onClick={() => setRegion('US')}
                      style={{ padding: '6px 12px', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', backgroundColor: region === 'US' ? 'var(--accent-color)' : 'transparent', color: region === 'US' ? 'var(--bg-color)' : 'var(--text-muted)' }}
                    >
                      USD ($)
                    </button>
                    <button 
                      onClick={() => setRegion('IN')}
                      style={{ padding: '6px 12px', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', backgroundColor: region === 'IN' ? 'var(--accent-color)' : 'transparent', color: region === 'IN' ? 'var(--bg-color)' : 'var(--text-muted)' }}
                    >
                      INR (₹)
                    </button>
                  </div>
                </div>
                <hr className="settings-divider" />

                {isLoadingBilling ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                    <Loader2 className="spinner" size={32} style={{ color: 'var(--accent-color)' }} />
                  </div>
                ) : (
                  <>
                    {/* Active usage bar */}
                    <div className="parse-usage-container" style={{ margin: '20px 0', padding: '24px', border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'var(--card-surface)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: '600', letterSpacing: '0.05em' }}>MONTHLY PARSE USAGE</span>
                        <span style={{ fontSize: '13px', color: 'var(--accent-color)', fontWeight: '600' }}>
                          {subscription.parsesUsed} / {subscription.parsesLimit} parses used
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            width: `${Math.min(100, (subscription.parsesUsed / subscription.parsesLimit) * 100)}%`, 
                            height: '100%', 
                            backgroundColor: 'var(--accent-color)', 
                            borderRadius: '4px',
                            transition: 'width 0.3s ease'
                          }}
                        ></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {subscription.currentPeriodEnd ? `Renews on ${new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}` : 'Standard Reset'}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          Active Plan: <strong style={{ color: 'var(--accent-color)', textTransform: 'capitalize' }}>{subscription.plan} Tier</strong>
                          {subscription.status === 'cancelled' && <span style={{ color: '#ef4444', marginLeft: '6px' }}>(Pending Cancellation)</span>}
                        </span>
                      </div>
                    </div>

                    {/* Subscription billing cycle switcher */}
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '32px 0 24px 0' }}>
                      <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '4px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                        <button 
                          onClick={() => setBillingCycle('monthly')}
                          style={{ padding: '8px 20px', border: 'none', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', backgroundColor: billingCycle === 'monthly' ? 'var(--accent-color)' : 'transparent', color: billingCycle === 'monthly' ? 'var(--bg-color)' : 'var(--text-muted)' }}
                        >
                          Monthly
                        </button>
                        <button 
                          onClick={() => setBillingCycle('annual')}
                          style={{ padding: '8px 20px', border: 'none', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', backgroundColor: billingCycle === 'annual' ? 'var(--accent-color)' : 'transparent', color: billingCycle === 'annual' ? 'var(--bg-color)' : 'var(--text-muted)' }}
                        >
                          Annual (10% Off)
                        </button>
                      </div>
                    </div>

                    {/* Active Plans selection grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '12px' }}>
                      {plans.map(plan => {
                        const isCurrent = subscription.plan === plan.id;
                        const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
                        const formattedPrice = plan.currency === 'INR' ? `₹${price}` : `$${price}`;
                        const isPopular = plan.id === 'starter';

                        return (
                          <div 
                            key={plan.id}
                            style={{ 
                              padding: '24px', 
                              border: isCurrent ? '1px solid var(--accent-color)' : '1px solid var(--border-color)', 
                              borderRadius: '12px', 
                              backgroundColor: 'var(--card-surface)', 
                              display: 'flex', 
                              flexDirection: 'column', 
                              justifyContent: 'space-between',
                              transform: isCurrent ? 'scale(1.02)' : 'none',
                              boxShadow: isCurrent ? '0 4px 20px rgba(0,200,150,0.1)' : 'none',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', textTransform: 'uppercase' }}>{plan.name}</h3>
                                {isPopular && (
                                  <span style={{ fontSize: '9px', fontWeight: '700', backgroundColor: 'var(--accent-color)', color: 'var(--bg-color)', padding: '2px 6px', borderRadius: '4px' }}>POPULAR</span>
                                )}
                              </div>
                              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>{plan.id === 'free' ? 'For occasional use' : plan.id === 'starter' ? 'For professionals' : 'For full agencies'}</p>
                              <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>{formattedPrice}</span>
                              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/{billingCycle === 'annual' ? 'yr' : 'mo'}</span>
                              <ul style={{ listStyle: 'none', padding: '0', margin: '20px 0 0 0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                {plan.features.map((feat, i) => (
                                  <li key={i}>✓ {feat}</li>
                                ))}
                              </ul>
                            </div>
                            
                            {isCurrent ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '24px' }}>
                                <button disabled style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--accent-color)', fontWeight: '700', fontSize: '13px', cursor: 'not-allowed' }}>
                                  Active Plan
                                </button>
                                {subscription.plan !== 'free' && subscription.status !== 'cancelled' && (
                                  <button onClick={handleCancelSubscription} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer', padding: '4px' }}>
                                    Cancel Subscription
                                  </button>
                                )}
                              </div>
                            ) : (
                              <button 
                                onClick={() => handleUpgrade(plan.id, plan.gateway)}
                                disabled={plan.id === 'free' || isCheckingOut}
                                style={{ 
                                  width: '100%', 
                                  padding: '10px', 
                                  marginTop: '24px', 
                                  borderRadius: '8px', 
                                  border: 'none', 
                                  backgroundColor: plan.id === 'free' ? 'transparent' : 'var(--accent-color)', 
                                  color: plan.id === 'free' ? 'var(--text-muted)' : 'var(--bg-color)', 
                                  fontWeight: '600', 
                                  fontSize: '13px', 
                                  cursor: plan.id === 'free' ? 'not-allowed' : 'pointer',
                                  transition: 'all 0.2s'
                                }}
                              >
                                {isCheckingOut ? 'Loading...' : plan.id === 'free' ? 'Free Tier' : `Upgrade to ${plan.name}`}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
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
                  <button className="btn-danger-ghost" onClick={() => {
                    setDeleteConfirmEmail('');
                    setShowDeleteModal(true);
                  }}>Delete Account</button>
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
                <p style={{ color: '#888', fontSize: '0.9375rem', marginBottom: '20px' }}>This will permanently delete your account and all candidate data. This cannot be undone.</p>
                <div style={{ textAlign: 'left', marginTop: '10px' }}>
                  <label style={{ color: 'white', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                    Type <strong style={{color: '#ff4444'}}>{currentUser?.email}</strong> to confirm:
                  </label>
                  <input 
                    type="text" 
                    value={deleteConfirmEmail} 
                    onChange={e => setDeleteConfirmEmail(e.target.value)}
                    placeholder="Enter your email" 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#111', border: '1px solid #333', color: 'white', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              <div className="modal-actions" style={{ justifyContent: 'center' }}>
                <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button 
                  className="btn-create" 
                  style={{ 
                    backgroundColor: deleteConfirmEmail === currentUser?.email ? '#ef4444' : '#552222', 
                    color: deleteConfirmEmail === currentUser?.email ? 'white' : '#888',
                    cursor: deleteConfirmEmail === currentUser?.email ? 'pointer' : 'not-allowed'
                  }} 
                  disabled={deleteConfirmEmail !== currentUser?.email}
                  onClick={confirmDelete}
                >
                  Delete Account
                </button>
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
