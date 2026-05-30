import { useState, useEffect, useRef } from 'react';
import './FAQ.css';

const faqs = [
  {
    question: "How accurate is the AI resume parser?",
    answer: "Our AI model is trained on millions of resumes across various industries and achieves over 98% accuracy in extracting key fields like skills, experience, and contact information, even from complex formatting."
  },
  {
    question: "Do you offer a free trial?",
    answer: "Yes, you can get started for free and parse up to 50 resumes per month to test the capabilities of HR.ai before upgrading to a premium plan."
  },
  {
    question: "Is my candidate data secure?",
    answer: "Absolutely. We use enterprise-grade encryption for all data at rest and in transit. You retain full ownership of your candidate library, and we do not share your data with third parties."
  },
  {
    question: "Can I search for specific skills?",
    answer: "Yes, our smart search allows you to filter your entire candidate library by specific skills, job titles, locations, and experience levels in seconds."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);
  const answersRef = useRef([]);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  // Helper to split heading text into letters for gravity falls
  const splitLetters = (text) => {
    return text.split('').map((letter, i) => (
      <span
        key={i}
        className="faq-title-letter"
        style={{
          display: 'inline-block',
          transform: 'translateY(-120px)',
          opacity: 0,
          willChange: 'transform, opacity'
        }}
      >
        {letter === ' ' ? '\u00A0' : letter}
      </span>
    ));
  };

  // Question Text 3D Shift (Moves 2px towards user on Z-axis on hover)
  const handleQuestionMouseEnter = (event) => {
    const gsap = window.gsap;
    if (!gsap) return;
    const h3 = event.currentTarget.querySelector('h3');
    if (h3) {
      gsap.to(h3, {
        z: 15,
        duration: 0.35,
        ease: 'power2.out'
      });
    }
  };

  const handleQuestionMouseLeave = (event) => {
    const gsap = window.gsap;
    if (!gsap) return;
    const h3 = event.currentTarget.querySelector('h3');
    if (h3) {
      gsap.to(h3, {
        z: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  // Accordion Expansions, Icon Rotations, and Border Glows on openIndex changes
  useEffect(() => {
    const gsap = window.gsap;
    if (!gsap) return;

    faqs.forEach((_, index) => {
      const answer = answersRef.current[index];
      const item = itemsRef.current[index];
      const icon = item ? item.querySelector('.faq-icon') : null;
      if (!answer || !item) return;

      const isOpen = openIndex === index;

      if (isOpen) {
        // Spring height expand accordion
        gsap.to(answer, {
          height: 'auto',
          opacity: 1,
          duration: 0.8,
          ease: 'elastic.out(1.0, 0.75)'
        });

        // Illuminate left border
        gsap.to(item, {
          borderLeftColor: '#ffffff',
          borderColor: 'rgba(255, 255, 255, 0.25)',
          duration: 0.35
        });

        // Pulsing shadow border once on open
        gsap.fromTo(item,
          { boxShadow: 'none' },
          {
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.12)',
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut'
          }
        );

        // Indicator plus rotates 135deg into active close 'x' cross
        if (icon) {
          gsap.to(icon, {
            rotation: 135,
            color: '#ffffff',
            duration: 0.6,
            ease: 'back.out(1.8)'
          });
        }
      } else {
        // Collapse card
        gsap.to(answer, {
          height: 0,
          opacity: 0,
          duration: 0.35,
          ease: 'power2.out'
        });

        gsap.to(item, {
          borderLeftColor: 'transparent',
          borderColor: 'var(--border-color)',
          boxShadow: 'none',
          duration: 0.35
        });

        // Rotate arrow back to rest plus state
        if (icon) {
          gsap.to(icon, {
            rotation: 0,
            color: 'var(--text-muted)',
            duration: 0.4,
            ease: 'power2.out'
          });
        }
      }
    });
  }, [openIndex]);

  // Viewport scroll entrances
  useEffect(() => {
    const gsap = window.gsap;
    if (!gsap) return;

    if (window.ScrollTrigger) {
      gsap.registerPlugin(window.ScrollTrigger);
    }

    // Title Letter Split Gravity drop
    const letters = sectionRef.current ? sectionRef.current.querySelectorAll('.faq-title-letter') : [];
    let titleDrop = null;
    if (letters.length > 0) {
      titleDrop = gsap.fromTo(letters,
        { y: -120, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.3,
          stagger: 0.035,
          ease: 'elastic.out(1.0, 0.58)',
          scrollTrigger: {
            trigger: '.faq-header',
            start: 'top 85%'
          }
        }
      );
    }

    // Staggered FAQ card slide-ins from bottom
    const items = sectionRef.current ? sectionRef.current.querySelectorAll('.faq-item') : [];
    const itemEntrances = [];

    items.forEach((item) => {
      gsap.set(item, { y: 65, opacity: 0 });

      const tween = gsap.to(item, {
        y: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none reset'
        }
      });
      itemEntrances.push(tween);
    });

    // Cleanup triggers on unmount
    return () => {
      if (titleDrop) {
        if (titleDrop.scrollTrigger) titleDrop.scrollTrigger.kill();
        titleDrop.kill();
      }

      itemEntrances.forEach((t) => {
        if (t.scrollTrigger) t.scrollTrigger.kill();
        t.kill();
      });
    };
  }, []);

  // Generate FAQ Schema for SEO
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="faq-section" ref={sectionRef}>
      {/* Inject SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
      <div className="container">
        <div className="faq-header">
          <h2>{splitLetters("Frequently Asked Questions")}</h2>
          <p>Everything you need to know about the product and billing.</p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="faq-item"
              ref={el => itemsRef.current[index] = el}
              onClick={() => toggleFAQ(index)}
            >
              <div 
                className="faq-question"
                onMouseEnter={handleQuestionMouseEnter}
                onMouseLeave={handleQuestionMouseLeave}
              >
                <h3>{faq.question}</h3>
                {/* Permanent '+' character rotates to 'x' on click */}
                <span className="faq-icon">+</span>
              </div>
              <div className="faq-answer" ref={el => answersRef.current[index] = el}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
