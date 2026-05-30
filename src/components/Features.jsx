import { useEffect, useRef } from 'react';
import './Features.css';

export function Features() {
  const sectionRef = useRef(null);
  const gridCanvasRef = useRef(null);

  const features = [
    {
      title: "AI Resume Parsing",
      description: "Upload any resume format. Our AI instantly extracts skills, experience, and contact details, eliminating manual data entry.",
      icon: "🤖",
      imagePlaceholder: "Resume Parsing Visualization"
    },
    {
      title: "Smart Candidate Search",
      description: "Find the exact candidate you need in seconds. Search your entire library by skills, location, or past experience.",
      icon: "🔍",
      imagePlaceholder: "Search Interface Visualization"
    },
    {
      title: "Your Data, Owned by You",
      description: "Unlike other platforms, your candidate data remains yours. No vendor lock-in, just a secure library of talent.",
      icon: "🔐",
      imagePlaceholder: "Data Security Visualization"
    }
  ];

  // Hover explosion particle burst from icon
  const triggerParticleBurst = (event) => {
    const gsap = window.gsap;
    if (!gsap) return;

    const row = event.currentTarget;
    const icon = row.querySelector('.feature-icon');
    if (!icon) return;

    // Create or select burst container
    let burstContainer = icon.querySelector('.burst-container');
    if (!burstContainer) {
      burstContainer = document.createElement('div');
      burstContainer.className = 'burst-container';
      icon.appendChild(burstContainer);
    }

    // Clear old elements
    burstContainer.innerHTML = '';

    const numDots = 8;
    const dots = [];
    for (let i = 0; i < numDots; i++) {
      const dot = document.createElement('div');
      dot.className = 'burst-dot';
      burstContainer.appendChild(dot);
      dots.push(dot);
    }

    // Polar coordinate explosive burst
    dots.forEach((dot, index) => {
      const angle = (index / numDots) * Math.PI * 2;
      const distance = 35 + Math.random() * 20;
      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance;

      gsap.fromTo(dot,
        { x: 0, y: 0, scale: 1, opacity: 1 },
        {
          x: targetX,
          y: targetY,
          scale: 0.1,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => {
            if (dot.parentNode) dot.parentNode.removeChild(dot);
          }
        }
      );
    });
  };

  // Card Mouse Tilt Calculations (tilt up to 12 degrees)
  const handleCardMouseMove = (event) => {
    const gsap = window.gsap;
    if (!gsap) return;

    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const xPercent = (mouseX / rect.width) * 2 - 1;
    const yPercent = (mouseY / rect.height) * 2 - 1;

    const maxTilt = 12;
    const rotX = -yPercent * maxTilt;
    const rotY = xPercent * maxTilt;

    gsap.to(card, {
      rotateX: rotX,
      rotateY: rotY,
      z: 15,
      transformPerspective: 1000,
      duration: 0.15,
      ease: 'power1.out',
      overwrite: 'auto'
    });
  };

  const handleCardMouseLeave = (event) => {
    const gsap = window.gsap;
    if (!gsap) return;

    gsap.to(event.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      z: 0,
      duration: 0.6,
      ease: 'elastic.out(1.0, 0.6)',
      overwrite: 'auto'
    });
  };

  useEffect(() => {
    const THREE = window.THREE;
    const gsap = window.gsap;

    if (!THREE || !gsap) return;

    if (window.ScrollTrigger) {
      gsap.registerPlugin(window.ScrollTrigger);
    }

    const isMobile = window.innerWidth < 768;

    // --- 1. THREE.JS GRID PLANE BACKGROUND (Only on Desktop) ---
    let renderer, scene, gridHelper, animationId;
    if (!isMobile && gridCanvasRef.current) {
      const canvas = gridCanvasRef.current;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: false // Disable antialias for performance on this simple grid
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(width, height, false);

      scene = new THREE.Scene();

      // Camera positioned tilted looking slightly downward
      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
      camera.position.set(0, 4.5, 12);
      camera.lookAt(0, 0, -4);

      // Create a grid colored in accent brand purple/pink
      const gridSize = 200;
      const gridDivisions = 80;
      gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0xd946ef, 0xd946ef);
      gridHelper.material.opacity = 0.055;
      gridHelper.material.transparent = true;
      gridHelper.position.set(0, -3.2, 0);
      scene.add(gridHelper);

      // Grid spacing = size / divisions = 200 / 80 = 2.5 units
      const spacing = 2.5;

      const tick = () => {
        gridHelper.position.z += 0.015;
        if (gridHelper.position.z >= spacing) {
          gridHelper.position.z = 0;
        }
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(tick);
      };

      tick();

      const handleResize = () => {
        if (!canvas) return;
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };
      window.addEventListener('resize', handleResize);
    }

    // --- 2. GSAP SCROLL-TRIGGERED SCANNING LASER SWEEP ---
    const scannerSweep = gsap.fromTo('.scanner-line',
      { left: '-100%' },
      {
        left: '200%',
        duration: 1.1,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true
        }
      }
    );

    // --- 3. GSAP ALTERNATING 3D ROW ENTRANCE ---
    const rows = sectionRef.current ? sectionRef.current.querySelectorAll('.feature-row') : [];
    const rowTweens = [];

    rows.forEach((row, i) => {
      const fromLeft = i % 2 === 0;

      // Initialize rotated start state in 3D perspective
      gsap.set(row, {
        x: fromLeft ? -150 : 150,
        z: -200,
        rotationY: fromLeft ? -15 : 15,
        opacity: 0
      });

      const rTween = gsap.to(row, {
        x: 0,
        z: 0,
        rotationY: 0,
        opacity: 1,
        duration: 1.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: row,
          start: 'top 85%',
          toggleActions: 'play none none reset'
        }
      });
      rowTweens.push(rTween);
    });

    // --- 4. STAGGERED 360-DEGREE ICON SPIN ON VIEWPORT ENTRY ---
    const icons = sectionRef.current ? sectionRef.current.querySelectorAll('.feature-icon') : [];
    const iconSpinTweens = [];

    icons.forEach((icon) => {
      icon.style.transformStyle = 'preserve-3d';

      const sTween = gsap.fromTo(icon,
        { rotationY: 0 },
        {
          rotationY: 360,
          duration: 1.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: icon,
            start: 'top 85%',
            toggleActions: 'play none none reset'
          }
        }
      );
      iconSpinTweens.push(sTween);
    });

    // --- CLEANUP ALL TIMELINES AND WEBGL ---
    return () => {
      if (renderer) {
        cancelAnimationFrame(animationId);
        renderer.dispose();
        gridHelper.geometry.dispose();
        gridHelper.material.dispose();
        scene.clear();
      }

      if (scannerSweep.scrollTrigger) scannerSweep.scrollTrigger.kill();
      scannerSweep.kill();

      rowTweens.forEach((t) => {
        if (t.scrollTrigger) t.scrollTrigger.kill();
        t.kill();
      });

      iconSpinTweens.forEach((t) => {
        if (t.scrollTrigger) t.scrollTrigger.kill();
        t.kill();
      });
    };
  }, []);

  return (
    <section className="features-section" ref={sectionRef}>
      <canvas ref={gridCanvasRef} className="features-bg-canvas" />
      <div className="scanner-line"></div>

      <div className="container">
        <div className="features-header">
          <h2>Everything you need to hire faster</h2>
          <p>HR.ai replaces scattered folders and spreadsheets with a single, intelligent source of truth.</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-row ${index % 2 !== 0 ? 'reverse' : ''}`}
              onMouseEnter={triggerParticleBurst}
            >
              <div className="feature-content">
                <div className="feature-icon">
                  {feature.icon}
                  {/* Exploding particle container element */}
                  <div className="burst-container"></div>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <ul className="feature-bullets">
                  <li>Automated extraction</li>
                  <li>Semantic matching</li>
                  <li>High accuracy</li>
                </ul>
              </div>
              <div className="feature-visual">
                <div
                  className="glass-card"
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                >
                  <div className="visual-placeholder">{feature.imagePlaceholder}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
