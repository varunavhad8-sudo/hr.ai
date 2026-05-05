import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Hero />
        {/* Additional sections like Features, Testimonials, etc. will go here */}
      </main>
      <footer style={{
        padding: '40px 0',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        borderTop: '1px solid var(--glass-border)',
        marginTop: 'auto'
      }}>
        <div className="container">
          <p>© 2026 hr.ai - The Intelligent Recruitment Marketing Platform</p>
        </div>
      </footer>
    </div>
  )
}

export default App
