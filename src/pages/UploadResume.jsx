import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { UploadCloud, Loader2, X, CheckCircle, FileText } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { API_BASE_URL } from '../config';
import getAuthToken from '../utils/getAuthToken';
import './UploadResume.css';

export function UploadResume() {
  const navigate = useNavigate();
  
  const [isUploading, setIsUploading] = useState(false);
  const [candidateData, setCandidateData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [actualFile, setActualFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [linkedinError, setLinkedinError] = useState('');
  
  const fileInputRef = React.useRef(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [toastMessage, setToastMessage] = useState('');
 
  const { incrementStats, folders, createFolder, addCandidateToFolder, updateCandidateInDb, loadCandidates } = useAppContext();
 
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
 
  const processFile = async (file) => {
    setFileError('');
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File too large. Maximum 10MB allowed.');
      return;
    }
    setSelectedFile(file.name);
    setActualFile(file);
    setIsUploading(true);
    
    try {
      const token = await getAuthToken();
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await fetch(`${API_BASE_URL}/api/parse-resume`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (response.status === 401) {
        window.location.href = '/signin';
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to parse resume');
      }
      
      const data = await response.json();
      
      // Bind details returned from API
      setCandidateData({
        name: data.name || 'Unknown',
        initials: (data.name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        role: data.current_role || data.role || '',
        experience: data.experience_years ? `${data.experience_years} Years` : '0 Years',
        skills: data.skills || [],
        education: data.education || '',
        email: data.email || '',
        linkedin: data.linkedin || '',
        status: 'In Review' // default stage
      });
      
      if (data.linkedin) {
        setLinkedinUrl(data.linkedin);
      }
    } catch (err) {
      console.error('[UploadResume] Upload/Parse error:', err.message);
      setFileError('Error reading or parsing resume. Please try again.');
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
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
    setActualFile(null);
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let savedCandidateId = null;

      if (candidateData) {
        if (candidateData._id) {
          // If it somehow already has an ID, just update it
          await updateCandidateInDb(candidateData._id, {
            name: candidateData.name,
            role: candidateData.role,
            experience: candidateData.experience,
            skills: candidateData.skills,
            education: candidateData.education,
            email: candidateData.email,
            status: candidateData.status
          });
          savedCandidateId = candidateData._id;
        } else {
          // Create new candidate with resume file
          const formData = new FormData();
          if (actualFile) {
            formData.append('resume', actualFile);
          }
          formData.append('name', candidateData.name);
          formData.append('role', candidateData.role);
          
          // Parse experience number
          const expMatch = String(candidateData.experience).match(/\d+/);
          formData.append('experience_years', expMatch ? expMatch[0] : 0);
          
          formData.append('education', candidateData.education);
          formData.append('email', candidateData.email);
          formData.append('stage', candidateData.status);
          formData.append('skills', JSON.stringify(candidateData.skills));
          
          const newCandidate = await createCandidateInDb(formData);
          if (newCandidate) {
            savedCandidateId = newCandidate.id || newCandidate._id;
          }
        }
        
        // Refresh candidates from backend
        await loadCandidates();
      }

      setSaveSuccess(true);
      incrementStats();

      if (selectedFolderId && savedCandidateId) {
        const folderName = folders.find(f => f.id === parseInt(selectedFolderId))?.name || 'Folder';
        addCandidateToFolder(parseInt(selectedFolderId), savedCandidateId);
        setToastMessage(`Saved to Library & added to ${folderName}`);
        setTimeout(() => {
          setToastMessage('');
          navigate('/candidates');
        }, 2000);
      } else {
        setTimeout(() => {
          navigate('/candidates');
        }, 800);
      }
    } catch (err) {
      console.error('[UploadResume] Failed to save candidate edits:', err.message);
    } finally {
      setIsSaving(false);
    }
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
                  <p className="upload-subtitle">Supports PDF, DOCX, DOC, TXT, Images, and more</p>
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
