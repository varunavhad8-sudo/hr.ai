import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  ChevronDown, 
  Bookmark, 
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const FindCandidates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [selectedSources, setSelectedSources] = useState(['LinkedIn', 'Naukri', 'Indeed']);
  const [sortBy, setSortBy] = useState('Best Match');

  const candidates = [
    {
      id: 1,
      name: 'Arjun Mehta',
      role: 'Senior Product Designer',
      company: 'Acme Corp',
      location: 'Bangalore, IN',
      experience: '8 yrs',
      source: 'LinkedIn',
      matchScore: 98,
      skills: ['Product Design', 'Figma', 'User Research'],
      initials: 'AM'
    },
    {
      id: 2,
      name: 'Sarah Jenkins',
      role: 'Product Designer',
      company: 'Global Tech',
      location: 'Remote',
      experience: '5 yrs',
      source: 'Indeed',
      matchScore: 94,
      skills: ['UI Design', 'Design Systems', 'Webflow'],
      initials: 'SJ'
    },
    {
      id: 3,
      name: 'Priya Ramesh',
      role: 'UI/UX Lead',
      company: 'Zomato',
      location: 'Gurgaon, IN',
      experience: '10 yrs',
      source: 'Naukri',
      matchScore: 92,
      skills: ['Leadership', 'User Strategy', 'Mobile Design'],
      initials: 'PR'
    },
    {
      id: 4,
      name: 'Michael Chen',
      role: 'Design Systems Engineer',
      company: 'Stripe',
      location: 'San Francisco, CA',
      experience: '6 yrs',
      source: 'LinkedIn',
      matchScore: 89,
      skills: ['React', 'TypeScript', 'Design Ops'],
      initials: 'MC'
    }
  ];

  const getSourceStyle = (s) => {
    if (s.includes('LinkedIn')) return { active: '#0077b5', soft: 'rgba(0, 119, 181, 0.15)' };
    if (s.includes('Naukri')) return { active: '#ef4444', soft: 'rgba(239, 68, 68, 0.15)' };
    if (s.includes('Indeed')) return { active: '#8b5cf6', soft: 'rgba(139, 92, 246, 0.15)' };
    return { active: 'var(--emerald-green)', soft: 'rgba(16, 185, 129, 0.1)' };
  };

  const toggleSource = (source) => {
    setSelectedSources(prev => 
      prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
    );
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="dashboard-main">
        {/* Top Search & Filter Bar */}
        <div className="card" style={{ marginBottom: '32px', padding: '32px' }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search by job title, skill, keyword..." 
                className="form-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '56px' }}
              />
            </div>
            <button className="btn-emerald" style={{ width: 'auto', padding: '0 32px' }}>Find Candidates</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr 1fr', gap: '32px', alignItems: 'end' }}>
            {/* Location */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label className="form-label">Location</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--emerald-green)' }} />
                <input 
                  type="text" 
                  placeholder="City name" 
                  className="form-input"
                  style={{ paddingLeft: '44px', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            {/* Experience */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label className="form-label">Experience</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Fresher', '1-3 yrs', '3-5 yrs', '5+ yrs'].map(exp => (
                  <button 
                    key={exp}
                    onClick={() => setSelectedExperience(exp)}
                    style={{
                      flex: 1,
                      padding: '10px 4px',
                      borderRadius: '10px',
                      border: '1px solid',
                      borderColor: selectedExperience === exp ? 'var(--emerald-green)' : 'var(--glass-border)',
                      background: selectedExperience === exp ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                      color: selectedExperience === exp ? 'white' : 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Toggles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label className="form-label">Platforms</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['LinkedIn', 'Naukri', 'Indeed'].map(source => {
                  const style = getSourceStyle(source);
                  const active = selectedSources.includes(source);
                  return (
                    <button 
                      key={source}
                      onClick={() => toggleSource(source)}
                      style={{
                        flex: 1,
                        padding: '10px 4px',
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor: active ? style.active : 'var(--glass-border)',
                        background: active ? style.soft : 'transparent',
                        color: active ? 'white' : 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'var(--transition-smooth)'
                      }}
                    >
                      {source}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Salary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label className="form-label">Salary Range</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="text" placeholder="₹ min" className="form-input" style={{ padding: '10px', fontSize: '0.85rem' }} />
                <span style={{ color: 'var(--glass-border)' }}>—</span>
                <input type="text" placeholder="₹ max" className="form-input" style={{ padding: '10px', fontSize: '0.85rem' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>147 candidates found</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: '500' }}>Sort by:</span>
            <div style={{ position: 'relative' }}>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-input"
                style={{
                  padding: '10px 40px 10px 16px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontWeight: 700,
                  width: '180px',
                  background: 'rgba(255, 255, 255, 0.03)'
                }}
              >
                <option>Best Match</option>
                <option>Most Recent</option>
                <option>Experience</option>
              </select>
              <ChevronDown size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--emerald-green)' }} />
            </div>
          </div>
        </div>

        {/* Candidate Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <AnimatePresence>
            {candidates.map((candidate, i) => {
              const platformStyle = getSourceStyle(candidate.source);
              return (
                <motion.div 
                  key={candidate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="card"
                  style={{ padding: '32px', position: 'relative', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                    <div style={{ 
                      width: '72px', 
                      height: '72px', 
                      borderRadius: '50%', 
                      background: 'var(--gradient-main)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)'
                    }}>
                      {candidate.initials}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white' }}>{candidate.name}</h3>
                        <div style={{ 
                          padding: '4px 10px', 
                          background: 'rgba(16, 185, 129, 0.15)', 
                          color: 'var(--emerald-green)',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <Zap size={12} fill="var(--emerald-green)" /> {candidate.matchScore}% match
                        </div>
                      </div>
                      <p style={{ fontWeight: 600, fontSize: '1rem', color: 'white', opacity: 0.9 }}>{candidate.role}</p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{candidate.company}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>
                      <MapPin size={16} color="var(--emerald-green)" /> {candidate.location}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>
                      <Briefcase size={16} color="var(--emerald-green)" /> {candidate.experience}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                    {candidate.skills.slice(0, 3).map(skill => (
                      <span key={skill} style={{ 
                        padding: '6px 12px', 
                        background: 'rgba(255, 255, 255, 0.05)', 
                        borderRadius: '8px', 
                        fontSize: '0.8rem', 
                        fontWeight: 600,
                        color: 'white',
                        border: '1px solid var(--glass-border)'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    paddingTop: '24px', 
                    borderTop: '1px solid var(--glass-border)',
                    marginTop: 'auto'
                  }}>
                    <div style={{ 
                      padding: '4px 12px', 
                      background: platformStyle.soft, 
                      color: platformStyle.active, 
                      borderRadius: '6px', 
                      fontSize: '0.7rem', 
                      fontWeight: 900,
                      letterSpacing: '0.05em'
                    }}>
                      {candidate.source.toUpperCase()}
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <Link to={`/candidate/${candidate.id}`} style={{ textDecoration: 'none' }}>
                        <button style={{ 
                          background: 'transparent', 
                          border: '1px solid var(--glass-border)', 
                          color: 'white', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          padding: '10px 16px',
                          borderRadius: '10px',
                          transition: 'var(--transition-smooth)'
                        }}>
                          View Profile
                        </button>
                      </Link>
                      <button className="btn-emerald" style={{ 
                        width: 'auto',
                        padding: '10px 20px',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <Bookmark size={18} /> Save
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default FindCandidates;
