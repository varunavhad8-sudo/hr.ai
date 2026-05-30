import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export function Navbar() {
  const navigate = useNavigate();
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    const gsap = window.gsap;
    if (!gsap) return;

    // Register ScrollTrigger if available
    if (window.ScrollTrigger) {
      gsap.registerPlugin(window.ScrollTrigger);
    }

    // Perspective wrapper style for logo 3D effect
    if (logoRef.current) {
      logoRef.current.style.perspective = '1000px';
      logoRef.current.style.transformStyle = 'preserve-3d';
    }

    // 1. Entrance animation timeline
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Subtle 3D Y-axis flip for logo
    tl.fromTo(logoRef.current,
      { opacity: 0, rotationY: -180, scale: 0.8 },
      { opacity: 1, rotationY: 0, scale: 1, duration: 1.4, ease: 'back.out(1.5)' }
    );

    // Staggered top fade-in for links and action buttons
    const links = linksRef.current ? linksRef.current.querySelectorAll('a') : [];
    const actions = actionsRef.current ? actionsRef.current.children : [];

    tl.fromTo([...links, ...actions],
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.08 },
      '-=1.0'
    );

    // 2. Continuous 3D breathing pulse on the CTA button
    const getStartedBtn = actionsRef.current ? actionsRef.current.querySelector('.btn-primary') : null;
    let pulseTween = null;
    if (getStartedBtn) {
      pulseTween = gsap.to(getStartedBtn, {
        scale: 1.06,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        boxShadow: '0 0 15px rgba(255, 255, 255, 0.25), 0 0 5px rgba(255, 255, 255, 0.12)'
      });
    }

    // 3. ScrollTrigger for spring-physics navbar shrink
    let scrollTriggerInstance = null;
    if (window.ScrollTrigger && navRef.current) {
      scrollTriggerInstance = window.ScrollTrigger.create({
        trigger: 'body',
        start: 'top -20px',
        onEnter: () => {
          gsap.to('.navbar-container', {
            height: '3.6rem',
            duration: 0.7,
            ease: 'elastic.out(1, 0.75)'
          });
          gsap.to(navRef.current, {
            backgroundColor: 'rgba(13, 13, 13, 0.95)',
            borderBottomColor: 'rgba(255, 255, 255, 0.12)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
            duration: 0.7,
            ease: 'elastic.out(1, 0.75)'
          });
        },
        onLeaveBack: () => {
          gsap.to('.navbar-container', {
            height: '4.5rem',
            duration: 0.7,
            ease: 'elastic.out(1, 0.75)'
          });
          gsap.to(navRef.current, {
            backgroundColor: 'rgba(13, 13, 13, 0.8)',
            borderBottomColor: 'var(--border-color)',
            boxShadow: 'none',
            duration: 0.7,
            ease: 'elastic.out(1, 0.75)'
          });
        }
      });
    }

    // Cleanup animations and triggers on unmount
    return () => {
      if (pulseTween) pulseTween.kill();
      if (scrollTriggerInstance) scrollTriggerInstance.kill();
    };
  }, []);

  return (
    <nav className="navbar" ref={navRef}>
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" ref={logoRef}>
          <span className="logo-text">HR.ai</span>
          <span className="logo-dot"></span>
        </Link>
        
        <div className="navbar-links" ref={linksRef}>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#docs">Docs</a>
          <a href="#blog">Blog</a>
        </div>
        
        <div className="navbar-actions" ref={actionsRef}>
          <Link to="/signin" className="btn btn-ghost">Sign In</Link>
          <Link to="/signup" className="btn btn-primary">Get Started</Link>
        </div>
      </div>
    </nav>
  );
}
