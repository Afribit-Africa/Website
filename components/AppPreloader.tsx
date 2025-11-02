"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiBitcoin } from 'react-icons/si';

export default function AppPreloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    // Hide preloader after animation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1300);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
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
              <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                  className="h-full bg-bitcoin rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
