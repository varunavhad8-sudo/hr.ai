import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Pricing.css';

const plans = [
  {
    name: "Candidate Organizer",
    description: "Ideal for personal candidate organization and initial resume parser testing.",
    price: 0,
    period: "forever",
    cta: "Get Started for Free",
    features: [
      "50 resume parsings / month",
      "Smart semantic search",
      "Standard folder groups",
      "Private local Excel data export",
      "Secure local-first database"
    ],
    isPopular: false
  },
  {
    name: "Recruiter Pro",
    description: "For active recruiters and Indian HR professionals building an exclusive talent network.",
    price: 399,
    period: "month",
    cta: "Upgrade to Pro",
    features: [
      "Unlimited resume parsings",
      "Full semantic AI parsing",
      "Autonomous AI folder groupings",
      "SQL, JSON & Excel raw exports",
      "Priority dedicated VRAM queues",
      "Premium support channels"
    ],
    isPopular: true
  }
];

export function Pricing() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const spheresRef = useRef([]);

  // Button gloss sweep sweep on hover
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
      { left: '200%', duration: 0.85, ease: 'power2.inOut' }
    );
  };

  // Card Mouse Tilt Calculations (tilt up to 10 degrees)
  const handleCardMouseMove = (event, index) => {
    const gsap = window.gsap;
    if (!gsap) return;

    const cardContainer = cardsRef.current[index];
    const card = cardContainer ? cardContainer.querySelector('.pricing-card') : null;
    if (!card) return;

    const rect = cardContainer.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const xPercent = (mouseX / rect.width) * 2 - 1;
    const yPercent = (mouseY / rect.height) * 2 - 1;

    const maxTilt = 10;
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

    gsap.to(card, {
      borderColor: plans[index].isPopular ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.25)',
      boxShadow: plans[index].isPopular 
        ? '0 25px 50px rgba(255, 255, 255, 0.08)' 
        : '0 20px 40px rgba(255, 255, 255, 0.08)',
      duration: 0.15,
      overwrite: 'auto'
    });
  };

  const handleCardMouseLeave = (index) => {
    const gsap = window.gsap;
    if (!gsap) return;

    const cardContainer = cardsRef.current[index];
    const card = cardContainer ? cardContainer.querySelector('.pricing-card') : null;
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      z: 0,
      duration: 0.7,
      ease: 'elastic.out(1.0, 0.65)',
      overwrite: 'auto'
    });

    gsap.to(card, {
      borderColor: plans[index].isPopular ? 'rgba(255, 255, 255, 0.15)' : 'var(--border-color)',
      boxShadow: plans[index].isPopular 
        ? '0 25px 50px rgba(255, 255, 255, 0.03)' 
        : '0 20px 40px rgba(0, 0, 0, 0.25)',
      duration: 0.5,
      overwrite: 'auto'
    });
  };

  useEffect(() => {
    const gsap = window.gsap;
    if (!gsap) return;

    if (window.ScrollTrigger) {
      gsap.registerPlugin(window.ScrollTrigger);
    }

    // --- 1. CARDS STAGGERED 3D ENTRANCE SLIDES ---
    const freeCardWrapper = cardsRef.current[0];
    const proCardWrapper = cardsRef.current[1];

    if (freeCardWrapper && proCardWrapper) {
      const freeCard = freeCardWrapper.querySelector('.pricing-card');
      const proCard = proCardWrapper.querySelector('.pricing-card');

      // Initialize rotated start state
      gsap.set(freeCard, { x: -140, rotationY: -15, opacity: 0 });
      gsap.set(proCard, { x: 140, rotationY: 15, opacity: 0 });

      // Trigger entrances
      gsap.to(freeCard, {
        x: 0,
        rotationY: 0,
        opacity: 1,
        duration: 1.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reset'
        }
      });

      gsap.to(proCard, {
        x: 0,
        rotationY: 0,
        opacity: 1,
        duration: 1.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reset'
        }
      });
    }

    // --- 2. MOST POPULAR BADGE 3D COIN FLIP ---
    const popularBadge = document.querySelector('.popular-badge');
    let badgeFlip = null;
    if (popularBadge) {
      gsap.set(popularBadge, { rotationY: -360, opacity: 0 });
      badgeFlip = gsap.to(popularBadge, {
        rotationY: 0,
        opacity: 1,
        duration: 1.4,
        ease: 'back.out(1.8)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%'
        }
      });
    }

    // --- 3. PRO CARD CONTINUOUS 3D LEVITATION LOOP ---
    let levitationTween = null;
    if (proCardWrapper) {
      levitationTween = gsap.to(proCardWrapper, {
        y: -8,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    }

    // --- 4. PRICE NUMBERS COUNT-UP ---
    const countTweens = [];
    cardsRef.current.forEach((wrapper, index) => {
      if (!wrapper) return;
      const priceNum = wrapper.querySelector('.price-number');
      if (priceNum) {
        const counter = { val: 0 };
        const tween = gsap.to(counter, {
          val: plans[index].price,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reset'
          },
          onUpdate: () => {
            priceNum.textContent = Math.round(counter.val);
          }
        });
        countTweens.push(tween);
      }
    });

    // --- 5. HIGH-PERFORMANCE BLURRED SPHERES BACKDROP DRIFT ---
    const driftTweens = [];
    spheresRef.current.forEach((sphere, index) => {
      if (!sphere) return;
      // Drift vectors
      const dx = (index % 2 === 0 ? 1 : -1) * (30 + index * 10);
      const dy = (index % 3 === 0 ? -1 : 1) * (25 + index * 12);

      const drift = gsap.to(sphere, {
        x: dx,
        y: dy,
        duration: 7 + index * 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
      driftTweens.push(drift);
    });

    // --- CLEANUP TIMELINES ON UNMOUNT ---
    return () => {
      if (badgeFlip) {
        if (badgeFlip.scrollTrigger) badgeFlip.scrollTrigger.kill();
        badgeFlip.kill();
      }

      if (levitationTween) levitationTween.kill();

      countTweens.forEach((t) => {
        if (t.scrollTrigger) t.scrollTrigger.kill();
        t.kill();
      });

      driftTweens.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section className="pricing-section" ref={containerRef}>
      {/* Blurred circle atmosphere blobs */}
      <div className="pricing-bg-spheres">
        <div ref={el => spheresRef.current[0] = el} className="floating-sphere" style={{ width: '320px', height: '320px', top: '10%', left: '5%' }}></div>
        <div ref={el => spheresRef.current[1] = el} className="floating-sphere" style={{ width: '280px', height: '280px', bottom: '15%', right: '8%' }}></div>
        <div ref={el => spheresRef.current[2] = el} className="floating-sphere" style={{ width: '220px', height: '220px', top: '40%', left: '45%' }}></div>
        <div ref={el => spheresRef.current[3] = el} className="floating-sphere" style={{ width: '350px', height: '350px', bottom: '-5%', left: '15%' }}></div>
        <div ref={el => spheresRef.current[4] = el} className="floating-sphere" style={{ width: '180px', height: '180px', top: '-5%', right: '25%' }}></div>
      </div>

      <div className="container">
        <div className="pricing-header">
          <h2>Predictable, recruiter-friendly pricing</h2>
          <p>Organize candidates organically. Start organizing today for free, or unlock unlimited parsings and VRAM priority queues.</p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`pricing-card-3d ${plan.isPopular ? 'levitate' : ''}`}
              ref={el => cardsRef.current[index] = el}
              onMouseMove={(e) => handleCardMouseMove(e, index)}
              onMouseLeave={() => handleCardMouseLeave(index)}
            >
              <div className={`pricing-card ${plan.isPopular ? 'pro-plan' : ''}`}>
                {/* Popular badge */}
                {plan.isPopular && (
                  <div className="popular-badge-container">
                    <span className="popular-badge">Most Popular</span>
                  </div>
                )}

                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>

                <div className="plan-price">
                  <span className="price-currency">₹</span>
                  <span className="price-number">0</span>
                  <span className="price-period">/{plan.period}</span>
                </div>

                <ul className="plan-features">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx}>
                      <span className="feature-bullet-check">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <div className="pricing-btn-container">
                  <Link 
                    to="/signup"
                    className={`pricing-btn btn-shimmer ${plan.isPopular ? 'btn-accent' : 'btn-dark-ghost'}`}
                    onMouseEnter={handleButtonMouseEnter}
                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
