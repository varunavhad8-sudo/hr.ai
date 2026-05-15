import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const Signup = () => {
  return (
    <AuthLayout>
      <h1 className="auth-heading">Start hiring smarter</h1>
      <p className="auth-subheading">Get access to pre-vetted top talent</p>
      
      <form onSubmit={(e) => e.preventDefault()}>
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
        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input 
            className="form-input" 
            type="password" 
            id="password" 
            placeholder="Create a strong password" 
            required 
          />
        </div>
        <button type="submit" className="btn-emerald">Create Free Account</button>
      </form>

      <div className="divider">or continue with</div>

      <button className="btn-google">
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" height="20" />
        Sign up with Google
      </button>

      <p style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
        Already have an account? <Link to="/login" className="auth-link">Login</Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;
