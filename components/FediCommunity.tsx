"use client";

import Image from 'next/image';
import Link from 'next/link';
import { FiUsers, FiShield, FiZap, FiArrowRight } from 'react-icons/fi';
import { SiBitcoin } from 'react-icons/si';

export default function FediCommunity() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-black via-purple-950/10 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-3 mb-4 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-full">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center border border-white/80">
              <span className="text-sm font-bold" style={{fontFamily: 'monospace'}}>fd</span>
            </div>
            <span className="text-sm font-semibold text-purple-300">New: We're on Fedi</span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Join Our <span className="text-gradient bg-gradient-to-r from-purple-400 to-pink-400">Community</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300">
            Connect with us on Fedi—a secure, privacy-focused Bitcoin wallet with community features
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto items-center">
          {/* Left: Features */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-bitcoin/20 rounded-xl flex items-center justify-center shrink-0">
                <SiBitcoin className="w-6 h-6 text-bitcoin" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Bitcoin Payments</h3>
                <p className="text-gray-400">
                  Send Bitcoin donations instantly through Lightning Network with private, secure transactions
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
                <FiUsers className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Community Chat</h3>
                <p className="text-gray-400">
                  Join conversations with team members and supporters in our private community space
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center shrink-0">
                <FiZap className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Real-time Updates</h3>
                <p className="text-gray-400">
                  Get instant notifications about programs, events, and impact stories from Kibera
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center shrink-0">
                <FiShield className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Privacy & Security</h3>
                <p className="text-gray-400">
                  Self-custodial wallet with end-to-end encryption—your keys, your Bitcoin
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                href="/fedi"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
              >
                Join Community on Fedi
                <FiArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Right: QR Codes */}
          <div className="space-y-6">
            {/* Community QR */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <FiUsers className="w-5 h-5 text-purple-400" />
                <h3 className="text-xl font-bold">Community Invite</h3>
              </div>
              <div className="bg-white rounded-xl p-4 mb-3 flex items-center justify-center">
                <Image
                  src="/Media/Images/fedi-community-qr.png"
                  alt="Scan to join Afribit community on Fedi"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
              <p className="text-xs text-center text-gray-400">
                Scan with Fedi app to join our community
              </p>
            </div>

            {/* Federation QR */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <SiBitcoin className="w-5 h-5 text-bitcoin" />
                <h3 className="text-xl font-bold">Federation Invite</h3>
              </div>
              <div className="bg-white rounded-xl p-4 mb-3 flex items-center justify-center">
                <Image
                  src="/Media/Images/fedi-federation-qr.png"
                  alt="Scan to join Afribit federation on Fedi"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
              <p className="text-xs text-center text-gray-400">
                Scan with Fedi app to join our federation
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-sm text-gray-300">
              <strong className="text-white">New to Fedi?</strong> Download the app from the{' '}
              <a href="https://apps.apple.com/app/fedi/id6444849426" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">
                App Store
              </a>
              {' '}or{' '}
              <a href="https://play.google.com/store/apps/details?id=com.fedi" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">
                Google Play
              </a>
              , then scan the QR codes above to join.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
