import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import { 
  Search, 
  Send, 
  Paperclip,
  Smile,
  ExternalLink
} from 'lucide-react';

const Messages = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [messageText, setMessageText] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Priya Ramesh',
      role: 'Store Manager',
      source: 'Naukri',
      sourceColor: '#ef4444',
      initials: 'PR',
      lastMessage: 'Looking forward to the interview tomorrow',
      time: '2 min ago',
      unread: 1,
      type: 'Candidate'
    },
    {
      id: 2,
      name: 'Karan Sharma',
      role: 'Frontend Developer',
      source: 'LinkedIn',
      sourceColor: '#0077b5',
      initials: 'KS',
      lastMessage: 'Thank you for the opportunity',
      time: '1 hr ago',
      unread: 0,
      type: 'Candidate'
    },
    {
      id: 3,
      name: 'HR Team – Acme',
      role: 'Internal',
      source: 'Internal',
      sourceColor: '#10b981',
      initials: 'HR',
      lastMessage: 'Interview confirmed for Friday',
      time: '3 hrs ago',
      unread: 3,
      type: 'HR Team'
    },
    {
      id: 4,
      name: 'Meena Shetty',
      role: 'Product Designer',
      source: 'Indeed',
      sourceColor: '#8b5cf6',
      initials: 'MS',
      lastMessage: 'Can we reschedule to Thursday?',
      time: 'Yesterday',
      unread: 0,
      type: 'Candidate'
    },
    {
      id: 5,
      name: 'Rohan Agarwal',
      role: 'Backend Engineer',
      source: 'LinkedIn',
      sourceColor: '#0077b5',
      initials: 'RA',
      lastMessage: 'I have sent my updated resume',
      time: '2 days ago',
      unread: 0,
      type: 'Candidate'
    }
  ];

  const chatHistory = [
    { text: 'Hi Priya, we reviewed your profile and would love to schedule an interview', sender: 'HR', isSender: true },
    { text: 'Thank you so much! I am available this week any day after 2pm', sender: 'Priya', isSender: false },
    { text: 'Perfect, how about tomorrow at 3pm?', sender: 'HR', isSender: true },
    { text: 'That works perfectly for me', sender: 'Priya', isSender: false },
    { text: 'Great! You will receive a calendar invite shortly', sender: 'HR', isSender: true },
  ];

  const quickReplies = ['Schedule Interview', 'Send Offer', 'Request Documents'];

  const filteredConversations = conversations.filter(conv => 
    activeTab === 'All' ? true : conv.type === activeTab
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main" style={{ padding: '24px 48px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <DashboardNavbar />
        
        <div style={{ 
          flex: 1, 
          display: 'grid', 
          gridTemplateColumns: '320px 1fr', 
          gap: '24px', 
          marginBottom: '24px',
          overflow: 'hidden'
        }}>
          {/* LEFT PANEL */}
          <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'rgba(15, 23, 42, 0.6)' }}>
            <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--glass-border)' }}>
              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                <input 
                  type="text" 
                  placeholder="Search conversations..." 
                  className="form-input" 
                  style={{ paddingLeft: '44px', background: 'rgba(255,255,255,0.03)', fontSize: '0.95rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {['All', 'Candidates', 'HR Team'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      flex: 1,
                      padding: '8px 4px',
                      background: activeTab === tab ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                      color: activeTab === tab ? 'var(--emerald-green)' : 'var(--text-secondary)',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
              {filteredConversations.map((conv, index) => (
                <div 
                  key={conv.id}
                  style={{ 
                    padding: '16px', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    gap: '14px', 
                    cursor: 'pointer',
                    background: index === 0 ? 'rgba(255,255,255,0.05)' : 'transparent',
                    borderLeft: index === 0 ? '3px solid var(--emerald-green)' : '3px solid transparent',
                    transition: 'all 0.2s',
                    marginBottom: '4px'
                  }}
                >
                  <div style={{ 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '50%', 
                    background: 'var(--gradient-main)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    flexShrink: 0
                  }}>
                    {conv.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.name}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', flexShrink: 0, marginLeft: '8px' }}>{conv.time}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ 
                        fontSize: '0.8rem', 
                        color: conv.unread > 0 ? 'white' : 'var(--text-secondary)', 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        fontWeight: conv.unread > 0 ? 600 : 400,
                        marginRight: '8px'
                      }}>
                        {conv.lastMessage}
                      </p>
                      {conv.unread > 0 && (
                        <div style={{ 
                          width: '18px', 
                          height: '18px', 
                          borderRadius: '50%', 
                          background: 'var(--emerald-green)', 
                          color: 'white', 
                          fontSize: '0.65rem', 
                          fontWeight: 800, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {conv.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'rgba(30, 41, 59, 0.4)' }}>
            {/* Top bar */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  background: 'var(--gradient-main)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '1.1rem'
                }}>
                  PR
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>Priya Ramesh</h3>
                    <span style={{ 
                      padding: '2px 8px', 
                      background: 'rgba(239, 68, 68, 0.1)', 
                      color: '#ef4444', 
                      borderRadius: '6px', 
                      fontSize: '0.7rem', 
                      fontWeight: 800,
                      border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}>
                      NAUKRI
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '2px' }}>Store Manager</p>
                </div>
              </div>
              <button style={{ 
                padding: '8px 16px', 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--glass-border)', 
                color: 'white', 
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}>
                View Profile <ExternalLink size={14} />
              </button>
            </div>

            {/* Message Bubbles Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ textAlign: 'center', margin: '16px 0 24px' }}>
                <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '6px 16px', borderRadius: '16px', color: 'var(--text-secondary)', fontWeight: 600 }}>Today, 2:15 PM</span>
              </div>
              
              {chatHistory.map((msg, i) => (
                <div key={i} style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: msg.isSender ? 'flex-end' : 'flex-start',
                  maxWidth: '100%'
                }}>
                  <div style={{ 
                    maxWidth: '65%', 
                    padding: '14px 20px', 
                    borderRadius: msg.isSender ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    background: msg.isSender ? 'var(--gradient-main)' : 'rgba(30, 41, 59, 0.8)',
                    color: 'white',
                    fontSize: '0.95rem',
                    fontWeight: 400,
                    lineHeight: 1.5,
                    boxShadow: msg.isSender ? '0 4px 12px rgba(16, 185, 129, 0.15)' : 'none',
                    border: msg.isSender ? 'none' : '1px solid var(--glass-border)'
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Replies & Bottom Input Area */}
            <div style={{ padding: '20px 24px', borderTop: '1px solid var(--glass-border)', background: 'rgba(15, 23, 42, 0.3)' }}>
              
              {/* Quick Replies */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                {quickReplies.map((reply, i) => (
                  <button key={i} style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid var(--emerald-green)',
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: 'var(--emerald-green)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}>
                    {reply}
                  </button>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={(e) => { e.preventDefault(); setMessageText(''); }} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <button type="button" style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
                  <Paperclip size={22} />
                </button>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input 
                    type="text" 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..." 
                    className="form-input" 
                    style={{ background: 'rgba(255,255,255,0.05)', paddingRight: '48px', height: '52px', fontSize: '1rem', border: '1px solid var(--glass-border)' }}
                  />
                  <button type="button" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <Smile size={20} />
                  </button>
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '14px', borderRadius: '12px', height: '52px', width: '52px', justifyContent: 'center' }}>
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Messages;
