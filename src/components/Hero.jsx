import { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Hero.css';

export function Hero() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const socialProofRef = useRef(null);

  const avatars = [
    "https://i.pravatar.cc/100?img=11",
    "https://i.pravatar.cc/100?img=12",
    "https://i.pravatar.cc/100?img=33",
    "https://i.pravatar.cc/100?img=44",
    "https://i.pravatar.cc/100?img=55"
  ];

  // Helper to split text into words wrapped in masked containers
  const splitText = (text) => {
    return text.split(' ').map((word, i) => (
      <span key={i} className="word-wrapper" style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
        <span className="word-inner" style={{ display: 'inline-block', transform: 'translateY(120%)', opacity: 0 }}>
          {word}&nbsp;
        </span>
      </span>
    ));
  };

  // Helper to split text into characters for a clean typewriter fade
  const splitChars = (text) => {
    return text.split('').map((char, i) => (
      <span key={i} className="char" style={{ opacity: 0, display: 'inline-block' }}>
        {char === ' ' ? '\u00A0' : char}
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

    // --- 1. THREE.JS BACKGROUND CANVAS SETUP ---
    const canvas = canvasRef.current;
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: window.innerWidth > 768 // Disable antialiasing on mobile for better FPS
    });

    const isMobile = window.innerWidth < 768;
    // Cap pixel ratio to 1.5 on desktop, and 1.0 on mobile to prevent GPU thermal throttling
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.0 : 1.5));
    renderer.setSize(width, height, false);

    const scene = new THREE.Scene();

    // Field of view, aspect ratio, near, far
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 8;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    // Faint white directional and point lights for clean monochrome highlights
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xffffff, 2.0, 30);
    pointLight.position.set(-5, -5, 3);
    scene.add(pointLight);

    // Large talent database perimeter ring rotating in the background
    const ringGeo = new THREE.TorusGeometry(3.5, 0.04, 8, 64);
    const ringMat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
      emissive: 0xffffff,
      emissiveIntensity: 0.05
    });
    const portalRing = new THREE.Mesh(ringGeo, ringMat);
    portalRing.position.set(1.5, 0.2, -2.5);
    scene.add(portalRing);

    // Floating Candidate Nodes (Representing candidates in a talent database)
    const particles = [];
    const particleCount = isMobile ? 35 : 90;

    const sphereGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const baseParticleMat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
      shininess: 100,
      specular: 0xffffff
    });

    for (let i = 0; i < particleCount; i++) {
      // All nodes are spheres for a clean, consistent candidate profile network look
      const mat = baseParticleMat.clone();
      const mesh = new THREE.Mesh(sphereGeo, mat);

      // Randomize original positioning (X: -8 to 8, Y: -6 to 6, Z: -5.5 to 1.5)
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 7 - 2;

      mesh.position.set(x, y, z);
      scene.add(mesh);

      particles.push({
        mesh,
        baseX: x,
        baseY: y,
        baseZ: z,
        speedY: 0.002 + Math.random() * 0.0035,
        rotSpeedX: 0.002 + Math.random() * 0.004,
        rotSpeedY: 0.002 + Math.random() * 0.004,
        rotSpeedZ: 0.002 + Math.random() * 0.004,
        phase: Math.random() * Math.PI * 2,
        repelForceX: 0,
        repelForceY: 0
      });
    }

    // Faint connecting lines segment for the dynamic Talent Network graph
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * 60); // safe array size
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const talentNetworkGraph = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(talentNetworkGraph);

    // Mouse Tracking for repel physics
    const mouse = { x: -999, y: -999, targetX: -999, targetY: -999 };
    
    const handleMouseMove = (event) => {
      mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -999;
      mouse.targetY = -999;
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    // Animation Tick loop
    let animationId = null;
    const fovRad = (camera.fov * Math.PI) / 180;

    const tick = () => {
      // Smoothly interpolate mouse positioning
      if (mouse.targetX !== -999) {
        if (mouse.x === -999) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        } else {
          mouse.x += (mouse.targetX - mouse.x) * 0.08;
          mouse.y += (mouse.targetY - mouse.y) * 0.08;
        }
      } else {
        mouse.x = -999;
        mouse.y = -999;
      }

      // Rotate background portal ring
      portalRing.rotation.x += 0.0015;
      portalRing.rotation.y += 0.0025;
      portalRing.rotation.z += 0.001;

      const aspect = camera.aspect;

      // Update and animate particles
      particles.forEach((p) => {
        // 1. Drifting upward
        p.baseY += p.speedY;

        // Wrap around at top boundaries
        if (p.baseY > 6) {
          p.baseY = -6;
          p.baseZ = (Math.random() - 0.5) * 7 - 2;
          p.baseX = (Math.random() - 0.5) * 16;
        }

        // Horizontal sway
        const horizontalWave = Math.sin(p.baseY * 1.5 + p.phase) * 0.25;
        let targetX = p.baseX + horizontalWave;
        let targetY = p.baseY;

        // 2. Mouse Repulsion Field
        if (mouse.x !== -999 && !isMobile) {
          const distCamZ = camera.position.z - p.mesh.position.z;
          const halfH = distCamZ * Math.tan(fovRad / 2);
          const halfW = halfH * aspect;

          const mouse3DX = mouse.x * halfW;
          const mouse3DY = mouse.y * halfH;

          const dx = p.mesh.position.x - mouse3DX;
          const dy = p.mesh.position.y - mouse3DY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const repelRadius = 2.4;
          const repelStrength = 0.95;

          if (distance < repelRadius) {
            const force = (1.0 - distance / repelRadius) * repelStrength;
            // Push vector
            p.repelForceX += (dx / (distance || 0.01)) * force * 0.15;
            p.repelForceY += (dy / (distance || 0.01)) * force * 0.15;
          }
        }

        // Decay repel forces for spring return
        p.repelForceX *= 0.92;
        p.repelForceY *= 0.92;

        // Apply positions
        p.mesh.position.x = targetX + p.repelForceX;
        p.mesh.position.y = targetY + p.repelForceY;

        // Rotations
        p.mesh.rotation.x += p.rotSpeedX;
        p.mesh.rotation.y += p.rotSpeedY;

        // 3. Volumetric Depth of Field Fading (Z-depth mapping)
        // Camera is at Z=8. Particles bounds: Z=-5.5 to Z=1.5
        const zMin = -5.5;
        const zMax = 1.5;
        const depthPercent = Math.max(0, Math.min(1, (p.mesh.position.z - zMin) / (zMax - zMin)));

        // Brighten/Increase opacity if closer to camera, fade out if farther
        p.mesh.material.opacity = 0.06 + depthPercent * 0.32;

        // Scale perspective sizing
        const sizeScale = 0.5 + depthPercent * 0.7;
        p.mesh.scale.set(sizeScale, sizeScale, sizeScale);
      });

      // 4. Volumetric Talent Network Graph calculations inside tick
      let lineIdx = 0;
      const positions = lineGeo.attributes.position.array;
      
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i].mesh.position;
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j].mesh.position;
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.z - p2.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          // Faint connections for nearby nodes to build the talent graph
          if (dist < 2.5 && lineIdx < linePositions.length - 6) {
            positions[lineIdx++] = p1.x;
            positions[lineIdx++] = p1.y;
            positions[lineIdx++] = p1.z;
            
            positions[lineIdx++] = p2.x;
            positions[lineIdx++] = p2.y;
            positions[lineIdx++] = p2.z;
          }
        }
      }
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.setDrawRange(0, lineIdx / 3);

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(tick);
    };

    tick();

    // Canvas resize handler
    const handleResize = () => {
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (width !== w || height !== h) {
        width = w;
        height = h;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      }
    };
    window.addEventListener('resize', handleResize);

    // --- 2. GSAP TYPOGRAPHY ANIMATIONS ---
    const titleWords = titleRef.current ? titleRef.current.querySelectorAll('.word-inner') : [];
    const descChars = descRef.current ? descRef.current.querySelectorAll('.char') : [];
    const ctaButtons = ctaRef.current ? ctaRef.current.children : [];
    const socialProof = socialProofRef.current;

    // Reset styles before running animation
    gsap.set(titleWords, { y: '120%', opacity: 0 });
    gsap.set(descChars, { opacity: 0 });
    gsap.set(ctaButtons, { y: 40, opacity: 0 });
    if (socialProof) gsap.set(socialProof, { y: 15, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top 85%',
        toggleActions: 'play none none reset'
      },
      defaults: { ease: 'power3.out' }
    });

    // Word Drop-in with Spring Elastic effect
    tl.to(titleWords, {
      y: '0%',
      opacity: 1,
      duration: 1.4,
      stagger: 0.08,
      ease: 'elastic.out(0.9, 0.65)'
    });

    // Character Typing fade-in staggered
    tl.to(descChars, {
      opacity: 1,
      duration: 0.03,
      stagger: 0.015,
      ease: 'none'
    }, '-=0.45');

    // CTA buttons sliding up with elastic overshoot
    tl.to(ctaButtons, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.12,
      ease: 'elastic.out(1.0, 0.72)'
    }, '-=0.55');

    // Social Proof trust line fades in last
    if (socialProof) {
      tl.to(socialProof, {
        y: 0,
        opacity: 1,
        duration: 1.0,
        ease: 'power3.out'
      }, '-=0.7');
    }

    // --- CLEANUP MEMORY & BINDINGS ---
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
      
      // Clean up Three.js context completely to prevent memory leaks
      renderer.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      sphereGeo.dispose();
      baseParticleMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      
      particles.forEach((p) => {
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        scene.remove(p.mesh);
      });
      
      scene.remove(portalRing);
      scene.remove(talentNetworkGraph);
      scene.clear();
      
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <section className="hero">
      <canvas ref={canvasRef} className="hero-canvas" />
      <div className="hero-glow"></div>
      
      <div className="container hero-container">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          Now in Public Beta
        </div>
        
        <h1 className="hero-title" ref={titleRef}>
          <div className="title-line" style={{ display: 'block', marginBottom: '0.2rem' }}>
            {splitText("The AI-Powered Candidate Library")}
          </div>
          <div className="title-line hero-title-accent" style={{ display: 'block' }}>
            {splitText("Built to replace your spreadsheets")}
          </div>
        </h1>
        
        <h2 className="hero-description" ref={descRef}>
          {splitChars("Upload resumes. AI auto-fills everything. Build your personal candidate library — owned by you, forever.")}
        </h2>
        
        <div className="hero-cta" ref={ctaRef}>
          <Link to="/signup" className="btn btn-accent">Get Started for Free</Link>
          <button className="btn btn-dark-ghost">Watch Demo</button>
        </div>
        
        <div className="hero-social-proof" ref={socialProofRef}>
          <div className="avatar-group">
            {avatars.map((src, i) => (
              <img key={i} src={src} alt={`HR professional using HR.ai ${i+1}`} className="avatar" />
            ))}
          </div>
          <span className="social-proof-text">Built for Indian HR professionals</span>
        </div>
      </div>
    </section>
  );
}
