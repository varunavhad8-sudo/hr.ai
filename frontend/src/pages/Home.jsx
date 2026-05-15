import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Pricing from '../components/Pricing'

const Home = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing />
      </main>
      <footer style={{
        padding: '60px 0',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        borderTop: '1px solid var(--glass-border)',
        marginTop: '100px'
      }}>
        <div className="container">
          <p>© 2026 Hr.ai - The Intelligent Talent Sourcing Engine</p>
        </div>
      </footer>
    </>
  )
}

export default Home
