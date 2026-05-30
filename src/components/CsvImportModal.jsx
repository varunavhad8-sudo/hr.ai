import React, { useState } from 'react';
import Papa from 'papaparse';
import { UploadCloud, FileText, Loader2, X, Download } from 'lucide-react';
import { useAppContext } from '../AppContext';
import './CsvImportModal.css';

export function CsvImportModal({ isOpen, onClose, onImport }) {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState('');
  
  const { currentUser } = useAppContext();
  const plan = currentUser?.plan || 'free';
  
  let maxCandidatesPerFile = 20;
  if (plan === 'starter') maxCandidatesPerFile = 100;
  if (plan === 'pro') maxCandidatesPerFile = 500;

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    const csvContent = "name,email,phone,current_role,experience_years,skills,education,resume_link\nJohn Doe,john@example.com,1234567890,Software Engineer,5,\"React, Node, MongoDB\",B.S. Computer Science,https://drive.google.com/open?id=123";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'hr_ai_candidates_template.csv';
    link.click();
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }

    setFile(selectedFile);
    setError('');

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validRows = results.data.filter(row => row.email || row.name);
        
        if (validRows.length > maxCandidatesPerFile) {
          setError(`Your ${plan} plan limits imports to ${maxCandidatesPerFile} candidates per file. Found ${validRows.length}.`);
          setFile(null);
          return;
        }

        setParsedData(validRows);
      },
      error: (err) => {
        setError(`Error parsing CSV: ${err.message}`);
      }
    });
  };

  const handleImport = async () => {
    if (!parsedData || parsedData.length === 0) return;
    setIsImporting(true);
    await onImport(parsedData);
    setIsImporting(false);
    onClose();
    setFile(null);
    setParsedData(null);
  };

  return (
    <div className="csv-modal-overlay">
      <div className="csv-modal-card">
        <div className="csv-modal-header">
          <h3>Import Candidates via CSV</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="csv-modal-body">
          <div className="template-section">
            <p>Download our template to ensure your columns match exactly.</p>
            <button className="btn-template" onClick={handleDownloadTemplate}>
              <Download size={16} /> Download Template
            </button>
          </div>

          <div className="upload-zone">
            <input 
              type="file" 
              accept=".csv"
              onChange={handleFileSelect}
              id="csv-upload"
              hidden
            />
            {!file ? (
              <label htmlFor="csv-upload" className="upload-label">
                <UploadCloud size={48} className="upload-icon" />
                <p>Click to select or drag and drop a .csv file</p>
              </label>
            ) : (
              <div className="upload-success">
                <FileText size={32} className="upload-icon" />
                <p className="filename">{file.name}</p>
                {parsedData && (
                  <p className="parsed-count">Found {parsedData.length} valid candidates</p>
                )}
                {error && <p className="error-text">{error}</p>}
              </div>
            )}
          </div>
        </div>

        <div className="csv-modal-footer">
          <button className="btn-cancel" onClick={onClose} disabled={isImporting}>Cancel</button>
          <button 
            className="btn-import" 
            onClick={handleImport}
            disabled={!parsedData || isImporting || parsedData.length === 0}
          >
            {isImporting ? <><Loader2 size={16} className="spinner" /> Importing...</> : `Import ${parsedData ? parsedData.length : ''} Candidates`}
          </button>
        </div>
      </div>
    </div>
  );
}
