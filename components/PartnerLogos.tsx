'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const partners = [
  { name: 'Bitcoin Conference', logo: '/Media/Partner logos/Bitcoin-confed.jpg' },
  { name: 'FBCE Global', logo: '/Media/Partner logos/fbceglobal_logo.jpg' },
  { name: 'Geyser', logo: '/Media/Partner logos/Geyser.png' },
  { name: 'Rottweil', logo: '/Media/Partner logos/Rottweil.jpg' },
];

export default function PartnerLogos() {
  const scrollRef = useRef<HTMLDivElement>(null);

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

        {/* Mobile: Circular Orbit Layout */}
        <div className="md:hidden relative h-96 flex items-center justify-center mb-8">
          {/* Center Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute z-10 w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-bitcoin/30 border-4 border-bitcoin/20"
          >
            <img
              src="/Media/Logo/Full logo png transparent.png"
              alt="Afribit"
              className="w-28 h-28 object-contain"
            />
          </motion.div>

          {/* Orbiting Partner Logos */}
          {partners.map((partner, index) => {
            const angle = (index * 360) / partners.length;
            const radius = 140;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;

            return (
              <motion.div
                key={partner.name}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  rotate: [0, 360]
                }}
                transition={{
                  scale: { duration: 0.4, delay: 0.4 + index * 0.1 },
                  opacity: { duration: 0.4, delay: 0.4 + index * 0.1 },
                  rotate: { duration: 30, repeat: Infinity, ease: "linear" }
                }}
                className="absolute w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-2 flex items-center justify-center hover:border-bitcoin/50 transition-colors"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all"
                />
              </motion.div>
            );
          })}

          {/* Orbit Ring */}
          <div className="absolute w-80 h-80 border-2 border-dashed border-white/10 rounded-full animate-spin" style={{ animationDuration: '40s' }} />
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
