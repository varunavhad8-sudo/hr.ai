import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { useAppContext } from '../AppContext';
import { ArrowLeft, UserPlus, FolderOpen } from 'lucide-react';
import './FolderView.css';
import './MyCandidates.css'; // Reuse table styles

export function FolderView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { folders, candidates } = useAppContext();
  const [folder, setFolder] = useState(null);
  const [folderCandidates, setFolderCandidates] = useState([]);

  useEffect(() => {
    const currentFolder = folders.find(f => f.id === parseInt(id));
    if (currentFolder) {
      setFolder(currentFolder);
      const cands = currentFolder.candidateIds
        .map(cId => candidates.find(c => c.id === cId))
        .filter(Boolean);
      setFolderCandidates(cands);
    } else {
      navigate('/folders'); // Invalid folder, redirect back
    }
  }, [id, folders, candidates, navigate]);

  const getStatusClass = (status) => {
    return `status-${status.toLowerCase().replace(' ', '-')}`;
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (!folder) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main folder-view-main">
        
        <header className="folder-view-header">
          <div className="folder-view-header-left">
            <button className="btn-back" onClick={() => navigate('/folders')}>
              <ArrowLeft size={16} /> Folders
            </button>
            <h1 className="folder-view-title">{folder.name}</h1>
            <p className="folder-view-subtitle">{folderCandidates.length} candidates</p>
          </div>
          <button className="btn-add-candidate" onClick={() => navigate('/candidates')}>
            Add Candidates
          </button>
        </header>

        <div className="table-container folder-table">
          <div className="table-header-row">
            <div className="col-candidate">CANDIDATE</div>
            <div className="col-role">ROLE</div>
            <div className="col-experience">EXPERIENCE</div>
            <div className="col-skills">SKILLS</div>
            <div className="col-status">STATUS</div>
            <div className="col-added">ADDED ON</div>
            <div className="col-actions">ACTIONS</div>
          </div>

          <div className="table-body">
            {folderCandidates.length === 0 ? (
              <div className="empty-folder-state">
                <FolderOpen size={48} className="empty-icon" />
                <h3 className="empty-title">This folder is empty</h3>
                <p className="empty-subtitle">Add candidates from My Candidates</p>
                <button className="btn-upload-header" onClick={() => navigate('/candidates')}>
                  Go to My Candidates
                </button>
              </div>
            ) : (
              folderCandidates.map(candidate => (
                <div key={candidate.id} className="table-row">
                  <div className="col-candidate">
                    <div className="candidate-avatar">
                      {getInitials(candidate.name)}
                    </div>
                    <div className="candidate-info">
                      <div className="candidate-name">{candidate.name}</div>
                      <div className="candidate-email">{candidate.email}</div>
                    </div>
                  </div>
                  <div className="col-role">
                    <div className="role-title">{candidate.role}</div>
                    <div className="role-company">{candidate.company}</div>
                  </div>
                  <div className="col-experience">
                    <div className="experience-text">{candidate.experience}</div>
                  </div>
                  <div className="col-skills">
                    <div className="skills-wrapper">
                      {candidate.skills.slice(0, 2).map(skill => (
                        <span key={skill} className="skill-chip">{skill}</span>
                      ))}
                      {candidate.skills.length > 2 && (
                        <span className="skill-more">+{candidate.skills.length - 2} more</span>
                      )}
                    </div>
                  </div>
                  <div className="col-status">
                    <span className={`status-badge ${getStatusClass(candidate.status)}`}>
                      {candidate.status}
                    </span>
                  </div>
                  <div className="col-added">
                    <div className="added-date">{candidate.addedOn}</div>
                    <div className="added-days">{candidate.addedDaysAgo}</div>
                  </div>
                  <div className="col-actions">
                    <button className="action-btn-text view-btn" onClick={() => navigate(`/candidate/${candidate.id}`)}>
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
