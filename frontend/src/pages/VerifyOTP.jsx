import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { Shield, ArrowRight } from 'lucide-react';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const countdown = timer > 0 && setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Allow pasting
    if (value.length > 1) {
      const pastedData = value.slice(0, 6).split('');
      for (let i = 0; i < pastedData.length; i++) {
        if (index + i < 6) newOtp[index + i] = pastedData[i];
      }
      setOtp(newOtp);
      // Focus last filled input or next empty
      const nextIndex = Math.min(index + pastedData.length, 5);
      inputRefs.current[nextIndex].focus();
    } else {
      newOtp[index] = value;
      setOtp(newOtp);
      // Move to next input
      if (value !== '' && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length === 6) {
      // Simulate verification success
      navigate('/dashboard');
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(30);
      // Simulate resend API call
    }
  };

  return (
    <AuthLayout>
      <div style={{ width: '100%', maxWidth: '420px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ 
          width: '64px', 
          height: '64px', 
          background: 'rgba(16, 185, 129, 0.1)', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 24px',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
          <Shield size={32} color="#10b981" />
        </div>
        
        <h1 className="auth-heading" style={{ fontSize: '2rem' }}>Verify It's You</h1>
        <p className="auth-subheading" style={{ marginBottom: '40px' }}>Enter the 6-digit code sent to your email</p>
        
        <form onSubmit={handleVerify}>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '32px' }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                style={{
                  width: '50px',
                  height: '60px',
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '12px',
                  color: 'white',
                  transition: 'all 0.2s outline 0s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2dd4bf';
                  e.target.style.background = 'rgba(45, 212, 191, 0.05)';
                  e.target.style.outline = 'none';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--glass-border)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                }}
              />
            ))}
          </div>

          <button 
            type="submit" 
            className="btn-emerald" 
            disabled={otp.join('').length !== 6}
            style={{ 
              opacity: otp.join('').length === 6 ? 1 : 0.5, 
              cursor: otp.join('').length === 6 ? 'pointer' : 'not-allowed',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            Verify & Continue <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Didn't receive the code?{' '}
            <button 
              onClick={handleResend}
              disabled={timer > 0}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: timer > 0 ? 'var(--text-secondary)' : '#2dd4bf', 
                fontWeight: 700, 
                cursor: timer > 0 ? 'default' : 'pointer',
                fontFamily: 'inherit'
              }}
            >
              Resend code {timer > 0 && `in ${timer}s`}
            </button>
          </div>
          
          <Link to="/login" style={{ color: '#64748b', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 600 }}>
            Use a different method
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyOTP;
