import React from 'react';
import Sidebar from '../components/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Users, 
  MoreVertical,
  Plus,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  const getStatusStyle = (status) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', dot: '#10b981' };
      case 'PAUSED':
        return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', dot: '#f59e0b' };
      case 'CLOSED':
        return { bg: 'rgba(148, 163, 184, 0.1)', color: '#94a3b8', dot: '#94a3b8' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.1)', color: '#94a3b8', dot: '#94a3b8' };
    }
  };

  const statusStyle = getStatusStyle(job.status);

  return (
    <div className="card" style={{ padding: '28px', marginBottom: '24px', transition: 'var(--transition-smooth)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'white', marginBottom: '8px' }}>{job.title}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Briefcase size={14} color="var(--accent-primary)" /> {job.type}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} color="var(--accent-primary)" /> {job.location}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="var(--accent-primary)" /> Experience: {job.experience}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            padding: '6px 14px', 
            borderRadius: '99px', 
            backgroundColor: statusStyle.bg, 
            color: statusStyle.color,
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: statusStyle.dot, boxShadow: `0 0 8px ${statusStyle.dot}` }} />
            {job.status}
          </div>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '20px', 
        padding: '20px 0', 
        borderTop: '1px solid var(--glass-border)', 
        borderBottom: '1px solid var(--glass-border)', 
        marginBottom: '24px' 
      }}>
        <div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '6px', fontWeight: 500 }}>Applicants</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{job.stats.applicants}</div>
        </div>
        <div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '6px', fontWeight: 500 }}>Shortlisted</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{job.stats.shortlisted}</div>
        </div>
        <div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '6px', fontWeight: 500 }}>Offers Sent</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{job.stats.offersSent}</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {job.platforms.map((platform, i) => (
            <span key={i} className={`source-badge badge-${platform.toLowerCase()}`} style={{ padding: '4px 10px', borderRadius: '6px' }}>
              {platform}
            </span>
          ))}
        </div>
        
        <div style={{ flex: 1, position: 'relative', height: '40px', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '100%', position: 'relative' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              position: 'relative', 
              zIndex: 1 
            }}>
              {['Applied', 'Screened', 'Shortlisted', 'Hired'].map((step, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    backgroundColor: i <= job.progress ? 'var(--accent-primary)' : '#1e293b',
                    border: '2px solid',
                    borderColor: i <= job.progress ? 'var(--accent-primary)' : 'var(--glass-border)',
                    boxShadow: i <= job.progress ? '0 0 12px var(--accent-primary)' : 'none',
                    transition: 'all 0.3s ease'
                  }} />
                  <span style={{ 
                    fontSize: '0.65rem', 
                    fontWeight: 600,
                    color: i <= job.progress ? 'white' : 'var(--text-secondary)',
                    transition: 'all 0.3s ease'
                  }}>{step}</span>
                </div>
              ))}
            </div>
            <div style={{ 
              position: 'absolute', 
              top: '6px', 
              left: '6px', 
              right: '6px', 
              height: '2px', 
              backgroundColor: 'rgba(255,255,255,0.05)',
              zIndex: 0
            }} />
            <div style={{ 
              position: 'absolute', 
              top: '6px', 
              left: '6px', 
              width: `${(job.progress / 3) * 98}%`, 
              height: '2px', 
              background: 'var(--gradient-main)',
              zIndex: 0,
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
          View Candidates <ExternalLink size={16} />
        </button>
        <button style={{ 
          padding: '10px 24px', 
          fontSize: '0.9rem', 
          background: 'rgba(255,255,255,0.03)', 
          border: '1px solid var(--glass-border)', 
          borderRadius: '10px',
          color: 'white',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'var(--transition-smooth)'
        }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
          {job.status === 'PAUSED' ? 'Resume Job' : 'Pause Job'}
        </button>
      </div>
    </div>
  );
};

const MyJobs = () => {
  const jobs = [
    {
      title: 'Store Manager – Bandra',
      type: 'Full-time',
      location: 'Mumbai',
      experience: '3-5 yrs',
      stats: { applicants: 54, shortlisted: 18, offersSent: 2 },
      platforms: ['Naukri', 'LinkedIn', 'Indeed'],
      status: 'ACTIVE',
      progress: 2
    },
    {
      title: 'Sales Executive – Pune',
      type: 'Full-time',
      location: 'Pune',
      experience: '1-3 yrs',
      stats: { applicants: 72, shortlisted: 24, offersSent: 1 },
      platforms: ['LinkedIn', 'Naukri'],
      status: 'ACTIVE',
      progress: 1
    },
    {
      title: 'Warehouse Supervisor',
      type: 'Full-time',
      location: 'Mumbai',
      experience: '3-5 yrs',
      stats: { applicants: 21, shortlisted: 6, offersSent: 0 },
      platforms: ['Indeed', 'Naukri'],
      status: 'PAUSED',
      progress: 1
    },
    {
      title: 'Marketing Manager',
      type: 'Full-time',
      location: 'Remote',
      experience: '5+ yrs',
      stats: { applicants: 103, shortlisted: 31, offersSent: 3 },
      platforms: ['LinkedIn', 'Indeed'],
      status: 'CLOSED',
      progress: 3
    }
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main" style={{ padding: '24px 48px' }}>
        <DashboardNavbar />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
          <div>
            <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'white', marginBottom: '8px', letterSpacing: '-0.03em' }}>My Jobs</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', fontWeight: 500 }}>All your active and past job postings</p>
          </div>
          <Link to="/post-job" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              <Plus size={20} strokeWidth={3} /> Post a New Job
            </button>
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '40px', borderBottom: '1px solid var(--glass-border)' }}>
          {['All Jobs', 'Active', 'Paused', 'Closed'].map((tab) => (
            <button key={tab} style={{ 
              background: 'none', 
              border: 'none', 
              padding: '16px 4px', 
              color: tab === 'Active' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              position: 'relative',
              transition: 'var(--transition-smooth)',
              borderBottom: tab === 'Active' ? '3px solid var(--accent-primary)' : '3px solid transparent'
            }}>{tab}</button>
          ))}
        </div>

        <div style={{ position: 'relative', marginBottom: '40px' }}>
          <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={22} />
          <input 
            type="text" 
            placeholder="Search by job title or location..." 
            className="form-input" 
            style={{ 
              paddingLeft: '60px', 
              background: 'rgba(255, 255, 255, 0.02)', 
              height: '56px',
              fontSize: '1.05rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {jobs.map((job, i) => (
            <JobCard key={i} job={job} />
          ))}
        </div>

        <div className="card" style={{ 
          padding: '60px 40px', 
          textAlign: 'center', 
          marginTop: '60px', 
          borderStyle: 'dashed',
          background: 'rgba(16, 185, 129, 0.02)',
          borderColor: 'rgba(16, 185, 129, 0.2)'
        }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '24px', 
            background: 'rgba(16, 185, 129, 0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 28px',
            transform: 'rotate(-5deg)'
          }}>
            <Briefcase size={40} color="var(--accent-primary)" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '16px', color: 'white' }}>Post your first job to start finding candidates</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '36px', maxWidth: '500px', margin: '0 auto 36px', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Reach thousands of potential candidates across LinkedIn, Naukri, and Indeed with just one click.
          </p>
          <Link to="/post-job" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '14px 40px', fontSize: '1.05rem' }}>Get Started Now</button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default MyJobs;
