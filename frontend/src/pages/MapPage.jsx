import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import SourcingMap from '../components/SourcingMap';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, Users, Filter } from 'lucide-react';

const MapPage = () => {
  const [viewType, setViewType] = useState('jobs'); // 'jobs' or 'companies'
  const [searchPos, setSearchPos] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Nominatim requires a User-Agent or it may block requests
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'HrAi-Recruitment-App'
        }
      });
      
      if (!response.ok) throw new Error('Search service unreachable');
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        // Slightly randomize or offset if it's the same to force a re-trigger if needed
        setSearchPos([parseFloat(lat), parseFloat(lon)]);
        console.log("Found location:", data[0].display_name);
      } else {
        alert("We couldn't find that location. Try adding a city or country name.");
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Search is temporarily unavailable. Please try again in a moment.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocateMe = () => {
    if ("geolocation" in navigator) {
      setIsSearching(true);
      navigator.geolocation.getCurrentPosition((position) => {
        setSearchPos([position.coords.latitude, position.coords.longitude]);
        setIsSearching(false);
      }, (error) => {
        console.error("Geolocation error:", error);
        alert("Could not find your location. Please check your browser permissions.");
        setIsSearching(false);
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <div style={{ flex: 1, display: 'flex', paddingTop: '100px' }}>
        {/* Sidebar */}
        <aside style={{
          width: '400px',
          padding: '24px',
          borderRight: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          zIndex: 10
        }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Live Sourcing Map</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Real-time visualization of global recruitment activity.
            </p>
          </div>

          {/* Toggle */}
          <div className="glass" style={{
            display: 'flex',
            padding: '4px',
            borderRadius: '12px',
            gap: '4px'
          }}>
            <button
              onClick={() => setViewType('jobs')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: viewType === 'jobs' ? 'var(--gradient-main)' : 'transparent',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Briefcase size={18} /> Find Jobs
            </button>
            <button
              onClick={() => setViewType('companies')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: viewType === 'companies' ? 'var(--gradient-main)' : 'transparent',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Users size={18} /> Find Talent
            </button>
          </div>

          {/* Search & Filters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <form onSubmit={handleSearch} style={{ position: 'relative' }}>
              <Search size={18} style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: isSearching ? 'var(--accent-primary)' : 'var(--text-secondary)' 
              }} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city (e.g. Nasik, India)" 
                className="glass"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  borderRadius: '10px',
                  color: 'white',
                  border: '1px solid var(--glass-border)',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
              {searchQuery && (
                <button 
                  type="submit"
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'var(--gradient-main)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  GO
                </button>
              )}
            </form>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={handleLocateMe}
                className="glass" 
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: '10px',
                  color: 'white',
                  cursor: 'pointer',
                  border: '1px solid var(--glass-border)',
                  fontWeight: 500
                }}
              >
                <MapPin size={18} color="var(--accent-primary)" /> Locate Me
              </button>
              <button className="glass" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px',
                borderRadius: '10px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                border: '1px solid var(--glass-border)'
              }}>
                <Filter size={18} />
              </button>
            </div>
          </div>

          {/* Activity List */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Trending Zones
            </h3>
            {[
              { city: 'Mumbai', activity: 'High', color: '#3b82f6', pos: [19.0760, 72.8777] },
              { city: 'Bangalore', activity: 'High', color: '#3b82f6', pos: [12.9716, 77.5946] },
              { city: 'Delhi NCR', activity: 'Growing', color: '#10b981', pos: [28.6139, 77.2090] },
              { city: 'Pune', activity: 'Medium', color: '#8b5cf6', pos: [18.5204, 73.8567] },
              { city: 'Hyderabad', activity: 'Growing', color: '#10b981', pos: [17.3850, 78.4867] }
            ].map((zone, i) => (
              <div 
                key={i} 
                className="glass" 
                onClick={() => setSearchPos(zone.pos)}
                style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MapPin size={20} color={zone.color} />
                  <span>{zone.city}</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: zone.color, fontWeight: 700 }}>{zone.activity}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Map Container */}
        <main style={{ flex: 1, position: 'relative', padding: '24px' }}>
          <SourcingMap viewType={viewType} searchPos={searchPos} />
          
          {/* Overlay Stats */}
          <div style={{
            position: 'absolute',
            bottom: '48px',
            right: '48px',
            display: 'flex',
            gap: '16px',
            zIndex: 1000
          }}>
            <div className="glass" style={{ padding: '16px 24px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Live Jobs</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>12,842</div>
            </div>
            <div className="glass" style={{ padding: '16px 24px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Active Talent</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>45,210</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MapPage;
