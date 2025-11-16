"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiUser, FiUserCheck } from 'react-icons/fi';
import { DonationTier } from '@/lib/types';

interface DonorDetailsFormProps {
  selectedTier: DonationTier;
  customAmount: string;
  setCustomAmount: (amount: string) => void;
  donationType: 'anonymous' | 'named';
  setDonationType: (type: 'anonymous' | 'named') => void;
  donorName: string;
  setDonorName: (name: string) => void;
  donorEmail: string;
  setDonorEmail: (email: string) => void;
  error: string;
  onBack: () => void;
  onContinue: () => void;
}

export function DonorDetailsForm({
  selectedTier,
  customAmount,
  setCustomAmount,
  donationType,
  setDonationType,
  donorName,
  setDonorName,
  donorEmail,
  setDonorEmail,
  error,
  onBack,
  onContinue,
}: DonorDetailsFormProps) {
  const displayAmount = selectedTier.isCustom ? customAmount : selectedTier.amount.toString();
  const isValid = selectedTier.isCustom
    ? parseFloat(customAmount) > 0
    : true;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <FiArrowLeft /> Back to tiers
      </button>

      <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-8 space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{selectedTier.title}</h2>
          <p className="text-gray-400">{selectedTier.subtitle}</p>
        </div>

        {selectedTier.isCustom && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              Enter Amount (USD)
            </label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bitcoin"
            />
            {customAmount && parseFloat(customAmount) > 0 && (
              <p className="text-sm text-gray-400">
                You're contributing ${parseFloat(customAmount).toFixed(2)}
              </p>
            )}
          </div>
        )}

        {!selectedTier.isCustom && (
          <div className="bg-bitcoin/10 border border-bitcoin/30 rounded-lg p-4">
            <p className="text-center text-2xl font-bold text-bitcoin">
              ${selectedTier.amount.toFixed(2)}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-sm font-medium text-white">Choose your recognition preference:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setDonationType('anonymous')}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                donationType === 'anonymous'
                  ? 'bg-bitcoin/10 border-bitcoin text-white'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
              }`}
            >
              <FiUser className="text-2xl" />
              <div className="text-left">
                <p className="font-semibold">Anonymous</p>
                <p className="text-xs">Keep your contribution private</p>
              </div>
            </button>

            <button
              onClick={() => setDonationType('named')}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                donationType === 'named'
                  ? 'bg-bitcoin/10 border-bitcoin text-white'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
              }`}
            >
              <FiUserCheck className="text-2xl" />
              <div className="text-left">
                <p className="font-semibold">Named</p>
                <p className="text-xs">Be recognized as a supporter</p>
              </div>
            </button>
          </div>
        </div>

        {donationType === 'named' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">
                Your Name <span className="text-bitcoin">*</span>
              </label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bitcoin"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">
                Your Email <span className="text-bitcoin">*</span>
              </label>
              <input
                type="email"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bitcoin"
              />
              <p className="text-xs text-gray-400">
                We'll send you a donation receipt and updates
              </p>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-2">Your Impact:</h4>
          <p className="text-sm text-gray-300">{selectedTier.perk}</p>
        </div>

        <button
          onClick={onContinue}
          disabled={!isValid}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-bitcoin hover:bg-bitcoin-dark text-black font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Payment <FiArrowRight />
        </button>
      </div>
    </div>
  );
}
