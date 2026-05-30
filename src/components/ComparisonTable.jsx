import { useEffect, useRef } from 'react';
import './ComparisonTable.css';

export function ComparisonTable() {
  const sectionRef = useRef(null);

  const comparisonData = [
    {
      feature: "Resume Parsing Speed",
      sheets: "Manual (10-15 mins per file)",
      competitors: "Slow (30s - 1 min queues)",
      hrai: "< 2 seconds (Instant queues)",
      isPositive: true
    },
    {
      feature: "Auto-Tag Accuracy",
      sheets: "0% (No auto-tagging)",
      competitors: "Moderate (70-75% accuracy)",
      hrai: "98.6% (Top-tier auto-tagging)",
      isPositive: true
    },
    {
      feature: "Search Intelligence",
      sheets: "Ctrl + F (Keyword matches only)",
      competitors: "Exact keyword matching",
      hrai: "Semantic AI Search (Synonyms & Roles)",
      isPositive: true
    },
    {
      feature: "Data Ownership",
      sheets: "100% Private (local computer files)",
      competitors: "Vendor Locked (difficult exports)",
      hrai: "100% Private Ownership (SQL raw export)",
      isPositive: true
    }
  ];

  // SVG Animated checkmark component
  const Checkmark = () => (
    <svg className="checkmark-svg" viewBox="0 0 24 24" width="20" height="20">
      <path
        d="M4 12 L9 17 L20 6"
        stroke="#ffffff"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="checkmark-path"
      />
    </svg>
  );

  useEffect(() => {
    const gsap = window.gsap;
    if (!gsap) return;

    if (window.ScrollTrigger) {
      gsap.registerPlugin(window.ScrollTrigger);
    }

    // --- 1. PULSING HIGHLIGHT ON THE HR.ai COLUMN ---
    const hraiPulse = gsap.to('.col-hrai', {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderColor: 'rgba(255, 255, 255, 0.35)',
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    // --- 2. STAGGERED 3D ROW SLIDE-IN ENTRANCES ---
    const rows = sectionRef.current ? sectionRef.current.querySelectorAll('.comparison-row') : [];
    const rowTweens = [];

    rows.forEach((row) => {
      // Set initial offscreen rotated state
      gsap.set(row, { x: -100, rotationY: -10, opacity: 0 });

      const rTween = gsap.to(row, {
        x: 0,
        rotationY: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: row,
          start: 'top 85%',
          toggleActions: 'play none none reset'
        }
      });
      rowTweens.push(rTween);
    });

    // --- 3. STAGGERED CHECKMARK SVG DRAW ON VIEWPORT ENTRY ---
    const paths = sectionRef.current ? sectionRef.current.querySelectorAll('.checkmark-path') : [];
    const checkmarkTweens = [];

    paths.forEach((path) => {
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;

      const cTween = gsap.to(path, {
        strokeDashoffset: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: path,
          start: 'top 85%',
          toggleActions: 'play none none reset'
        }
      });
      checkmarkTweens.push(cTween);
    });

    // --- CLEANUP TIMELINES ON UNMOUNT ---
    return () => {
      hraiPulse.kill();
      
      rowTweens.forEach((t) => {
        if (t.scrollTrigger) t.scrollTrigger.kill();
        t.kill();
      });

      checkmarkTweens.forEach((t) => {
        if (t.scrollTrigger) t.scrollTrigger.kill();
        t.kill();
      });
    };
  }, []);

  return (
    <section className="comparison-section" ref={sectionRef}>
      <div className="container">
        <div className="comparison-header">
          <h2>Compare HR.ai with the alternatives</h2>
          <p>Traditional recruiters rely on static files or complex SaaS tools. Here is why HR.ai is the ultimate candidate workspace.</p>
        </div>

        <div className="comparison-table-container">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Capabilities</th>
                <th>Spreadsheets</th>
                <th>Traditional SaaS</th>
                <th className="col-hrai header-cell">HR.ai</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, i) => (
                <tr key={i} className="comparison-row">
                  <td>{row.feature}</td>
                  <td className="comparison-text-negative">{row.sheets}</td>
                  <td className="comparison-text-neutral">{row.competitors}</td>
                  <td className={`col-hrai ${i === comparisonData.length - 1 ? 'last-cell' : ''}`}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <Checkmark />
                      <span className="comparison-text-positive">{row.hrai}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
