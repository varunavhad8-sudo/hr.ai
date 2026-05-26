import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SignIn } from './pages/SignIn';
import { Dashboard } from './pages/Dashboard';
import { UploadResume } from './pages/UploadResume';
import { MyCandidates } from './pages/MyCandidates';
import { Settings } from './pages/Settings';
import { Folders } from './pages/Folders';
import { FolderView } from './pages/FolderView';
import { Storage } from './pages/Storage';
import { CandidateProfile } from './pages/CandidateProfile';
import './App.css';

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/candidates" element={<MyCandidates />} />
          <Route path="/candidates/:id" element={<CandidateProfile />} />
          <Route path="/folders" element={<Folders />} />
          <Route path="/folders/:id" element={<FolderView />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/upload" element={<UploadResume />} />
          <Route path="/storage" element={<Storage />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
