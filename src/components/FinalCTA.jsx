import { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './FinalCTA.css';

export function FinalCTA() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const titleRef = useRef(null);
  const buttonRef = useRef(null);
  const rippleRef = useRef(null);
  const microcopyRef = useRef(null);

  // Button glossy sweep on mouse hover
  const handleButtonMouseEnter = (event) => {
    const gsap = window.gsap;
    if (!gsap) return;

    const btn = event.currentTarget;
    let sweep = btn.querySelector('.btn-shimmer-sweep');
    if (!sweep) {
      sweep = document.createElement('div');
      sweep.className = 'btn-shimmer-sweep';
      sweep.style.position = 'absolute';
      sweep.style.top = '0';
      sweep.style.left = '-150%';
      sweep.style.width = '60%';
      sweep.style.height = '100%';
      sweep.style.background = 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)';
      sweep.style.transform = 'skewX(-20deg)';
      sweep.style.pointerEvents = 'none';
      btn.appendChild(sweep);
    }

    gsap.fromTo(sweep,
      { left: '-150%' },
      { left: '200%', duration: 0.8, ease: 'power2.inOut' }
    );
  };

  // Helper to split heading text into words for massive 3D scale reveals
  const splitTextWords = (text) => {
    return text.split(' ').map((word, i) => (
      <span key={i} className="final-cta-word-wrapper" style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.35em' }}>
        <span className="final-cta-word" style={{ display: 'inline-block', opacity: 0, transform: 'scale(3)' }}>
          {word}
        </span>
      </span>
    ));
  };

  useEffect(() => {
    const THREE = window.THREE;
    const gsap = window.gsap;

    if (!THREE || !gsap) return;

    if (window.ScrollTrigger) {
      gsap.registerPlugin(window.ScrollTrigger);
    }

    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- 1. THREE.JS PARTICLE EXPLOSION (Pauses off-screen, reduced on mobile, disabled on reduced motion) ---
    let renderer, scene, camera, particleSystem, animationId, observer, geometry, material;
    let particles = [];
    let isExploded = false;
    let isInViewport = true;

    if (canvasRef.current && !prefersReducedMotion) {
      const canvas = canvasRef.current;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: false
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.0 : 1.5));
      renderer.setSize(width, height, false);

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
      camera.position.z = 12;

      // Particle geometry & system
      const particleCount = isMobile ? 120 : 300;
      geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);

      const color = new THREE.Color(0xd946ef);

      // Material styled as round glowing points
      material = new THREE.PointsMaterial({
        size: isMobile ? 0.08 : 0.12,
        color: color,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      // Initialize all particles at center coordinates (0,0,0) for explosion effect
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;

        // Random vector coordinates for explosive force
        const angle = Math.random() * Math.PI * 2;
        const pitch = (Math.random() - 0.5) * Math.PI;
        const speed = 0.05 + Math.random() * 0.12;

        particles.push({
          x: 0, y: 0, z: 0,
          vx: Math.cos(angle) * Math.cos(pitch) * speed,
          vy: Math.sin(pitch) * speed,
          vz: Math.sin(angle) * Math.cos(pitch) * speed,
          baseX: (Math.random() - 0.5) * 16,
          baseY: (Math.random() - 0.5) * 12,
          baseZ: (Math.random() - 0.5) * 6 - 2,
          driftSpeedY: 0.0015 + Math.random() * 0.002,
          phase: Math.random() * Math.PI * 2
        });
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleSystem = new THREE.Points(geometry, material);
      scene.add(particleSystem);

      // Tick rendering loop
      const tick = () => {
        if (!isInViewport) {
          animationId = requestAnimationFrame(tick);
          return;
        }

        const posArr = particleSystem.geometry.attributes.position.array;

        particles.forEach((p, i) => {
          if (isExploded) {
            // Settle Phase: apply drag friction and attract back to drift path
            p.vx *= 0.94;
            p.vy *= 0.94;
            p.vz *= 0.94;

            p.baseY += p.driftSpeedY;
            if (p.baseY > 6) p.baseY = -6;

            const horizontalWave = Math.sin(p.baseY + p.phase) * 0.1;
            const targetX = p.baseX + horizontalWave;
            const targetY = p.baseY;

            // Slowly slide from current exploded position to drift coordinates
            p.x += (targetX - p.x) * 0.02 + p.vx;
            p.y += (targetY - p.y) * 0.02 + p.vy;
            p.z += (p.baseZ - p.z) * 0.02 + p.vz;
          } else {
            // Explosion Phase: expand outward aggressively
            p.x += p.vx;
            p.y += p.vy;
            p.z += p.vz;
          }

          posArr[i * 3] = p.x;
          posArr[i * 3 + 1] = p.y;
          posArr[i * 3 + 2] = p.z;
        });

        particleSystem.geometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(tick);
      };

      tick();

      // Trigger the explosion on scroll into view
      window.ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        onEnter: () => {
          isExploded = false; // Reset to center
          particles.forEach(p => {
            p.x = 0; p.y = 0; p.z = 0;
            const angle = Math.random() * Math.PI * 2;
            const pitch = (Math.random() - 0.5) * Math.PI;
            const speed = 0.06 + Math.random() * 0.15;
            p.vx = Math.cos(angle) * Math.cos(pitch) * speed;
            p.vy = Math.sin(pitch) * speed;
            p.vz = Math.sin(angle) * Math.cos(pitch) * speed;
          });
          
          // Settle into floating drift after 0.5 seconds of burst expansion
          setTimeout(() => {
            isExploded = true;
          }, 450);
        },
        onLeaveBack: () => {
          isExploded = false;
        }
      });

      // Intersection observer to pause tick loops when out of viewport
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isInViewport = entry.isIntersecting;
        });
      }, { threshold: 0.02 });
      observer.observe(canvas);

      // Resize event
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

    // --- 2. GSAP HEADLINE massive 3D scale reveal ---
    const words = titleRef.current ? titleRef.current.querySelectorAll('.final-cta-word') : [];
    const sweepCircle = rippleRef.current;
    const microcopy = microcopyRef.current;

    // Reset properties before triggering
    gsap.set(words, { scale: 3, opacity: 0 });
    gsap.set(sweepCircle, { width: 0, height: 0, opacity: 0 });
    if (microcopy) gsap.set(microcopy, { y: 15, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none reset'
      }
    });

    if (prefersReducedMotion) {
      // Accessibility bypass: simple fade-in
      tl.to(words, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1 })
        .to(buttonRef.current, { opacity: 1, duration: 0.5 }, '-=0.3')
        .to(microcopy, { opacity: 1, duration: 0.5 }, '-=0.2');
    } else {
      // 3D scale down landing stagger
      tl.to(words, {
        scale: 1,
        opacity: 1,
        duration: 1.1,
        stagger: 0.15,
        ease: 'power3.out'
      });

      // Expanding Button ripple circle
      tl.fromTo(sweepCircle,
        { width: 0, height: 0, opacity: 1 },
        {
          width: 250,
          height: 250,
          opacity: 0,
          duration: 1.8,
          ease: 'power2.out'
        },
        '-=0.4'
      );

      // Micro copy fade in delayed drift
      if (microcopy) {
        tl.to(microcopy, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out'
        }, '-=1.2');
      }
    }

    // --- CLEANUP TIMELINES & OBSERVERS ---
    return () => {
      if (renderer) {
        cancelAnimationFrame(animationId);
        renderer.dispose();
        geometry.dispose();
        material.dispose();
        scene.clear();
        if (observer) observer.disconnect();
      }

      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <section className="final-cta-section" ref={sectionRef}>
      <canvas ref={canvasRef} className="final-cta-canvas" />
      
      <div className="container final-cta-container">
        <h2 className="final-cta-title" ref={titleRef}>
          {splitTextWords("Build your personal candidate library today")}
        </h2>

        <div className="final-cta-actions">
          {/* Pulsing ring ripple overlay */}
          <div ref={rippleRef} className="ripple-ring"></div>

          {/* Glowing Conic Perimeter Button */}
          <div className="gradient-border-btn-container" ref={buttonRef}>
            <Link 
              to="/signup"
              className="gradient-border-btn"
              onMouseEnter={handleButtonMouseEnter}
            >
              Get Started for Free
            </Link>
          </div>
        </div>

        <p className="final-cta-microcopy" ref={microcopyRef}>
          Parse up to 50 resumes free. No credit card required. Private ownership forever.
        </p>
      </div>
    </section>
  );
}
