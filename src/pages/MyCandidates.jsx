import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { useAppContext } from '../AppContext';
import { Search, Archive, Download, Grid, FileText, Loader2 } from 'lucide-react';
import { CsvImportModal } from '../components/CsvImportModal';
import * as XLSX from 'xlsx-js-style';
import './MyCandidates.css';

export function MyCandidates() {
  const navigate = useNavigate();
  const { candidates, folders, addCandidateToFolder, bulkImportCandidates } = useAppContext();
  
  const mockCandidates = [...candidates].sort((a, b) => new Date(b.addedOn) - new Date(a.addedOn));
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [displayCount, setDisplayCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [activeCandidateForFolder, setActiveCandidateForFolder] = useState(null);
  const [addFolderSearchQuery, setAddFolderSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  
  const exportDropdownRef = useRef(null);

  const filters = ['All', 'Shortlisted', 'In Review', 'On Hold', 'Rejected'];
  
  const filteredCandidates = mockCandidates.filter(c => {
    const matchesFilter = activeFilter === 'All' || c.status === activeFilter;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const displayedCandidates = filteredCandidates.slice(0, displayCount);

  useEffect(() => {
    setDisplayCount(6);
  }, [activeFilter, searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      // Allow some margin (e.g. 100px) from the bottom before triggering
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        if (!isLoadingMore && displayCount < filteredCandidates.length) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setDisplayCount(prev => prev + 6);
            setIsLoadingMore(false);
          }, 800);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, displayCount, filteredCandidates.length]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(e.target)) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusClass = (status) => {
    return `status-${status.toLowerCase().replace(' ', '-')}`;
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const generateExcelSheet = (candidatesToExport) => {
    const data = candidatesToExport.map(c => ({
      "NAME": c.name,
      "EMAIL": c.email,
      "CURRENT ROLE": c.role,
      "COMPANY": c.company,
      "EXPERIENCE": c.experience,
      "SKILLS": c.skills.join(", "),
      "STATUS": c.status,
      "ADDED ON": c.addedOn
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    // Set column widths
    worksheet["!cols"] = [
      { wch: 25 }, // Name
      { wch: 30 }, // Email
      { wch: 25 }, // Current Role
      { wch: 25 }, // Company
      { wch: 15 }, // Experience
      { wch: 35 }, // Skills
      { wch: 15 }, // Status
      { wch: 20 }, // Added On
    ];

    // Set row heights
    worksheet["!rows"] = [
      { hpx: 20 }, // Header row
      ...data.map(() => ({ hpx: 18 })) // Data rows
    ];

    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    
    const borderStyle = {
      top: { style: "thin", color: { rgb: "E0E0E0" } },
      bottom: { style: "thin", color: { rgb: "E0E0E0" } },
      left: { style: "thin", color: { rgb: "E0E0E0" } },
      right: { style: "thin", color: { rgb: "E0E0E0" } },
    };

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellAddress]) continue;

        const isHeader = R === 0;
        const isOddRow = R % 2 !== 0; // Data rows alternate
        
        let cellStyle = {
          font: { name: "Arial", sz: 10 },
          alignment: { vertical: "center" },
          border: borderStyle,
          fill: { fgColor: { rgb: "FFFFFF" } }
        };

        if (isHeader) {
          cellStyle.font.bold = true;
          cellStyle.font.color = { rgb: "FFFFFF" };
          cellStyle.fill.fgColor = { rgb: "00C896" };
        } else {
          if (isOddRow) {
            cellStyle.fill.fgColor = { rgb: "F8F8F8" };
          }
        }

        worksheet[cellAddress].s = cellStyle;
      }
    }

    return worksheet;
  };

  const handleExportExcel = () => {
    const worksheet = generateExcelSheet(filteredCandidates);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");
    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `HR-ai-candidates-${dateStr}.xlsx`);
    setIsExportOpen(false);
  };

  const handleExportCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredCandidates);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");
    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `HR-ai-candidates-${dateStr}.csv`, { bookType: "csv" });
    setIsExportOpen(false);
  };

  const handleExportRow = (candidate) => {
    const worksheet = generateExcelSheet([candidate]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");
    XLSX.writeFile(workbook, `${candidate.name}-profile.xlsx`);
  };

  const handleAddToFolderClick = (e, candidate) => {
    e.stopPropagation();
    setActiveCandidateForFolder(candidate);
    setAddFolderSearchQuery('');
  };

  const handleSelectFolderModal = (folderId, folderName, candidateId) => {
    addCandidateToFolder(folderId, candidateId);
    setActiveCandidateForFolder(null);
    setToastMessage(`Added to ${folderName}`);
    setTimeout(() => setToastMessage(''), 2000);
  };

  const handleCsvImport = async (parsedData) => {
    try {
      const result = await bulkImportCandidates(parsedData);
      setToastMessage(`Imported ${result.importedCount} candidates${result.skippedEmails.length > 0 ? ` (${result.skippedEmails.length} skipped duplicates)` : ''}`);
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      setToastMessage(`Import failed: ${err.message}`);
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main candidates-main">
        
        <header className="candidates-header">
          <div>
            <h1 className="candidates-title">My Candidates</h1>
            <p className="candidates-subtitle">Your personal candidate library</p>
          </div>
          <div className="header-actions">
            <div className="export-dropdown-wrapper" ref={exportDropdownRef}>
              <button className="btn-export" onClick={() => setIsExportOpen(!isExportOpen)}>
                <Download size={16} /> Export
              </button>
              
              {isExportOpen && (
                <div className="export-dropdown-menu">
                  <div className="dropdown-item" onClick={handleExportExcel}>
                    <div className="dropdown-icon excel-icon"><Grid size={18} /></div>
                    <div className="dropdown-content">
                      <div className="dropdown-title">Export All as Excel</div>
                      <div className="dropdown-subtitle">Download full candidate list as .xlsx</div>
                    </div>
                  </div>
                  <div className="dropdown-item" onClick={handleExportCSV}>
                    <div className="dropdown-icon csv-icon"><FileText size={18} /></div>
                    <div className="dropdown-content">
                      <div className="dropdown-title">Export All as CSV</div>
                      <div className="dropdown-subtitle">Download as comma separated file</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button className="btn-upload-header" style={{marginRight: '8px', backgroundColor: '#333', color: '#fff'}} onClick={() => setIsCsvModalOpen(true)}>
              Import CSV
            </button>
            <button className="btn-upload-header" onClick={() => navigate('/upload')}>
              Upload Resume
            </button>
          </div>
        </header>

        <div className="filter-bar">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search candidates by name, role, skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="filter-chips">
            {filters.map(filter => (
              <button 
                key={filter}
                className={`filter-chip ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="table-container">
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
            {displayedCandidates.length === 0 ? (
              <div className="empty-table-state">
                <Archive size={48} className="empty-icon" />
                <h3 className="empty-title">No candidates yet</h3>
                <p className="empty-subtitle">Upload a resume to get started</p>
                <button className="btn-upload-header" onClick={() => navigate('/upload')}>
                  Upload Resume
                </button>
              </div>
            ) : (
              displayedCandidates.map(candidate => (
                <div key={candidate.id} className="table-row">
                  <div className="col-candidate">
                    <div className="col-candidate-inner">
                      <div className="candidate-avatar">
                        {getInitials(candidate.name)}
                      </div>
                      <div className="candidate-info">
                        <div className="candidate-name">{candidate.name}</div>
                        <div className="candidate-email">{candidate.email}</div>
                      </div>
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
                    <div className="col-skills-inner skills-wrapper">
                      {candidate.skills.slice(0, 2).map(skill => (
                        <span key={skill} className="skill-chip">{skill}</span>
                      ))}
                      {candidate.skills.length > 2 && (
                        <span className="skill-more">+{candidate.skills.length - 2} more</span>
                      )}
                    </div>
                  </div>
                  <div className="col-status">
                    <div className="col-status-inner">
                      <span className={`status-badge ${getStatusClass(candidate.status)}`}>
                        {candidate.status}
                      </span>
                    </div>
                  </div>
                  <div className="col-added">
                    <div className="added-date">{candidate.addedOn}</div>
                    <div className="added-days">{candidate.addedDaysAgo}</div>
                  </div>
                  <div className="col-actions">
                    <div className="col-actions-inner">
                      <button className="action-btn-text view-btn" onClick={() => navigate(`/candidates/${candidate.id}`)}>
                        View
                      </button>
                      <button className="action-btn-text export-btn" title="Export to Excel" onClick={() => handleExportRow(candidate)}>
                        Export Row
                      </button>
                      <button className="btn-add-to-folder" onClick={(e) => handleAddToFolderClick(e, candidate)}>
                        Add to Folder
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {isLoadingMore && (
              <div className="loading-spinner-container">
                <Loader2 className="spinner-icon" size={24} />
              </div>
            )}
          </div>
        </div>

        {activeCandidateForFolder && (
          <div className="folder-modal-overlay" onClick={() => setActiveCandidateForFolder(null)}>
            <div className="folder-modal-card" onClick={e => e.stopPropagation()}>
              <div className="folder-modal-header">
                <h3 className="folder-modal-title">Add to Folder</h3>
                <button className="folder-modal-close" onClick={() => setActiveCandidateForFolder(null)}>&times;</button>
              </div>
              <div className="folder-modal-candidate-info">
                Adding: {activeCandidateForFolder.name}
              </div>
              <div className="folder-modal-search">
                <Search className="folder-search-icon" size={16} />
                <input 
                  type="text"
                  className="folder-search-input"
                  placeholder="Search folders..."
                  value={addFolderSearchQuery}
                  onChange={(e) => setAddFolderSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="folder-modal-list">
                {(() => {
                  const filteredFolders = folders.filter(f => f.name.toLowerCase().includes(addFolderSearchQuery.toLowerCase()));
                  if (filteredFolders.length === 0) {
                    return (
                      <div className="folder-modal-empty">
                        <div>No folders found for '{addFolderSearchQuery}'</div>
                        <button className="folder-modal-create-link" onClick={() => { setActiveCandidateForFolder(null); navigate('/folders'); }}>
                          Create new folder
                        </button>
                      </div>
                    );
                  }
                  return filteredFolders.map(f => (
                    <div key={f.id} className="folder-modal-row" onClick={() => handleSelectFolderModal(f.id, f.name, activeCandidateForFolder.id)}>
                      <div className="folder-modal-row-icon"><Archive size={16} /></div>
                      <div className="folder-modal-row-name">{f.name}</div>
                      <div className="folder-modal-row-count">{f.candidates ? f.candidates.length : 0}</div>
                    </div>
                  ));
                })()}
              </div>
              <div className="folder-modal-divider"></div>
              <button className="folder-modal-create-btn" onClick={() => { setActiveCandidateForFolder(null); navigate('/folders'); }}>
                Create New Folder
              </button>
            </div>
          </div>
        )}

        {toastMessage && (
          <div className="toast-notification">
            {toastMessage}
          </div>
        )}

        <CsvImportModal 
          isOpen={isCsvModalOpen} 
          onClose={() => setIsCsvModalOpen(false)} 
          onImport={handleCsvImport} 
        />

      </main>
    </div>
  );
}
