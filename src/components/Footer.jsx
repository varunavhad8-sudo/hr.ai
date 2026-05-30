import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  // Helper to split text into characters for typewriter fade
  const splitChars = (text) => {
    return text.split('').map((char, i) => (
      <span key={i} className="copyright-char" style={{ opacity: 0, display: 'inline-block' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  // 3D link tilts toward user on hover
  const handleLinkMouseEnter = (event) => {
    const gsap = window.gsap;
    if (!gsap) return;
    gsap.to(event.currentTarget, {
      z: 8,
      scale: 1.04,
      rotationX: 4,
      transformPerspective: 600,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  };

  const handleLinkMouseLeave = (event) => {
    const gsap = window.gsap;
    if (!gsap) return;
    gsap.to(event.currentTarget, {
      z: 0,
      scale: 1.0,
      rotationX: 0,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  };

  useEffect(() => {
    const gsap = window.gsap;
    if (!gsap) return;

    if (window.ScrollTrigger) {
      gsap.registerPlugin(window.ScrollTrigger);
    }

    // --- 1. LOGO HOLOGRAM SLOW Y-ROTATION LOOP ---
    const logoTween = gsap.to('.footer-logo', {
      rotationY: 360,
      duration: 8,
      repeat: -1,
      ease: 'none'
    });

    // --- 2. COPYRIGHT CHARACTER TYPEWRITER ---
    const chars = document.querySelectorAll('.copyright-char');
    const typewriter = gsap.to(chars, {
      opacity: 1,
      duration: 0.03,
      stagger: 0.02,
      ease: 'none',
      scrollTrigger: {
        trigger: '.footer-bottom',
        start: 'top 95%'
      }
    });

    // --- 3. STAGGERED SECTION REVEALS ---
    const targets = ['.footer-brand', '.footer-column', '.footer-bottom'];
    const revealTweens = [];

    targets.forEach((target, index) => {
      gsap.set(target, { y: 35, opacity: 0 });
      const tween = gsap.to(target, {
        y: 0,
        opacity: 1,
        duration: 1.0,
        ease: 'power3.out',
        delay: index * 0.1,
        scrollTrigger: {
          trigger: '.footer',
          start: 'top 90%',
          toggleActions: 'play none none reset'
        }
      });
      revealTweens.push(tween);
    });

    // --- CLEANUP TIMELINES ON UNMOUNT ---
    return () => {
      logoTween.kill();
      
      if (typewriter.scrollTrigger) typewriter.scrollTrigger.kill();
      typewriter.kill();

      revealTweens.forEach((t) => {
        if (t.scrollTrigger) t.scrollTrigger.kill();
        t.kill();
      });
    };
  }, []);

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <Link 
            to="/" 
            className="footer-logo"
            onMouseEnter={handleLinkMouseEnter}
            onMouseLeave={handleLinkMouseLeave}
          >
            HR.ai
          </Link>
          <p className="footer-tagline">Manage every candidate like a library.</p>
        </div>
        
        <div className="footer-links">
          <div className="footer-column">
            <h3>Product</h3>
            <ul>
              <li>
                <Link 
                  to="/" 
                  onMouseEnter={handleLinkMouseEnter}
                  onMouseLeave={handleLinkMouseLeave}
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  onMouseEnter={handleLinkMouseEnter}
                  onMouseLeave={handleLinkMouseLeave}
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  to="/signin" 
                  onMouseEnter={handleLinkMouseEnter}
                  onMouseLeave={handleLinkMouseLeave}
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Legal</h3>
            <ul>
              <li>
                <Link 
                  to="/" 
                  onMouseEnter={handleLinkMouseEnter}
                  onMouseLeave={handleLinkMouseLeave}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  onMouseEnter={handleLinkMouseEnter}
                  onMouseLeave={handleLinkMouseLeave}
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          {splitChars(`© ${currentYear} HR.ai. All rights reserved.`)}
        </p>
      </div>
    </footer>
  );
}
