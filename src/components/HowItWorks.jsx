import { useEffect, useRef } from 'react';
import './HowItWorks.css';

export function HowItWorks() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  const steps = [
    {
      title: "1. Upload Resume Library",
      description: "Drag and drop any resume format (PDF, DOCX, or images). Our automated ingestion queue processes files instantly with high accuracy.",
      icon: "📤"
    },
    {
      title: "2. Autonomous AI Parsing",
      description: "AI extracts skills, work experience histories, contact channels, and structures candidates into a standard schema automatically.",
      icon: "⚙️"
    },
    {
      title: "3. Semantic Search & Hire",
      description: "Perform rich natural-language searches by skills or locations, group candidates in structured folders, and ditch sheets forever.",
      icon: "🎯"
    }
  ];

  useEffect(() => {
    const gsap = window.gsap;
    if (!gsap) return;

    if (window.ScrollTrigger) {
      gsap.registerPlugin(window.ScrollTrigger);
    }

    const isMobile = window.innerWidth < 768;

    // --- 1. SVG PATH INITIALIZATION & SCROLL-DRAW SCRUB ---
    const desktopPath = document.querySelector('.connecting-path');
    const mobilePath = document.querySelector('.connecting-path-mobile');
    let desktopScrub = null;
    let mobileScrub = null;

    if (desktopPath) {
      const len = desktopPath.getTotalLength();
      desktopPath.style.strokeDasharray = len;
      desktopPath.style.strokeDashoffset = len;

      desktopScrub = gsap.to(desktopPath, {
        strokeDashoffset: 0,
        scrollTrigger: {
          trigger: '.how-steps-container',
          start: 'top 50%',
          end: 'bottom 60%',
          scrub: 1.0
        }
      });
    }

    if (mobilePath) {
      const len = mobilePath.getTotalLength();
      mobilePath.style.strokeDasharray = len;
      mobilePath.style.strokeDashoffset = len;

      mobileScrub = gsap.to(mobilePath, {
        strokeDashoffset: 0,
        scrollTrigger: {
          trigger: '.how-steps-container',
          start: 'top 35%',
          end: 'bottom 75%',
          scrub: 1.0
        }
      });
    }

    // --- 2. CARD 3D ENTRANCE & DIGIT COUNTING TIMELINES ---
    const cardTweens = [];
    const countTweens = [];

    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const numEl = card.querySelector('.step-number');

      // Initialize 3D pitch state
      gsap.set(card, { rotationX: 30, y: 70, opacity: 0 });

      // Animate 3D landing
      const cTween = gsap.to(card, {
        rotationX: 0,
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reset'
        }
      });
      cardTweens.push(cTween);

      // Digital counting animation
      if (numEl) {
        const counterObj = { val: 0 };
        const numTween = gsap.to(counterObj, {
          val: index + 1,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reset'
          },
          onUpdate: () => {
            numEl.textContent = `0${Math.round(counterObj.val)}`;
          }
        });
        countTweens.push(numTween);
      }
    });

    // --- 3. GENTLE FLOATING BOUNCE FOR ICONS ---
    const iconContainers = document.querySelectorAll('.step-icon-container');
    const iconTweens = [];

    iconContainers.forEach((icon, idx) => {
      const floatTween = gsap.to(icon, {
        y: -10,
        duration: 2 + idx * 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        overwrite: 'auto'
      });
      iconTweens.push(floatTween);
    });

    // --- 4. DESKTOP-ONLY VIEWPORT PINNING ---
    let pinTrigger = null;
    if (!isMobile && window.ScrollTrigger && sectionRef.current) {
      pinTrigger = window.ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 12%',
        end: '+=450px',
        pin: true,
        scrub: 1.0
      });
    }

    // --- CLEANUP MEMORY & PLUGINS ON UNMOUNT ---
    return () => {
      if (desktopScrub && desktopScrub.scrollTrigger) desktopScrub.scrollTrigger.kill();
      if (desktopScrub) desktopScrub.kill();
      
      if (mobileScrub && mobileScrub.scrollTrigger) mobileScrub.scrollTrigger.kill();
      if (mobileScrub) mobileScrub.kill();

      cardTweens.forEach((t) => {
        if (t.scrollTrigger) t.scrollTrigger.kill();
        t.kill();
      });

      countTweens.forEach((t) => {
        if (t.scrollTrigger) t.scrollTrigger.kill();
        t.kill();
      });

      iconTweens.forEach((t) => t.kill());

      if (pinTrigger) pinTrigger.kill();
    };
  }, []);

  // --- 5. 3D HOVER BREATH & SHADOW GLOWS ---
  const handleMouseEnter = (event) => {
    const gsap = window.gsap;
    if (!gsap) return;
    gsap.to(event.currentTarget, {
      scale: 1.02,
      z: 15,
      rotateX: 2.5,
      borderColor: 'rgba(255, 255, 255, 0.25)',
      boxShadow: '0 20px 45px rgba(255, 255, 255, 0.05), 0 10px 25px rgba(0,0,0,0.35)',
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  };

  const handleMouseLeave = (event) => {
    const gsap = window.gsap;
    if (!gsap) return;
    gsap.to(event.currentTarget, {
      scale: 1.0,
      z: 0,
      rotateX: 0,
      borderColor: 'var(--border-color)',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.25)',
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  };

  return (
    <section className="how-section" ref={sectionRef}>
      <div className="container">
        <div className="how-header">
          <h2>Simple, autonomous recruiting</h2>
          <p>Ditch manual databases. We automate the boring data keying processes so you can focus entirely on interviews and building relationships.</p>
        </div>

        <div className="how-container" ref={containerRef}>
          {/* Serpentine Connecting path for Desktop */}
          <svg className="connecting-line-svg-desktop" viewBox="0 0 1040 100" fill="none" preserveAspectRatio="none">
            <path
              d="M 160 50 Q 340 105 520 50 T 880 50"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M 160 50 Q 340 105 520 50 T 880 50"
              stroke="#ffffff"
              strokeWidth="4"
              fill="none"
              className="connecting-path"
            />
          </svg>

          {/* Straight Connecting path for Mobile */}
          <svg className="connecting-line-svg-mobile" viewBox="0 0 10 700" fill="none" preserveAspectRatio="none">
            <path
              d="M 5 20 L 5 680"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M 5 20 L 5 680"
              stroke="#ffffff"
              strokeWidth="4"
              fill="none"
              className="connecting-path-mobile"
            />
          </svg>

          <div className="how-steps-container">
            {steps.map((step, index) => (
              <div
                key={index}
                className="step-card"
                ref={el => cardsRef.current[index] = el}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Big counting step number in back */}
                <div className="step-number-container">
                  <span className="step-number">00</span>
                </div>

                {/* Y-axis rotating 3D emoji */}
                <div className="step-icon-container">
                  <span className="step-icon">{step.icon}</span>
                </div>

                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
