import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import dashboardImg from '../assets/dashboard-mockup.png';

const Hero = () => {
  return (
    <section className="container" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      position: 'relative',
      paddingTop: '160px',
      paddingBottom: '100px'
    }}>
      {/* Background Glows */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60vw',
        height: '60vw',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        zIndex: -1,
        pointerEvents: 'none'
      }}></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass"
        style={{
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '32px',
          fontSize: '0.9rem',
          color: 'var(--accent-primary)',
          borderColor: 'rgba(59, 130, 246, 0.3)',
          fontWeight: 600
        }}
      >
        <Sparkles size={16} />
        The World's First AI Recruitment Marketing Platform
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          fontSize: 'clamp(3rem, 10vw, 5.5rem)',
          maxWidth: '1000px',
          lineHeight: 1.05,
          marginBottom: '28px',
          fontWeight: 800
        }}
      >
        Hire the future with <span className="gradient-text">Intelligent Marketing</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          fontSize: '1.4rem',
          color: 'var(--text-secondary)',
          maxWidth: '700px',
          marginBottom: '48px',
          fontWeight: 400
        }}
      >
        Hr.ai automates your employer branding and job marketing. Attract top-tier talent with data-driven AI campaigns that convert.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{ display: 'flex', gap: '20px', marginBottom: '80px' }}
      >
        <Link to="/get-started">
          <button className="btn-primary" style={{ padding: '18px 36px', fontSize: '1.15rem' }}>
            Get Started for Free <ArrowRight size={22} />
          </button>
        </Link>
        <button className="glass" style={{
          padding: '18px 36px',
          background: 'transparent',
          color: 'white',
          fontWeight: 600,
          fontSize: '1.15rem',
          border: '1px solid var(--glass-border)',
          cursor: 'pointer',
          borderRadius: '10px',
          transition: 'var(--transition-smooth)'
        }}>
          Watch Demo
        </button>
      </motion.div>

      {/* Founders & Ecosystem Spotlight Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          width: '100%',
          maxWidth: '1200px',
          marginTop: '60px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          textAlign: 'left',
          zIndex: 10
        }}
      >
        {/* Market Capital Column */}
        <div className="glass" style={{ padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.1em' }}>Market Intelligence</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px', color: 'white' }}>Talent Infrastructure for the Next Billion</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { label: 'Unicorn Capital Tracked', value: '$8.4B', trend: '+12% this month' },
              { label: 'Global Offices Managed', value: '1,240', trend: 'across 42 countries' }
            ].map((stat, i) => (
              <div key={i}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>{stat.label}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>{stat.value}</span>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>{stat.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Founder Network Column */}
        <div className="glass" style={{ padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)' }}>
          <div style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '0.1em' }}>Founder's Board</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { 
                name: "Ritesh Agarwal", 
                role: "Founder & CEO, OYO", 
                note: "Revolutionized global hospitality recruitment across 80 countries.",
                img: "ritesh_agarwal_portrait.png" 
              },
              { 
                name: "Bhavish Aggarwal", 
                role: "Founder, Ola Electric", 
                note: "Building the world's largest engineering team for EV mobility.",
                img: "bhavish_aggarwal_portrait.png" 
              },
              { 
                name: "Deepinder Goyal", 
                role: "Founder, Zomato", 
                note: "Scaling the logistics backbone for India's food-tech ecosystem.",
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" 
              }
            ].map((f, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                gap: '16px', 
                padding: '16px', 
                background: 'rgba(255,255,255,0.03)', 
                borderRadius: '16px', 
                border: '1px solid rgba(255,255,255,0.05)',
                transition: 'transform 0.3s ease'
              }}>
                <img 
                  src={f.img.startsWith('http') ? f.img : `/${f.img}`} 
                  alt={f.name} 
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '12px', 
                    objectFit: 'cover',
                    border: '1px solid var(--accent-primary)',
                    boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)'
                  }} 
                />
                <div>
                  <div style={{ fontWeight: 800, color: 'white', fontSize: '1rem' }}>{f.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 700, marginBottom: '6px' }}>{f.role}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>{f.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Unicorn Ticker */}
        <div className="glass" style={{ padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '0.1em' }}>Live Unicorn Pulse</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { name: 'Swiggy', val: '$10.7B' },
              { name: 'Paytm', val: '$6.5B' },
              { name: 'Razorpay', val: '$7.5B' },
              { name: 'CRED', val: '$6.4B' },
              { name: 'Zoho', val: '$5.0B' }
            ].map((u, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                paddingBottom: '12px', 
                borderBottom: '1px solid rgba(255,255,255,0.05)' 
              }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#f1f5f9' }}>{u.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Valuation: {u.val}</div>
                </div>
                <span style={{ padding: '4px 10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800 }}>LIVE SOURCING</span>
              </div>
            ))}
          </div>
          <div style={{ 
            marginTop: '24px', 
            padding: '12px', 
            background: 'rgba(59, 130, 246, 0.1)', 
            borderRadius: '12px', 
            fontSize: '0.8rem', 
            textAlign: 'center', 
            color: 'var(--accent-primary)', 
            fontWeight: 700,
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            Infrastructure for the Future of Work
          </div>
        </div>
      </motion.div>

      {/* Trust Badges placeholder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        style={{
          marginTop: '100px',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}
      >
        Trusted by high-growth engineering teams globally
      </motion.div>
    </section>
  );
};

export default Hero;
