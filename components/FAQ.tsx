'use client';

import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const faqs = [
  {
    question: "What is Afribit and what do you do?",
    answer: "Afribit is a grassroots organization building a Bitcoin circular economy in Kibera, one of Africa's largest informal settlements. We leverage Bitcoin to create financial inclusion, environmental stewardship, and community resilience through education, waste management, micro-loans, and merchant onboarding."
  },
  {
    question: "Why Bitcoin? Why not use mobile money or cash?",
    answer: "Bitcoin offers true financial sovereignty without the need for bank accounts or documentation—critical in a community where 80% are unbanked. It's borderless, transparent, and can't be censored. Unlike mobile money, Bitcoin allows locals to save, earn, and transact without intermediaries taking fees or controlling their funds."
  },
  {
    question: "How do residents earn Bitcoin?",
    answer: "Residents earn Bitcoin through multiple programs: collecting waste and receiving satoshi rewards, running Bitcoin-accepting businesses, participating in upcycling workshops with weekly stipends, completing driving classes as boda-boda riders, and attending Bitcoin education meetups."
  },
  {
    question: "How does the Bitcoin circular economy actually work?",
    answer: "It's a self-sustaining loop: residents earn sats through work (waste collection, upcycling, merchant sales), then spend those sats at local merchants who also accept Bitcoin. This keeps value circulating within the community, building local wealth instead of extracting it."
  },
  {
    question: "What programs can I support with my donation?",
    answer: "Your contribution supports five key initiatives: Bitcoin Education (training 500 community ambassadors), Boda-Boda Compliance (licensing and training riders), Waste Management Expansion (Bitcoin-incentivized recycling), Upcycling & Women's Empowerment (sponsoring micro-entrepreneurs), and Business Accelerator (micro-loans for local enterprises)."
  },
  {
    question: "How do I claim my perk after donating?",
    answer: "All donations are anonymous by default for maximum privacy. To claim your perk, email ronnie@afribit.africa with your Transaction ID or a screenshot of your paid invoice, plus the name/logo you'd like to be recognized with. We'll verify and deliver your perks within two weeks."
  },
  {
    question: "Can I donate in Bitcoin?",
    answer: "Yes! All donations through our BTCPay Server crowdfund page can be paid with Bitcoin (on-chain or Lightning Network), ensuring your contribution goes directly to our programs without intermediaries."
  },
  {
    question: "How transparent is Afribit with donations?",
    answer: "We publish regular impact reports showing exactly how funds are used. Bitcoin's transparent blockchain means every transaction is verifiable. We're also listed on BTC Map, Geyser Fund, and partnered with Bitcoin Confederation for accountability."
  },
  {
    question: "What impact have you made so far?",
    answer: "We've completed over 2,000 Bitcoin transactions in Kibera, trained 120+ youth and women, onboarded 150+ merchants, licensed 7+ boda-boda riders, and run 5 active programs. Every contribution creates measurable, lasting impact."
  },
  {
    question: "How can I get involved beyond donating?",
    answer: "You can volunteer remotely, share our story on social media, connect us with Bitcoin companies for partnerships, sponsor specific equipment or training cohorts, or visit Kibera to see the impact firsthand. Contact us at ronnie@afribit.africa to discuss opportunities."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-linear-to-b from-black via-[#0a0a0a] to-black">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <p className="text-bitcoin font-semibold mb-4 tracking-wide uppercase text-sm">Got Questions?</p>
          <h2 className="font-heading text-5xl md:text-6xl font-bold mb-6">
            Frequently Asked <span className="text-bitcoin">Questions</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Everything you need to know about Afribit and how Bitcoin is transforming Kibera
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-linear-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-bitcoin/30 transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left group"
              >
                <span className="font-heading text-lg md:text-xl font-semibold text-white group-hover:text-bitcoin transition-colors pr-4">
                  {faq.question}
                </span>
                <FiChevronDown
                  className={`w-6 h-6 text-bitcoin shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center bg-linear-to-br from-white/5 to-white/2 border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-bold font-heading mb-2 md:mb-3 text-white">Still have questions?</h3>
          <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-base">Our team is here to help!</p>
          
          <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 text-base md:text-lg">
              <span className="text-gray-300">Email:</span>
              <a 
                href="mailto:connect@afribit.africa" 
                className="text-bitcoin hover:underline font-semibold"
              >
                connect@afribit.africa
              </a>
            </div>
            <p className="text-gray-400 text-xs md:text-sm">
              We typically respond within 24-48 hours
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
