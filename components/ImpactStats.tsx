'use client';

import { useEffect, useState } from 'react';
import { HiUsers } from 'react-icons/hi';
import { FaMotorcycle } from 'react-icons/fa';
import { SiBitcoin } from 'react-icons/si';
import { MdStorefront } from 'react-icons/md';

const stats = [
  { 
    Icon: HiUsers, 
    number: 120, 
    label: 'Youth and women trained, earning via upcycling', 
    suffix: '+',
    color: 'text-white'
  },
  { 
    Icon: FaMotorcycle, 
    number: 7, 
    label: 'Boda-boda riders fully licensed and financially active', 
    suffix: '+',
    color: 'text-white'
  },
  { 
    Icon: SiBitcoin, 
    number: 2000, 
    label: 'Bitcoin transactions made in Kibera', 
    suffix: '+',
    color: 'text-white'
  },
  { 
    Icon: MdStorefront, 
    number: 40, 
    label: 'Total merchants in the community', 
    suffix: '+',
    color: 'text-white'
  },
];

export default function ImpactStats() {
  const [animatedNumbers, setAnimatedNumbers] = useState(stats.map(() => 0));

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    stats.forEach((stat, index) => {
      const increment = stat.number / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current = Math.min(Math.round(increment * step), stat.number);
        
        setAnimatedNumbers(prev => {
          const newNumbers = [...prev];
          newNumbers[index] = current;
          return newNumbers;
        });

        if (step >= steps) {
          clearInterval(timer);
        }
      }, interval);
    });
  }, []);

  return (
    <section id="impact" className="py-20 bg-linear-to-b from-black via-[#0a0a0a] to-black">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <p className="text-bitcoin font-semibold mb-4 tracking-wide uppercase text-sm">Impact at a Glance</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Real People.<br />
              Real Progress.<br />
              <span className="text-[#16a34a]">Powered by Sats</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Our vision isn't theory — it's already happening. Kibera's circular Bitcoin economy is making everyday life better for those who need it most. From upcycling to boda riders to recycling rewards, here's a snapshot of our grassroots impact.
            </p>
          </div>

          {/* Right Stats Grid */}
          <div className="grid grid-cols-2 gap-3 md:gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.Icon;
              return (
                <div 
                  key={index}
                  className="bg-linear-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-8 hover:border-bitcoin/30 transition-all duration-300 group"
                >
                  <div className={`${stat.color} mb-2 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 md:w-12 h-8 md:h-12" />
                  </div>
                  <div className="font-numbers text-3xl md:text-5xl font-bold mb-1 md:mb-3 text-white">
                    {animatedNumbers[index].toLocaleString()}{stat.suffix}
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm leading-snug">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
