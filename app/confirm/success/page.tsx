/**
 * Merchant Confirmation Success Page
 *
 * Shown after merchant successfully confirms their edit request.
 * Next step: Admin will apply the changes to the database and OSM.
 */

'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Clock } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const businessName = searchParams.get('business') || 'your business';

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-500/20 rounded-full p-4">
              <CheckCircle className="w-16 h-16 text-green-400" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
            Confirmation Successful!
          </h1>

          {/* Business Name */}
          <p className="text-xl text-gray-300 mb-6 font-body">
            Thank you for confirming the information for{' '}
            <strong className="text-bitcoin">{businessName}</strong>
          </p>

          {/* Timeline */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold font-heading text-white mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-bitcoin" />
              What Happens Next?
            </h2>

            <div className="space-y-4 font-body">
              <div className="flex items-start gap-3">
                <div className="bg-green-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="text-white font-medium">Edit Request Submitted</p>
                  <p className="text-gray-400 text-sm">Your changes have been recorded</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="text-white font-medium">Admin Approved</p>
                  <p className="text-gray-400 text-sm">An administrator reviewed and approved your request</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="text-bitcoin font-medium">You Confirmed ✓</p>
                  <p className="text-gray-400 text-sm">You just verified the changes are correct</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-bitcoin/30 border-2 border-bitcoin rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-bitcoin text-xs font-bold">4</span>
                </div>
                <div>
                  <p className="text-gray-300 font-medium">Admin Will Apply Changes</p>
                  <p className="text-gray-400 text-sm">Your information will be updated on Bitcoin Maps</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-white/10 border border-white/20 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gray-400 text-xs font-bold">5</span>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">You'll Receive Confirmation</p>
                  <p className="text-gray-400 text-sm">We'll email you when changes are live</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-8 text-left">
            <p className="text-sm text-blue-300 font-body">
              <strong className="text-blue-400">Note:</strong> An administrator will now apply your confirmed changes
              to the merchant database and publish them to OpenStreetMap. You'll receive an email notification
              once your business information is updated.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-bitcoin hover:bg-bitcoin/90 text-black font-semibold font-heading px-8 py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-bitcoin/30"
            >
              Return to Home
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/maps"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold font-heading px-8 py-3 rounded-lg transition-all border border-white/20"
            >
              View Bitcoin Map
            </Link>
          </div>

          {/* Footer Note */}
          <p className="text-gray-500 text-sm mt-8 font-body">
            Questions? Contact us at{' '}
            <a href="mailto:support@afribit.africa" className="text-bitcoin hover:underline">
              support@afribit.africa
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
