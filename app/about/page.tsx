'use client';

import { motion } from 'framer-motion';
import { FaGraduationCap, FaStore, FaRecycle, FaHeart, FaRocket, FaUsers, FaBitcoin } from 'react-icons/fa';
import { FiTarget, FiTrendingUp } from 'react-icons/fi';
import Link from 'next/link';

export default function AboutPage() {
  const stats = [
    { icon: FiTrendingUp, value: '2000+', label: 'Transactions' },
    { icon: FaStore, value: '40+', label: 'Merchants' },
    { icon: FaGraduationCap, value: '5', label: 'Programs' },
    { icon: FaUsers, value: '500+', label: 'Community Members' }
  ];

  const values = [
    {
      icon: FaBitcoin,
      title: 'Bitcoin First',
      description: 'We believe Bitcoin offers financial freedom and sovereignty to communities across Africa.'
    },
    {
      icon: FaGraduationCap,
      title: 'Education',
      description: 'Knowledge is power. We empower communities through comprehensive Bitcoin education programs.'
    },
    {
      icon: FaHeart,
      title: 'Community Driven',
      description: 'Our initiatives are designed and implemented with the community, for the community.'
    },
    {
      icon: FiTarget,
      title: 'Sustainable Impact',
      description: 'We focus on creating long-term, sustainable economic opportunities for African communities.'
    }
  ];

  const milestones = [
    {
      year: '2023',
      title: 'Foundation',
      description: 'Afribit Africa was founded with a mission to bring Bitcoin adoption to Kenya and beyond.'
    },
    {
      year: '2024',
      title: 'Merchant Network',
      description: 'Onboarded 40+ merchants accepting Bitcoin, creating a circular Bitcoin economy in Nairobi.'
    },
    {
      year: '2024',
      title: 'Education Programs',
      description: 'Launched 5 comprehensive programs covering education, merchant support, and community development.'
    },
    {
      year: '2025',
      title: 'Regional Expansion',
      description: 'Expanding our initiatives across East Africa, bringing Bitcoin to more communities.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            About <span className="text-bitcoin">Afribit Africa</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            We're building a sustainable Bitcoin economy in Africa, empowering communities through 
            education, merchant onboarding, and economic development initiatives.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center"
            >
              <stat.icon className="w-8 h-8 text-bitcoin mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-r from-bitcoin/10 to-orange-500/10 border border-bitcoin/20 rounded-3xl p-8 md:p-12 mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <FaRocket className="w-8 h-8 text-bitcoin" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Our Mission</h2>
          </div>
          <p className="text-xl text-gray-300 leading-relaxed">
            To empower African communities with Bitcoin knowledge, infrastructure, and economic opportunities. 
            We believe in a future where Bitcoin serves as a tool for financial inclusion, economic sovereignty, 
            and sustainable development across the continent.
          </p>
        </motion.div>

        {/* Core Values */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            Our <span className="text-bitcoin">Core Values</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-bitcoin/50 transition-all"
              >
                <div className="w-12 h-12 bg-bitcoin/10 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-bitcoin" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            Our <span className="text-bitcoin">Journey</span>
          </motion.h2>

          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-bitcoin/50 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="w-20 h-20 bg-bitcoin/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-bitcoin">{milestone.year}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                    <p className="text-gray-400">{milestone.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our <span className="text-bitcoin">Mission</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Be part of the Bitcoin revolution in Africa. Whether you're a merchant, educator, or supporter, 
            there's a place for you in our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/programs"
              className="bg-bitcoin hover:bg-bitcoin/90 text-black font-semibold py-4 px-8 rounded-xl transition-all inline-flex items-center justify-center gap-2"
            >
              <FaGraduationCap className="w-5 h-5" />
              Explore Our Programs
            </Link>
            <Link
              href="/contact"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-xl transition-all border border-white/20 inline-flex items-center justify-center"
            >
              Get in Touch
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
