'use client';

import { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, Bitcoin } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    setIsChecking(true);

    try {
      // Try to fetch a small resource to check connection
      const response = await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-cache'
      });

      if (response.ok) {
        // Connection restored, reload the page
        window.location.reload();
      }
    } catch (error) {
      // Still offline
      setIsOnline(false);
    } finally {
      setIsChecking(false);
    }
  };

  // If online, redirect to home
  useEffect(() => {
    if (isOnline) {
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }
  }, [isOnline]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A0A00] to-[#0A0A0A] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #F7931A 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Bitcoin Orange Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-bitcoin/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-bitcoin/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full text-center">
          {/* WiFi Off Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-500/20 rounded-full mb-8 animate-pulse">
            <WifiOff className="w-12 h-12 text-red-500" />
          </div>

          {/* Status Message */}
          {isOnline ? (
            <>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                Connection Restored!
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Redirecting you back...
              </p>
              <div className="flex justify-center">
                <Bitcoin className="w-8 h-8 text-bitcoin animate-spin" />
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                No Internet Connection
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Please check your internet connection and try again.
              </p>

              {/* Retry Button */}
              <Button
                variant="primary"
                onClick={handleRetry}
                loading={isChecking}
                disabled={isChecking}
                icon={<RefreshCw className={`w-5 h-5 ${isChecking ? 'animate-spin' : ''}`} />}
                className="w-full sm:w-auto"
              >
                {isChecking ? 'Checking Connection...' : 'Try Again'}
              </Button>

              {/* Troubleshooting Tips */}
              <div className="mt-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-left">
                <h3 className="text-white font-semibold mb-4 text-center">Troubleshooting Tips</h3>
                <ul className="space-y-3 text-gray-300 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="text-bitcoin mt-0.5">1.</span>
                    <span>Check if your WiFi or mobile data is turned on</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-bitcoin mt-0.5">2.</span>
                    <span>Try turning Airplane mode on and off</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-bitcoin mt-0.5">3.</span>
                    <span>Restart your router or modem</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-bitcoin mt-0.5">4.</span>
                    <span>Check if other websites are loading</span>
                  </li>
                </ul>
              </div>

              {/* Offline Features Info */}
              <p className="text-gray-400 text-sm mt-6">
                Some cached content may still be available offline
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
