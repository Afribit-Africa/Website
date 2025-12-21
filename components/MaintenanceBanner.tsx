'use client';

import { CheckCircle, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MaintenanceBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner
    const dismissed = sessionStorage.getItem('service-restored-banner-dismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('service-restored-banner-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-green-500 to-emerald-500 py-3 px-4 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <div className="flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div className="text-sm md:text-base text-white">
            <span className="font-semibold flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              We're Back!
            </span>
            {' '}
            Our infrastructure upgrade is complete. All services are now fully operational with improved performance.
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors text-white"
          aria-label="Dismiss banner"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
