import React from 'react';
import Sidebar from '../components/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import StatCard from '../components/StatCard';
import JobItem from '../components/JobItem';
import CandidateCard from '../components/CandidateCard';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  Clock, 
  ArrowUpRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { 
      title: 'Active Jobs', 
      value: '3', 
      icon: <Briefcase size={20} />, 
      color: '#10b981',
      subtitle: '↑ 1 from last week',
      subtitleColor: 'teal',
      trendData: [2, 2, 2, 3, 2, 2, 3] 
    },
    { 
      title: 'Candidates Found', 
      value: '147', 
      icon: <Users size={20} />, 
      color: '#3b82f6',
      subtitle: '↑ 32 new today',
      subtitleColor: 'teal',
      trendData: [90, 105, 108, 115, 120, 140, 147] 
    },
    { 
      title: 'Interviews Scheduled', 
      value: '8', 
      icon: <Calendar size={20} />, 
      color: '#8b5cf6',
      subtitle: 'Next: Today 3pm',
      subtitleColor: 'amber',
      trendData: [2, 4, 3, 5, 4, 7, 8] 
    },
    { 
      title: 'Hours Saved', 
      value: '94h', 
      icon: <Clock size={20} />, 
      color: '#10b981',
      subtitle: 'vs doing it manually',
      subtitleColor: 'gray',
      trendData: [70, 75, 78, 82, 85, 90, 94] 
    },
  ];

  const jobs = [
    { title: 'Senior Product Designer', location: 'Remote', candidates: 48, status: 'Active' },
    { title: 'Full Stack Engineer', location: 'Bangalore, IN', candidates: 72, status: 'Active' },
    { title: 'Marketing Operations', location: 'San Francisco, CA', candidates: 27, status: 'Active' },
  ];

  const candidates = [
    { name: 'Arjun Mehta', role: 'Sr. Designer', exp: '8 yrs', source: 'LinkedIn', matchScore: '98%' },
    { name: 'Sarah Jenkins', role: 'Product Designer', exp: '5 yrs', source: 'Indeed', matchScore: '94%' },
    { name: 'Priya Ramesh', role: 'UI/UX Lead', exp: '10 yrs', source: 'Naukri', matchScore: '91%' },
    { name: 'Michael Chen', role: 'Design Systems', exp: '6 yrs', source: 'LinkedIn', matchScore: '89%' },
  ];

  const activities = [
    { text: '23 new candidates found for Sales Executive', time: '2 hours ago', type: 'match' },
    { text: 'Interview scheduled with Priya Ramesh', time: '4 hours ago', type: 'event' },
    { text: 'New job "Senior Product Designer" published', time: '6 hours ago', type: 'status' },
    { text: '5 candidates shortlisted for Full Stack Engineer', time: 'Yesterday', type: 'match' },
    { text: 'New message from Sarah Jenkins', time: '2 days ago', type: 'message' },
  ];

  const getActivityColor = (type) => {
    switch(type) {
      case 'match': return '#10b981';
      case 'event': return '#8b5cf6';
      case 'status': return '#10b981';
      case 'message': return '#06b6d4';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="dashboard-main" style={{ 
        padding: '24px 48px'
      }}>
        <DashboardNavbar />

        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: 800, color: 'white' }}>Good morning 👋</h1>
          <p style={{ color: 'var(--text-secondary)', fontWeight: '500', fontSize: '1.1rem' }}>
            Your recruitment engine is running at full capacity.
          </p>
        </div>

        <section className="stat-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '24px', 
          marginBottom: '32px' 
        }}>
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </section>

        {/* New AI Recommendations Section */}
        <section style={{ marginBottom: '48px' }}>
          <div className="card" style={{ 
            padding: '32px', 
            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute', 
              top: '-100px', 
              right: '-100px', 
              width: '300px', 
              height: '300px', 
              background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(0,0,0,0) 70%)',
              zIndex: 0
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '12px', 
                  background: 'rgba(16, 185, 129, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--emerald-green)'
                }}>
                  <Sparkles size={20} />
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>AI Recommendations</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.03)',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  border: '1px solid var(--glass-border)',
                  transition: 'transform 0.2s, background 0.2s',
                  cursor: 'pointer'
                }} className="hover-scale">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <ArrowRight size={18} color="var(--emerald-green)" />
                    <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'white' }}>
                      <span style={{ color: 'var(--emerald-green)' }}>Priya Ramesh</span> is a 94% match for Store Manager — contact her today
                    </span>
                  </div>
                  <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>View Profile</button>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.03)',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  border: '1px solid var(--glass-border)',
                  transition: 'transform 0.2s, background 0.2s',
                  cursor: 'pointer'
                }} className="hover-scale">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <ArrowRight size={18} color="var(--emerald-green)" />
                    <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'white' }}>
                      Your <span style={{ color: 'var(--emerald-green)' }}>Sales Executive</span> job has 72 candidates — 18 are unreviewed
                    </span>
                  </div>
                  <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Review Now</button>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.03)',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  border: '1px solid var(--glass-border)',
                  transition: 'transform 0.2s, background 0.2s',
                  cursor: 'pointer'
                }} className="hover-scale">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <ArrowRight size={18} color="var(--emerald-green)" />
                    <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'white' }}>
                      Interview with <span style={{ color: 'var(--emerald-green)' }}>Rohan Agarwal</span> is tomorrow at 10am — send reminder?
                    </span>
                  </div>
                  <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Send Reminder</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '32px', marginBottom: '40px' }}>
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>My Active Jobs</h2>
              <button style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--emerald-green)', 
                fontWeight: '700', 
                cursor: 'pointer',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>View all <ArrowUpRight size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {jobs.map((job, i) => (
                <JobItem key={i} {...job} />
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Top Matches Today</h2>
              <button style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--emerald-green)', 
                fontWeight: '700', 
                cursor: 'pointer',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>See all <ArrowUpRight size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {candidates.map((candidate, i) => (
                <CandidateCard key={i} {...candidate} />
              ))}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '32px', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '32px' }}>Recent Activity</h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {activities.map((activity, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '20px 0',
                borderBottom: i === activities.length - 1 ? 'none' : '1px solid var(--glass-border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: getActivityColor(activity.type),
                    boxShadow: `0 0 10px ${getActivityColor(activity.type)}`
                  }} />
                  <span style={{ fontWeight: '600', color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>{activity.text}</span>
                </div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
