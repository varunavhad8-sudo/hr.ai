import React from 'react';
import Sidebar from '../components/Sidebar';
import { 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Link, 
  FileText, 
  Phone, 
  Sparkles, 
  ArrowRight,
  User,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import AIFraudAnalysis from '../components/AIFraudAnalysis';

const VerificationCenter = () => {
  const stats = [
    { label: 'Fully Verified', value: 34, color: '#2dd4bf', icon: <CheckCircle2 size={20} /> },
    { label: 'Partially Verified', value: 89, color: '#f59e0b', icon: <AlertTriangle size={20} /> },
    { label: 'Unverified', value: 24, color: '#ef4444', icon: <XCircle size={20} /> },
    { label: 'Checks Done', value: 12, color: 'white', icon: <Shield size={20} /> }
  ];

  const queue = [
    { 
      name: 'Anjali Sharma', 
      role: 'Senior Product Designer', 
      missing: ['Degree not verified', 'Phone unverified'],
      avatar: 'AS'
    },
    { 
      name: 'Rohan Mehta', 
      role: 'Full Stack Developer', 
      missing: ['Experience unconfirmed'],
      avatar: 'RM'
    },
    { 
      name: 'Sneha Kapoor', 
      role: 'Marketing Lead', 
      missing: ['Degree not verified', 'Experience unconfirmed'],
      avatar: 'SK'
    },
    { 
      name: 'Vikram Singh', 
      role: 'Sales Director', 
      missing: ['Phone unverified'],
      avatar: 'VS'
    }
  ];

  const methods = [
    {
      title: 'LinkedIn Connect',
      desc: 'Candidate connects LinkedIn account — we pull verified work history automatically',
      icon: <Link size={24} color="#0077b5" />,
      status: 'Active'
    },
    {
      title: 'Document Upload',
      desc: 'Candidate uploads Aadhar, PAN, degree certificate, salary slips',
      icon: <FileText size={24} color="#2dd4bf" />,
      status: 'Active'
    },
    {
      title: 'Phone & Email OTP',
      icon: <Phone size={24} color="#f59e0b" />,
      desc: 'One-time password sent to verify real contact details',
      status: 'Active'
    },
    {
      title: 'AI Resume Analysis',
      icon: <Sparkles size={24} color="#a78bfa" />,
      desc: 'AI cross-checks resume claims against LinkedIn and detects inconsistencies',
      status: 'Active'
    }
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="dashboard-main">
        <header style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#2dd4bf', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.1em' }}>
            <Shield size={18} /> Trusted Hiring Ecosystem
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: 'white', marginBottom: '8px' }}>Verification Center</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 500 }}>Know exactly who you are hiring</p>
        </header>

        {/* Top Stats Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '48px' }}>
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card" 
              style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}
            >
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: `${stat.color}15`, 
                color: stat.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${stat.color}30`
              }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white' }}>{stat.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px', marginBottom: '48px' }}>
          {/* Left: Verification Queue */}
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>Needs Attention</h2>
              <span style={{ fontSize: '0.85rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '4px 12px', borderRadius: '20px', fontWeight: 700 }}>{queue.length} Candidates Pending</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {queue.map((item, i) => (
                <div key={i} style={{ 
                  padding: '20px', 
                  background: 'rgba(255, 255, 255, 0.02)', 
                  borderRadius: '16px', 
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px'
                }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--gradient-main)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
                    {item.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: 'white', fontWeight: 800, fontSize: '1.05rem', marginBottom: '4px' }}>{item.name}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '10px' }}>{item.role}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {item.missing.map((tag, j) => (
                        <span key={j} style={{ 
                          fontSize: '0.7rem', 
                          padding: '4px 10px', 
                          borderRadius: '6px', 
                          background: tag.includes('not verified') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          color: tag.includes('not verified') ? '#ef4444' : '#f59e0b',
                          fontWeight: 800,
                          textTransform: 'uppercase'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                    <button style={{ 
                      padding: '8px 16px', 
                      background: 'rgba(45, 212, 191, 0.1)', 
                      border: '1px solid #2dd4bf', 
                      color: '#2dd4bf', 
                      borderRadius: '8px', 
                      fontSize: '0.8rem', 
                      fontWeight: 800, 
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}>
                      Send Request
                    </button>
                    <button style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Skip</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Verification Methods */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="card" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginBottom: '32px' }}>How We Verify</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {methods.map((method, i) => (
                  <div key={i} style={{ 
                    padding: '20px', 
                    background: 'rgba(15, 23, 42, 0.3)', 
                    borderRadius: '20px', 
                    border: '1px solid var(--glass-border)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ 
                        width: '44px', 
                        height: '44px', 
                        borderRadius: '10px', 
                        background: 'rgba(255, 255, 255, 0.03)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}>
                        {method.icon}
                      </div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#2dd4bf', background: 'rgba(45, 212, 191, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>{method.status}</span>
                    </div>
                    <h4 style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', marginBottom: '8px' }}>{method.title}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, fontWeight: 500 }}>{method.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Fraud Analysis Demo */}
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginBottom: '16px' }}>Live Analysis Feed</h2>
              <AIFraudAnalysis riskLevel="medium" />
            </div>
          </div>
        </div>

        {/* Bottom Section: Trust Score Explained */}
        <div className="card" style={{ 
          padding: '40px', 
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'white', marginBottom: '32px', textAlign: 'center' }}>Trust Score Explained</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {[
              { range: '0-40%', label: 'High Risk', color: '#ef4444', desc: 'Minimal verified data. Exercise extreme caution.' },
              { range: '41-70%', label: 'Review Carefully', color: '#f59e0b', desc: 'Partial verification. Manual document review advised.' },
              { range: '71-90%', label: 'Good Standing', color: '#2dd4bf', desc: 'Solid verification across primary identity channels.' },
              { range: '91-100%', label: 'Fully Verified', color: '#10b981', desc: 'Highest trust level. All claims backed by hard data.' }
            ].map((scale, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '20px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.02)', border: `1px solid ${scale.color}20` }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: scale.color, marginBottom: '4px' }}>{scale.range}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', marginBottom: '12px' }}>{scale.label}</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontWeight: 500 }}>{scale.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerificationCenter;
