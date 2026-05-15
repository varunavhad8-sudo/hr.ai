import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Search, 
  PlusSquare, 
  Briefcase, 
  Star, 
  MessageSquare, 
  Settings,
  Menu,
  X,
  Shield
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Find Candidates', path: '/find', icon: <Search size={20} /> },
    { name: 'Post a Job', path: '/post-job', icon: <PlusSquare size={20} /> },
    { name: 'My Jobs', path: '/jobs', icon: <Briefcase size={20} /> },
    { name: 'Saved Candidates', path: '/saved', icon: <Star size={20} /> },
    { name: 'Verification Center', path: '/verify', icon: <Shield size={20} /> },
    { name: 'Messages', path: '/messages', icon: <MessageSquare size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Menu Button */}
      <button 
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          zIndex: 1000,
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--emerald-green)',
          transition: 'var(--transition-smooth)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
        className="hover-scale"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(4px)',
                zIndex: 900
              }}
            />

            {/* Sidebar Content */}
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
              style={{
                width: '280px',
                backgroundColor: '#0d1117',
                borderRight: '1px solid var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                padding: '100px 24px 32px', // Extra top padding for the menu button
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                zIndex: 950,
                boxShadow: '20px 0 50px rgba(0,0,0,0.5)'
              }}
            >
              {/* User Avatar Circle with Initials at Top */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '50%', 
                  background: 'var(--gradient-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '800',
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                }}>
                  VM
                </div>
              </div>
              
              <nav style={{ flex: 1 }}>
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={closeSidebar}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      color: isActive ? 'var(--emerald-green)' : 'var(--text-secondary)',
                      backgroundColor: isActive ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                      fontWeight: isActive ? '700' : '500',
                      marginBottom: '8px',
                      transition: 'var(--transition-smooth)',
                      fontSize: '0.95rem'
                    })}
                  >
                    {link.icon}
                    {link.name}
                  </NavLink>
                ))}
              </nav>

              {/* Company Name and Pro Plan Badge at Bottom */}
              <div style={{ 
                marginTop: 'auto', 
                paddingTop: '24px', 
                borderTop: '1px solid var(--glass-border)'
              }}>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'white' }}>Acme Inc.</div>
                <div style={{ 
                  fontSize: '0.65rem', 
                  color: 'var(--emerald-green)', 
                  fontWeight: '900',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  padding: '2px 10px',
                  borderRadius: '6px',
                  display: 'inline-block',
                  marginTop: '6px',
                  letterSpacing: '0.05em'
                }}>
                  PRO PLAN
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
