import React, { useState } from 'react';
import JobSeekerSidebar from '../components/JobSeekerSidebar';
import JobSeekerNavbar from '../components/JobSeekerNavbar';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign,
  Building2,
  Clock
} from 'lucide-react';

const JobSeeker = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechFlow Systems',
      location: 'Remote',
      salary: '$120k - $160k',
      type: 'Full-time',
      posted: '2 hours ago',
      logo: 'TF'
    },
    {
      id: 2,
      title: 'Product Designer',
      company: 'Nexus Creative',
      location: 'San Francisco, CA',
      salary: '$110k - $145k',
      type: 'Full-time',
      posted: '5 hours ago',
      logo: 'NX'
    },
    {
      id: 3,
      title: 'Backend Engineer (Node.js)',
      company: 'DataStream AI',
      location: 'New York, NY',
      salary: '$130k - $170k',
      type: 'Contract',
      posted: 'Yesterday',
      logo: 'DS'
    },
    {
      id: 4,
      title: 'UX Researcher',
      company: 'UserFirst Corp',
      location: 'Austin, TX',
      salary: '$95k - $130k',
      type: 'Full-time',
      posted: '2 days ago',
      logo: 'UF'
    }
  ];

  return (
    <div className="dashboard-layout">
      <JobSeekerSidebar />
      
      <main className="dashboard-main" style={{ 
        padding: '24px 48px'
      }}>
        <JobSeekerNavbar />

        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', fontWeight: 800, color: 'white' }}>Find Your Dream Job</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Browse through high-impact roles at global unicorns and tech giants.</p>
        </div>

        {/* Search & Filter Section */}
        <div className="card" style={{ padding: '32px', marginBottom: '40px' }}>
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <Search size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search by job title, company, skill..." 
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '56px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#a78bfa' }} />
              <input type="text" placeholder="Location" className="form-input" style={{ paddingLeft: '44px' }} />
            </div>
            <div style={{ position: 'relative' }}>
              <Briefcase size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#a78bfa' }} />
              <select className="form-input" style={{ paddingLeft: '44px', appearance: 'none' }}>
                <option>Job Type</option>
                <option>Full-time</option>
                <option>Contract</option>
                <option>Remote</option>
              </select>
            </div>
            <div style={{ position: 'relative' }}>
              <DollarSign size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#a78bfa' }} />
              <input type="text" placeholder="Salary Range" className="form-input" style={{ paddingLeft: '44px' }} />
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {jobs.map(job => (
            <div key={job.id} className="card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '16px', 
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#a78bfa',
                  border: '1px solid var(--glass-border)'
                }}>
                  {job.logo}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>{job.title}</h3>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Building2 size={16} /> {job.company}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> {job.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><DollarSign size={16} /> {job.salary}</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                  <Clock size={14} /> {job.posted}
                </span>
                <button className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.95rem' }}>
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default JobSeeker;
