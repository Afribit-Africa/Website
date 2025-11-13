"use client";

import { useState } from 'react';
import { FiCopy, FiCheck, FiDownload, FiExternalLink, FiShield, FiUsers, FiZap } from 'react-icons/fi';
import { SiBitcoin } from 'react-icons/si';
import Image from 'next/image';

export default function FediPage() {
  const [copiedCommunity, setCopiedCommunity] = useState(false);
  const [copiedFederation, setCopiedFederation] = useState(false);

  const COMMUNITY_INVITE = "fedi:community10v3xxmmdd46ku6t5090k6et5v90h2unvygazy6r5w3c8xw309a4x76tw943k7mtdw4hxjare9eenxtn4wvkk2ctnwsknztnpd4sh5mmwv9mhxtnrdakj7ctxwf5ky6t5ta4kjcn9wfsj7mt9w3sju6nndahzylg3wdue0";
  const FEDERATION_INVITE = "fed11qgqyj3mfwfhksw309ucrxe35vgcryvesxf3nyepsv3jnyepsvgcnxdpjv5urjcfkv4nrydmxxvervef3xcmxxce5x5ergwfnxcukzetr8qen2vnpvsmr2vrzqyqjplegdfhg4qq8f0zeuvjxn8e49sa3tnep7w08dca79wecgjkyszrufgwesp";

  const copyToClipboard = (text: string, type: 'community' | 'federation') => {
    navigator.clipboard.writeText(text);
    if (type === 'community') {
      setCopiedCommunity(true);
      setTimeout(() => setCopiedCommunity(false), 2000);
    } else {
      setCopiedFederation(true);
      setTimeout(() => setCopiedFederation(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/Media/Logo/icon symbol only svg.svg"
              alt="Afribit"
              width={48}
              height={48}
              className="rounded-full"
            />
            <span className="text-3xl font-bold text-gray-400">×</span>
            <Image
              src="/Media/Partner logos/Fedi logo.jpg"
              alt="Fedi"
              width={48}
              height={48}
              className="rounded-lg"
            />
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">
            Join Afribit on <span className="text-gradient bg-gradient-to-r from-purple-400 to-pink-400">Fedi</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Connect with our community through Fedi's secure, privacy-focused Bitcoin wallet. Join our federation and community to engage, transact, and grow together.
          </p>
        </div>

        {/* What is Fedi Section */}
        <div className="mb-16 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold font-heading mb-6 text-center">What is Fedi?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                <FiShield className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Privacy First</h3>
              <p className="text-sm text-gray-400">
                Self-custodial Bitcoin wallet with end-to-end encrypted chat and transactions
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-bitcoin/20 rounded-2xl flex items-center justify-center">
                <FiUsers className="w-8 h-8 text-bitcoin" />
              </div>
              <h3 className="text-xl font-bold mb-2">Community Powered</h3>
              <p className="text-sm text-gray-400">
                Join federations and communities to connect with like-minded Bitcoin users
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-pink-500/20 rounded-2xl flex items-center justify-center">
                <FiZap className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-sm text-gray-400">
                Instant Bitcoin payments with Lightning Network integration
              </p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <a
              href="https://www.fedi.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              Learn more about Fedi
              <FiExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Download Fedi App */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold font-heading mb-4">Step 1: Download Fedi App</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Get the Fedi app on your mobile device to join our community and federation
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://apps.apple.com/app/fedi/id6444849426"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-xl transition-all"
            >
              <FiDownload className="w-5 h-5" />
              <span className="font-semibold">iOS</span>
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.fedi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-xl transition-all"
            >
              <FiDownload className="w-5 h-5" />
              <span className="font-semibold">Android</span>
            </a>
          </div>
        </div>

        {/* Join Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Community Invite */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <FiUsers className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold font-heading">Join Our Community</h2>
            </div>
            <p className="text-gray-300 mb-6">
              Connect with Afribit community members, chat, and participate in group activities
            </p>

            {/* QR Code */}
            <div className="bg-white rounded-xl p-6 mb-6 flex items-center justify-center">
              <Image
                src="/Media/Images/fedi-community-qr.png"
                alt="Afribit Community QR Code"
                width={256}
                height={256}
                className="rounded-lg"
              />
            </div>

            {/* Copy Code */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-400 mb-2">Community Invite Code</label>
              <div className="relative">
                <input
                  type="text"
                  value={COMMUNITY_INVITE}
                  readOnly
                  className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white text-xs font-mono pr-20"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  onClick={() => copyToClipboard(COMMUNITY_INVITE, 'community')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold rounded-md transition-all flex items-center gap-1"
                >
                  {copiedCommunity ? (
                    <>
                      <FiCheck className="w-3 h-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <FiCopy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
              <p className="text-xs text-gray-300">
                <strong>How to join:</strong> Open Fedi app → Tap "Join Community" → Scan QR code or paste the invite code above
              </p>
            </div>
          </div>

          {/* Federation Invite */}
          <div className="bg-gradient-to-br from-bitcoin/10 to-orange-500/5 border border-bitcoin/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <SiBitcoin className="w-6 h-6 text-bitcoin" />
              <h2 className="text-2xl font-bold font-heading">Join Our Federation</h2>
            </div>
            <p className="text-gray-300 mb-6">
              Access shared Bitcoin custody and seamless Lightning payments within our federation
            </p>

            {/* QR Code */}
            <div className="bg-white rounded-xl p-6 mb-6 flex items-center justify-center">
              <Image
                src="/Media/Images/fedi-federation-qr.png"
                alt="Afribit Federation QR Code"
                width={256}
                height={256}
                className="rounded-lg"
              />
            </div>

            {/* Copy Code */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-400 mb-2">Federation Invite Code</label>
              <div className="relative">
                <input
                  type="text"
                  value={FEDERATION_INVITE}
                  readOnly
                  className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white text-xs font-mono pr-20"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  onClick={() => copyToClipboard(FEDERATION_INVITE, 'federation')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-bitcoin hover:bg-bitcoin-dark text-white text-xs font-semibold rounded-md transition-all flex items-center gap-1"
                >
                  {copiedFederation ? (
                    <>
                      <FiCheck className="w-3 h-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <FiCopy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-bitcoin/10 border border-bitcoin/20 rounded-lg p-3">
              <p className="text-xs text-gray-300">
                <strong>How to join:</strong> Open Fedi app → Tap "Join Federation" → Scan QR code or paste the invite code above
              </p>
            </div>
          </div>
        </div>

        {/* Why Join Section */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold font-heading mb-8 text-center">Why Join Afribit on Fedi?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-bitcoin/20 rounded-lg flex items-center justify-center shrink-0">
                <SiBitcoin className="w-5 h-5 text-bitcoin" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Direct Bitcoin Support</h3>
                <p className="text-sm text-gray-400">
                  Send Bitcoin donations directly through Fedi with instant Lightning payments
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center shrink-0">
                <FiUsers className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Community Engagement</h3>
                <p className="text-sm text-gray-400">
                  Chat with team members, get updates, and participate in community discussions
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center shrink-0">
                <FiZap className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Instant Updates</h3>
                <p className="text-sm text-gray-400">
                  Receive real-time notifications about programs, events, and impact stories
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center shrink-0">
                <FiShield className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Private & Secure</h3>
                <p className="text-sm text-gray-400">
                  Your transactions and communications are encrypted and private
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-400 mb-6">
            Need help joining? Contact us at{' '}
            <a href="mailto:connect@afribit.africa" className="text-bitcoin hover:text-white transition-colors">
              connect@afribit.africa
            </a>
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="/donate"
              className="btn btn-primary px-8 py-3"
            >
              Support Afribit
            </a>
            <a
              href="https://support.fedi.xyz/hc/en-us"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary px-8 py-3"
            >
              Fedi Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
