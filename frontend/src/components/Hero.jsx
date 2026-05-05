import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

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
      paddingTop: '120px'
    }}>
      {/* Background Glows */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
        zIndex: -1
      }}></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass"
        style={{
          padding: '6px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '24px',
          fontSize: '0.85rem',
          color: 'var(--accent-primary)',
          borderColor: 'rgba(59, 130, 246, 0.3)'
        }}
      >
        <Sparkles size={14} />
        AI-Powered Recruitment Marketing
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
          maxWidth: '900px',
          lineHeight: 1.1,
          marginBottom: '24px'
        }}
      >
        Hire the future with <span className="gradient-text">Intelligent Marketing</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          marginBottom: '40px'
        }}
      >
        hr.ai automates your employer branding and job marketing. Attract top-tier talent with data-driven AI campaigns.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{ display: 'flex', gap: '16px' }}
      >
        <button className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
          Start for Free <ArrowRight size={20} />
        </button>
        <button className="glass" style={{
          padding: '16px 32px',
          background: 'transparent',
          color: 'white',
          fontWeight: 600,
          border: '1px solid var(--glass-border)',
          cursor: 'pointer',
          borderRadius: '10px'
        }}>
          Watch Demo
        </button>
      </motion.div>

      {/* Stats Preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        style={{
          marginTop: '80px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '40px',
          width: '100%',
          maxWidth: '800px'
        }}
      >
        {[
          { label: 'Conversion Rate', val: '+45%' },
          { label: 'Time to Hire', val: '-30%' },
          { label: 'Employer Brand Reach', val: '10x' }
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div className="gradient-text" style={{ fontSize: '2rem', fontWeight: 700 }}>{stat.val}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default Hero;
