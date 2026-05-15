import React from 'react';
import { motion } from 'framer-motion';
import { Search, Zap, BarChart3, PenTool, Globe, Layers } from 'lucide-react';

const features = [
  {
    icon: <Search className="text-accent-primary" />,
    title: "AI-Powered Sourcing",
    description: "Deep-search LinkedIn, Naukri, and Indeed simultaneously to find pre-matched talent that others miss."
  },
  {
    icon: <Zap className="text-accent-primary" />,
    title: "Instant Matching",
    description: "Our AI analyzes skill sets and cultural fit to deliver top-tier candidates in hours, not weeks."
  },
  {
    icon: <Globe className="text-accent-primary" />,
    title: "Automated Outreach",
    description: "Personalized, multi-channel candidate engagement that feels human but scales with AI efficiency."
  },
  {
    icon: <BarChart3 className="text-accent-primary" />,
    title: "Predictive Hiring",
    description: "Forecast candidate availability and salary expectations before you even start the interview process."
  },
  {
    icon: <PenTool className="text-accent-primary" />,
    title: "Verified Portfolios",
    description: "Auto-verify candidate experience and project portfolios through AI-driven validation checks."
  },
  {
    icon: <Layers className="text-accent-primary" />,
    title: "One-Click Sync",
    description: "Shortlist candidates and push them directly into your existing ATS (Lever, Greenhouse, etc.) instantly."
  }
];

const Features = () => {
  return (
    <section id="features" style={{ padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ fontSize: '3rem', marginBottom: '20px' }}
          >
            Everything you need to <span className="gradient-text">scale your team</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}
          >
            Hr.ai combines advanced machine learning with recruitment best practices to give your team an unfair advantage in the talent market.
          </motion.p>
        </div>

        <div className="grid-features">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass feature-card"
            >
              <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '12px', 
                background: 'rgba(59, 130, 246, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '24px',
                color: 'var(--accent-primary)'
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
