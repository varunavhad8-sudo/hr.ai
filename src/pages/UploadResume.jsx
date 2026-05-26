import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { UploadCloud, Loader2, X, CheckCircle, FileText } from 'lucide-react';
import { useAppContext } from '../AppContext';
import './UploadResume.css';

export function UploadResume() {
  const navigate = useNavigate();
  
  const [isUploading, setIsUploading] = useState(false);
  const [candidateData, setCandidateData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [linkedinError, setLinkedinError] = useState('');
  
  const fileInputRef = React.useRef(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const { incrementStats, folders, createFolder, addCandidateToFolder } = useAppContext();

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isUploading && !candidateData) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (isUploading || candidateData) return;
    const files = e.dataTransfer.files;
    if (files.length > 0) processFile(files[0]);
  };

  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) processFile(e.target.files[0]);
  };

  const processFile = (file) => {
    setFileError('');
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext)) {
      setFileError('Only PDF, DOC, DOCX files allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File too large. Maximum 5MB allowed.');
      return;
    }
    setSelectedFile(file.name);
    setIsUploading(true);
    
    setTimeout(() => {
      setIsUploading(false);
      setCandidateData({
        name: "Priya Sharma",
        initials: "PS",
        role: "Senior HR Manager",
        experience: "6 Years",
        skills: ["HR Management", "Recruitment", "Talent Acquisition", "Excel"],
        education: "MBA HR, Delhi University",
        email: "priya.sharma@example.com",
        linkedin: "https://linkedin.com/in/priyasharma",
        status: "In Review"
      });
      setLinkedinUrl("https://linkedin.com/in/priyasharma");
    }, 2000);
  };

  const updateField = (field, value) => {
    setCandidateData({...candidateData, [field]: value});
  };

  const removeSkill = (skillToRemove) => {
    setCandidateData({
      ...candidateData,
      skills: candidateData.skills.filter(s => s !== skillToRemove)
    });
  };

  const handleLinkedinChange = (e) => {
    const val = e.target.value;
    setLinkedinUrl(val);
    if (val && !val.includes('linkedin.com/in/')) {
      setLinkedinError('Please enter a valid LinkedIn URL');
    } else {
      setLinkedinError('');
    }
    if (candidateData) {
      updateField('linkedin', val);
    }
  };

  const handleReupload = () => {
    setCandidateData(null);
    setSelectedFile(null);
    setIsUploading(false);
    setSelectedFolderId('');
    setFileError('');
    setLinkedinUrl('');
    setLinkedinError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim());
      setNewFolderName('');
      setIsModalOpen(false);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      incrementStats();

      if (selectedFolderId) {
        const folderName = folders.find(f => f.id === parseInt(selectedFolderId))?.name || 'Folder';
        setToastMessage(`Saved to Library & added to ${folderName}`);
        setTimeout(() => {
          setToastMessage('');
          navigate('/dashboard');
        }, 2000);
      } else {
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      }
    }, 1500);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main upload-main">
        <div className="upload-container">
          
          {/* LEFT COLUMN */}
          <div className="upload-panel">
            <header className="upload-header">
              <h1 className="upload-title">Add New Candidate</h1>
              <p className="upload-subtitle">AI will auto-fill details from the resume</p>
            </header>

            <div 
              className={`upload-zone ${isUploading ? 'uploading' : ''} ${selectedFile && !isUploading ? 'has-file' : ''} ${isDragging ? 'is-dragging' : ''}`}
              onClick={() => !isUploading && !candidateData && fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                hidden
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx"
              />
              {isUploading ? (
                <div className="upload-loading">
                  <Loader2 className="spinner" size={48} />
                  <p>AI is reading the resume...</p>
                </div>
              ) : selectedFile ? (
                <div className="upload-success">
                  <FileText size={48} className="upload-icon" />
                  <p className="file-name">{selectedFile}</p>
                  <CheckCircle size={20} className="check-icon" />
                </div>
              ) : (
                <div className="upload-prompt">
                  <UploadCloud size={48} className="upload-icon" />
                  <p className="upload-prompt-text">Drop resume here or click to upload</p>
                  <p className="upload-prompt-subtext">PDF, DOC, DOCX supported</p>
                </div>
              )}
            </div>
            {fileError && <div className="file-error-text" style={{color: '#ef4444', fontSize: '14px', marginTop: '-12px'}}>{fileError}</div>}

            <div className="linkedin-input-group">
              <label htmlFor="linkedin">LinkedIn Profile URL</label>
              <input 
                type="url" 
                id="linkedin" 
                placeholder="https://linkedin.com/in/name" 
                disabled={isUploading}
                value={linkedinUrl}
                onChange={handleLinkedinChange}
              />
              {linkedinError ? (
                <span className="helper-text" style={{color: '#ef4444'}}>{linkedinError}</span>
              ) : (
                <span className="helper-text">Reference only — used to open profile</span>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className={`candidate-panel ${!candidateData ? 'empty' : ''}`}>
            {candidateData ? (
              <div className="candidate-card">
                <div className="candidate-card-header">
                  <div className="candidate-card-title-group">
                    <div className="avatar-initials">{candidateData.initials}</div>
                    <h2 className="candidate-title">Candidate Details</h2>
                  </div>
                  <span className="ai-badge">Auto-filled by AI</span>
                </div>

                <div className="candidate-fields">
                  <div className="field-row">
                    <label>Full Name</label>
                    <input type="text" value={candidateData.name} onChange={(e) => updateField('name', e.target.value)} />
                  </div>
                  <div className="field-row">
                    <label>Current Role</label>
                    <input type="text" value={candidateData.role} onChange={(e) => updateField('role', e.target.value)} />
                  </div>
                  <div className="field-row">
                    <label>Years of Experience</label>
                    <input type="text" value={candidateData.experience} onChange={(e) => updateField('experience', e.target.value)} />
                  </div>
                  <div className="field-row">
                    <label>Skills</label>
                    <div className="skills-tags">
                      {candidateData.skills.map(skill => (
                        <span key={skill} className="skill-tag">
                          {skill}
                          <button className="tag-remove" onClick={() => removeSkill(skill)}><X size={12}/></button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="field-row">
                    <label>Education</label>
                    <input type="text" value={candidateData.education} onChange={(e) => updateField('education', e.target.value)} />
                  </div>
                  <div className="field-row">
                    <label>Email</label>
                    <input type="email" value={candidateData.email} onChange={(e) => updateField('email', e.target.value)} />
                  </div>
                  <div className="field-row">
                    <label>LinkedIn</label>
                    <a href={candidateData.linkedin} target="_blank" rel="noreferrer" className="linkedin-link">
                      {candidateData.linkedin}
                    </a>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="category-group">
                  <label>Add to Category</label>
                  <select className="category-select" value={candidateData.status} onChange={(e) => updateField('status', e.target.value)}>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="In Review">In Review</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="category-group">
                  <label>Add to Folder</label>
                  <div className="folder-selection-row">
                    <select 
                      className="category-select" 
                      value={selectedFolderId}
                      onChange={(e) => setSelectedFolderId(e.target.value)}
                    >
                      <option value="">Select existing folder</option>
                      {folders.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                    <button 
                      className="btn-new-folder-ghost" 
                      onClick={() => setIsModalOpen(true)}
                    >
                      + New Folder
                    </button>
                  </div>
                </div>

                <div className="candidate-actions">
                  <button className="btn-save" onClick={handleSave} disabled={isSaving || saveSuccess}>
                    {saveSuccess ? (
                      <span className="btn-save-content"><CheckCircle size={18} /> Saved</span>
                    ) : isSaving ? (
                      <span className="btn-save-content"><Loader2 className="spinner" size={18} /> Saving...</span>
                    ) : (
                      "Save to Library"
                    )}
                  </button>
                  <button className="btn-ghost-teal" onClick={handleReupload} disabled={isSaving || saveSuccess}>Re-upload Resume</button>
                </div>
              </div>
            ) : (
              <div className="candidate-card placeholder-card">
                <UploadCloud size={32} className="placeholder-icon" strokeWidth={1.5} />
                <p>Upload a resume to see<br/>AI-extracted details here.</p>
              </div>
            )}
          </div>
          
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Create New Folder</h2>
                <button className="btn-close" onClick={() => setIsModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateFolder}>
                <div className="modal-body">
                  <input
                    type="text"
                    className="folder-input"
                    placeholder="e.g. Python Developers, Marketing, Sales"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-create" disabled={!newFolderName.trim()}>
                    Create Folder
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {toastMessage && (
          <div className="toast-notification">
            {toastMessage}
          </div>
        )}

      </main>
    </div>
  );
}
