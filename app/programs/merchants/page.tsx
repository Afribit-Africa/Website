'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowLeft, FiCheckCircle, FiTarget, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { SiBitcoin } from 'react-icons/si';

export default function MerchantsProgram() {
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
              src="/Media/Images/Mama mboga groceries accepting bitcoin.jpg"
              alt="Micro-Merchants & Traders"
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-4">
                Micro-Merchants & Traders
              </h1>
              <p className="text-xl text-gray-200 max-w-3xl">
                Empowering local entrepreneurs to accept Bitcoin payments and participate in the global digital economy
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
              The Micro-Merchants & Traders program is the cornerstone of Afribit's mission to build a thriving Bitcoin circular economy in Kibera. We work directly with local business owners—from vegetable vendors (mama mboga) to barbers, restaurants, and retail shops—to integrate Bitcoin as a viable payment method.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              By providing hands-on training, technical support, and ongoing mentorship, we're creating a network of Bitcoin-accepting businesses that serve the community while connecting to the global Bitcoin economy.
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
          <div className="bg-gradient-to-br from-bitcoin/20 to-orange-500/10 border border-bitcoin/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-bitcoin mb-2 font-numbers">40+</div>
            <div className="text-gray-300">Active Merchants</div>
          </div>
          <div className="bg-gradient-to-br from-bitcoin/20 to-orange-500/10 border border-bitcoin/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-bitcoin mb-2 font-numbers">2,000+</div>
            <div className="text-gray-300">Bitcoin Transactions</div>
          </div>
          <div className="bg-gradient-to-br from-bitcoin/20 to-orange-500/10 border border-bitcoin/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-bitcoin mb-2 font-numbers">100%</div>
            <div className="text-gray-300">Lightning Network</div>
          </div>
        </motion.div>

        {/* What We Provide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold font-heading mb-8">What We Provide</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-bitcoin/20 rounded-lg flex items-center justify-center mb-4">
                <FiCheckCircle className="w-6 h-6 text-bitcoin" />
              </div>
              <h3 className="text-xl font-bold mb-3">Bitcoin Education & Onboarding</h3>
              <p className="text-gray-400 leading-relaxed">
                Comprehensive training on Bitcoin basics, Lightning Network, wallet setup, and transaction management. We ensure every merchant understands both the technology and the economic benefits.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-bitcoin/20 rounded-lg flex items-center justify-center mb-4">
                <SiBitcoin className="w-6 h-6 text-bitcoin" />
              </div>
              <h3 className="text-xl font-bold mb-3">Point-of-Sale Solutions</h3>
              <p className="text-gray-400 leading-relaxed">
                Setting up BTCPay Server, Blink wallets, and NFC contactless payment systems. Merchants receive printed QR codes, signage, and marketing materials.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-bitcoin/20 rounded-lg flex items-center justify-center mb-4">
                <FiUsers className="w-6 h-6 text-bitcoin" />
              </div>
              <h3 className="text-xl font-bold mb-3">Ongoing Support & Community</h3>
              <p className="text-gray-400 leading-relaxed">
                Regular check-ins, troubleshooting assistance, and access to our Fedi community for merchant networking and peer support.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-bitcoin/20 rounded-lg flex items-center justify-center mb-4">
                <FiTrendingUp className="w-6 h-6 text-bitcoin" />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Visibility</h3>
              <p className="text-gray-400 leading-relaxed">
                Listing on BTCMap.org, our merchant directory, and promotion through social media channels to attract Bitcoin users worldwide.
              </p>
            </div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold font-heading mb-8">How It Works</h2>
          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-bitcoin rounded-full flex items-center justify-center text-black font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Initial Consultation</h3>
                <p className="text-gray-400 leading-relaxed">
                  We meet with interested merchants to understand their business, explain Bitcoin benefits, and assess readiness for integration.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-bitcoin rounded-full flex items-center justify-center text-black font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Training Workshop</h3>
                <p className="text-gray-400 leading-relaxed">
                  Hands-on Bitcoin education covering wallets, security, transaction processing, and practical demonstrations with Lightning Network payments.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-bitcoin rounded-full flex items-center justify-center text-black font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Setup & Installation</h3>
                <p className="text-gray-400 leading-relaxed">
                  We install wallets, configure payment systems, create BTCPay Server stores, generate QR codes, and provide physical signage.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-bitcoin rounded-full flex items-center justify-center text-black font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Go Live & Support</h3>
                <p className="text-gray-400 leading-relaxed">
                  Merchants start accepting Bitcoin with our team available for troubleshooting, questions, and ongoing optimization.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold font-heading mb-8">Our Goals</h2>
          <div className="bg-gradient-to-br from-bitcoin/10 to-orange-500/5 border border-bitcoin/30 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <FiTarget className="w-6 h-6 text-bitcoin flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">100 Merchants by 2026</h3>
                  <p className="text-gray-400 text-sm">
                    Expand from 40 to 100 active Bitcoin-accepting businesses across Kibera.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FiTarget className="w-6 h-6 text-bitcoin flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Category Diversity</h3>
                  <p className="text-gray-400 text-sm">
                    Ensure representation across all business types: food, retail, services, transport, and entertainment.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FiTarget className="w-6 h-6 text-bitcoin flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Peer-to-Peer Ecosystem</h3>
                  <p className="text-gray-400 text-sm">
                    Create a circular economy where merchants transact with each other using Bitcoin for supplies and services.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FiTarget className="w-6 h-6 text-bitcoin flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">International Tourism</h3>
                  <p className="text-gray-400 text-sm">
                    Attract Bitcoin-savvy tourists and digital nomads to spend in Kibera, supporting local economy.
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
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-bitcoin/20 to-orange-500/10 border border-bitcoin/30 rounded-2xl p-12">
            <h2 className="text-3xl font-bold font-heading mb-4">Support Micro-Merchants</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Your donation helps onboard more local businesses, provide training, and build the infrastructure for a thriving Bitcoin circular economy in Kibera.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/donate"
                className="btn btn-primary btn-lg"
              >
                Donate to This Program
              </Link>
              <Link
                href="/maps"
                className="btn btn-secondary btn-lg"
              >
                View Merchant Directory
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
