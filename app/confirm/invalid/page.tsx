/**
 * Invalid/Expired Token Page
 */

'use client';

import Link from 'next/link';
import { XCircle, ArrowRight } from 'lucide-react';

export default function InvalidTokenPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-xl w-full">
        <div className="bg-white/5 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-red-500/20 rounded-full p-4">
              <XCircle className="w-16 h-16 text-red-400" />
            </div>
          </div>

          <h1 className="text-3xl font-bold font-heading text-white mb-4">
            Invalid Confirmation Link
          </h1>

          <p className="text-gray-300 mb-6 font-body">
            This confirmation link is invalid or has already been used.
          </p>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8 text-left">
            <p className="text-sm text-red-300 font-body">
              <strong>Possible reasons:</strong><br />
              • The link has expired (confirmation links are valid for 7 days)<br />
              • The link has already been used<br />
              • The link is incorrect or incomplete
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              href="/contact"
              className="bg-bitcoin hover:bg-bitcoin/90 text-black font-semibold font-heading px-8 py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              Contact Support
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
