"use client";

import { motion } from 'framer-motion';
import { DonationTier } from '@/lib/types';
import Image from 'next/image';

interface TierSelectionProps {
  tiers: DonationTier[];
  onSelectTier: (tier: DonationTier) => void;
}

export function TierSelection({ tiers, onSelectTier }: TierSelectionProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">
          Support Bitcoin Adoption in <span className="text-bitcoin">Kibera</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Choose your contribution level and help us empower the community through Bitcoin education,
          entrepreneurship, and sustainable development.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelectTier(tier)}
            className="group cursor-pointer"
          >
            <div className="relative h-full bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden hover:border-bitcoin/50 transition-all duration-300 hover:scale-[1.02]">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={tier.image}
                  alt={tier.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${tier.bgGradient}`} />
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-bitcoin transition-colors">
                    {tier.title}
                  </h3>
                  <p className="text-sm text-gray-400">{tier.subtitle}</p>
                </div>

                {!tier.isCustom && (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-bitcoin">${tier.amount}</span>
                    {tier.goal && (
                      <span className="text-sm text-gray-400">/ ${tier.goal} goal</span>
                    )}
                  </div>
                )}

                {tier.isCustom && (
                  <div className="text-lg font-semibold text-bitcoin">
                    {tier.description}
                  </div>
                )}

                <p className="text-sm text-gray-300 line-clamp-3">
                  {tier.isCustom ? tier.perk : tier.description}
                </p>

                <button className="w-full py-3 px-4 bg-bitcoin hover:bg-bitcoin-dark text-black font-semibold rounded-lg transition-colors">
                  {tier.isCustom ? 'Choose Amount' : 'Select This Tier'}
                </button>
              </div>

              {tier.goal && (
                <div className="px-6 pb-6">
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-bitcoin rounded-full"
                      style={{ width: `${Math.min((tier.amount / tier.goal) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
