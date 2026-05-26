import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { useAppContext } from '../AppContext';
import { ArrowLeft, ExternalLink, X, FileText, CheckCircle2 } from 'lucide-react';
import * as XLSX from 'xlsx-js-style';
import './CandidateProfile.css';

export function CandidateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { candidates } = useAppContext();
  
  // Find candidate or use fallback sample data
  const initialData = candidates.find(c => c.id === parseInt(id)) || {
    id: parseInt(id),
    name: 'Rahul Sharma',
    role: 'Senior Frontend Engineer',
    status: 'Shortlisted',
    email: 'rahul.s@example.com',
    experience: '5 years',
    education: 'B.Tech Computer Science, IIT Delhi',
    skills: ['React', 'TypeScript', 'Next.js', 'Node.js'],
    linkedin: 'https://linkedin.com/in/rahulsharma'
  };

  const [candidate, setCandidate] = useState(initialData);
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [timeline, setTimeline] = useState([
    { id: 1, action: 'Profile created', date: 'Today' },
    { id: 2, action: `Added to ${candidate.status}`, date: 'Today' },
    { id: 3, action: 'Resume uploaded', date: 'Today' }
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleStageChange = (newStage) => {
    setCandidate({ ...candidate, status: newStage });
    setTimeline([{ id: Date.now(), action: `Stage changed to ${newStage}`, date: 'Just now' }, ...timeline]);
    showToast('Stage updated');
  };

  const removeSkill = (skillToRemove) => {
    setCandidate({
      ...candidate,
      skills: candidate.skills.filter(s => s !== skillToRemove)
    });
  };

  const saveNotes = () => {
    setIsSavingNotes(true);
    setTimeout(() => {
      setIsSavingNotes(false);
      if (notes.trim()) {
        setTimeline([{ id: Date.now(), action: 'Notes updated', date: 'Just now' }, ...timeline]);
        showToast('Notes saved');
      }
    }, 600);
  };

  const handleExport = () => {
    const wsData = [
      ['Candidate Name', candidate.name],
      ['Role', candidate.role],
      ['Status', candidate.status],
      ['Email', candidate.email],
      ['Experience', candidate.experience],
      ['Education', candidate.education],
      ['Skills', candidate.skills.join(', ')],
      ['LinkedIn', candidate.linkedin]
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Profile");
    XLSX.writeFile(wb, `${candidate.name.replace(/\s+/g, '_')}-profile.xlsx`);
  };

  const handleMoveToVault = () => {
    showToast('Moved to Vault successfully');
    setTimeout(() => navigate('/candidates'), 1500);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Shortlisted': return 'var(--accent-color)';
      case 'In Review': return '#eab308';
      case 'On Hold': return '#64748b';
      case 'Rejected': return '#ef4444';
      default: return 'var(--text-muted)';
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main profile-main">
        <div className="profile-container">
          
          <div className="profile-top-row">
            <button className="btn-back" onClick={() => navigate('/candidates')}>
              <ArrowLeft size={20} />
              <span>My Candidates</span>
            </button>
            <div className="top-actions">
              <button className="btn-ghost-teal" onClick={handleExport}>Export Profile</button>
              <button className="btn-ghost-grey" onClick={() => setShowVaultModal(true)}>Move to Vault</button>
            </div>
          </div>

          <div className="profile-header-card">
            <div className="header-left">
              <div className="avatar-circle-large">{getInitials(candidate.name)}</div>
              <div className="header-info">
                <h1 className="candidate-name">{candidate.name}</h1>
                <p className="candidate-role">{candidate.role}</p>
                <span className="status-badge" style={{ backgroundColor: getStatusColor(candidate.status) + '1A', color: getStatusColor(candidate.status) }}>
                  {candidate.status}
                </span>
              </div>
            </div>
            {candidate.linkedin && (
              <a href={candidate.linkedin} target="_blank" rel="noreferrer" className="btn-linkedin">
                <ExternalLink size={16} /> View LinkedIn
              </a>
            )}
          </div>

          <div className="profile-grid">
            {/* LEFT COLUMN */}
            <div className="profile-left-col">
              
              <div className="profile-card">
                <h3 className="section-heading">PERSONAL INFORMATION</h3>
                <div className="info-row">
                  <span className="info-label">Email</span>
                  <span className="info-value">{candidate.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Experience</span>
                  <span className="info-value">{candidate.experience}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Education</span>
                  <span className="info-value">{candidate.education}</span>
                </div>
              </div>

              <div className="profile-card">
                <h3 className="section-heading">SKILLS</h3>
                <div className="skills-wrap">
                  {candidate.skills.map(skill => (
                    <span key={skill} className="skill-chip">
                      {skill}
                      <button className="btn-remove-skill" onClick={() => removeSkill(skill)}><X size={14}/></button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="profile-card">
                <h3 className="section-heading">NOTES</h3>
                <textarea 
                  className="notes-textarea"
                  placeholder="Add notes about this candidate..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <div className="notes-actions">
                  <button className="btn-save-notes" onClick={saveNotes} disabled={isSavingNotes}>
                    {isSavingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
              </div>
              
            </div>

            {/* RIGHT COLUMN */}
            <div className="profile-right-col">
              
              <div className="profile-card">
                <h3 className="section-heading">HIRING STAGE</h3>
                <div className="stage-list">
                  {['Shortlisted', 'In Review', 'On Hold', 'Rejected'].map(stage => (
                    <div 
                      key={stage}
                      className={`stage-row ${candidate.status === stage ? 'active' : ''}`}
                      onClick={() => handleStageChange(stage)}
                    >
                      {stage}
                    </div>
                  ))}
                </div>
              </div>

              <div className="profile-card">
                <h3 className="section-heading">ACTIVITY TIMELINE</h3>
                <div className="timeline-list">
                  {timeline.map((item, index) => (
                    <div key={item.id} className="timeline-item">
                      <div className="timeline-dot-wrapper">
                        <div className="timeline-dot"></div>
                        {index !== timeline.length - 1 && <div className="timeline-line"></div>}
                      </div>
                      <div className="timeline-content">
                        <p className="timeline-action">{item.action}</p>
                        <span className="timeline-date">{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="profile-card">
                <h3 className="section-heading">RESUME</h3>
                <div className="resume-display">
                  <FileText size={40} className="resume-icon" />
                  <span className="resume-filename">resume.pdf</span>
                </div>
                <button className="btn-ghost-teal-full" onClick={() => {
                  const link = document.createElement('a');
                  link.href = 'data:application/pdf;base64,';
                  link.download = 'resume.pdf';
                  link.click();
                }}>Download Resume</button>
              </div>

            </div>
          </div>
        </div>

        {/* Modals & Toasts */}
        {showVaultModal && (
          <div className="modal-overlay">
            <div className="modal-content delete-modal">
              <div className="modal-body text-center" style={{marginTop: '10px', marginBottom: '20px'}}>
                <h2 style={{color: 'var(--text-main)', marginBottom: '10px', fontSize: '1.25rem', fontWeight: '700'}}>Move {candidate.name} to Vault?</h2>
                <p style={{color: 'var(--text-muted)', fontSize: '0.9375rem'}}>This candidate will be archived in your Vault.</p>
              </div>
              <div className="modal-actions" style={{justifyContent: 'center', border: 'none'}}>
                <button className="btn-cancel" onClick={() => setShowVaultModal(false)}>Cancel</button>
                <button className="btn-create" onClick={handleMoveToVault}>Move to Vault</button>
              </div>
            </div>
          </div>
        )}

        {toastMessage && (
          <div className="toast-notification" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <CheckCircle2 size={18} />
            {toastMessage}
          </div>
        )}

      </main>
    </div>
  );
}
