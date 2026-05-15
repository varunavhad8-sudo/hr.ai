import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { 
  Type, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  FileText,
  X,
  CheckCircle2,
  ArrowRight,
  Monitor,
  LayoutGrid
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState(['React', 'Node.js']);
  const [skillInput, setSkillInput] = useState('');
  const [empType, setEmpType] = useState('Full-time');
  const [remote, setRemote] = useState(false);
  const [sources, setSources] = useState(['LinkedIn', 'Naukri', 'Indeed']);

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const toggleSource = (source) => {
    setSources(prev => 
      prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/find');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="dashboard-main">
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <header style={{ marginBottom: '48px' }}>
            <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'white', marginBottom: '12px' }}>Post a New Job</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '750px', lineHeight: 1.6 }}>
              Fill in the details and AI will instantly find matching candidates from LinkedIn, Naukri & Indeed
            </p>
          </header>

          <form onSubmit={handleSubmit} className="card" style={{ padding: '48px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* Job Title & Department */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Type size={16} color="var(--emerald-green)" /> Job Title
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Senior Product Manager" 
                  required 
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LayoutGrid size={16} color="var(--emerald-green)" /> Department
                </label>
                <select className="form-input" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <option>Select Department</option>
                  <option>Sales</option>
                  <option>Operations</option>
                  <option>Marketing</option>
                  <option>Tech</option>
                  <option>HR</option>
                  <option>Finance</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* Location & Remote */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'flex-end' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="var(--emerald-green)" /> Location
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="City name" 
                  disabled={remote} 
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                />
              </div>
              <div style={{ paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div 
                  onClick={() => setRemote(!remote)}
                  style={{ 
                    width: '56px', 
                    height: '28px', 
                    background: remote ? 'var(--emerald-green)' : 'rgba(255,255,255,0.1)', 
                    borderRadius: '14px', 
                    position: 'relative', 
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <div style={{ 
                    width: '22px', 
                    height: '22px', 
                    background: 'white', 
                    borderRadius: '50%', 
                    position: 'absolute', 
                    top: '3px', 
                    left: remote ? '31px' : '3px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }} />
                </div>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: remote ? 'white' : 'var(--text-secondary)' }}>Remote Opportunity</span>
              </div>
            </div>

            {/* Employment Type & Experience */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
              <div className="form-group">
                <label className="form-label">Employment Type</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {['Full-time', 'Part-time', 'Contract', 'Internship'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEmpType(type)}
                      style={{
                        flex: 1,
                        padding: '14px',
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: empType === type ? 'var(--emerald-green)' : 'var(--glass-border)',
                        background: empType === type ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.03)',
                        color: empType === type ? 'white' : 'var(--text-secondary)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Briefcase size={16} color="var(--emerald-green)" /> Experience Required
                </label>
                <select className="form-input" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <option>Fresher</option>
                  <option>1-2 yrs</option>
                  <option>3-5 yrs</option>
                  <option>5-10 yrs</option>
                  <option>10+ yrs</option>
                </select>
              </div>
            </div>

            {/* Salary Range */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={16} color="var(--emerald-green)" /> Salary Range (Annual)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--emerald-green)', fontWeight: 800 }}>₹</span>
                  <input type="text" className="form-input" style={{ paddingLeft: '36px', background: 'rgba(255,255,255,0.03)' }} placeholder="Min" />
                </div>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>to</span>
                <div style={{ position: 'relative', flex: 1 }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--emerald-green)', fontWeight: 800 }}>₹</span>
                  <input type="text" className="form-input" style={{ paddingLeft: '36px', background: 'rgba(255,255,255,0.03)' }} placeholder="Max" />
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: 'var(--emerald-green)', cursor: 'pointer' }} />
                Don't want to disclose salary
              </label>
            </div>

            {/* Key Skills */}
            <div className="form-group">
              <label className="form-label">Skills Required</label>
              <div className="form-input" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '12px', minHeight: '60px', background: 'rgba(255,255,255,0.03)' }}>
                {skills.map(skill => (
                  <span key={skill} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    padding: '6px 14px', 
                    background: 'rgba(16, 185, 129, 0.1)', 
                    color: 'var(--emerald-green)', 
                    borderRadius: '8px', 
                    fontSize: '0.9rem', 
                    fontWeight: 700,
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}>
                    {skill}
                    <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeSkill(skill)} />
                  </span>
                ))}
                <input 
                  type="text" 
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="Type skill and press Enter..." 
                  style={{ border: 'none', outline: 'none', flex: 1, minWidth: '200px', background: 'transparent', fontSize: '1rem', color: 'white' }}
                />
              </div>
            </div>

            {/* Job Description */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} color="var(--emerald-green)" /> Job Description
              </label>
              <textarea 
                className="form-input" 
                rows="8" 
                style={{ resize: 'vertical', background: 'rgba(255,255,255,0.03)', padding: '20px', lineHeight: 1.6 }}
                placeholder="Describe the role, responsibilities and core requirements..."
              ></textarea>
            </div>

            {/* Source Platforms */}
            <div className="form-group">
              <label className="form-label" style={{ marginBottom: '24px' }}>Source Platforms</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                {[
                  { name: 'LinkedIn', color: '#0077b5', icon: 'LI' },
                  { name: 'Naukri', color: '#ef4444', icon: 'N' },
                  { name: 'Indeed', color: '#8b5cf6', icon: 'I' }
                ].map(source => (
                  <div 
                    key={source.name}
                    onClick={() => toggleSource(source.name)}
                    style={{
                      padding: '32px',
                      borderRadius: '20px',
                      border: '2px solid',
                      borderColor: sources.includes(source.name) ? source.color : 'var(--glass-border)',
                      background: sources.includes(source.name) ? `${source.color}15` : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      boxShadow: sources.includes(source.name) ? `0 10px 20px ${source.color}20` : 'none'
                    }}
                  >
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '12px', 
                      background: source.color, 
                      color: 'white', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      margin: '0 auto 16px',
                      fontWeight: 900,
                      fontSize: '1.2rem'
                    }}>
                      {source.icon}
                    </div>
                    <div style={{ fontWeight: 800, color: sources.includes(source.name) ? 'white' : 'var(--text-secondary)', fontSize: '1.1rem' }}>{source.name}</div>
                    {sources.includes(source.name) && (
                      <div style={{ position: 'absolute', top: '16px', right: '16px', color: source.color }}>
                        <CheckCircle2 size={20} fill="white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <button className="btn-emerald" style={{ width: '100%', padding: '20px', fontSize: '1.2rem', justifyContent: 'center', fontWeight: 800 }}>
                Find Matching Candidates <ArrowRight size={22} style={{ marginLeft: '12px' }} />
              </button>
              <p style={{ marginTop: '20px', color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>
                AI will scan selected platforms and rank best matches instantly
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PostJob;
