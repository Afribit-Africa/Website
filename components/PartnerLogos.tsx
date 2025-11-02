'use client';

import { useEffect, useRef } from 'react';

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
    const scrollSpeed = 0.5; // pixels per frame

    const animate = () => {
      scrollPosition += scrollSpeed;
      
      // Reset scroll position when we've scrolled one full set of logos
      const maxScroll = scrollContainer.scrollWidth / 2;
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0;
      }
      
      scrollContainer.style.transform = `translateX(-${scrollPosition}px)`;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Duplicate the logos array for seamless infinite scroll
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

        {/* Logo Carousel */}
        <div className="relative">
          {/* Fade overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-linear-to-r from-black via-black to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-linear-to-l from-black via-black to-transparent z-10 pointer-events-none" />

          {/* Scrolling container */}
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

        {/* Optional: Partner stats or CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Interested in partnering with Afribit?{' '}
            <a href="#contact" className="text-bitcoin hover:text-white transition-colors font-semibold">
              Get in touch
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
