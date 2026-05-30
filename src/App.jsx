import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { Dashboard } from './pages/Dashboard';
import { UploadResume } from './pages/UploadResume';
import { MyCandidates } from './pages/MyCandidates';
import { Settings } from './pages/Settings';
import { Folders } from './pages/Folders';
import { FolderView } from './pages/FolderView';
import { Storage } from './pages/Storage';
import { CandidateProfile } from './pages/CandidateProfile';
import { Home } from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';



function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/candidates" element={<ProtectedRoute><MyCandidates /></ProtectedRoute>} />
          <Route path="/candidates/:id" element={<ProtectedRoute><CandidateProfile /></ProtectedRoute>} />
          <Route path="/folders" element={<ProtectedRoute><Folders /></ProtectedRoute>} />
          <Route path="/folders/:id" element={<ProtectedRoute><FolderView /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><UploadResume /></ProtectedRoute>} />
          <Route path="/storage" element={<ProtectedRoute><Storage /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
