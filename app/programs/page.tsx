"use client";

import Link from "next/link";

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
        merchants: "150+",
        sessions: "50+"
      },
      icon: "📚",
      gradient: "from-bitcoin to-orange-500"
    },
    {
      id: "merchants",
      title: "Merchant Onboarding",
      tagline: "Building the Circular Economy",
      description: "We onboard local businesses—from mama mbogas to boda-boda riders—to accept Bitcoin payments using BTCPay Server, creating a thriving circular economy in Kibera.",
      impact: "Every merchant becomes a node in our circular economy. They earn sats, save for their future, and spend within the community. Merchants like Steph expanded their business buying motorbikes with Bitcoin earnings.",
      benefits: [
        "Free BTCPay Server setup",
        "Point-of-sale training and hardware",
        "Marketing materials and signage",
        "Ongoing technical support",
        "Access to merchant network",
        "Featured on BTC Map"
      ],
      stats: {
        merchants: "150+",
        transactions: "2,000+",
        volume: "Growing"
      },
      icon: "🏪",
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
      icon: "♻️",
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
      icon: "👑",
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
      icon: "🏍️",
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
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-bitcoin/10 via-black to-black" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold">
              Our Programs
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Comprehensive initiatives empowering Kibera through Bitcoin adoption, education, and sustainable development
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link 
                href="/donate"
                className="btn btn-primary btn-lg"
              >
                Support Our Programs
              </Link>
              <Link href="/#testimonials" className="btn btn-secondary btn-lg">
                Success Stories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="space-y-20">
              {programs.map((program, index) => (
                <div 
                  key={program.id}
                  className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
                >
                  {/* Program Card */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-20 h-20 rounded-2xl bg-linear-to-br ${program.gradient} flex items-center justify-center text-4xl`}>
                        {program.icon}
                      </div>
                      <div>
                        <h2 className="text-4xl font-bold">{program.title}</h2>
                        <p className="text-bitcoin text-lg">{program.tagline}</p>
                      </div>
                    </div>

                    <p className="text-gray-300 text-lg leading-relaxed">
                      {program.description}
                    </p>

                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                      <h3 className="text-xl font-bold mb-3 text-bitcoin">Real Impact</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {program.impact}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(program.stats).map(([key, value]) => (
                        <div key={key} className="text-center p-4 bg-white/5 rounded-xl">
                          <div className="text-2xl font-bold text-bitcoin">{value}</div>
                          <div className="text-sm text-gray-400 capitalize">{key}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits List */}
                  <div className="flex-1">
                    <div className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-3xl p-8">
                      <h3 className="text-2xl font-bold mb-6">What We Provide</h3>
                      <ul className="space-y-4">
                        {program.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="text-bitcoin text-xl mt-1">✓</span>
                            <span className="text-gray-300">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/donate"
                        className="w-full mt-8 btn btn-primary block text-center"
                      >
                        Fund This Program
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-linear-to-b from-black to-bitcoin/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Community Voices</h2>
              <p className="text-xl text-gray-400">Real stories from real people</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-bitcoin/50 transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-bitcoin to-orange-600 flex items-center justify-center text-xl font-bold">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <div className="font-bold">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-300 italic leading-relaxed mb-4">
                    "{testimonial.quote}"
                  </p>
                  <div className="text-xs text-bitcoin uppercase tracking-wide">
                    {testimonial.program}
                  </div>
                </div>
              ))}
            </div>
          </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <div className="bg-linear-to-br from-bitcoin/20 to-orange-600/20 backdrop-blur-md border border-bitcoin/30 rounded-3xl p-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Every Sat Makes a Difference
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Your donation doesn't just fund programs—it transforms lives. From a mama mboga expanding her business to a youth stacking sats for their future, every contribution builds real financial freedom in Kibera.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/donate"
                  className="btn btn-primary btn-lg"
                >
                  Donate with Bitcoin
                </Link>
                <Link href="/contact" className="btn btn-secondary btn-lg">
                  Get Involved
                </Link>
              </div>
            </div>
          </div>
      </section>
    </div>
  );
}
