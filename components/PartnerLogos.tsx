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

  // Duplicate partners many times for seamless continuous scroll
  const extendedPartners = [...partners, ...partners, ...partners, ...partners, ...partners, ...partners];

  // Distribute logos across rows with varied positions
  for (let i = 0; i < extendedPartners.length; i++) {
    const row = i % rows;
    pattern.push({
      ...extendedPartners[i],
      row,
      offset: Math.random() * 15, // Random vertical offset within row
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
    const scrollSpeed = 0.5; // Smooth scrolling speed

    const animate = () => {
      scrollPosition += scrollSpeed;

      // Get the width of half the content (one complete set of logos)
      const containerWidth = scrollContainer.scrollWidth;
      const halfWidth = containerWidth / 2;

      // Reset position seamlessly when we've scrolled through half the content
      if (scrollPosition >= halfWidth) {
        scrollPosition = scrollPosition - halfWidth;
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
        return 'w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24';
      case 'lg':
        return 'w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32';
      default:
        return 'w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28';
    }
  };

  return (
    <section className="py-20 bg-black overflow-hidden relative">
      <div className="container mx-auto px-6 mb-12">
        <div className="text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">Our Partners</h2>
          <p className="text-gray-300 text-base md:text-lg">
            Collaborating with organizations that share our vision for Bitcoin adoption
          </p>
        </div>
      </div>

      {/* Logo Container with Fade Overlays */}
      <div className="relative">
        {/* Fade Overlays - Smooth gradients on all sides */}
        <div className="absolute left-0 top-0 bottom-0 w-32 md:w-56 bg-gradient-to-r from-black via-black/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 md:w-56 bg-gradient-to-l from-black via-black/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-16 md:h-20 bg-gradient-to-b from-black via-black/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-20 bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none" />

        {/* Masonry Grid Container */}
        <div className="relative h-56 md:h-64 lg:h-72 overflow-hidden">
          <div
            ref={scrollRef}
            className="absolute inset-0 flex items-center will-change-transform"
            style={{ width: 'fit-content' }}
          >
            {/* Row-based masonry layout - Duplicate for seamless loop */}
            <div className="flex flex-col justify-center h-full gap-3 md:gap-4 lg:gap-5">{/* Row 1 */}
            <div className="flex items-center gap-3 md:gap-6 lg:gap-8">{masonryPattern
                .filter(item => item.row === 0)
                .map((partner, index) => (
                  <div
                    key={`row1-${index}`}
                    className={`${getSizeClasses(partner.size)} shrink-0 flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl p-2 md:p-3 hover:bg-white/10 hover:border-bitcoin/30 transition-all duration-300 grayscale hover:grayscale-0 opacity-70 hover:opacity-100`}
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
            <div className="flex items-center gap-3 md:gap-6 lg:gap-8">
              {masonryPattern
                .filter(item => item.row === 1)
                .map((partner, index) => (
                  <div
                    key={`row2-${index}`}
                    className={`${getSizeClasses(partner.size)} shrink-0 flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl p-2 md:p-3 hover:bg-white/10 hover:border-bitcoin/30 transition-all duration-300 grayscale hover:grayscale-0 opacity-70 hover:opacity-100`}
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
            <div className="flex items-center gap-3 md:gap-6 lg:gap-8">
              {masonryPattern
                .filter(item => item.row === 2)
                .map((partner, index) => (
                  <div
                    key={`row3-${index}`}
                    className={`${getSizeClasses(partner.size)} shrink-0 flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl p-2 md:p-3 hover:bg-white/10 hover:border-bitcoin/30 transition-all duration-300 grayscale hover:grayscale-0 opacity-70 hover:opacity-100`}
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
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <p className="text-gray-400 text-sm md:text-base">
          Interested in partnering with Afribit?{' '}
          <a href="/contact" className="text-bitcoin hover:text-white transition-colors font-semibold">
            Get in touch
          </a>
        </p>
      </div>
    </section>
  );
}
