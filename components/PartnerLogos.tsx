'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

const partners = [
  { name: 'Bitcoin Conference', logo: '/Media/Partner logos/Bitcoin-confed.jpg', width: 120, height: 60, size: 'md' },
  { name: 'FBCE Global', logo: '/Media/Partner logos/fbceglobal_logo.jpg', width: 100, height: 50, size: 'sm' },
  { name: 'Geyser', logo: '/Media/Partner logos/Geyser.png', width: 140, height: 70, size: 'lg' },
  { name: 'Rottweil', logo: '/Media/Partner logos/Rottweil.jpg', width: 110, height: 55, size: 'md' },
  { name: 'Afribit', logo: '/Media/Logo/Full logo png transparent.png', width: 90, height: 45, size: 'sm' },
];

// Create a masonry-style grid with varied sizes
const createMasonryPattern = () => {
  const pattern = [];
  const rows = 3; // 3 rows for masonry effect
  
  // Duplicate partners multiple times for continuous scroll
  const extendedPartners = [...partners, ...partners, ...partners, ...partners, ...partners];
  
  // Distribute logos across rows with varied positions
  for (let i = 0; i < extendedPartners.length; i++) {
    const row = i % rows;
    pattern.push({
      ...extendedPartners[i],
      row,
      offset: Math.random() * 20, // Random vertical offset within row
    });
  }
  
  return pattern;
};

export default function PartnerLogos() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const masonryPattern = createMasonryPattern();

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.3; // Slow, smooth scrolling

    const animate = () => {
      scrollPosition += scrollSpeed;
      const maxScroll = scrollContainer.scrollWidth / 2;
      
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0;
      }
      
      scrollContainer.style.transform = `translateX(-${scrollPosition}px)`;
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'w-20 h-20 md:w-24 md:h-24';
      case 'lg':
        return 'w-32 h-32 md:w-40 md:h-40';
      default:
        return 'w-24 h-24 md:w-32 md:h-32';
    }
  };

  return (
    <section className="py-20 bg-black overflow-hidden relative">
      <div className="container mx-auto px-6 mb-16">
        <div className="text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">Our Partners</h2>
          <p className="text-gray-400 text-lg">
            Collaborating with organizations that share our vision for Bitcoin adoption
          </p>
        </div>
      </div>

      {/* Fade Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-black via-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-l from-black via-black to-transparent z-10 pointer-events-none" />

      {/* Masonry Grid Container */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div
          ref={scrollRef}
          className="absolute inset-0 flex items-center"
          style={{ width: 'fit-content' }}
        >
          {/* Row-based masonry layout */}
          <div className="flex flex-col justify-center h-full gap-4 md:gap-6">
            {/* Row 1 */}
            <div className="flex items-center gap-4 md:gap-8">
              {masonryPattern
                .filter(item => item.row === 0)
                .map((partner, index) => (
                  <div
                    key={`row1-${index}`}
                    className={`${getSizeClasses(partner.size)} shrink-0 flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 hover:bg-white/10 hover:border-bitcoin/30 transition-all duration-300 grayscale hover:grayscale-0 opacity-70 hover:opacity-100`}
                    style={{
                      transform: `translateY(${partner.offset}px)`,
                    }}
                  >
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={partner.width}
                      height={partner.height}
                      className="object-contain w-full h-full"
                      loading="lazy"
                    />
                  </div>
                ))}
            </div>

            {/* Row 2 */}
            <div className="flex items-center gap-4 md:gap-8">
              {masonryPattern
                .filter(item => item.row === 1)
                .map((partner, index) => (
                  <div
                    key={`row2-${index}`}
                    className={`${getSizeClasses(partner.size)} shrink-0 flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 hover:bg-white/10 hover:border-bitcoin/30 transition-all duration-300 grayscale hover:grayscale-0 opacity-70 hover:opacity-100`}
                    style={{
                      transform: `translateY(${partner.offset}px)`,
                    }}
                  >
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={partner.width}
                      height={partner.height}
                      className="object-contain w-full h-full"
                      loading="lazy"
                    />
                  </div>
                ))}
            </div>

            {/* Row 3 */}
            <div className="flex items-center gap-4 md:gap-8">
              {masonryPattern
                .filter(item => item.row === 2)
                .map((partner, index) => (
                  <div
                    key={`row3-${index}`}
                    className={`${getSizeClasses(partner.size)} shrink-0 flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 hover:bg-white/10 hover:border-bitcoin/30 transition-all duration-300 grayscale hover:grayscale-0 opacity-70 hover:opacity-100`}
                    style={{
                      transform: `translateY(${partner.offset}px)`,
                    }}
                  >
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={partner.width}
                      height={partner.height}
                      className="object-contain w-full h-full"
                      loading="lazy"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16">
        <p className="text-gray-500 text-sm md:text-base">
          Interested in partnering with Afribit?{' '}
          <a href="/contact" className="text-bitcoin hover:text-white transition-colors font-semibold">
            Get in touch
          </a>
        </p>
      </div>
    </section>
  );
}
