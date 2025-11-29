'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function EarlyAdopterBanner() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Hide banner on admin pages
  const isAdminPage = pathname.startsWith('/admin');

  useEffect(() => {
    // Don't show on admin pages
    if (isAdminPage) {
      setIsVisible(false);
      return;
    }

    // Check if banner was dismissed
    const dismissed = localStorage.getItem('earlyAdopterBannerDismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, [isAdminPage]);

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('earlyAdopterBannerDismissed', 'true');
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[100] bg-black border-b border-white/10 shadow-2xl transition-all duration-300 ${
        isClosing ? 'translate-y-[-100%]' : 'translate-y-0'
      }`}
    >
      <div className="relative overflow-hidden">
        <div className="relative px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-7 h-7 bg-bitcoin/20 rounded-lg flex items-center justify-center border border-bitcoin/30">
                <AlertCircle className="w-4 h-4 text-bitcoin" />
              </div>
            </div>

            {/* Scrolling content */}
            <Link
              href="/merchants/confirm-details"
              className="flex-1 overflow-hidden cursor-pointer group"
            >
              <div className="animate-marquee whitespace-nowrap pause-marquee">
                <span className="inline-block text-white font-medium text-sm pr-16 font-body">
                  <AlertCircle className="w-4 h-4 inline-block text-bitcoin mr-1" /> <strong className="text-bitcoin font-heading">Early Adopter Merchants:</strong> Please confirm your business details to ensure accuracy on Bitcoin Maps.
                  <span className="ml-2 text-gray-300">Click here to verify your location and contact information →</span>
                </span>
                <span className="inline-block text-white font-medium text-sm pr-16 font-body">
                  <AlertCircle className="w-4 h-4 inline-block text-bitcoin mr-1" /> <strong className="font-heading">Early Adopter Merchants:</strong> Please confirm your business details to ensure accuracy on Bitcoin Maps.
                  <span className="ml-2 text-white/90">Click here to verify your location and contact information →</span>
                </span>
              </div>
            </Link>

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1.5 hover:bg-white/20 rounded-lg transition-colors group"
              aria-label="Dismiss banner"
            >
              <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
