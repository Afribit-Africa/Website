"use client";

import { motion } from 'framer-motion';
import { FiCheck, FiDownload } from 'react-icons/fi';
import { SiBitcoin } from 'react-icons/si';
import Link from 'next/link';
import { useEffect } from 'react';

interface SuccessScreenProps {
  donorName?: string;
  amount: number;
  tier: string;
  invoiceId: string;
}

export function SuccessScreen({ donorName, amount, tier, invoiceId }: SuccessScreenProps) {
  useEffect(() => {
    // Optional: Add confetti celebration if package is installed
    // Install with: npm install canvas-confetti
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#1A1A1A] border border-white/10 rounded-xl p-8 space-y-6 text-center"
      >
        {/* Success Icon */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center"
          >
            <FiCheck className="text-5xl text-green-500" />
          </motion.div>
        </div>

        {/* Thank You Message */}
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Thank You{donorName ? `, ${donorName}` : ''}!
          </h2>
          <p className="text-xl text-gray-400">
            Your contribution makes a real difference
          </p>
        </div>

        {/* Donation Details */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <SiBitcoin className="text-3xl text-bitcoin" />
            <div className="text-left">
              <p className="text-sm text-gray-400">Donation Amount</p>
              <p className="text-2xl font-bold text-bitcoin">${amount.toFixed(2)} USD</p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Tier</span>
              <span className="text-white font-medium">{tier}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Transaction ID</span>
              <span className="text-white font-mono text-xs">{invoiceId.slice(0, 16)}...</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Payment Method</span>
              <span className="text-white">Bitcoin Lightning</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-bitcoin/10 border border-bitcoin/30 rounded-lg p-4 text-left">
          <h4 className="font-semibold text-white mb-3">What happens next?</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex gap-2">
              <span className="text-bitcoin">✓</span>
              <span>You'll receive an email receipt shortly</span>
            </li>
            <li className="flex gap-2">
              <span className="text-bitcoin">✓</span>
              <span>Your contribution will be allocated to the selected program</span>
            </li>
            <li className="flex gap-2">
              <span className="text-bitcoin">✓</span>
              <span>We'll send you regular updates on your impact</span>
            </li>
            {donorName && (
              <li className="flex gap-2">
                <span className="text-bitcoin">✓</span>
                <span>Your name will be added to our supporters page</span>
              </li>
            )}
          </ul>
        </div>

        {/* Call to Action */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <Link
            href="/donors"
            className="py-3 px-6 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FiCheck /> View All Donors
          </Link>
          <Link
            href="/"
            className="py-3 px-6 bg-bitcoin hover:bg-bitcoin-dark text-black font-semibold rounded-lg transition-colors"
          >
            Return Home
          </Link>
        </div>

        {/* Social Share */}
        <div className="border-t border-white/10 pt-6">
          <p className="text-sm text-gray-400 mb-3">
            Help us spread the word about Bitcoin adoption in Kibera
          </p>
          <div className="flex justify-center gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=I just supported Bitcoin adoption in Kibera through @AfribitAfrica! Join me in empowering the community with financial freedom. 🧡⚡&url=https://afribit.africa/donate`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
            >
              Share on Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=https://afribit.africa/donate`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm transition-colors"
            >
              Share on Facebook
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
