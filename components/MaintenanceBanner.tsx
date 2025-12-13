'use client';

import { AlertCircle, X, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MaintenanceBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner
    const dismissed = sessionStorage.getItem('maintenance-banner-dismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('maintenance-banner-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="bg-white border-b-2 border-orange-200 shadow-sm py-3 px-4 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <div className="flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-sm md:text-base text-gray-800">
            <span className="font-semibold text-gray-900">Service Update:</span>
            {' '}
            We're migrating to improved infrastructure. Some services may be temporarily unavailable.
            {' '}
            <Link 
              href="/maintenance" 
              className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium underline decoration-orange-300 hover:decoration-orange-500 transition-colors"
            >
              Learn more
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors text-gray-500 hover:text-gray-700"
          aria-label="Dismiss banner"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
