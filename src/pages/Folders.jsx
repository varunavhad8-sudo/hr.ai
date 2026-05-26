import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { useAppContext } from '../AppContext';
import { FolderPlus, Folder as FolderIcon, MoreVertical, X, Search } from 'lucide-react';
import './Folders.css';

export function Folders() {
  const navigate = useNavigate();
  const { folders, createFolder, deleteFolder, renameFolder } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [renamingFolderId, setRenamingFolderId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [folderToDelete, setFolderToDelete] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.folder-menu-wrapper')) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim());
      setNewFolderName('');
      setIsModalOpen(false);
    }
  };

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleStartRename = (e, folder) => {
    e.stopPropagation();
    setRenamingFolderId(folder.id);
    setRenameValue(folder.name);
    setActiveMenuId(null);
  };

  const submitRename = (e, id) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (renameValue.trim()) {
      renameFolder(id, renameValue.trim());
    }
    setRenamingFolderId(null);
  };

  const handleDeleteClick = (e, folder) => {
    e.stopPropagation();
    setFolderToDelete(folder);
    setActiveMenuId(null);
  };

  const confirmDelete = () => {
    if (folderToDelete) {
      deleteFolder(folderToDelete.id);
      setFolderToDelete(null);
    }
  };

  const handleFolderClick = (id) => {
    navigate(`/folders/${id}`);
  };

  const filteredFolders = folders.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main folders-main">
        
        <header className="folders-header">
          <div>
            <h1 className="folders-title">Folders</h1>
            <p className="folders-subtitle">Organise candidates your way</p>
          </div>
          <button className="btn-new-folder" onClick={() => setIsModalOpen(true)}>
            <FolderPlus size={18} /> New Folder
          </button>
        </header>

        {folders.length > 0 && (
          <div className="folders-search-container">
            <Search className="folders-search-icon" size={18} />
            <input
              type="text"
              className="folders-search-input"
              placeholder="Search folders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {folders.length === 0 ? (
          <div className="empty-folders-state">
            <FolderIcon size={64} className="empty-folder-icon" />
            <h3 className="empty-title">No folders yet</h3>
            <p className="empty-subtitle">Create your first folder to start organising candidates</p>
            <button className="btn-create-teal" onClick={() => setIsModalOpen(true)}>
              Create Folder
            </button>
          </div>
        ) : filteredFolders.length === 0 ? (
          <div className="empty-search-state">
            No folders found for '{searchTerm}'
          </div>
        ) : (
          <div className="folders-grid">
            {filteredFolders.map(folder => (
              <div key={folder.id} className="folder-card" onClick={() => handleFolderClick(folder.id)}>
                <div className="folder-card-header">
                  <FolderIcon size={40} className="folder-card-icon" />
                  <div className="folder-menu-wrapper">
                    <button className="btn-menu" onClick={(e) => toggleMenu(e, folder.id)}>
                      <MoreVertical size={20} />
                    </button>
                    {activeMenuId === folder.id && (
                      <div className="folder-dropdown-menu">
                        <button className="dropdown-item" onClick={(e) => handleStartRename(e, folder)}>
                          Rename
                        </button>
                        <button className="dropdown-item-danger" onClick={(e) => handleDeleteClick(e, folder)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="folder-card-body">
                  {renamingFolderId === folder.id ? (
                    <form onSubmit={(e) => submitRename(e, folder.id)}>
                      <input 
                        type="text" 
                        className="folder-rename-input"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        onBlur={(e) => submitRename(e, folder.id)}
                      />
                    </form>
                  ) : (
                    <h3 className="folder-name">{folder.name}</h3>
                  )}
                  <p className="folder-count">{folder.candidateIds.length} candidates</p>
                </div>
                <div className="folder-card-footer">
                  <span className="folder-date">Created {folder.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Create New Folder</h2>
                <button className="btn-close" onClick={() => setIsModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreate}>
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

        {folderToDelete && (
          <div className="modal-overlay">
            <div className="modal-content delete-modal">
              <div className="modal-body" style={{ textAlign: 'center', marginTop: '10px', marginBottom: '20px' }}>
                <h2 style={{ color: 'white', marginBottom: '10px', fontSize: '1.25rem', fontWeight: '700' }}>Delete Folder?</h2>
                <p style={{ color: '#888', fontSize: '0.9375rem' }}>Are you sure you want to delete {folderToDelete.name}? This cannot be undone.</p>
              </div>
              <div className="modal-actions" style={{ justifyContent: 'center' }}>
                <button className="btn-cancel" onClick={() => setFolderToDelete(null)}>Cancel</button>
                <button className="btn-create" style={{ backgroundColor: '#ef4444', color: 'white' }} onClick={confirmDelete}>Confirm</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
