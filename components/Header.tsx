"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiHome, FiMapPin, FiMail, FiHelpCircle } from 'react-icons/fi';
import { SiBitcoin } from 'react-icons/si';

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Set scrolled state for darker background
      setScrolled(currentScrollY > 50);
      
      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setVisible(false);
      } else {
        // Scrolling up
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Desktop Floating Header - Thin & Minimalistic */}
      <header 
        className={`hidden md:block fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl transition-all duration-300 ${
          visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <nav 
          className={`glass-card py-3 px-6 transition-all duration-300 ${
            scrolled ? 'bg-black/80 backdrop-blur-xl' : ''
          }`}
          style={{
            background: scrolled ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.05)',
          }}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/Media/Logo/icon symbol only svg.svg"
                alt="Afribit Africa"
                width={32}
                height={32}
                className="transition-transform group-hover:scale-110"
              />
              <span className="text-lg font-bold">
                Afribit <span className="text-gradient">Africa</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="flex items-center gap-6">
              <Link 
                href="/#approach" 
                className="text-sm text-gray-300 hover:text-bitcoin transition-colors"
              >
                Our Approach
              </Link>
              <Link 
                href="/#impact" 
                className="text-sm text-gray-300 hover:text-bitcoin transition-colors"
              >
                Impact
              </Link>
              <Link 
                href="/#testimonials" 
                className="text-sm text-gray-300 hover:text-bitcoin transition-colors"
              >
                Testimonials
              </Link>
              <Link 
                href="/#faq" 
                className="text-sm text-gray-300 hover:text-bitcoin transition-colors"
              >
                FAQ
              </Link>
              <Link 
                href="/maps" 
                className="text-sm text-gray-300 hover:text-bitcoin transition-colors"
              >
                Merchants
              </Link>
              <Link
                href="/donate"
                className="btn btn-primary px-5 py-2 text-sm"
              >
                Fuel BCE
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Navigation - Black Background with Better Icons */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black pb-safe">
        <div className="flex items-center justify-around py-3 px-2">
          {/* Home */}
          <Link 
            href="/" 
            className={`flex items-center justify-center w-12 h-10 rounded-lg transition-all ${
              pathname === '/' ? 'text-bitcoin bg-bitcoin/10' : 'text-gray-400 hover:text-bitcoin'
            }`}
          >
            <FiHome className="w-6 h-6" />
          </Link>

          {/* Merchants */}
          <Link 
            href="/maps" 
            className={`flex items-center justify-center w-12 h-10 rounded-lg transition-all ${
              pathname === '/maps' ? 'text-bitcoin bg-bitcoin/10' : 'text-gray-400 hover:text-bitcoin'
            }`}
          >
            <FiMapPin className="w-6 h-6" />
          </Link>

          {/* Donate - Bitcoin Icon */}
          <Link 
            href="/donate"
            className={`flex items-center justify-center w-12 h-10 rounded-lg transition-all ${
              pathname === '/donate' ? 'text-bitcoin bg-bitcoin/10' : 'text-gray-400 hover:text-bitcoin'
            }`}
          >
            <SiBitcoin className="w-6 h-6" />
          </Link>

          {/* Contact - Mail Icon */}
          <a 
            href="mailto:connect@afribit.africa" 
            className="flex items-center justify-center w-12 h-10 rounded-lg text-gray-400 hover:text-bitcoin transition-all"
          >
            <FiMail className="w-6 h-6" />
          </a>

          {/* FAQ - Help Icon */}
          <Link 
            href="/#faq" 
            className="flex items-center justify-center w-12 h-10 rounded-lg text-gray-400 hover:text-bitcoin transition-all"
          >
            <FiHelpCircle className="w-6 h-6" />
          </Link>
        </div>
      </nav>
    </>
  );
}
