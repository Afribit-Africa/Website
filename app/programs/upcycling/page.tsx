'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowLeft, FiCheckCircle, FiTarget, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { GiRecycle, GiSewingMachine } from 'react-icons/gi';
import { SiBitcoin } from 'react-icons/si';
import { ShoppingBag, Shirt, Palette, Gift } from 'lucide-react';

export default function UpcyclingProgram() {
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
              src="/Media/Images/Trezor Academy session pics/IMG-20250914-WA0155.jpg"
              alt="Women's Upcycling Collective"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-4">
                Women's Upcycling Collective
              </h1>
              <p className="text-xl text-gray-200 max-w-3xl">
                Empowering women to transform waste into wealth, earning Bitcoin while protecting the environment
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
              The Women's Upcycling Collective empowers women in Kibera with skills, tools, and markets to create valuable products from waste materials. Through comprehensive training in sewing, craftsmanship, and design, participants learn to transform discarded fabrics, plastics, and other materials into beautiful, sellable products.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              By combining traditional crafts with modern Bitcoin commerce, we're creating sustainable income opportunities while reducing environmental waste. Women earn Bitcoin for their creations, building financial independence and contributing to the circular economy.
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
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2 font-numbers">7</div>
            <div className="text-gray-300">Women Currently Training</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2 font-numbers">150+</div>
            <div className="text-gray-300">Products Created</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2 font-numbers">500kg</div>
            <div className="text-gray-300">Waste Diverted</div>
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
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <GiSewingMachine className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Skills Training & Equipment</h3>
              <p className="text-gray-400 leading-relaxed">
                Comprehensive instruction in sewing, pattern making, design, and upcycling techniques. Access to sewing machines, tools, and materials to practice and create products.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <SiBitcoin className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Bitcoin Commerce Training</h3>
              <p className="text-gray-400 leading-relaxed">
                Education on Bitcoin wallets, accepting payments, and managing earnings. Women learn to receive payments directly in Bitcoin for their products.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <FiUsers className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Market Access & Sales Support</h3>
              <p className="text-gray-400 leading-relaxed">
                Connection to local and international markets, online sales platforms, and marketing support. We help participants price, photograph, and sell their products.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <GiRecycle className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Material Sourcing Network</h3>
              <p className="text-gray-400 leading-relaxed">
                Access to waste collection partners providing steady supply of materials: fabrics, plastics, metals, and other recyclables for creative transformation.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Products Created */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold font-heading mb-8">What We Create</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-xl p-6 text-center">
              <ShoppingBag className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="font-semibold">Handbags & Totes</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-xl p-6 text-center">
              <Shirt className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="font-semibold">Clothing & Apparel</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-xl p-6 text-center">
              <Palette className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="font-semibold">Home Décor</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-xl p-6 text-center">
              <Gift className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="font-semibold">Accessories & Gifts</div>
            </div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold font-heading mb-8">Program Journey</h2>
          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Recruitment & Orientation</h3>
                <p className="text-gray-400 leading-relaxed">
                  Women from Kibera apply to join the program. We conduct orientation sessions covering program goals, expectations, and opportunities.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">8-Week Skills Training</h3>
                <p className="text-gray-400 leading-relaxed">
                  Intensive hands-on training in sewing techniques, upcycling methods, design principles, and quality standards. Participants create their first products.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Bitcoin & Business Training</h3>
                <p className="text-gray-400 leading-relaxed">
                  Education on Bitcoin fundamentals, wallet management, pricing strategies, customer service, and sales techniques for both online and offline markets.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Production & Sales</h3>
                <p className="text-gray-400 leading-relaxed">
                  Graduates receive equipment kits and begin producing products independently. We provide ongoing mentorship, material access, and sales support.
                </p>
              </div>
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
          <h2 className="text-3xl font-bold font-heading mb-8">Our Goals</h2>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/30 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <FiTarget className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">20 Women by 2026</h3>
                  <p className="text-gray-400 text-sm">
                    Scale from 7 to 20 active participants, creating sustainable income for more women in Kibera.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FiTarget className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Dedicated Workshop Space</h3>
                  <p className="text-gray-400 text-sm">
                    Establish a permanent workshop with equipment, storage, and retail space for collective operations.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FiTarget className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">International Markets</h3>
                  <p className="text-gray-400 text-sm">
                    Connect with global buyers interested in ethical, upcycled fashion and support export opportunities.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FiTarget className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Environmental Impact</h3>
                  <p className="text-gray-400 text-sm">
                    Divert 5 tons of waste annually from landfills through creative upcycling and sustainable practices.
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
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 rounded-2xl p-12">
            <h2 className="text-3xl font-bold font-heading mb-4">Support Women's Empowerment</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Your donation provides training, equipment, and materials for women to build sustainable businesses through upcycling, earning Bitcoin while protecting the environment.
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
