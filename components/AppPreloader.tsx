"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiBitcoin } from 'react-icons/si';

export default function AppPreloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading with smooth progress
    const duration = 2000; // 2 seconds total
    const steps = 50; // Number of updates
    const increment = 100 / steps;
    const interval = duration / steps;

    let currentStep = 0;
    const progressInterval = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(currentStep * increment, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(progressInterval);
        // Hide preloader after bar fills
        setTimeout(() => {
          setLoading(false);
        }, 400);
      }
    }, interval);

    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-9999 bg-black flex items-center justify-center"
        >
          <div className="text-center">
            {/* Bitcoin Icon - Static */}
            <div className="mb-6 flex justify-center">
              <SiBitcoin className="w-16 h-16 text-bitcoin" />
            </div>

            {/* Brand Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold font-heading text-white mb-6">
                Afribit Kibera
              </h2>
              
              {/* Loading Bar */}
              <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden mx-auto relative">
                <motion.div
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.05, ease: "linear" }}
                  className="h-full bg-white rounded-full shadow-lg shadow-white/30"
                />
              </div>
              
              {/* Progress Percentage */}
              <div className="mt-3 text-white text-sm font-mono">
                {Math.round(progress)}%
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
