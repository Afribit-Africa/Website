"use client";

import { motion } from 'framer-motion';
import { FiZap } from 'react-icons/fi';
import { SiBitcoin } from 'react-icons/si';

interface PaymentLoaderProps {
  message?: string;
}

export default function PaymentLoader({ message = "Processing payment..." }: PaymentLoaderProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-linear-to-br from-white/10 to-white/5 border border-bitcoin/30 rounded-2xl p-8 max-w-sm mx-4"
      >
        <div className="text-center">
          {/* Lightning Animation */}
          <div className="relative mb-6">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-20 h-20 border-4 border-bitcoin/20 border-t-bitcoin rounded-full" />
            </motion.div>
            
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 flex items-center justify-center w-20 h-20 mx-auto"
            >
              <FiZap className="w-10 h-10 text-bitcoin" />
            </motion.div>
          </div>

          {/* Message */}
          <h3 className="text-xl font-bold text-white mb-2">{message}</h3>
          <p className="text-sm text-gray-400">
            Please wait while we generate your invoice
          </p>

          {/* Loading Dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              className="w-2 h-2 bg-bitcoin rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              className="w-2 h-2 bg-bitcoin rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              className="w-2 h-2 bg-bitcoin rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
