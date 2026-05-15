import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { AlertTriangle, Lock, Shield } from 'lucide-react';

const Login = () => {
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate failed login to show the security feature
    if (loginAttempts < 3) {
      setLoginAttempts(prev => prev + 1);
    }
    
    // If it was a real app, successful login would reset attempts and navigate
    // if (success) { setLoginAttempts(0); navigate('/verify-otp'); }
  };

  return (
    <AuthLayout>
      <div style={{ width: '100%', maxWidth: '420px', margin: '0 auto' }}>
        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-subheading">Access the world's elite talent pool</p>
        
        {loginAttempts >= 3 && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)', 
            color: '#ef4444', 
            padding: '12px 16px', 
            borderRadius: '12px', 
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.9rem',
            fontWeight: 600
          }}>
            <AlertTriangle size={20} />
            Too many attempts — wait 30 seconds
          </div>
        )}

        <form onSubmit={handleLogin}>
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
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label className="form-label" htmlFor="password" style={{ marginBottom: 0 }}>Password</label>
              <Link to="#" className="auth-link" style={{ fontSize: '0.85rem' }}>Forgot password?</Link>
            </div>
            <input 
              className="form-input" 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              required 
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <input 
              type="checkbox" 
              id="remember" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ 
                width: '16px', 
                height: '16px', 
                accentColor: 'var(--emerald-green)',
                cursor: 'pointer'
              }} 
            />
            <label htmlFor="remember" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer', userSelect: 'none' }}>
              Remember this device
            </label>
          </div>

          <button 
            type="submit" 
            className="btn-emerald" 
            style={{ opacity: loginAttempts >= 3 ? 0.5 : 1, cursor: loginAttempts >= 3 ? 'not-allowed' : 'pointer' }}
            disabled={loginAttempts >= 3}
          >
            Login
          </button>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '16px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>
            <Lock size={14} color="#10b981" />
            Secure login with Hr.ai Vault
          </div>
        </form>

        <div className="divider">or continue with</div>

        <button className="btn-google">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" height="20" />
          Sign in with Google
        </button>

        <p style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
