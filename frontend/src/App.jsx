import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import GetStarted from './pages/GetStarted'
import MapPage from './pages/MapPage'
import FindCandidates from './pages/FindCandidates'
import CandidateProfile from './pages/CandidateProfile'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import PostJob from './pages/PostJob'
import SavedCandidates from './pages/SavedCandidates'
import Settings from './pages/Settings'
import JobSeeker from './pages/JobSeeker'
import MyJobs from './pages/MyJobs'
import Messages from './pages/Messages'
import VerificationCenter from './pages/VerificationCenter'
import VerifyOTP from './pages/VerifyOTP'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/find" element={<FindCandidates />} />
          <Route path="/find-jobs" element={<FindCandidates />} />
          <Route path="/candidate/:id" element={<CandidateProfile />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/jobs" element={<MyJobs />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/saved" element={<SavedCandidates />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/job-seeker" element={<JobSeeker />} />
          <Route path="/verify" element={<VerificationCenter />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
