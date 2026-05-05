import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Shield, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: "Starter",
    price: "0",
    description: "Perfect for exploring AI-powered sourcing.",
    features: ["14-Day Free Trial", "5 AI Sourcing Credits", "Basic Employer Branding", "Community Support"],
    icon: <Zap size={24} />,
    buttonText: "Start Trial",
    link: "/get-started"
  },
  {
    name: "Pro",
    price: "99",
    description: "For scaling teams that need more power.",
    features: ["Unlimited Trial Days", "100 AI Credits / month", "Advanced Branding AI", "Priority Email Support", "Predictive Analytics"],
    icon: <Shield size={24} />,
    buttonText: "Get Pro",
    link: "/get-started",
    recommended: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Custom solutions for global organizations.",
    features: ["Unlimited AI Credits", "Custom AI Model Training", "Dedicated Account Manager", "SSO & Security Suite", "API Access"],
    icon: <Crown size={24} />,
    buttonText: "Contact Sales",
    link: "/get-started"
  }
];

const Pricing = () => {
  return (
    <section id="solutions" className="container" style={{ paddingBottom: '120px' }}>
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '16px' }}>
          Simple, <span className="gradient-text">Transparent Credits</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Choose the plan that fits your hiring velocity. No hidden fees, just pure AI power.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '30px'
      }}>
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass"
            style={{
              padding: '48px 32px',
              position: 'relative',
              border: plan.recommended ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {plan.recommended && (
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--gradient-main)',
                padding: '4px 16px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'white'
              }}>
                MOST POPULAR
              </div>
            )}

            <div style={{ marginBottom: '32px' }}>
              <div style={{ color: 'var(--accent-primary)', marginBottom: '16px' }}>{plan.icon}</div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{plan.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{plan.description}</p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800 }}>${plan.price}</span>
                {plan.price !== "Custom" && <span style={{ color: 'var(--text-secondary)' }}>/mo</span>}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px', flex: 1 }}>
              {plan.features.map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Check size={18} color="var(--accent-primary)" />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{feature}</span>
                </div>
              ))}
            </div>

            <Link to={plan.link}>
              <button 
                className={plan.recommended ? "btn-primary" : "glass"} 
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  justifyContent: 'center',
                  background: plan.recommended ? 'var(--gradient-main)' : 'transparent',
                  color: 'white',
                  fontWeight: 600,
                  border: plan.recommended ? 'none' : '1px solid var(--glass-border)'
                }}
              >
                {plan.buttonText}
              </button>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
