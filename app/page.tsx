"use client";

import { BitcoinValuesMarquee } from "@/components/BitcoinValuesMarquee";
import { GSAPAnimations } from "@/components/GSAPAnimations";
import { DonationStats } from "@/components/DonationStats";
import { EnhancedFloatingVideo } from "@/components/EnhancedFloatingVideo";
import { MobileVideoPlayer } from "@/components/MobileVideoPlayer";
import { FloatingAudioPlayer } from "@/components/FloatingAudioPlayer";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import PartnerLogos from "@/components/PartnerLogos";
import ImpactStats from "@/components/ImpactStats";
import WhyKibera from "@/components/WhyKibera";
import NewsSection from "@/components/NewsSection";
import FAQ from "@/components/FAQ";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      
      {/* Desktop Video Player */}
      <div className="hidden md:block">
        <EnhancedFloatingVideo />
      </div>
      
      {/* Mobile Video Icon & Lightbox */}
      <MobileVideoPlayer />
      
      {/* Floating Audio Player */}
      <FloatingAudioPlayer />
      
      <GSAPAnimations>
        <div className="min-h-screen">
      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-24 md:pb-0 pt-24 lg:pt-32">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-30"
          >
            <source src="/Media/Videos/Home hero section video.mp4" type="video/mp4" />
          </video>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/60 to-black" />
        </div>
        
        {/* Content - PROPERLY CENTERED */}
        <div className="relative z-10 container max-w-5xl px-4 sm:px-6">
          <div className="text-center space-y-6 sm:space-y-8">
            {/* Main Heading */}
            <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight font-display">
              Empowering African Communities
              <br />
              <span className="text-gradient">Through Bitcoin</span>
            </h1>
            
            {/* Subtitle */}
            <p className="hero-subtitle text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Financial freedom, environmental stewardship, and community resilience — powered by sats.
            </p>
            
            {/* CTA Buttons - Properly Spaced */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4">
              <Link 
                href="/donate"
                className="btn btn-primary btn-lg w-full sm:w-auto"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Fuel the Movement
              </Link>
              <a href="#programs" className="btn btn-secondary btn-lg w-full sm:w-auto">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                View Programs
              </a>
            </div>
            
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-12 sm:pt-16 mt-12 sm:mt-16 border-t border-white/10 max-w-3xl mx-auto">
              <div className="stat-item text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient font-numbers">
                  <span className="counter" data-target="2000">0</span>+
                </div>
                <div className="text-gray-400 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">Transactions</div>
              </div>
              <div className="stat-item text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient font-numbers">
                  <span className="counter" data-target="40">0</span>+
                </div>
                <div className="text-gray-400 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">Merchants</div>
              </div>
              <div className="stat-item text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient font-numbers">
                  <span className="counter" data-target="5">0</span>
                </div>
                <div className="text-gray-400 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">Programs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== LIVE DONATION STATS ========== */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-6 max-w-4xl">
          <DonationStats />
        </div>
      </section>

      {/* ========== BITCOIN VALUES SECTION ========== */}
      <section id="approach" className="py-12 sm:py-16 md:py-20 bg-black overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6 sm:space-y-8">
            {/* Values Marquee */}
            <BitcoinValuesMarquee />

            {/* Mission Statement with GSAP animation */}
            <div className="mission-text">
              <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
                At Afribit, our mission is to empower underserved communities by providing the tools and knowledge needed to thrive in a global, decentralized economy through Bitcoin adoption and by promoting a Bitcoin circular economy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== IMPACT STATS SECTION ========== */}
      <ImpactStats />

      {/* ========== WHY KIBERA SECTION ========== */}
      <WhyKibera />

      {/* ========== PROGRAMS SECTION ========== */}
      <section id="programs" className="py-24 bg-black">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="font-heading text-5xl md:text-6xl font-bold mb-6">
              How We Build <span className="text-bitcoin">Circular Resilience</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Financial freedom, environmental stewardship, and community resilience — powered by sats
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Program 1 - Micro-Merchants & Traders */}
            <div className="program-card group overflow-hidden rounded-3xl bg-linear-to-b from-white/5 to-white/2 border border-white/10 hover:border-bitcoin/50 transition-all duration-500">
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="/Media/Images/Mama mboga groceries accepting bitcoin.jpg" 
                  alt="Micro-Merchants & Traders" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
              </div>
              
              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-2xl font-bold font-heading mb-3 text-white">Micro-Merchants & Traders</h3>
                
                <p className="text-gray-300 text-base mb-6 leading-relaxed">
                  Empowering local merchants to accept Bitcoin payments, building a thriving circular economy from the ground up.
                </p>
                
                <a href="/programs#merchants" className="inline-flex items-center text-bitcoin font-semibold hover:text-white transition-colors group/link text-sm">
                  Learn More 
                  <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Program 2 - Women's Upcycling Collective */}
            <div className="program-card group overflow-hidden rounded-3xl bg-linear-to-b from-white/5 to-white/2 border border-white/10 hover:border-bitcoin/50 transition-all duration-500">
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="/Media/Images/Trezor Academy session pics/IMG-20250914-WA0155.jpg" 
                  alt="Women's Upcycling Collective" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
              </div>
              
              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-2xl font-bold font-heading mb-3 text-white">Women's Upcycling Collective</h3>
                
                <p className="text-gray-300 text-base mb-6 leading-relaxed">
                  Training women to create valuable products from waste materials, earning Bitcoin while protecting the environment.
                </p>
                
                <a href="/programs#upcycle" className="inline-flex items-center text-bitcoin font-semibold hover:text-white transition-colors group/link text-sm">
                  Learn More 
                  <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Program 3 - Waste Incentives Program */}
            <div className="program-card group overflow-hidden rounded-3xl bg-linear-to-b from-white/5 to-white/2 border border-white/10 hover:border-bitcoin/50 transition-all duration-500">
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="/Media/Images/Waste Collection.jpg" 
                  alt="Waste Incentives Program" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
              </div>
              
              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-2xl font-bold font-heading mb-3 text-white">Waste Incentives Program</h3>
                
                <p className="text-gray-300 text-base mb-6 leading-relaxed">
                  Rewarding community members with Bitcoin for collecting and recycling waste, creating a cleaner Kibera.
                </p>
                
                <a href="/programs#waste" className="inline-flex items-center text-bitcoin font-semibold hover:text-white transition-colors group/link text-sm">
                  Learn More 
                  <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Program 4 - Boda-Boda "Ride to Freedom" */}
            <div className="program-card group overflow-hidden rounded-3xl bg-linear-to-b from-white/5 to-white/2 border border-white/10 hover:border-bitcoin/50 transition-all duration-500">
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="/Media/Images/Motorbike bitcoin onboarding.jpg" 
                  alt="Boda-Boda Ride to Freedom" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
              </div>
              
              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-2xl font-bold font-heading mb-3 text-white">Boda-Boda "Ride to Freedom"</h3>
                
                <p className="text-gray-300 text-base mb-6 leading-relaxed">
                  Providing motorcycle riders with Bitcoin microloans for licensing, insurance, and financial independence.
                </p>
                
                <a href="/programs#bodaboda" className="inline-flex items-center text-bitcoin font-semibold hover:text-white transition-colors group/link text-sm">
                  Learn More 
                  <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS SECTION ========== */}
      <section id="testimonials" className="py-24 bg-black relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl md:text-6xl font-bold mb-6">Community Success Stories</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Hear from real people whose lives have been transformed by Bitcoin
            </p>
          </div>
          
          <TestimonialsCarousel />
        </div>
      </section>

      {/* ========== PARTNER LOGOS SECTION ========== */}
      <PartnerLogos />

      {/* ========== NEWS SECTION ========== */}
      <NewsSection />

      {/* ========== FAQ SECTION ========== */}
      <FAQ />

      {/* ========== TWITTER CTA SECTION ========== */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            <div className="inline-block px-4 py-2 bg-black/5 border border-black/10 rounded-full">
              <span className="text-black font-semibold text-sm">Twitter</span>
            </div>
            
            <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl font-bold text-black">
              Don't miss what's next
            </h2>
            
            <p className="text-lg sm:text-xl md:text-2xl text-black/70 leading-relaxed max-w-2xl mx-auto">
              Stay updated with stories from the streets of Kibera — fresh from our community, partners, and friends.
            </p>
            
            <a
              href="https://twitter.com/afribitAfrica"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-xl"
            >
              Follow us on
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </section>
        </div>
      </GSAPAnimations>
    </>
  );
}
