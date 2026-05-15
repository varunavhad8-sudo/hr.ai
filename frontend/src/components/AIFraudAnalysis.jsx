import React from 'react';
import { 
  Shield, 
  Bot, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Activity
} from 'lucide-react';

const AIFraudAnalysis = ({ riskLevel = 'low' }) => {
  // Determine state based on riskLevel prop to make it reusable
  const isLowRisk = riskLevel === 'low';
  const isMediumRisk = riskLevel === 'medium';
  const isHighRisk = riskLevel === 'high';

  // Section 1: Consistency
  let consistencyIcon = <CheckCircle2 size={18} color="#10b981" />;
  let consistencyTitle = "CONSISTENT";
  let consistencyDesc = "All claims match across platforms";
  let consistencyBg = "rgba(16, 185, 129, 0.1)";
  let consistencyColor = "#10b981";

  if (isMediumRisk) {
    consistencyIcon = <AlertTriangle size={18} color="#f59e0b" />;
    consistencyTitle = "MINOR GAPS";
    consistencyDesc = "3 year gap in employment not explained";
    consistencyBg = "rgba(245, 158, 11, 0.1)";
    consistencyColor = "#f59e0b";
  } else if (isHighRisk) {
    consistencyIcon = <XCircle size={18} color="#ef4444" />;
    consistencyTitle = "INCONSISTENCY FOUND";
    consistencyDesc = "Claims 7 years experience but LinkedIn shows 4 years";
    consistencyBg = "rgba(239, 68, 68, 0.1)";
    consistencyColor = "#ef4444";
  }

  // Section 3: Duplicate
  let duplicateIcon = <CheckCircle2 size={18} color="#10b981" />;
  let duplicateText = "No duplicate profiles found across platforms";
  
  if (isHighRisk || isMediumRisk) {
    duplicateIcon = <AlertTriangle size={18} color="#f59e0b" />;
    duplicateText = "Similar profile found on Naukri with different experience claims";
  }

  // Section 4: Verdict
  let verdictColor = "#10b981"; // Green
  let verdictText = "LOW RISK — Safe to proceed";
  let verdictBg = "rgba(16, 185, 129, 0.1)";
  
  if (isMediumRisk) {
    verdictColor = "#f59e0b"; // Amber
    verdictText = "MEDIUM RISK — Verify manually";
    verdictBg = "rgba(245, 158, 11, 0.1)";
  } else if (isHighRisk) {
    verdictColor = "#ef4444"; // Red
    verdictText = "HIGH RISK — Proceed with caution";
    verdictBg = "rgba(239, 68, 68, 0.1)";
  }

  // Authenticity Score
  const authenticityScore = isLowRisk ? 96 : (isMediumRisk ? 74 : 42);

  return (
    <div className="card" style={{ 
      padding: '32px', 
      border: `1px solid ${verdictColor}40`,
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.5) 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glow based on risk */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '150px',
        height: '150px',
        background: verdictColor,
        opacity: 0.05,
        filter: 'blur(50px)',
        borderRadius: '50%'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '12px' }}>
          <Bot size={24} color="#2dd4bf" style={{ marginRight: '-8px', zIndex: 1 }} />
          <Shield size={24} color="#2dd4bf" />
        </div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>AI Fraud Analysis</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Section 1: Resume Consistency Check */}
        <div>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '12px' }}>
            1. Resume Consistency Check
          </h4>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>
            AI has compared resume claims with LinkedIn profile
          </p>
          <div style={{ 
            background: consistencyBg, 
            border: `1px solid ${consistencyColor}30`, 
            padding: '16px', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <div style={{ marginTop: '2px' }}>{consistencyIcon}</div>
            <div>
              <div style={{ color: consistencyColor, fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px' }}>{consistencyTitle}</div>
              <div style={{ color: 'white', fontSize: '0.9rem', fontWeight: 500 }}>{consistencyDesc}</div>
            </div>
          </div>
        </div>

        {/* Section 2: Profile Authenticity */}
        <div>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '16px' }}>
            2. Profile Authenticity
          </h4>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: 600 }}>Authenticity Score</span>
              <span style={{ fontSize: '0.85rem', color: '#2dd4bf', fontWeight: 800 }}>{authenticityScore}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${authenticityScore}%`, height: '100%', background: '#2dd4bf', borderRadius: '4px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'white', fontWeight: 500 }}>
              <CheckCircle2 size={16} color="#10b981" /> Profile photo verified as real person
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'white', fontWeight: 500 }}>
              <CheckCircle2 size={16} color="#10b981" /> Account age: 4 years <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>(older = trusted)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'white', fontWeight: 500 }}>
              <CheckCircle2 size={16} color="#10b981" /> Connection count: 340
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'white', fontWeight: 500 }}>
              <CheckCircle2 size={16} color="#10b981" /> Profile completeness: 87%
            </div>
          </div>
        </div>

        {/* Section 3: Duplicate Detection */}
        <div>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '12px' }}>
            3. Duplicate Detection
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: 'white', fontWeight: 600, background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            {duplicateIcon} {duplicateText}
          </div>
        </div>

        {/* Section 4: AI Verdict */}
        <div style={{ marginTop: '10px', borderTop: '1px solid var(--glass-border)', paddingTop: '32px' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '16px', textAlign: 'center' }}>
            4. Final Verdict
          </h4>
          <div style={{ 
            background: verdictBg,
            border: `2px solid ${verdictColor}50`,
            padding: '20px',
            borderRadius: '16px',
            textAlign: 'center',
            marginBottom: '16px',
            boxShadow: `0 10px 30px ${verdictColor}15`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: verdictColor, fontWeight: 900, fontSize: '1.2rem', letterSpacing: '0.05em' }}>
              <Activity size={24} /> {verdictText}
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            This analysis is AI-generated and should be used as a guide only.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AIFraudAnalysis;
