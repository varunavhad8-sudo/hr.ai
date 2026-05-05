import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import GetStarted from './pages/GetStarted'
import MapPage from './pages/MapPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
