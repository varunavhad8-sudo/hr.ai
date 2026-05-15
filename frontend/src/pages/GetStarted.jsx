import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Users, Building, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const GetStarted = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
      <Navbar />
      
      <main className="container" style={{ 
        paddingTop: '160px', 
        paddingBottom: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, marginBottom: '16px' }}>
            Choose Your <span className="gradient-text">Trajectory</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 60px' }}>
            Are you looking to scale a global empire or join one? Select your path to begin.
          </p>
        </motion.div>

        {/* Persona Selection Section */}
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '32px'
        }}>
          {/* Path 1: The Employer / HR */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ 
              scale: 1.02, 
              borderColor: '#10b981', 
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.9) 100%)'
            }}
            transition={{ duration: 0.4 }}
            onClick={() => navigate('/dashboard')}
            className="glass" 
            style={{ 
              padding: '48px', 
              borderRadius: '32px', 
              border: '1px solid rgba(16, 185, 129, 0.2)',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(16, 185, 129, 0.05) 100%)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
            }}
          >
            <div style={{ 
              width: '80px', 
              height: '80px', 
              background: 'rgba(16, 185, 129, 0.1)', 
              borderRadius: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '24px',
              color: 'var(--accent-primary)'
            }}>
              <Building size={40} />
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '16px', color: 'white' }}>I am Hiring</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.1rem', lineHeight: 1.6 }}>
              "I am a Founder or HR leader looking to source elite talent and scale my global team."
            </p>
            <ul style={{ textAlign: 'left', marginBottom: '40px', color: '#94a3b8', listStyle: 'none', padding: 0, width: '100%' }}>
              <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '6px', height: '6px', background: 'var(--accent-primary)', borderRadius: '50%' }}></div>
                Global Intelligence Map Access
              </li>
              <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '6px', height: '6px', background: 'var(--accent-primary)', borderRadius: '50%' }}></div>
                5 Free Sourcing Credits
              </li>
              <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '6px', height: '6px', background: 'var(--accent-primary)', borderRadius: '50%' }}></div>
                Automated Candidate Matching
              </li>
            </ul>
            <button className="btn-primary" style={{ width: '100%', padding: '20px', fontSize: '1.1rem' }}>
              Scale My Team <ArrowRight size={20} />
            </button>
          </motion.div>

          {/* Path 2: The Candidate / Job Seeker */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ 
              scale: 1.02, 
              borderColor: '#8b5cf6', 
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(15, 23, 42, 0.9) 100%)'
            }}
            transition={{ duration: 0.4 }}
            onClick={() => navigate('/job-seeker')}
            className="glass" 
            style={{ 
              padding: '48px', 
              borderRadius: '32px', 
              border: '1px solid rgba(139, 92, 246, 0.2)',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(139, 92, 246, 0.05) 100%)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
            }}
          >
            <div style={{ 
              width: '80px', 
              height: '80px', 
              background: 'rgba(139, 92, 246, 0.1)', 
              borderRadius: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '24px',
              color: '#a78bfa'
            }}>
              <Rocket size={40} />
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '16px', color: 'white' }}>I Want a Job</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.1rem', lineHeight: 1.6 }}>
              "I am elite talent ready to join a Unicorn or a global empire and make an impact."
            </p>
            <ul style={{ textAlign: 'left', marginBottom: '40px', color: '#94a3b8', listStyle: 'none', padding: 0, width: '100%' }}>
              <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '6px', height: '6px', background: '#a78bfa', borderRadius: '50%' }}></div>
                Direct Access to Unicorn Founders
              </li>
              <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '6px', height: '6px', background: '#a78bfa', borderRadius: '50%' }}></div>
                AI Resume Intelligence Audit
              </li>
              <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '6px', height: '6px', background: '#a78bfa', borderRadius: '50%' }}></div>
                Priority Placement Feed
              </li>
            </ul>
            <button className="btn-primary" style={{ 
              width: '100%', 
              padding: '20px', 
              fontSize: '1.1rem',
              background: 'linear-gradient(90deg, #8b5cf6 0%, #d946ef 100%)',
              boxShadow: '0 10px 20px rgba(139, 92, 246, 0.3)'
            }}>
              Accelerate Career <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default GetStarted;
