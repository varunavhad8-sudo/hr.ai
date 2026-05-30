import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from './config';
import getAuthToken from './utils/getAuthToken';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'light';
  });

  const [currentUser, setCurrentUserRaw] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Use this everywhere so setting a user always marks loading as done
  const setCurrentUser = (user) => {
    setCurrentUserRaw(user);
    setIsLoadingUser(false);
  };

  const fetchCurrentUser = async () => {
    setIsLoadingUser(true);
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('[AppContext] CURRENT USER SET:', data.user);
        setCurrentUserRaw(data.user);
      } else {
        setCurrentUserRaw(null);
      }
    } catch (err) {
      console.warn('[AppContext] Failed to fetch current user:', err.message);
      setCurrentUserRaw(null);
    } finally {
      setIsLoadingUser(false);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    saved: 0
  });

  // Global Candidates State
  const initialCandidates = [
    { id: 1, name: 'Rahul Sharma', email: 'rahul.s@example.com', role: 'Senior Frontend Engineer', company: 'TechFlow India', experience: '5 years', skills: ['React', 'TypeScript', 'Next.js', 'Tailwind'], status: 'Shortlisted', addedOn: 'Oct 24, 2023', addedDaysAgo: '2 days ago' },
    { id: 2, name: 'Priya Patel', email: 'priya.p@example.com', role: 'Product Designer', company: 'DesignHub', experience: '4 years', skills: ['Figma', 'UI/UX', 'Prototyping'], status: 'In Review', addedOn: 'Oct 22, 2023', addedDaysAgo: '4 days ago' },
    { id: 3, name: 'Amit Desai', email: 'amit.d@example.com', role: 'Backend Developer', company: 'CloudScale', experience: '3 years', skills: ['Node.js', 'Express', 'MongoDB', 'AWS'], status: 'On Hold', addedOn: 'Oct 20, 2023', addedDaysAgo: '6 days ago' },
    { id: 4, name: 'Neha Singh', email: 'neha.s@example.com', role: 'Marketing Manager', company: 'GrowthX', experience: '6 years', skills: ['SEO', 'Content', 'Analytics'], status: 'Rejected', addedOn: 'Oct 15, 2023', addedDaysAgo: '11 days ago' },
    { id: 5, name: 'Vikram Gupta', email: 'vikram.g@example.com', role: 'DevOps Engineer', company: 'InfraTech', experience: '7 years', skills: ['Docker', 'Kubernetes', 'CI/CD', 'Linux'], status: 'Shortlisted', addedOn: 'Oct 10, 2023', addedDaysAgo: '16 days ago' },
    { id: 6, name: 'Sneha Reddy', email: 'sneha.r@example.com', role: 'Data Scientist', company: 'AI Solutions', experience: '4 years', skills: ['Python', 'Machine Learning', 'SQL'], status: 'In Review', addedOn: 'Oct 05, 2023', addedDaysAgo: '21 days ago' },
    { id: 7, name: 'Rajesh Kumar', email: 'rajesh.k@example.com', role: 'Full Stack Developer', company: 'WebTech', experience: '6 years', skills: ['React', 'Node.js', 'MongoDB'], status: 'Shortlisted', addedOn: 'Oct 01, 2023', addedDaysAgo: '25 days ago' },
    { id: 8, name: 'Anita Desai', email: 'anita.d@example.com', role: 'UX Researcher', company: 'CreativeMinds', experience: '5 years', skills: ['User Research', 'Usability Testing'], status: 'In Review', addedOn: 'Sep 28, 2023', addedDaysAgo: '28 days ago' },
    { id: 9, name: 'Karan Singh', email: 'karan.s@example.com', role: 'QA Engineer', company: 'QualityFirst', experience: '3 years', skills: ['Selenium', 'Cypress', 'Jest'], status: 'On Hold', addedOn: 'Sep 25, 2023', addedDaysAgo: '31 days ago' },
    { id: 10, name: 'Pooja Verma', email: 'pooja.v@example.com', role: 'Product Manager', company: 'Innovate', experience: '8 years', skills: ['Agile', 'Scrum', 'Jira'], status: 'Rejected', addedOn: 'Sep 20, 2023', addedDaysAgo: '36 days ago' },
    { id: 11, name: 'Sanjay Gupta', email: 'sanjay.g@example.com', role: 'System Administrator', company: 'ITCorp', experience: '10 years', skills: ['Linux', 'Windows Server', 'Networking'], status: 'Shortlisted', addedOn: 'Sep 15, 2023', addedDaysAgo: '41 days ago' },
    { id: 12, name: 'Meera Reddy', email: 'meera.r@example.com', role: 'Data Analyst', company: 'DataInsights', experience: '2 years', skills: ['Excel', 'SQL', 'Tableau'], status: 'In Review', addedOn: 'Sep 10, 2023', addedDaysAgo: '46 days ago' },
    { id: 13, name: 'Suresh Patel', email: 'suresh.p@example.com', role: 'Mobile Developer', company: 'AppWorks', experience: '4 years', skills: ['React Native', 'iOS', 'Android'], status: 'Shortlisted', addedOn: 'Sep 05, 2023', addedDaysAgo: '51 days ago' },
    { id: 14, name: 'Divya Sharma', email: 'divya.s@example.com', role: 'HR Manager', company: 'PeopleFirst', experience: '7 years', skills: ['Recruitment', 'Employee Relations'], status: 'On Hold', addedOn: 'Sep 01, 2023', addedDaysAgo: '55 days ago' }
  ].sort((a, b) => new Date(b.addedOn) - new Date(a.addedOn));

  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Global Folders State
  const [folders, setFolders] = useState([]);

  // Load candidates from the backend
  const loadCandidates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/candidates`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 401) {
        window.location.href = '/signin';
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to retrieve candidates from backend');
      }
      const data = await response.json();
      const loaded = (data.candidates || []).map(c => {
        const addedDate = new Date(c.createdAt || Date.now());
        const daysAgo = Math.floor((Date.now() - addedDate) / (1000 * 60 * 60 * 24));
        return {
          ...c,
          id: c._id, // Map MongoDB string ObjectId as id
          role: c.current_role || c.role || 'Candidate',
          company: c.company || 'Direct Upload',
          experience: c.experience_years ? `${c.experience_years} years` : (c.experience || '0 years'),
          addedOn: addedDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          addedDaysAgo: daysAgo === 0 ? 'Today' : daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`,
          status: c.status || 'In Review'
        };
      });
      setCandidates(loaded);
      setStats({
        total: loaded.length,
        thisMonth: loaded.filter(c => {
          const addedDate = new Date(c.createdAt || Date.now());
          return addedDate.getMonth() === new Date().getMonth();
        }).length,
        saved: loaded.length
      });
    } catch (err) {
      console.warn('[AppContext] Candidate loading failed:', err.message);
      setError(err.message);
      if (err.message === 'Not authenticated') {
        const path = window.location.pathname;
        if (path !== '/signin' && path !== '/signup' && path !== '/') {
          window.location.href = '/signin';
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  // Delete candidate action
  const deleteCandidateFromDb = async (id) => {
    setIsLoading(true);
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/candidates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 401) {
        window.location.href = '/signin';
        return false;
      }
      if (response.ok) {
        setCandidates(prev => prev.filter(c => c._id !== id && c.id !== id));
        setStats(prev => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
          saved: Math.max(0, prev.saved - 1)
        }));
        return true;
      }
    } catch (err) {
      console.error('[AppContext] Failed to delete candidate from backend:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  // Update candidate details in backend
  const updateCandidateInDb = async (id, updatedFields) => {
    setIsLoading(true);
    try {
      // Map fields to backend schema
      const backendFields = { ...updatedFields };
      if (updatedFields.role !== undefined) backendFields.current_role = updatedFields.role;
      if (updatedFields.experience !== undefined) {
        const match = String(updatedFields.experience).match(/\d+/);
        backendFields.experience_years = match ? parseInt(match[0]) : 0;
      }

      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/candidates/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(backendFields),
      });

      if (response.status === 401) {
        window.location.href = '/signin';
        return false;
      }

      if (response.ok) {
        const data = await response.json();
        const updated = data.candidate;
        setCandidates(prev => prev.map(c => {
          if (c._id === id || c.id === id) {
            const addedDate = new Date(updated.createdAt || Date.now());
            const daysAgo = Math.floor((Date.now() - addedDate) / (1000 * 60 * 60 * 24));
            return {
              ...c,
              ...updated,
              id: updated._id,
              role: updated.current_role || updated.role || '',
              experience: updated.experience_years ? `${updated.experience_years} years` : (updated.experience || '0 years'),
              addedDaysAgo: daysAgo === 0 ? 'Today' : daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`,
            };
          }
          return c;
        }));
        return true;
      }
    } catch (err) {
      console.error('[AppContext] Failed to update candidate in backend:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  // Create candidate with resume in backend
  const createCandidateInDb = async (formData) => {
    setIsLoading(true);
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/candidates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData, // FormData automatically sets multipart/form-data boundary
      });

      if (response.status === 401) {
        window.location.href = '/signin';
        return null;
      }

      if (response.ok) {
        const data = await response.json();
        const created = data.candidate;
        const addedDate = new Date(created.createdAt || Date.now());
        const daysAgo = Math.floor((Date.now() - addedDate) / (1000 * 60 * 60 * 24));
        const newCandidate = {
          ...created,
          id: created._id,
          role: created.current_role || created.role || '',
          experience: created.experience_years ? `${created.experience_years} years` : (created.experience || '0 years'),
          addedDaysAgo: daysAgo === 0 ? 'Today' : daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`,
          addedOn: addedDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        };
        
        setCandidates(prev => [newCandidate, ...prev]);
        return newCandidate;
      } else {
        throw new Error('Failed to create candidate');
      }
    } catch (err) {
      console.error('[AppContext] Failed to create candidate in backend:', err.message);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const bulkImportCandidates = async (candidatesArray) => {
    setIsLoading(true);
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/candidates/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ candidates: candidatesArray }),
      });

      if (response.status === 401) {
        window.location.href = '/signin';
        return null;
      }

      if (response.ok) {
        const data = await response.json();
        await loadCandidates();
        return data;
      } else {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to bulk import candidates');
      }
    } catch (err) {
      console.error('[AppContext] Failed to bulk import:', err.message);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const incrementStats = () => {
    setStats(prev => ({
      total: prev.total + 1,
      thisMonth: prev.thisMonth + 1,
      saved: prev.saved + 1
    }));
  };

  const createFolder = (name) => {
    const newFolder = {
      id: Date.now(),
      name,
      candidateIds: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setFolders([...folders, newFolder]);
  };

  const deleteFolder = (id) => {
    setFolders(folders.filter(f => f.id !== id));
  };

  const renameFolder = (id, newName) => {
    setFolders(folders.map(f => f.id === id ? { ...f, name: newName } : f));
  };

  const addCandidateToFolder = (folderId, candidateId) => {
    setFolders(folders.map(f => {
      if (f.id === folderId) {
        if (!f.candidateIds.includes(candidateId)) {
          return { ...f, candidateIds: [...f.candidateIds, candidateId] };
        }
      }
      return f;
    }));
  };

  return (
    <AppContext.Provider value={{ 
      theme, setTheme,
      currentUser, setCurrentUser, fetchCurrentUser, isLoadingUser,
      stats, incrementStats, 
      candidates, setCandidates,
      isLoading, error,
      loadCandidates, deleteCandidateFromDb, updateCandidateInDb, createCandidateInDb, bulkImportCandidates,
      folders, createFolder, deleteFolder, renameFolder, addCandidateToFolder
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
