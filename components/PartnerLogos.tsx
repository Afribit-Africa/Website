'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const partners = [
  { name: 'Bitcoin Conference', logo: '/Media/Partner logos/Bitcoin-confed.jpg', height: 60 },
  { name: 'FBCE Global', logo: '/Media/Partner logos/fbceglobal_logo.jpg', height: 60 },
  { name: 'Geyser', logo: '/Media/Partner logos/Geyser.png', height: 60 },
  { name: 'Rottweil', logo: '/Media/Partner logos/Rottweil.jpg', height: 60 },
  { name: 'Fedi', logo: '/Media/Partner logos/Fedi logo.jpg', height: 60 },
];

// Shuffle array function
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Create a masonry-style grid with varied sizes
const createMasonryPattern = () => {
  const pattern = [];
  const rows = 3;

  // Shuffle partners for variety
  const shuffledPartners = shuffleArray(partners);

  // Create enough duplicates for smooth infinite scroll
  const duplicates = 30; // Increased for smoother transitions
  const extendedPartners = Array(duplicates).fill(shuffledPartners).flat();

  // Distribute logos across rows with consistent offsets
  for (let i = 0; i < extendedPartners.length; i++) {
    const row = i % rows;
    const partnerIndex = i % partners.length;
    pattern.push({
      ...extendedPartners[i],
      row,
      offset: (partnerIndex * 7) % 12,
    });
  }

  return pattern;
};

export default function PartnerLogos() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [masonryPattern, setMasonryPattern] = useState<ReturnType<typeof createMasonryPattern>>([]);
  const [isClient, setIsClient] = useState(false);
  const loopCountRef = useRef(0);

  // Initialize pattern on client only to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
    setMasonryPattern(createMasonryPattern());
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !isClient) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.3; // Slower speed for better viewing
    const singleSetWidth = partners.length * 160; // Approximate width per partner set

    const animate = () => {
      scrollPosition += scrollSpeed;

      // Reset and reshuffle when one complete set has scrolled
      if (scrollPosition >= singleSetWidth) {
        scrollPosition = 0;
        loopCountRef.current += 1;

        // Reshuffle logos every loop
        setMasonryPattern(createMasonryPattern());
      }

      scrollContainer.style.transform = `translateX(-${scrollPosition}px)`;
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isClient]);

  // Show loading skeleton during SSR/initial client render
  if (!isClient || masonryPattern.length === 0) {
    return (
      <section className="py-20 md:py-32 bg-black overflow-hidden relative">
        <div className="container mx-auto px-4 md:px-6 mb-12">
          <div className="text-center">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">Our Partners</h2>
            <p className="text-gray-300 text-base md:text-lg">
              Collaborating with organizations that share our vision for Bitcoin adoption
            </p>
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="relative h-56 md:h-64 lg:h-72 overflow-hidden flex items-center justify-center">
            <div className="flex gap-6">
              {partners.map((partner, i) => (
                <div
                  key={i}
                  className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 shrink-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const getSizeClasses = () => {
    // All logos same height for uniformity
    return 'h-14 md:h-16 lg:h-20 w-auto';
  };

  return (
    <section className="py-20 md:py-32 bg-black overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-6 mb-12">
        <div className="text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">Our Partners</h2>
          <p className="text-gray-300 text-base md:text-lg">
            Collaborating with organizations that share our vision for Bitcoin adoption
          </p>
        </div>
      </div>

      {/* Logo Container with Fade Overlays */}
      <div className="relative max-w-7xl mx-auto">
        {/* Fade Overlays - All four sides for professional look */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-black via-black/95 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-black via-black/95 to-transparent z-10 pointer-events-none" />
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
                    className={`${getSizeClasses()} shrink-0 flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4 hover:bg-white/10 hover:border-bitcoin/30 transition-all duration-300 grayscale hover:grayscale-0 opacity-70 hover:opacity-100`}
                    style={{
                      transform: `translateY(${partner.offset}px)`,
                    }}
                  >
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={120}
                      height={partner.height}
                      className="object-contain w-auto h-full"
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
                    className={`${getSizeClasses()} shrink-0 flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4 hover:bg-white/10 hover:border-bitcoin/30 transition-all duration-300 grayscale hover:grayscale-0 opacity-70 hover:opacity-100`}
                    style={{
                      transform: `translateY(${partner.offset}px)`,
                    }}
                  >
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={120}
                      height={partner.height}
                      className="object-contain w-auto h-full"
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
                    className={`${getSizeClasses()} shrink-0 flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4 hover:bg-white/10 hover:border-bitcoin/30 transition-all duration-300 grayscale hover:grayscale-0 opacity-70 hover:opacity-100`}
                    style={{
                      transform: `translateY(${partner.offset}px)`,
                    }}
                  >
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={120}
                      height={partner.height}
                      className="object-contain w-auto h-full"
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
