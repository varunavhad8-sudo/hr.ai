import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { CheckCircle2, Circle } from 'lucide-react';

const Signup = () => {
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();

  // Password Validation Logic
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const criteriaMet = [hasLength, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  
  let strengthLevel = 'Weak';
  let strengthColor = '#ef4444'; // Red
  let strengthWidth = '25%';

  if (criteriaMet === 2) {
    strengthLevel = 'Medium';
    strengthColor = '#f59e0b'; // Amber
    strengthWidth = '50%';
  } else if (criteriaMet === 3) {
    strengthLevel = 'Strong';
    strengthColor = '#2dd4bf'; // Teal
    strengthWidth = '75%';
  } else if (criteriaMet === 4) {
    strengthLevel = 'Very Strong';
    strengthColor = '#10b981'; // Green
    strengthWidth = '100%';
  }

  if (password.length === 0) {
    strengthWidth = '0%';
  }

  const handleSignup = (e) => {
    e.preventDefault();
    if (criteriaMet === 4 && agreeTerms) {
      // Simulate signup success and redirect to Verify OTP
      navigate('/verify-otp');
    }
  };

  const ChecklistItem = ({ met, text }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: met ? '#10b981' : 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>
      {met ? <CheckCircle2 size={14} /> : <Circle size={14} opacity={0.3} />}
      <span style={{ textDecoration: met ? 'line-through' : 'none', opacity: met ? 0.8 : 1 }}>{text}</span>
    </div>
  );

  return (
    <AuthLayout>
      <div style={{ width: '100%', maxWidth: '420px', margin: '0 auto' }}>
        <h1 className="auth-heading">Start hiring smarter</h1>
        <p className="auth-subheading">Get access to pre-vetted top talent</p>
        
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label className="form-label" htmlFor="fullname">Full Name</label>
            <input 
              className="form-input" 
              type="text" 
              id="fullname" 
              placeholder="John Doe" 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="company">Company Name</label>
            <input 
              className="form-input" 
              type="text" 
              id="company" 
              placeholder="Acme Inc." 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Work Email</label>
            <input 
              className="form-input" 
              type="email" 
              id="email" 
              placeholder="name@company.com" 
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <input 
              className="form-input" 
              type="password" 
              id="password" 
              placeholder="Create a strong password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            
            {password.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Password Strength</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: strengthColor }}>{strengthLevel}</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', marginBottom: '16px' }}>
                  <div style={{ width: strengthWidth, height: '100%', background: strengthColor, transition: 'all 0.3s' }} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <ChecklistItem met={hasLength} text="At least 8 characters" />
                  <ChecklistItem met={hasUpper} text="One uppercase letter" />
                  <ChecklistItem met={hasNumber} text="One number" />
                  <ChecklistItem met={hasSpecial} text="One special character" />
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '24px', marginTop: password.length > 0 ? '24px' : '0' }}>
            <input 
              type="checkbox" 
              id="terms" 
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              required
              style={{ 
                width: '16px', 
                height: '16px', 
                accentColor: 'var(--emerald-green)',
                cursor: 'pointer',
                marginTop: '3px'
              }} 
            />
            <label htmlFor="terms" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer', lineHeight: 1.4 }}>
              I agree to Hr.ai <Link to="#" className="auth-link">Terms of Service</Link> and <Link to="#" className="auth-link">Privacy Policy</Link>
            </label>
          </div>

          <button 
            type="submit" 
            className="btn-emerald"
            disabled={criteriaMet < 4 || !agreeTerms}
            style={{ opacity: criteriaMet < 4 || !agreeTerms ? 0.5 : 1, cursor: criteriaMet < 4 || !agreeTerms ? 'not-allowed' : 'pointer' }}
          >
            Create Free Account
          </button>
        </form>

        <div className="divider">or continue with</div>

        <button className="btn-google">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" height="20" />
          Sign up with Google
        </button>

        <p style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Already have an account? <Link to="/login" className="auth-link">Login</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;
