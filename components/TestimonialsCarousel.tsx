'use client';

import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { ImQuotesLeft } from 'react-icons/im';

const testimonials = [
  {
    id: 1,
    name: 'Brian',
    role: 'Boda-Boda Rider',
    initial: 'B',
    quote: 'Through Afribit, I was able to complete my driving classes. The repayment in sats is very affordable. I can now convert my sats, save some, and spend some within the circular economy—supporting other riders and helping the whole community grow.',
  },
  {
    id: 2,
    name: 'DaMian Magak',
    role: 'Entrepreneur',
    initial: 'D',
    quote: 'I proudly call myself a Bitcoin-converted soul. Through the Live Great Waste Management group, I began earning in Bitcoin. With the sats I saved, I launched my own fast food business. Bitcoin is truly the best thing that has happened to me.',
  },
  {
    id: 3,
    name: 'Steph',
    role: 'Food Merchant',
    initial: 'S',
    quote: "I was the first merchant selling fries, juice, and porridge. Thanks to my Bitcoin earnings, I bought a motorbike and expanded my business. Bitcoin hasn't just helped me grow; it has given me the confidence to dream even bigger.",
  },
  {
    id: 4,
    name: 'Glen Omolo',
    role: 'Waste Management',
    initial: 'G',
    quote: "When Afribit introduced Bitcoin to our waste management group, I was immediately hooked. I've been earning and stacking sats regularly. I also joined the Core Bitcoin Classes to deepen my understanding. It's about financial freedom.",
  },
  {
    id: 5,
    name: 'Abebo',
    role: 'Upcycle Queen',
    initial: 'A',
    quote: 'As part of the Upcycle Queens initiative, I learned how to create beautiful, functional items from materials that would otherwise be thrown away. My creations are now earning me Bitcoin, and I get to contribute to a sustainable future.',
  },
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(1); // Start at index 1 to show prev/current/next
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getCardPosition = (index: number) => {
    const diff = index - currentIndex;
    if (diff === 0) return 'center'; // Spotlight
    if (diff === -1 || diff === testimonials.length - 1) return 'left';
    if (diff === 1 || diff === -testimonials.length + 1) return 'right';
    return 'hidden';
  };

  return (
    <div 
      className="relative max-w-6xl mx-auto px-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Carousel Container */}
      <div className="relative h-[450px] md:h-[500px] flex items-center justify-center">
        {testimonials.map((testimonial, index) => {
          const position = getCardPosition(index);
          
          return (
            <div
              key={testimonial.id}
              className={`absolute transition-all duration-700 ease-out ${
                position === 'center'
                  ? 'z-20 scale-100 opacity-100 translate-x-0'
                  : position === 'left'
                  ? 'z-10 scale-75 opacity-40 -translate-x-[400px] blur-sm hidden md:block'
                  : position === 'right'
                  ? 'z-10 scale-75 opacity-40 translate-x-[400px] blur-sm hidden md:block'
                  : 'opacity-0 scale-50'
              }`}
              style={{ width: '600px', maxWidth: '90vw' }}
            >
              {/* Glass Card */}
              <div className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl border-2 border-white/20 rounded-2xl md:rounded-3xl p-5 md:p-10 shadow-2xl">
                {/* Quote Icon */}
                <div className="text-bitcoin/20 mb-4 md:mb-6">
                  <ImQuotesLeft className="w-8 md:w-12 h-8 md:h-12" />
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-200 text-sm md:text-xl leading-relaxed mb-6 md:mb-8 italic min-h-[120px] md:min-h-[140px]">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Author Info */}
                <div className="flex items-center">
                  <div className="w-12 md:w-16 h-12 md:h-16 bg-linear-to-br from-bitcoin to-orange-600 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold text-black shrink-0">
                    {testimonial.initial}
                  </div>
                  <div className="ml-3 md:ml-4">
                    <div className="font-bold text-base md:text-xl text-white font-heading">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm md:text-base">{testimonial.role}</div>
                  </div>
                </div>

                {/* Bitcoin Badge */}
                <div className="absolute top-4 md:top-8 right-4 md:right-8 bg-bitcoin/10 border border-bitcoin/30 rounded-full px-3 md:px-4 py-1.5 md:py-2 backdrop-blur-sm">
                  <span className="text-bitcoin text-xs md:text-sm font-semibold">Bitcoin Advocate</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows - Desktop: side positions, Mobile: below */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:flex w-14 h-14 bg-linear-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/30 rounded-full items-center justify-center text-white hover:from-bitcoin/30 hover:to-bitcoin/20 hover:border-bitcoin/50 transition-all duration-300 z-30"
        aria-label="Previous testimonial"
      >
        <FiChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex w-14 h-14 bg-linear-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/30 rounded-full items-center justify-center text-white hover:from-bitcoin/30 hover:to-bitcoin/20 hover:border-bitcoin/50 transition-all duration-300 z-30"
        aria-label="Next testimonial"
      >
        <FiChevronRight className="w-6 h-6" />
      </button>

      {/* Mobile Navigation Below + Swipe Hint */}
      <div className="md:hidden mt-6 space-y-3">
        <p className="text-center text-xs text-gray-400">
          Swipe left or right to view more testimonials
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={prevSlide}
            className="w-12 h-12 bg-linear-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white active:scale-95 transition-all"
            aria-label="Previous testimonial"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="w-12 h-12 bg-linear-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white active:scale-95 transition-all"
            aria-label="Next testimonial"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Dots Indicator - Desktop only */}
      <div className="hidden md:flex justify-center gap-3 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'w-12 h-3 bg-bitcoin'
                : 'w-3 h-3 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
