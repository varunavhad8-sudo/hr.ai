import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const Login = () => {
  return (
    <AuthLayout>
      <h1 className="auth-heading">Welcome back</h1>
      <p className="auth-subheading">Access the world's elite talent pool</p>
      
      <form onSubmit={(e) => e.preventDefault()}>
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
        <button type="submit" className="btn-emerald">Login</button>
      </form>

      <div className="divider">or continue with</div>

      <button className="btn-google">
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" height="20" />
        Sign in with Google
      </button>

      <p style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
        Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
