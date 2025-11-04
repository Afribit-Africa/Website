"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function GSAPAnimations({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      // Hero text animations - no ScrollTrigger needed since they're always in view
      const heroTitle = document.querySelector(".hero-title");
      if (heroTitle) {
        gsap.fromTo(".hero-title",
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          }
        );
      }

      const heroSubtitle = document.querySelector(".hero-subtitle");
      if (heroSubtitle) {
        gsap.fromTo(".hero-subtitle",
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.2,
            ease: "power2.out",
          }
        );
      }
    });

    // Counter animation for hero stats
    const animateCounter = (el: Element) => {
      const target = parseInt(el.getAttribute('data-target') || '0');
      gsap.to(el, {
        innerText: target,
        duration: 2,
        ease: "power1.out",
        snap: { innerText: 1 },
        onUpdate: function() {
          el.textContent = Math.ceil((this.targets()[0] as any).innerText);
        }
      });
    };

    // Animate counters when they come into view
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
      setTimeout(() => {
        counters.forEach(counter => animateCounter(counter));
      }, 800); // Delay after hero animation
    }

    // Batch scroll-triggered animations for better performance
    ScrollTrigger.batch(".mission-text, .program-card, .testimonial-card, .stat-item", {
      onEnter: (elements) => {
        gsap.to(elements, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          overwrite: true,
        });
      },
      start: "top 85%",
      once: true, // Only animate once for performance
    });

    // Set initial states
    gsap.set(".mission-text, .program-card, .testimonial-card", {
      opacity: 0,
      y: 30,
    });

    gsap.set(".stat-item", {
      opacity: 0,
      scale: 0.8,
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return <>{children}</>;
}
