import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { 
  Search, 
  ChevronDown, 
  User, 
  Calendar, 
  MoreHorizontal, 
  MapPin,
  Bookmark,
  Zap,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const SavedCandidates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');

  const savedCandidates = [
    {
      id: 1,
      name: 'Arjun Mehta',
      title: 'Senior Product Designer',
      location: 'Bangalore, IN',
      job: 'Senior Product Designer',
      source: 'LinkedIn',
      sourceColor: '#0077b5',
      score: 98,
      stage: 'Contacted',
      stageColor: '#3b82f6',
      initials: 'AM'
    },
    {
      id: 2,
      name: 'Priya Ramesh',
      title: 'Store Manager',
      location: 'Mumbai, IN',
      job: 'Store Manager – Bandra',
      source: 'Naukri',
      sourceColor: '#ef4444',
      score: 94,
      stage: 'Interview Scheduled',
      stageColor: '#f59e0b',
      initials: 'PR'
    },
    {
      id: 3,
      name: 'Sarah Jenkins',
      role: 'Product Designer',
      location: 'Remote',
      job: 'Senior Product Designer',
      source: 'Indeed',
      sourceColor: '#8b5cf6',
      score: 94,
      stage: 'To Contact',
      stageColor: '#94a3b8',
      initials: 'SJ'
    },
    {
      id: 4,
      name: 'Michael Chen',
      title: 'Design Systems Engineer',
      location: 'San Francisco, CA',
      job: 'Full Stack Engineer',
      source: 'LinkedIn',
      sourceColor: '#0077b5',
      score: 89,
      stage: 'Offer Sent',
      stageColor: '#10b981',
      initials: 'MC'
    }
  ];

  const stages = ['All', 'To Contact', 'Contacted', 'Interview Scheduled', 'Offer Sent'];

  const filteredCandidates = savedCandidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = selectedStage === 'All' || c.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="dashboard-main">
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'white', marginBottom: '8px' }}>Saved Candidates</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 500 }}>Manage your talent pipeline across 3 active jobs</p>
          </div>
        </header>

        {/* Top Bar Filters */}
        <div className="card" style={{ padding: '24px', marginBottom: '32px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', background: 'rgba(30, 41, 59, 0.4)' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
            <Search size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search by name or role..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '52px', background: 'rgba(255,255,255,0.03)' }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <select className="form-input" style={{ paddingRight: '44px', minWidth: '220px', background: 'rgba(255,255,255,0.03)' }}>
              <option>Filter by Job</option>
              <option>Senior Product Designer</option>
              <option>Store Manager – Bandra</option>
              <option>Full Stack Engineer</option>
            </select>
            <ChevronDown size={18} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--emerald-green)' }} />
          </div>

          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '12px', gap: '6px', border: '1px solid var(--glass-border)' }}>
            {stages.map(stage => (
              <button
                key={stage}
                onClick={() => setSelectedStage(stage)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: selectedStage === stage ? 'var(--emerald-green)' : 'transparent',
                  color: selectedStage === stage ? 'white' : 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        {/* Candidates List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AnimatePresence mode="popLayout">
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate, i) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="card"
                  style={{ 
                    padding: '20px 32px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '32px',
                    border: '1px solid var(--glass-border)',
                    background: 'rgba(30, 41, 59, 0.2)'
                  }}
                >
                  {/* Avatar */}
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%', 
                    background: 'var(--gradient-main)', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)'
                  }}>
                    {candidate.initials}
                  </div>

                  {/* Basic Info */}
                  <div style={{ flex: '1.5' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>{candidate.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      <span>{candidate.title || candidate.role}</span>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--glass-border)' }}></span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} color="var(--emerald-green)" /> {candidate.location}</span>
                    </div>
                  </div>

                  {/* Saved for Job */}
                  <div style={{ flex: '1' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 800, marginBottom: '8px', letterSpacing: '0.05em' }}>SAVED FOR</div>
                    <span style={{ 
                      padding: '6px 12px', 
                      background: 'rgba(255, 255, 255, 0.03)', 
                      color: 'white', 
                      borderRadius: '8px', 
                      fontSize: '0.8rem', 
                      fontWeight: 700,
                      border: '1px solid var(--glass-border)'
                    }}>
                      {candidate.job}
                    </span>
                  </div>

                  {/* Source */}
                  <div style={{ flex: '0.6' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 800, marginBottom: '8px', letterSpacing: '0.05em' }}>SOURCE</div>
                    <span style={{ 
                      padding: '4px 10px', 
                      background: `${candidate.sourceColor}20`, 
                      color: candidate.sourceColor, 
                      borderRadius: '6px', 
                      fontSize: '0.75rem', 
                      fontWeight: 900,
                      border: `1px solid ${candidate.sourceColor}40`
                    }}>
                      {candidate.source.toUpperCase()}
                    </span>
                  </div>

                  {/* AI Score */}
                  <div style={{ flex: '0.5', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 800, marginBottom: '6px' }}>AI SCORE</div>
                    <div style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: 'var(--emerald-green)',
                      borderRadius: '8px',
                      fontWeight: 900,
                      fontSize: '1rem'
                    }}>
                      <Zap size={14} fill="var(--emerald-green)" /> {candidate.score}%
                    </div>
                  </div>

                  {/* Stage */}
                  <div style={{ flex: '0.8', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 800, marginBottom: '6px' }}>STAGE</div>
                    <div style={{ 
                      padding: '6px 14px', 
                      background: `${candidate.stageColor}15`, 
                      color: candidate.stageColor, 
                      borderRadius: '99px', 
                      fontSize: '0.75rem', 
                      fontWeight: 800,
                      border: `1px solid ${candidate.stageColor}30`,
                      whiteSpace: 'nowrap'
                    }}>
                      {candidate.stage.toUpperCase()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Link to={`/candidate/${candidate.id}`}>
                      <button style={{ 
                        padding: '10px 16px', 
                        borderRadius: '10px', 
                        border: '1px solid var(--glass-border)', 
                        background: 'transparent', 
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'var(--transition-smooth)'
                      }}>
                        View Profile
                      </button>
                    </Link>
                    <button className="btn-emerald" style={{ 
                      width: 'auto',
                      padding: '10px 16px', 
                      fontSize: '0.85rem',
                      fontWeight: 800
                    }}>
                      <Calendar size={16} /> Schedule
                    </button>
                    <button style={{ 
                      padding: '10px', 
                      borderRadius: '10px', 
                      border: '1px solid var(--glass-border)', 
                      background: 'transparent', 
                      color: 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}>
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card"
                style={{ padding: '80px 40px', textAlign: 'center', background: 'rgba(30, 41, 59, 0.2)' }}
              >
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  background: 'rgba(255,255,255,0.03)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 24px',
                  color: 'var(--text-secondary)'
                }}>
                  <Bookmark size={40} opacity={0.3} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '12px' }}>No saved candidates yet</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
                  Shortlist top talent from LinkedIn, Naukri and Indeed to see them here.
                </p>
                <Link to="/find" style={{ textDecoration: 'none' }}>
                  <button className="btn-emerald" style={{ width: 'auto', padding: '14px 32px' }}>
                    Start searching <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                  </button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default SavedCandidates;
