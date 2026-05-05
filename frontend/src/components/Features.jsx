import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, BarChart3, Users } from 'lucide-react';

const features = [
  {
    icon: <Zap size={24} />,
    title: "AI Candidate Matching",
    description: "Automatically score and rank candidates based on skill DNA and cultural fit with 98% accuracy."
  },
  {
    icon: <Target size={24} />,
    title: "Automated Branding",
    description: "AI-generated employer branding content that resonates with your target talent personas across all social channels."
  },
  {
    icon: <BarChart3 size={24} />,
    title: "Predictive Analytics",
    description: "Forecast your time-to-hire and sourcing costs before you even post the job opening."
  },
  {
    icon: <Users size={24} />,
    title: "Talent Pool CRM",
    description: "Nurture passive talent with automated, personalized outreach campaigns that feel human."
  }
];

const Features = () => {
  return (
    <section id="features" className="container">
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '16px' }}>
          Next-Gen <span className="gradient-text">Recruitment Arsenal</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
          Stop sourcing, start hiring. Our AI platform handles the marketing heavy lifting so you can focus on the people.
        </p>
      </div>

      <div className="grid-features">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass feature-card"
          >
            <div style={{
              background: 'var(--gradient-main)',
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              color: 'white'
            }}>
              {feature.icon}
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>{feature.title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
