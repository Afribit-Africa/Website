'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowLeft, FiCheckCircle, FiTarget, FiTrendingUp, FiDollarSign } from 'react-icons/fi';
import { GiPayMoney, GiTakeMyMoney } from 'react-icons/gi';
import { SiBitcoin } from 'react-icons/si';
import { MdSecurity, MdDirectionsBike } from 'react-icons/md';

export default function BodaBodaProgram() {
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
              src="/Media/Images/Motorbike bitcoin onboarding.jpg"
              alt="Boda-Boda Ride to Freedom"
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-4">
                Boda-Boda "Ride to Freedom"
              </h1>
              <p className="text-xl text-gray-200 max-w-3xl">
                Empowering motorcycle riders with Bitcoin microloans for licensing, insurance, and financial independence
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
              Boda-boda (motorcycle taxi) riders are essential to Nairobi's transportation ecosystem, but many operate without proper licensing, insurance, or safety equipment due to financial barriers. The "Ride to Freedom" program provides Bitcoin-based microloans to help riders formalize their businesses and achieve financial security.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              By offering flexible, low-interest loans repayable in Bitcoin, we help riders obtain licenses, insurance, safety gear, and motorcycle improvements. This creates legal compliance, reduces risks, and opens pathways to motorcycle ownership and business expansion.
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
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2 font-numbers">10</div>
            <div className="text-gray-300">Active Loan Recipients</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2 font-numbers">95%</div>
            <div className="text-gray-300">Repayment Rate</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2 font-numbers">100%</div>
            <div className="text-gray-300">Now Licensed & Insured</div>
          </div>
        </motion.div>

        {/* What We Provide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold font-heading mb-8">Loan Coverage</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <FiCheckCircle className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Licenses & Permits</h3>
              <p className="text-gray-400 leading-relaxed mb-3">
                Coverage for motorcycle operator licenses, commercial permits (PSV), and business registration fees required for legal operation.
              </p>
              <div className="text-lg font-bold text-blue-400 font-numbers">KES 5,000 - 15,000</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <MdSecurity className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Insurance & Inspection</h3>
              <p className="text-gray-400 leading-relaxed mb-3">
                Comprehensive or third-party insurance, annual motorcycle inspection fees, and NTSA compliance requirements.
              </p>
              <div className="text-lg font-bold text-blue-400 font-numbers">KES 8,000 - 20,000</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <MdSecurity className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Safety Equipment</h3>
              <p className="text-gray-400 leading-relaxed mb-3">
                Quality helmets (rider and passenger), reflective jackets, motorcycle locks, and protective riding gear.
              </p>
              <div className="text-lg font-bold text-blue-400 font-numbers">KES 3,000 - 10,000</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <MdDirectionsBike className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Motorcycle Improvements</h3>
              <p className="text-gray-400 leading-relaxed mb-3">
                Repairs, maintenance, upgrades, or down payments toward motorcycle ownership for riders currently renting.
              </p>
              <div className="text-lg font-bold text-blue-400 font-numbers">KES 10,000 - 50,000</div>
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
          <h2 className="text-3xl font-bold font-heading mb-8">Application Process</h2>
          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Application & Verification</h3>
                <p className="text-gray-400 leading-relaxed">
                  Riders submit applications with basic information: current license status, motorcycle details, income estimates, and loan purpose. We verify identity and conduct brief interviews.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Bitcoin Education</h3>
                <p className="text-gray-400 leading-relaxed">
                  All participants receive Bitcoin training: wallet setup, sending/receiving payments, security best practices, and using Lightning Network for instant transactions.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Loan Approval & Disbursement</h3>
                <p className="text-gray-400 leading-relaxed">
                  Approved applicants receive Bitcoin loans directly to their wallets. Funds can be immediately converted to Kenyan shillings via M-Pesa for payment of fees, or used at Bitcoin-accepting merchants.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Flexible Repayment</h3>
                <p className="text-gray-400 leading-relaxed">
                  Riders repay loans over 3-12 months in small, flexible installments via Bitcoin. Payments adapt to income fluctuations—busy weeks allow larger payments, slow weeks allow smaller ones.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                5
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Graduation & Growth</h3>
                <p className="text-gray-400 leading-relaxed">
                  Upon successful repayment, riders "graduate" with improved credit history, eligibility for larger loans (e.g., motorcycle purchase), and ongoing financial mentorship.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loan Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold font-heading mb-8">Loan Terms</h2>
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/30 rounded-2xl p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2 font-numbers">5-8%</div>
                <div className="text-gray-300 text-sm">Annual Interest Rate</div>
                <p className="text-gray-500 text-xs mt-2">Significantly lower than traditional microfinance</p>
              </div>
              <div className="text-center border-l border-r border-white/10 px-4">
                <div className="text-4xl font-bold text-blue-400 mb-2 font-numbers">3-12</div>
                <div className="text-gray-300 text-sm">Months Repayment</div>
                <p className="text-gray-500 text-xs mt-2">Flexible based on loan size and rider preference</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2 font-numbers">0</div>
                <div className="text-gray-300 text-sm">Collateral Required</div>
                <p className="text-gray-500 text-xs mt-2">Trust-based lending with community vouching</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold font-heading mb-8">Why This Matters</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <MdSecurity className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Legal Protection</h3>
              <p className="text-gray-400 leading-relaxed">
                Licensed and insured riders avoid police harassment, fines, and bribes. Operating legally provides peace of mind and protects against liability in accidents.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <FiDollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Increased Earnings</h3>
              <p className="text-gray-400 leading-relaxed">
                Legal riders can access premium customers, work with ride-hailing apps, and charge higher rates. Many see income increase by 20-40% after compliance.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <MdDirectionsBike className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Path to Ownership</h3>
              <p className="text-gray-400 leading-relaxed">
                Many riders start by renting motorcycles. Our loans help them save toward ownership, breaking the cycle of daily rental payments and building asset wealth.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <SiBitcoin className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Financial Inclusion</h3>
              <p className="text-gray-400 leading-relaxed">
                Bitcoin loans bypass traditional banking barriers. Riders build credit history through successful repayment, accessing future financial opportunities.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold font-heading mb-8">Program Goals</h2>
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/30 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <FiTarget className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">40 Riders by 2026</h3>
                  <p className="text-gray-400 text-sm">
                    Expand from 10 to 40 active loan recipients, helping dozens of riders formalize and grow their businesses.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FiTarget className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Motorcycle Ownership Program</h3>
                  <p className="text-gray-400 text-sm">
                    Launch dedicated motorcycle purchase loans, helping 10+ riders transition from renting to owning their vehicles.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FiTarget className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Ride-Hailing Integration</h3>
                  <p className="text-gray-400 text-sm">
                    Partner with Uber, Bolt, and local platforms to ensure licensed riders access premium earning opportunities.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FiTarget className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Savings & Investment Education</h3>
                  <p className="text-gray-400 text-sm">
                    Provide financial literacy training on Bitcoin savings, investment strategies, and long-term wealth building.
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
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-12">
            <h2 className="text-3xl font-bold font-heading mb-4">Empower Boda-Boda Riders</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Your donation provides life-changing microloans to motorcycle riders, helping them achieve legal compliance, financial security, and pathways to motorcycle ownership.
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
                Learn More
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
