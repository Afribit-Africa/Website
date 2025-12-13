'use client';

import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

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
    <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 text-white py-3 px-4 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
          <div className="text-sm md:text-base">
            <span className="font-semibold">Database Migration in Progress:</span>
            {' '}
            We're currently migrating our databases to a new hosting provider. Some services including merchant registration, verifier dashboard, and admin functions may be temporarily unavailable. We apologize for any inconvenience and expect to complete the migration within 24 hours.
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
