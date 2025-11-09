'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const partners = [
  { name: 'Bitcoin Conference', logo: '/Media/Partner logos/Bitcoin-confed.jpg' },
  { name: 'FBCE Global', logo: '/Media/Partner logos/fbceglobal_logo.jpg' },
  { name: 'Geyser', logo: '/Media/Partner logos/Geyser.png' },
  { name: 'Rottweil', logo: '/Media/Partner logos/Rottweil.jpg' },
];

export default function PartnerLogos() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Desktop auto-scroll
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const animate = () => {
      scrollPosition += scrollSpeed;
      const maxScroll = scrollContainer.scrollWidth / 2;
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0;
      }
      scrollContainer.style.transform = `translateX(-${scrollPosition}px)`;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Mobile carousel auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % partners.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(timer);
  }, []);

  const duplicatedLogos = [...partners, ...partners, ...partners];

  return (
    <section className="py-16 bg-black overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">Our Partners</h2>
          <p className="text-gray-400 text-lg">
            Collaborating with organizations that share our vision for Bitcoin adoption
          </p>
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden">
          <div className="relative h-64 flex flex-col items-center justify-center">
            {/* Center Afribit Logo */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl shadow-bitcoin/30 border-2 border-bitcoin/20"
            >
              <img
                src="/Media/Logo/Full logo png transparent.png"
                alt="Afribit"
                className="w-20 h-20 object-contain"
              />
            </motion.div>

            {/* Carousel Container */}
            <div className="relative w-full max-w-xs h-32">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 w-40 h-32 flex items-center justify-center">
                    <img
                      src={partners[currentIndex].logo}
                      alt={partners[currentIndex].name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Carousel Indicators */}
            <div className="flex gap-2 mt-6">
              {partners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-bitcoin w-8'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to partner ${index + 1}`}
                />
              ))}
            </div>

            {/* Partner Name */}
            <p className="text-gray-400 text-sm mt-4">{partners[currentIndex].name}</p>
          </div>
        </div>

        {/* Desktop: Horizontal Scroll */}
        <div className="hidden md:block relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-linear-to-r from-black via-black to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-linear-to-l from-black via-black to-transparent z-10 pointer-events-none" />

          <div className="overflow-hidden">
            <div
              ref={scrollRef}
              className="flex items-center gap-8 md:gap-24"
              style={{ width: 'fit-content' }}
            >
              {duplicatedLogos.map((partner, index) => (
                <div
                  key={`${partner.name}-${index}`}
                  className="shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 backdrop-blur-sm hover:border-bitcoin/30"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-10 md:h-16 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Interested in partnering with Afribit?{' '}
            <a href="/contact" className="text-bitcoin hover:text-white transition-colors font-semibold">
              Get in touch
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
