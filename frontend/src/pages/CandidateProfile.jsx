import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  MapPin, 
  Briefcase, 
  Mail, 
  Phone, 
  Lock, 
  MessageSquare, 
  Bookmark,
  CheckCircle2,
  XCircle,
  GraduationCap,
  History,
  Zap,
  Calendar,
  Shield,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AIFraudAnalysis from '../components/AIFraudAnalysis';

const CandidateProfile = () => {
  const [activeTab, setActiveTab] = useState('AI Summary');

  const candidate = {
    name: 'Priya Ramesh',
    initials: 'PR',
    title: 'Store Manager at Reliance Retail',
    location: 'Mumbai',
    experience: '5 years',
    source: 'Naukri',
    matchScore: 94,
    summary: [
      'Proven track record in managing high-volume retail operations with a 15% YoY growth in store revenue.',
      'Expertise in CRM tools and team leadership, managing a staff of 40+ members.',
      'Strong background in inventory management and supply chain coordination.'
    ],
    skillsMatched: ['Retail Management', 'Team Leadership', 'Inventory Control', 'CRM', 'Sales Forecasting'],
    skillsMissing: ['Adobe Analytics', 'Digital Marketing'],
    fit: 'Strong Match',
    experienceTimeline: [
      { company: 'Reliance Retail', title: 'Store Manager', duration: '2021 - Present', desc: 'Managing day-to-day operations and staff of a flagship store in Mumbai.' },
      { company: 'Shoppers Stop', title: 'Assistant Manager', duration: '2018 - 2021', desc: 'Assisted in floor management and customer relationship strategy.' },
      { company: 'Pantaloons', title: 'Floor Supervisor', duration: '2016 - 2018', desc: 'Supervised front-end staff and managed customer queries.' }
    ],
    education: [
      { degree: 'MBA in Retail Management', college: 'Welingkar Institute of Management', year: '2016' },
      { degree: 'B.Com', college: 'Mumbai University', year: '2014' }
    ],
    activity: [
      { type: 'Applied', date: 'Oct 12, 2023', status: 'completed' },
      { type: 'Screened', date: 'Oct 14, 2023', status: 'completed' },
      { type: 'Shortlisted', date: 'Oct 18, 2023', status: 'completed' },
      { type: 'Interview Scheduled', date: 'Oct 20, 2023', status: 'active' }
    ]
  };

  const tabs = ['AI Summary', 'Experience', 'Education', 'Fraud Analysis', 'Activity'];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="dashboard-main">
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          <Link to="/find" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>Find Candidates</Link>
          <ChevronRight size={16} />
          <span style={{ color: 'white', fontWeight: 700 }}>{candidate.name}</span>
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '32px' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="card" style={{ padding: '48px 32px', textAlign: 'center', position: 'relative' }}>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '50%', 
                border: '4px solid var(--emerald-green)',
                background: 'var(--gradient-main)', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.8rem',
                fontWeight: 900,
                margin: '0 auto 24px',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
              }}>
                {candidate.initials}
              </div>
              
              <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', fontWeight: 800, color: 'white' }}>{candidate.name}</h1>
              <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '1.05rem' }}>{candidate.title}</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px', fontWeight: 500 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} color="var(--emerald-green)" /> {candidate.location}</span>
                <span style={{ borderLeft: '1px solid var(--glass-border)', paddingLeft: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Briefcase size={16} color="var(--emerald-green)" /> {candidate.experience}
                </span>
              </div>

              <div style={{ 
                display: 'inline-block',
                padding: '6px 16px', 
                background: 'rgba(239, 68, 68, 0.1)', 
                color: '#ef4444', 
                borderRadius: '8px', 
                fontSize: '0.75rem', 
                fontWeight: 900,
                marginBottom: '40px',
                letterSpacing: '0.05em'
              }}>
                FOUND ON NAUKRI
              </div>

              <div style={{ marginBottom: '40px' }}>
                <div style={{ 
                  width: '100px', 
                  height: '100px', 
                  borderRadius: '50%', 
                  border: '8px solid rgba(16, 185, 129, 0.1)',
                  borderTopColor: 'var(--emerald-green)',
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--emerald-green)' }}>{candidate.matchScore}%</div>
                  <div style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)' }}>AI MATCH</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <button className="btn-emerald" style={{ width: '100%', justifyContent: 'center', padding: '16px', background: 'var(--gradient-main)' }}>
                  <Calendar size={20} /> Schedule Interview
                </button>
                <button 
                  onClick={() => alert('Requesting documents: Aadhar, PAN, Degree Certificate, Last Salary Slip...')}
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    borderRadius: '12px', 
                    border: '1px solid #2dd4bf', 
                    background: 'rgba(45, 212, 191, 0.1)', 
                    color: '#2dd4bf',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontWeight: 700,
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  <FileText size={18} /> Request Documents
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <button style={{ 
                    padding: '14px', 
                    borderRadius: '12px', 
                    border: '1px solid var(--glass-border)', 
                    background: 'transparent', 
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontWeight: 700,
                    transition: 'var(--transition-smooth)'
                  }}>
                    <Bookmark size={18} /> Save
                  </button>
                  <button style={{ 
                    padding: '14px', 
                    borderRadius: '12px', 
                    border: '1px solid var(--glass-border)', 
                    background: 'transparent', 
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontWeight: 700,
                    transition: 'var(--transition-smooth)'
                  }}>
                    <MessageSquare size={18} /> Message
                  </button>
                </div>
              </div>
            </div>

            {/* UPGRADED: Verification Status Card */}
            <div className="card" style={{ padding: '32px', border: '1px solid rgba(45, 212, 191, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <Shield size={24} color="#2dd4bf" />
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'white' }}>Trust & Verification</h3>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                <div style={{ 
                  padding: '20px 40px', 
                  background: 'rgba(245, 158, 11, 0.1)', 
                  border: '2px solid rgba(245, 158, 11, 0.5)', 
                  borderRadius: '32px', 
                  color: '#f59e0b',
                  textAlign: 'center',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.1)'
                }}>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900 }}>72%</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Verified Profile</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {[
                  { label: 'LinkedIn Profile', status: 'Verified', icon: <CheckCircle2 size={18} color="#2dd4bf" />, badge: '#2dd4bf' },
                  { label: 'Email Address', status: 'Verified', icon: <CheckCircle2 size={18} color="#2dd4bf" />, badge: '#2dd4bf' },
                  { label: 'Phone Number', status: 'Verified', icon: <CheckCircle2 size={18} color="#2dd4bf" />, badge: '#2dd4bf' },
                  { label: 'Work Experience', status: 'Pending', icon: <AlertTriangle size={18} color="#f59e0b" />, badge: '#f59e0b' },
                  { label: 'Education Degree', status: 'Not Verified', icon: <XCircle size={18} color="#ef4444" />, badge: '#ef4444' }
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white', fontSize: '0.95rem', fontWeight: 600 }}>
                    {row.icon} {row.label} 
                    <span style={{ color: row.badge, fontSize: '0.75rem', marginLeft: 'auto', fontWeight: 800, textTransform: 'uppercase' }}>{row.status}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', fontWeight: 600 }}>
                  <Lock size={18} color="var(--text-secondary)" /> Background Check 
                  <button style={{ background: 'rgba(45, 212, 191, 0.1)', border: '1px solid rgba(45, 212, 191, 0.3)', color: '#2dd4bf', padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', marginLeft: 'auto', cursor: 'pointer', fontWeight: 800 }}>UNLOCK</button>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '24px', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.1em', fontWeight: 800 }}>Contact Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}>
                    <Mail size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>Email</div>
                    <div style={{ fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Lock size={12} color="#2dd4bf" /> <span style={{ opacity: 0.5 }}>Unlock to view</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}>
                    <Phone size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>Phone</div>
                    <div style={{ fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Lock size={12} color="#2dd4bf" /> <span style={{ opacity: 0.5 }}>Unlock to view</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Candidate Link */}
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <button style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 500, transition: 'color 0.2s', margin: '0 auto' }} onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'} onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}>
                Something looks wrong? Report this profile
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', background: 'rgba(15, 23, 42, 0.6)' }}>
            {/* Tabs Header */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', padding: '0 40px' }}>
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '32px 0',
                    marginRight: '48px',
                    border: 'none',
                    background: 'none',
                    fontSize: '1.05rem',
                    fontWeight: activeTab === tab ? 800 : 500,
                    color: activeTab === tab ? '#2dd4bf' : 'var(--text-secondary)',
                    borderBottom: activeTab === tab ? '3px solid #2dd4bf' : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={{ padding: '48px', flex: 1 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'AI Summary' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '24px', color: 'white' }}>Why this candidate matches</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {candidate.summary.map((point, i) => (
                            <div key={i} style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.05rem' }}>
                              <div style={{ color: '#2dd4bf', marginTop: '4px' }}><CheckCircle2 size={20} /></div>
                              {point}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                        <div>
                          <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>Matched Skills</h4>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {candidate.skillsMatched.map(skill => (
                              <span key={skill} style={{ padding: '8px 16px', background: 'rgba(45, 212, 191, 0.1)', color: '#2dd4bf', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700, border: '1px solid rgba(45, 212, 191, 0.2)' }}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>Missing Skills</h4>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {candidate.skillsMissing.map(skill => (
                              <span key={skill} style={{ padding: '8px 16px', background: 'rgba(255, 255, 255, 0.03)', color: 'var(--text-secondary)', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700, border: '1px solid var(--glass-border)' }}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* NEW: Red Flags Section */}
                      <div style={{ 
                        padding: '24px 32px', 
                        borderRadius: '20px', 
                        background: 'rgba(45, 212, 191, 0.03)', 
                        border: '1px solid rgba(45, 212, 191, 0.1)' 
                      }}>
                        <h4 style={{ 
                          fontSize: '1.1rem', 
                          color: 'white', 
                          marginBottom: '12px', 
                          fontWeight: 800, 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '10px' 
                        }}>
                          <Shield size={20} color="#2dd4bf" /> AI Integrity Check
                        </h4>
                        <div style={{ color: '#2dd4bf', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <CheckCircle2 size={18} /> No red flags detected
                        </div>
                        <p style={{ marginTop: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                          AI scanning of historical work gaps and social footprint shows 100% professional consistency.
                        </p>
                      </div>

                      <div style={{ marginTop: '0', padding: '32px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)', border: '1px solid rgba(45, 212, 191, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', color: '#2dd4bf', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.1em' }}>AI Fit Analysis</div>
                          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'white' }}>{candidate.fit}</div>
                        </div>
                        <div style={{ padding: '12px 24px', background: '#2dd4bf', color: 'white', borderRadius: '12px', fontWeight: 800, boxShadow: '0 10px 20px rgba(45, 212, 191, 0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Zap size={18} fill="white" /> Strong Match
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'Experience' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                      {candidate.experienceTimeline.map((exp, i) => (
                        <div key={i} style={{ display: 'flex', gap: '24px', position: 'relative' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2dd4bf' }}><Briefcase size={22} /></div>
                            {i !== candidate.experienceTimeline.length - 1 && <div style={{ width: '2px', flex: 1, background: 'var(--glass-border)', margin: '12px 0' }} />}
                          </div>
                          <div style={{ paddingBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>{exp.title}</h3>
                              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 700, padding: '4px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>{exp.duration}</span>
                            </div>
                            <div style={{ color: '#2dd4bf', fontWeight: 800, fontSize: '1rem', marginBottom: '12px' }}>{exp.company}</div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>{exp.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'Education' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                      {candidate.education.map((edu, i) => (
                        <div key={i} style={{ display: 'flex', gap: '24px' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2dd4bf' }}><GraduationCap size={24} /></div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>{edu.degree}</h3>
                              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 700 }}>{edu.year}</span>
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '1rem' }}>{edu.college}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'Activity' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                      {candidate.activity.map((act, i) => (
                        <div key={i} style={{ display: 'flex', gap: '24px', position: 'relative' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ 
                              width: '24px', 
                              height: '24px', 
                              borderRadius: '50%', 
                              background: act.status === 'completed' ? '#2dd4bf' : 'transparent',
                              border: act.status === 'active' ? '2px solid #2dd4bf' : '2px solid var(--glass-border)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 1
                            }}>
                              {act.status === 'completed' && <CheckCircle2 size={16} color="white" />}
                            </div>
                            {i !== candidate.activity.length - 1 && <div style={{ width: '2px', flex: 1, background: 'var(--glass-border)', margin: '0' }} />}
                          </div>
                          <div style={{ paddingBottom: '40px' }}>
                            <div style={{ fontWeight: 800, color: act.status === 'active' ? '#2dd4bf' : 'white', fontSize: '1.1rem', marginBottom: '4px' }}>{act.type}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{act.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'Fraud Analysis' && (
                    <AIFraudAnalysis riskLevel="low" />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CandidateProfile;
