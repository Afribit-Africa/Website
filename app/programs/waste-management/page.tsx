'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowLeft, FiCheckCircle, FiTarget, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { GiRecycle, GiPayMoney } from 'react-icons/gi';
import { SiBitcoin } from 'react-icons/si';
import { MdCleaningServices } from 'react-icons/md';

export default function WasteManagementProgram() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-bitcoin transition-colors mb-8"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="relative h-[400px] rounded-3xl overflow-hidden mb-8">
            <img
              src="/Media/Images/Waste Collection.jpg"
              alt="Waste Incentives Program"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-4">
                Waste Incentives Program
              </h1>
              <p className="text-xl text-gray-200 max-w-3xl">
                Rewarding community members with Bitcoin for collecting and recycling waste, creating a cleaner Kibera
              </p>
            </div>
          </div>
        </motion.div>

        {/* Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-3xl font-bold font-heading mb-6 text-bitcoin">Program Overview</h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              The Waste Incentives Program tackles Kibera's waste management crisis by creating economic incentives for waste collection and recycling. Using Bitcoin as a reward mechanism, we motivate community members—especially youth—to actively collect waste from streets, drainage systems, and public spaces.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Collected waste is sorted for recycling, upcycling, or proper disposal. Participants earn Bitcoin based on the quantity and quality of waste collected, creating income opportunities while dramatically improving environmental conditions and public health.
            </p>
          </div>
        </motion.div>

        {/* Impact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-green-400 mb-2 font-numbers">4</div>
            <div className="text-gray-300">Active Collection Groups</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-green-400 mb-2 font-numbers">2.5</div>
            <div className="text-gray-300">Tons Collected (Monthly)</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-green-400 mb-2 font-numbers">30+</div>
            <div className="text-gray-300">Active Participants</div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold font-heading mb-8">How The System Works</h2>
          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Registration & Training</h3>
                <p className="text-gray-400 leading-relaxed">
                  Community members register as waste collectors, receive Bitcoin wallets, and learn waste sorting techniques, safety protocols, and environmental best practices.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Collection & Sorting</h3>
                <p className="text-gray-400 leading-relaxed">
                  Participants collect waste from designated areas, sorting materials into categories: plastics, metals, paper, glass, and organic waste. Collection happens daily or weekly depending on group schedules.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Weighing & Verification</h3>
                <p className="text-gray-400 leading-relaxed">
                  Collected waste is brought to designated collection points where Afribit staff weigh and verify the materials. Quality checks ensure proper sorting and clean materials.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Bitcoin Payment</h3>
                <p className="text-gray-400 leading-relaxed">
                  Participants receive instant Bitcoin payments via Lightning Network based on weight and material type. Payment rates are transparent and competitive with traditional recycling markets.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                5
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Processing & Recycling</h3>
                <p className="text-gray-400 leading-relaxed">
                  Sorted waste is distributed to recycling partners, upcycling programs, or proper disposal facilities, completing the circular economy loop.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Structure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold font-heading mb-8">Payment Structure</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <GiRecycle className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-lg font-bold">Plastics</h3>
              </div>
              <p className="text-gray-400 mb-2">Clean, sorted plastic bottles and containers</p>
              <div className="text-2xl font-bold text-green-400 font-numbers">~500 sats/kg</div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <GiRecycle className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-lg font-bold">Metals</h3>
              </div>
              <p className="text-gray-400 mb-2">Aluminum, copper, and other recyclable metals</p>
              <div className="text-2xl font-bold text-green-400 font-numbers">~800 sats/kg</div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <GiRecycle className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-lg font-bold">Paper & Cardboard</h3>
              </div>
              <p className="text-gray-400 mb-2">Clean paper products and cardboard boxes</p>
              <div className="text-2xl font-bold text-green-400 font-numbers">~300 sats/kg</div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <GiRecycle className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-lg font-bold">Glass</h3>
              </div>
              <p className="text-gray-400 mb-2">Bottles and containers, unbroken preferred</p>
              <div className="text-2xl font-bold text-green-400 font-numbers">~400 sats/kg</div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            *Rates vary based on Bitcoin market value and material quality. Bonus payments for large collections.
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold font-heading mb-8">Program Benefits</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <MdCleaningServices className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Environmental Impact</h3>
              <p className="text-gray-400 leading-relaxed">
                Dramatically reduces street litter, prevents drainage blockages, and improves overall sanitation in Kibera. Cleaner environment leads to better health outcomes.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <GiPayMoney className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Income Generation</h3>
              <p className="text-gray-400 leading-relaxed">
                Participants earn supplemental or full-time income through waste collection. Bitcoin earnings can be saved, spent at local merchants, or converted to fiat.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <FiUsers className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Youth Employment</h3>
              <p className="text-gray-400 leading-relaxed">
                Creates opportunities for young people who struggle to find formal employment, providing dignity and purpose through environmental work.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <SiBitcoin className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Bitcoin Adoption</h3>
              <p className="text-gray-400 leading-relaxed">
                Introduces participants to Bitcoin and cryptocurrency, building financial literacy and access to global digital economy.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold font-heading mb-8">Expansion Goals</h2>
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <FiTarget className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">10 Collection Groups</h3>
                  <p className="text-gray-400 text-sm">
                    Expand from 4 to 10 active groups covering all major areas of Kibera, creating comprehensive waste management network.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FiTarget className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Permanent Collection Centers</h3>
                  <p className="text-gray-400 text-sm">
                    Establish 3 permanent centers with weighing equipment, storage, and processing facilities for efficient operations.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FiTarget className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">10 Tons Monthly</h3>
                  <p className="text-gray-400 text-sm">
                    Scale collection from 2.5 to 10 tons monthly, removing significant waste from streets and waterways.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FiTarget className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Recycling Partnerships</h3>
                  <p className="text-gray-400 text-sm">
                    Partner with formal recycling companies to ensure collected materials are properly processed and create additional revenue.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-2xl p-12">
            <h2 className="text-3xl font-bold font-heading mb-4">Support Clean Kibera</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Your donation funds Bitcoin rewards for waste collectors, equipment for collection centers, and expansion to new areas. Help us create a cleaner, healthier Kibera.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/donate"
                className="btn btn-primary btn-lg"
              >
                Donate to This Program
              </Link>
              <Link
                href="/contact"
                className="btn btn-secondary btn-lg"
              >
                Partner With Us
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
