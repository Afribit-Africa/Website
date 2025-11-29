/**
 * Already Confirmed Page
 */

'use client';

import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function AlreadyConfirmedPage() {
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
            Already Confirmed
          </h1>

          <p className="text-gray-300 mb-6 font-body">
            You have already confirmed this edit request. Your changes are waiting to be applied by our team.
          </p>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-8 text-left">
            <p className="text-sm text-green-300 font-body">
              <strong>What's next?</strong><br />
              An administrator will apply your confirmed changes to the merchant database and publish them to Bitcoin Maps.
              You'll receive an email notification when your business information is updated.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              href="/maps"
              className="bg-bitcoin hover:bg-bitcoin/90 text-black font-semibold font-heading px-8 py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              View Bitcoin Map
              <ArrowRight className="w-5 h-5" />
            </Link>

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
