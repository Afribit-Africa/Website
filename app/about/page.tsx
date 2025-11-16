'use client';

import { motion } from 'framer-motion';
import { FiTarget, FiHeart, FiZap, FiShield, FiGlobe, FiTrendingUp, FiAward, FiUsers } from 'react-icons/fi';
import { SiBitcoin } from 'react-icons/si';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  const impactStats = [
    { icon: FiTrendingUp, value: '2,000+', label: 'Bitcoin Transactions', color: 'text-bitcoin' },
    { icon: FiUsers, value: '40+', label: 'Active Merchants', color: 'text-green-400' },
    { icon: FiZap, value: '500+', label: 'Community Members', color: 'text-blue-400' },
    { icon: FiAward, value: '5', label: 'Impact Programs', color: 'text-purple-400' }
  ];

  const coreValues = [
    {
      icon: SiBitcoin,
      title: 'Bitcoin Sovereignty',
      description: 'We champion financial self-custody and economic freedom through Bitcoin adoption, believing every individual deserves control over their wealth.',
      gradient: 'from-bitcoin/20 to-orange-500/20'
    },
    {
      icon: FiHeart,
      title: 'Community First',
      description: 'Our programs are co-created with local communities, ensuring solutions that genuinely address real needs and respect cultural context.',
      gradient: 'from-pink-500/20 to-red-500/20'
    },
    {
      icon: FiGlobe,
      title: 'Circular Economy',
      description: 'Building interconnected networks where Bitcoin flows between merchants, service providers, and community members sustainably.',
      gradient: 'from-green-500/20 to-teal-500/20'
    },
    {
      icon: FiShield,
      title: 'Education & Empowerment',
      description: 'Knowledge transforms lives. We provide comprehensive training that turns novices into Bitcoin advocates and entrepreneurs.',
      gradient: 'from-blue-500/20 to-purple-500/20'
    }
  ];

  const timeline = [
    {
      year: '2023',
      quarter: 'Q3',
      title: 'The Beginning',
      description: 'Founded in Nairobi with a vision to bring Bitcoin circular economy to Kibera, one of Africa\'s largest informal settlements.',
      milestone: 'First 5 merchants onboarded'
    },
    {
      year: '2023',
      quarter: 'Q4',
      title: 'Building Momentum',
      description: 'Launched Bitcoin education workshops and established partnerships with Fedi, Geyser, and global Bitcoin educators.',
      milestone: '15 merchants accepting Bitcoin'
    },
    {
      year: '2024',
      quarter: 'Q1-Q2',
      title: 'Program Expansion',
      description: 'Launched Women\'s Upcycling Collective, Waste Incentives, and Boda-Boda microloans. Community adoption accelerated.',
      milestone: '40+ merchants, 4 active programs'
    },
    {
      year: '2024',
      quarter: 'Q3-Q4',
      title: 'Recognition & Growth',
      description: 'Featured at major Bitcoin conferences, received international support, and documented over 2,000 Bitcoin transactions.',
      milestone: '500+ community members trained'
    },
    {
      year: '2025',
      quarter: 'Q1',
      title: 'Scaling Impact',
      description: 'Expanding to new areas, increasing program capacity, and building sustainable infrastructure for long-term growth.',
      milestone: 'Target: 100 merchants by year-end'
    }
  ];

  const team = [
    {
      role: 'Community Leadership',
      description: 'Local leaders who understand the unique challenges and opportunities in Kibera, driving grassroots adoption.'
    },
    {
      role: 'Bitcoin Educators',
      description: 'Passionate trainers who break down complex concepts into accessible knowledge for all community members.'
    },
    {
      role: 'Technical Support',
      description: 'Tech-savvy volunteers helping with wallet setup, merchant integrations, and Lightning Network infrastructure.'
    },
    {
      role: 'Global Partners',
      description: 'International Bitcoin organizations providing resources, mentorship, and amplifying our impact worldwide.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A0A00] to-[#0A0A0A] text-white pt-24 pb-16 relative overflow-hidden">
      {/* Background Pattern - Consistent throughout */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #F7931A 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Bitcoin Orange Gradient Overlay */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-bitcoin/20 via-bitcoin/5 to-transparent"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-bitcoin/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-bitcoin/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
      {/* Hero Section */}
      <section className="mb-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6">
              Building Africa's <span className="text-bitcoin">Bitcoin Future</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8">
              Afribit Africa is pioneering grassroots Bitcoin adoption in Kenya, creating sustainable circular economies that empower communities through financial sovereignty and digital literacy.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/merchants"
                className="btn btn-primary px-8 py-4 text-lg"
              >
                Find Merchants
              </Link>
              <Link
                href="/donate"
                className="btn btn-secondary px-8 py-4 text-lg"
              >
                Support Our Mission
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="container mx-auto px-4 max-w-7xl mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {impactStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-bitcoin/30 transition-all"
            >
              <stat.icon className={`w-10 h-10 ${stat.color} mx-auto mb-3`} />
              <div className="text-3xl md:text-4xl font-bold font-numbers mb-2">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission Statement */}
      <section className="container mx-auto px-4 max-w-7xl mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-bitcoin/20 to-orange-500/10 border border-bitcoin/30 rounded-3xl p-8 md:p-12"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-bitcoin rounded-2xl flex items-center justify-center flex-shrink-0">
              <FiTarget className="w-8 h-8 text-black" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Our Mission</h2>
              <p className="text-xl text-gray-200 leading-relaxed">
                To create self-sustaining Bitcoin circular economies in African communities, starting with Kibera. We provide education, infrastructure, and economic opportunities that enable financial sovereignty, environmental responsibility, and community resilience—all powered by sats.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Core Values */}
      <section className="container mx-auto px-4 max-w-7xl mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Our <span className="text-bitcoin">Core Values</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            The principles that guide every decision and action we take
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {coreValues.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-gradient-to-br ${value.gradient} border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all`}
            >
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                <value.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-4">{value.title}</h3>
              <p className="text-gray-300 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="container mx-auto px-4 max-w-7xl mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Our <span className="text-bitcoin">Journey</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            From humble beginnings to building Africa's first Bitcoin circular economy
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-bitcoin via-orange-500 to-transparent" />

          <div className="space-y-12">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-bitcoin rounded-full border-4 border-black -ml-2" />

                {/* Content */}
                <div className="md:w-1/2 ml-20 md:ml-0">
                  <div className={`bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-bitcoin/30 transition-all ${
                    index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-bitcoin font-bold text-lg">{item.year}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400 text-sm">{item.quarter}</span>
                    </div>
                    <h3 className="text-2xl font-bold font-heading mb-3">{item.title}</h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">{item.description}</p>
                    <div className="bg-bitcoin/10 border border-bitcoin/30 rounded-lg px-4 py-2 inline-block">
                      <span className="text-bitcoin text-sm font-semibold">{item.milestone}</span>
                    </div>
                  </div>
                </div>

                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 max-w-7xl mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Powered by <span className="text-bitcoin">Community</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our strength comes from diverse talents united by a common vision
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl p-6 hover:border-bitcoin/30 transition-all"
            >
              <h3 className="text-xl font-bold font-heading mb-3 text-bitcoin">{member.role}</h3>
              <p className="text-gray-300 leading-relaxed">{member.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-bitcoin/20 to-orange-500/10 border border-bitcoin/30 rounded-3xl p-12 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            Join the <span className="text-bitcoin">Revolution</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Whether you're a merchant ready to accept Bitcoin, a community member wanting to learn, or a supporter of financial freedom—there's a place for you at Afribit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn btn-primary px-8 py-4 text-lg">
              Become a Merchant
            </Link>
            <Link href="/contact" className="btn btn-secondary px-8 py-4 text-lg">
              Get Involved
            </Link>
          </div>
        </motion.div>
      </section>
      </div>
    </div>
  );
}
