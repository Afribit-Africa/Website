"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaGraduationCap, FaStore, FaRecycle, FaCrown, FaMotorcycle, FaBitcoin } from 'react-icons/fa';

export default function ProgramsPage() {

  const programs = [
    {
      id: "education",
      title: "Bitcoin Education",
      tagline: "Core Bitcoin Classes",
      description: "Our comprehensive Bitcoin education program equips community members with deep understanding of Bitcoin technology, financial sovereignty, and practical usage skills.",
      impact: "Through Core Bitcoin Classes, participants learn everything from basic wallet security to advanced Lightning Network usage. Many graduates become merchants, educators, and advocates within their own communities.",
      benefits: [
        "Beginner to advanced Bitcoin courses",
        "Hands-on wallet security training",
        "Lightning Network education",
        "Peer-to-peer learning sessions",
        "Certificate of completion",
        "Ongoing community support"
      ],
      stats: {
        participants: "200+",
        merchants: "40+",
        sessions: "50+"
      },
      icon: FaGraduationCap,
      gradient: "from-bitcoin to-orange-500"
    },
    {
      id: "merchants",
      title: "Merchant Onboarding",
      tagline: "Building the Circular Economy",
      description: "We onboard local businesses—from mama mbogas to boda-boda riders—to accept Bitcoin payments, creating a thriving circular economy in Kibera.",
      impact: "Every merchant becomes a node in our circular economy. They earn sats, save for their future, and spend within the community. Merchants like Steph expanded their business buying motorbikes with Bitcoin earnings.",
      benefits: [
        "BTCPay Server guidance and support",
        "Point-of-sale training and hardware",
        "Marketing materials and signage",
        "Ongoing technical support",
        "Access to merchant network",
        "Featured on BTC Map"
      ],
      stats: {
        merchants: "40+",
        transactions: "2,000+",
        volume: "Growing"
      },
      icon: FaStore,
      gradient: "from-green-500 to-emerald-600"
    },
    {
      id: "waste",
      title: "Live Great Waste Management",
      tagline: "From Waste to Wealth",
      description: "Our waste management program incentivizes community members to clean up Kibera while earning Bitcoin. Participants collect recyclables and earn sats, turning environmental stewardship into income.",
      impact: "DaMian Magak started in waste management, saved his sats, and launched his own fast food business. Glen Omolo stacks sats regularly while keeping his community clean. It's environmental action meets financial empowerment.",
      benefits: [
        "Earn sats for collecting waste",
        "Weekly Bitcoin payouts",
        "Training on recycling best practices",
        "Equipment and safety gear provided",
        "Community cleanup coordination",
        "Path to entrepreneurship"
      ],
      stats: {
        participants: "50+",
        waste: "Tons collected",
        income: "Weekly sats"
      },
      icon: FaRecycle,
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      id: "upcycle",
      title: "Upcycle Queens",
      tagline: "Women's Empowerment Program",
      description: "We sponsor women in Kibera for one month in our upcycling program, providing weekly satoshi stipends and workshop access. Women learn to transform waste materials into valuable products while earning Bitcoin.",
      impact: "This program specifically empowers women micro-entrepreneurs, giving them financial independence through Bitcoin. Participants learn valuable skills, earn weekly income, and gain confidence to dream bigger.",
      benefits: [
        "One month sponsorship ($90)",
        "Weekly satoshi stipend",
        "Upcycling workshops and training",
        "Materials and tools provided",
        "Business development support",
        "Access to merchant network"
      ],
      stats: {
        women: "30+",
        products: "100s",
        income: "Weekly"
      },
      icon: FaCrown,
      gradient: "from-purple-500 to-pink-600"
    },
    {
      id: "loans",
      title: "Bitcoin Microloans",
      tagline: "Driving Economic Growth",
      description: "Affordable Bitcoin-based microloans help boda-boda riders afford driving classes, insurance, and equipment. Repayment in sats is more affordable than traditional loans.",
      impact: "Brian, a boda-boda rider, completed his driving classes through our microloan program. Now he takes jobs beyond the informal settlement, converts sats, saves some, and spends within the circular economy.",
      benefits: [
        "Low-interest Bitcoin loans",
        "Flexible repayment in sats",
        "Driving school sponsorship",
        "Insurance coverage options",
        "No bank approval needed",
        "Support local riders"
      ],
      stats: {
        riders: "40+",
        loans: "50+",
        repayment: "Affordable"
      },
      icon: FaMotorcycle,
      gradient: "from-yellow-500 to-orange-600"
    }
  ];

  const testimonials = [
    {
      name: "Brian",
      role: "Boda-Boda Rider",
      quote: "Through Afribit, I was able to complete my driving classes. The repayment in sats is very affordable. I can now convert my sats, save some, and spend some within the circular economy—supporting other riders and helping the whole community grow.",
      program: "Bitcoin Microloans"
    },
    {
      name: "DaMian Magak",
      role: "Entrepreneur",
      quote: "Through Afribit's Live Great Waste Management group, I began earning in Bitcoin. With the sats I saved, I launched my own fast food business. Bitcoin is truly the best thing that has happened to me.",
      program: "Waste Management"
    },
    {
      name: "Steph",
      role: "Merchant",
      quote: "I was the first merchant in our network selling fries, juice, and porridge. Thanks to my Bitcoin earnings, I bought a motorbike and expanded my business. Bitcoin has given me the confidence to dream even bigger.",
      program: "Merchant Onboarding"
    },
    {
      name: "Glen Omolo",
      role: "Waste Collector",
      quote: "When Afribit introduced Bitcoin to our waste management group, I was immediately hooked. I've been earning and stacking sats regularly. It's not just about money—it's about financial freedom.",
      program: "Waste Management"
    },
    {
      name: "Abebo",
      role: "Vegetable Vendor",
      quote: "At first, I didn't fully understand Bitcoin. But through classes and peer-to-peer learning, I've become an informed and confident merchant. Now, I use some of my sats to buy from other local merchants—but I save most of it for my future.",
      program: "Bitcoin Education"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bitcoin/5 via-black to-black" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-bitcoin rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-bitcoin via-orange-400 to-bitcoin">
              Our Programs
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Empowering Kibera through Bitcoin adoption, education, and sustainable development
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link 
                href="/donate"
                className="bg-bitcoin hover:bg-bitcoin/90 text-black font-bold py-4 px-8 rounded-xl transition-all hover:scale-105"
              >
                Support Our Programs
              </Link>
              <Link 
                href="/contact" 
                className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-xl transition-all border border-white/20"
              >
                Get Involved
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-bitcoin/50 transition-all duration-300 hover:shadow-2xl hover:shadow-bitcoin/20"
              >
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${program.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  <program.icon className="w-8 h-8" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-2">{program.title}</h3>
                <p className="text-bitcoin text-sm font-semibold mb-4">{program.tagline}</p>

                {/* Description */}
                <p className="text-gray-400 leading-relaxed mb-6">
                  {program.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {Object.entries(program.stats).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-lg font-bold text-bitcoin">{value}</div>
                      <div className="text-xs text-gray-500 capitalize">{key}</div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href="/donate"
                  className="w-full block text-center py-3 px-6 bg-white/5 hover:bg-bitcoin/20 border border-white/10 hover:border-bitcoin rounded-xl transition-all font-semibold text-sm"
                >
                  Fund This Program
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Details Section */}
      <section className="py-20 bg-gradient-to-b from-black to-bitcoin/5">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Real Impact Stories</h2>
            <p className="text-xl text-gray-400">See how Bitcoin is changing lives in Kibera</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-bitcoin/30 transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-bitcoin to-orange-600 flex items-center justify-center text-xl font-bold flex-shrink-0">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                    <div className="text-xs text-bitcoin uppercase tracking-wide mt-1">
                      {testimonial.program}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Provide Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What We Provide</h2>
            <p className="text-xl text-gray-400">Comprehensive support for each program</p>
          </motion.div>

          <div className="space-y-12">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-10"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${program.gradient} flex items-center justify-center`}>
                    <program.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold">{program.title}</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-bitcoin mb-4">Program Benefits</h4>
                    <ul className="space-y-3">
                      {program.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <FaBitcoin className="text-bitcoin text-sm mt-1 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-bitcoin mb-4">Real Impact</h4>
                    <p className="text-gray-300 leading-relaxed">{program.impact}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-bitcoin/20 via-orange-600/20 to-bitcoin/20 backdrop-blur-md border border-bitcoin/30 rounded-3xl p-12 md:p-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(247,147,26,0.1),transparent_70%)]" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Every Sat Makes a Difference
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                Your donation doesn't just fund programs—it transforms lives. From a mama mboga expanding her business to a youth stacking sats for their future, every contribution builds real financial freedom in Kibera.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/donate"
                  className="bg-bitcoin hover:bg-bitcoin/90 text-black font-bold py-4 px-8 rounded-xl transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
                >
                  <FaBitcoin className="w-5 h-5" />
                  Donate with Bitcoin
                </Link>
                <Link 
                  href="/contact" 
                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-xl transition-all border border-white/20"
                >
                  Get Involved
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}