import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

export function Hero() {
  const navigate = useNavigate();
  const avatars = [
    "https://i.pravatar.cc/100?img=11",
    "https://i.pravatar.cc/100?img=12",
    "https://i.pravatar.cc/100?img=33",
    "https://i.pravatar.cc/100?img=44",
    "https://i.pravatar.cc/100?img=55"
  ];

  return (
    <section className="hero">
      <div className="hero-glow"></div>
      
      <div className="container hero-container">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          Now in Public Beta
        </div>
        
        <h1 className="hero-title">
          Manage Every Candidate<br/>
          <span className="hero-title-accent">Like a Library, Not a Spreadsheet</span>
        </h1>
        
        <p className="hero-description">
          Upload resumes. AI auto-fills everything. Build your personal candidate library — owned by you, forever.
        </p>
        
        <div className="hero-cta">
          <button className="btn btn-accent" onClick={() => navigate('/signin')}>Get Started for Free</button>
          <button className="btn btn-dark-ghost">Watch Demo</button>
        </div>
        
        <div className="hero-social-proof">
          <div className="avatar-group">
            {avatars.map((src, i) => (
              <img key={i} src={src} alt={`User ${i+1}`} className="avatar" />
            ))}
          </div>
          <span className="social-proof-text">Built for Indian HR professionals</span>
        </div>
      </div>
    </section>
  );
}
