import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

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

  const [candidates, setCandidates] = useState(initialCandidates);

  // Global Folders State with sample folders and mapped candidates
  const [folders, setFolders] = useState([
    { id: 1, name: 'Python Developers', candidateIds: [6, 12, 3], createdAt: '2023-10-25' },
    { id: 2, name: 'Frontend Engineers', candidateIds: [1, 7], createdAt: '2023-10-26' },
    { id: 3, name: 'Marketing Team', candidateIds: [4], createdAt: '2023-10-27' },
    { id: 4, name: 'Data Scientists', candidateIds: [6, 12, 1, 8], createdAt: '2023-10-28' },
  ]);

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
      stats, incrementStats, 
      candidates, setCandidates,
      folders, createFolder, deleteFolder, renameFolder, addCandidateToFolder
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
