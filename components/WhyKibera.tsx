'use client';

import { FiLock, FiUsers, FiCheck } from 'react-icons/fi';

export default function WhyKibera() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-linear-to-b from-bitcoin/5 via-transparent to-bitcoin/5 pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            Why Start in Kibera?
          </h2>
          <p className="text-lg md:text-2xl text-bitcoin font-semibold mb-4">
            Why Kibera needs Bitcoin
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-12">
          {/* Left Card */}
          <div className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl border-2 border-white/20 rounded-2xl md:rounded-3xl p-6 md:p-10">
            <div className="w-12 md:w-16 h-12 md:h-16 bg-bitcoin rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">
              <FiLock className="w-6 md:w-8 h-6 md:h-8 text-white" />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold font-heading mb-4 md:mb-6 text-white">
              The Challenge
            </h3>
            
            <p className="text-gray-300 text-sm md:text-lg leading-relaxed mb-4 md:mb-6">
              Kibera is a vibrant hub of entrepreneurial energy. Yet <span className="text-bitcoin font-semibold">nearly 80% of its residents are unbanked</span> — cut off from savings, credit, and digital finance.
            </p>
            
            <p className="text-gray-300 text-sm md:text-lg leading-relaxed">
              Through Afribit, Bitcoin becomes more than just currency; it becomes a <span className="text-white font-semibold">tool for empowerment</span>. With no need for documentation or bank approval, locals can now save, spend, and earn securely.
            </p>

            <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/20">
              <p className="text-bitcoin text-base md:text-xl font-semibold italic">
                "In a place where even a few satoshis can buy a meal or fund a school fee, Bitcoin is freedom — real, borderless, and owned by the people."
              </p>
            </div>
          </div>

          {/* Right Card */}
          <div className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl border-2 border-white/20 rounded-2xl md:rounded-3xl p-6 md:p-10">
            <div className="w-12 md:w-16 h-12 md:h-16 bg-[#16a34a] rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">
              <FiUsers className="w-6 md:w-8 h-6 md:h-8 text-white" />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold font-heading mb-4 md:mb-6 text-white">
              Our Approach
            </h3>
            
            <p className="text-gray-300 text-sm md:text-lg leading-relaxed mb-4 md:mb-6">
              We don't drop solutions from the top — <span className="text-[#16a34a] font-semibold">we grow them from the ground</span>. Our work in Kibera focuses on equipping everyday people with tools to earn, trade, and thrive using Bitcoin.
            </p>
            
            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
              <div className="flex items-start">
                <FiCheck className="text-bitcoin text-lg md:text-2xl mr-2 md:mr-3 shrink-0" />
                <p className="text-gray-300 text-sm md:text-base">Mama mbogas and upcyclers</p>
              </div>
              <div className="flex items-start">
                <FiCheck className="text-bitcoin text-lg md:text-2xl mr-2 md:mr-3 shrink-0" />
                <p className="text-gray-300 text-sm md:text-base">Boda riders and recycling crews</p>
              </div>
              <div className="flex items-start">
                <FiCheck className="text-bitcoin text-lg md:text-2xl mr-2 md:mr-3 shrink-0" />
                <p className="text-gray-300 text-sm md:text-base">Waste turned into income</p>
              </div>
              <div className="flex items-start">
                <FiCheck className="text-bitcoin text-lg md:text-2xl mr-2 md:mr-3 shrink-0" />
                <p className="text-gray-300 text-sm md:text-base">Training that actually empowers</p>
              </div>
            </div>

            <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/20">
              <p className="text-[#16a34a] text-base md:text-xl font-semibold italic">
                "It's not charity — it's a working model of circular empowerment, powered by the people."
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 md:mt-16">
          <p className="text-gray-400 text-base md:text-xl mb-6">
            Over <span className="text-bitcoin font-bold text-xl md:text-2xl">2,000 Bitcoin transactions</span> completed in Kibera's Circular Economy!
          </p>
        </div>
      </div>
    </section>
  );
}
