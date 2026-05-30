import { useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { ProblemCards } from '../components/ProblemCards';
import { Features } from '../components/Features';
import { HowItWorks } from '../components/HowItWorks';
import { ComparisonTable } from '../components/ComparisonTable';
import { Pricing } from '../components/Pricing';
import { FAQ } from '../components/FAQ';
import { FinalCTA } from '../components/FinalCTA';
import { Footer } from '../components/Footer';

export function Home() {
  useEffect(() => {
    const gsap = window.gsap;
    const Lenis = window.Lenis;

    if (!gsap) return;

    // --- 1. Curtain Lifting Animation ---
    gsap.to('.curtain-reveal', {
      y: '-100%',
      duration: 1.5,
      ease: 'power4.inOut'
    });

    // --- 2. Initialize Lenis Scroll ---
    let lenis;
    let tickerCallback;
    if (Lenis) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });

      lenis.on('scroll', () => {
        if (window.ScrollTrigger) {
          window.ScrollTrigger.update();
        }
      });

      tickerCallback = (time) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);
    }

    // --- 3. Scroll Progress Indicator Bar ---
    let progressTween;
    if (window.ScrollTrigger) {
      gsap.registerPlugin(window.ScrollTrigger);
      progressTween = gsap.to('.scroll-progress-bar', {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.landing-page',
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      });
    }
    // --- CLEANUP TIMELINES, TIMERS, & LISTENERS ---
    return () => {
      if (lenis) {
        lenis.destroy();
      }
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
      }
      if (progressTween) {
        if (progressTween.scrollTrigger) progressTween.scrollTrigger.kill();
        progressTween.kill();
      }
    };
  }, []);

  return (
    <div className="landing-page" data-theme="dark">
      <div className="curtain-reveal"></div>
      <div className="grain-overlay"></div>
      <div className="scroll-progress-bar"></div>
      
      <Navbar />
      <main>
        <Hero />
        <ProblemCards />
        <Features />
        <HowItWorks />
        <ComparisonTable />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

