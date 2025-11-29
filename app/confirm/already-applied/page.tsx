/**
 * Already Applied Page
 */

'use client';

import Link from 'next/link';
import { CheckCircle2, MapPin, ExternalLink } from 'lucide-react';

export default function AlreadyAppliedPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-xl w-full">
        <div className="bg-white/5 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-500/20 rounded-full p-4">
              <CheckCircle2 className="w-16 h-16 text-green-400" />
            </div>
          </div>

          <h1 className="text-3xl font-bold font-heading text-white mb-4">
            Changes Already Applied
          </h1>

          <p className="text-gray-300 mb-6 font-body">
            Great news! Your changes have already been applied and are now live on Bitcoin Maps.
          </p>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-8 text-left">
            <p className="text-sm text-green-300 font-body">
              <strong>Your business information is now updated!</strong><br />
              Your updated details are visible on Bitcoin Maps and OpenStreetMap.
              You should have received a confirmation email with links to verify your listing.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              href="/maps"
              className="bg-bitcoin hover:bg-bitcoin/90 text-black font-semibold font-heading px-8 py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <MapPin className="w-5 h-5" />
              View on Bitcoin Map
            </Link>

            <a
              href="https://btcmap.org"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold font-heading px-8 py-3 rounded-lg transition-all border border-white/20 flex items-center justify-center gap-2"
            >
              View on BTCMap
              <ExternalLink className="w-4 h-4" />
            </a>

            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors font-body"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
