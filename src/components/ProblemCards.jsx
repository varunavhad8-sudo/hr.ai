import { useEffect, useRef } from 'react';
import './ProblemCards.css';

export function ProblemCards() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  const problems = [
    {
      title: "Scattered Resume Folders",
      description: "Candidates are lost in endless email threads, local download folders, and Slack channels. There is no single, secure source of truth.",
      icon: "📁"
    },
    {
      title: "Manual Recruiter Fatigue",
      description: "Recruiters waste hours copy-pasting names, skills, salaries, and phone numbers into fragile spreadsheets. Time is lost on administration.",
      icon: "⌛"
    },
    {
      title: "Keyword Search Blindness",
      description: "Simple exact-keyword matching fails to find the right talent. Semantic gaps and synonyms hide the perfect candidates from your search.",
      icon: "👓"
    }
  ];

  useEffect(() => {
    const gsap = window.gsap;
    if (!gsap) return;

    if (window.ScrollTrigger) {
      gsap.registerPlugin(window.ScrollTrigger);
    }

    // 1. Staggered 3D card flip entrance animation
    const innerCards = cardsRef.current.map(card => card ? card.querySelector('.card-3d-inner') : null).filter(Boolean);

    // Initialize rotation states to hidden Y backface
    gsap.set(innerCards, { rotationY: -180 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reset'
      }
    });

    tl.fromTo(innerCards,
      { rotationY: -180 },
      {
        rotationY: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out'
      }
    );

    // Cleanup triggers on unmount
    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  // 2. 3D Mouse Tilt Calculations (Interactive mirror rotation)
  const handleMouseMove = (event, index) => {
    const gsap = window.gsap;
    if (!gsap) return;

    const container = cardsRef.current[index];
    const inner = container ? container.querySelector('.card-3d-inner') : null;
    const front = container ? container.querySelector('.card-front') : null;
    if (!inner || !front) return;

    const rect = container.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Convert pixels to normalized values from -1 to 1
    const xPercent = (mouseX / rect.width) * 2 - 1;
    const yPercent = (mouseY / rect.height) * 2 - 1;

    // Map to rotation angles: max 15 degrees
    const maxTilt = 15;
    const rotX = -yPercent * maxTilt;
    const rotY = xPercent * maxTilt;

    // Apply rotation on inner element, and glow border/depth on front face
    gsap.to(inner, {
      rotateX: rotX,
      rotateY: rotY,
      z: 20,
      transformPerspective: 1200,
      duration: 0.15,
      ease: 'power1.out',
      overwrite: 'auto'
    });

    gsap.to(front, {
      borderColor: 'rgba(255, 255, 255, 0.35)',
      boxShadow: '0 20px 45px rgba(255, 255, 255, 0.08)',
      duration: 0.15,
      overwrite: 'auto'
    });
  };

  // 3. Elastic Return Easing on Mouse Leave
  const handleMouseLeave = (index) => {
    const gsap = window.gsap;
    if (!gsap) return;

    const container = cardsRef.current[index];
    const inner = container ? container.querySelector('.card-3d-inner') : null;
    const front = container ? container.querySelector('.card-front') : null;
    if (!inner || !front) return;

    // Spring cards back to completely flat using spring elastic ease
    gsap.to(inner, {
      rotateX: 0,
      rotateY: 0,
      z: 0,
      duration: 0.9,
      ease: 'elastic.out(1.0, 0.6)',
      overwrite: 'auto'
    });

    gsap.to(front, {
      borderColor: 'rgba(255, 255, 255, 0.08)',
      boxShadow: 'none',
      duration: 0.6,
      overwrite: 'auto'
    });
  };

  return (
    <section className="problem-section" ref={containerRef}>
      <div className="container">
        <div className="problem-header">
          <h2>Spreadsheets are not candidate databases</h2>
          <p>Scattered files, manually keying in fields, and forgotten talent pools are locking recruiter efficiency. Reclaim your hiring workflow.</p>
        </div>

        <div className="problem-grid">
          {problems.map((prob, i) => (
            <div
              key={i}
              className="card-3d-container"
              ref={el => cardsRef.current[i] = el}
              onMouseMove={(e) => handleMouseMove(e, i)}
              onMouseLeave={() => handleMouseLeave(i)}
            >
              <div className="card-3d-inner">
                {/* Back Face: revealed first on entrance */}
                <div className="card-back">
                  <div className="back-logo">
                    <span className="back-logo-text">HR.ai</span>
                    <span className="back-logo-dot"></span>
                  </div>
                </div>

                {/* Front Face: revealed post-flip */}
                <div className="card-front">
                  <div className="card-icon">{prob.icon}</div>
                  <h3>{prob.title}</h3>
                  <p>{prob.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
