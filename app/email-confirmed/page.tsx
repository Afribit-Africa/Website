/**
 * Email Confirmation Success Page
 *
 * Shown when a merchant successfully confirms their email address
 * after clicking the confirmation link from test emails.
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Mail, MapPin, ArrowRight } from 'lucide-react';

export default function EmailConfirmedPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7931A]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Email Confirmed! ✓
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Thank you for confirming your email address
          </p>
          <p className="text-gray-400">
            Your email has been successfully verified
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* What Happens Next */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-lg font-bold text-white">What's Next?</h2>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-[#F7931A] mt-1">•</span>
                <span>You'll receive future updates via email</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F7931A] mt-1">•</span>
                <span>Important notifications will be sent to your inbox</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F7931A] mt-1">•</span>
                <span>Keep this email for your records</span>
              </li>
            </ul>
          </div>

          {/* For Merchants */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#F7931A]/20 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#F7931A]" />
              </div>
              <h2 className="text-lg font-bold text-white">For Merchants</h2>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-[#F7931A] mt-1">•</span>
                <span>Your business details are being reviewed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F7931A] mt-1">•</span>
                <span>Admin will apply changes after confirmation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F7931A] mt-1">•</span>
                <span>You'll be notified when changes go live</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6 text-center">Confirmation Timeline</h2>
          <div className="space-y-4">
            {/* Step 1 - Complete */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">Email Sent</div>
                <div className="text-sm text-gray-400">Confirmation email delivered to your inbox</div>
              </div>
              <div className="text-xs text-green-400 font-medium">Complete</div>
            </div>

            {/* Step 2 - Complete */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">Link Clicked</div>
                <div className="text-sm text-gray-400">You clicked the confirmation link</div>
              </div>
              <div className="text-xs text-green-400 font-medium">Complete</div>
            </div>

            {/* Step 3 - Complete */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">Email Confirmed</div>
                <div className="text-sm text-gray-400">Your email address has been verified</div>
              </div>
              <div className="text-xs text-green-400 font-medium">Complete</div>
            </div>

            {/* Step 4 - Pending */}
            <div className="flex items-center gap-4 opacity-50">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-600 border-2 border-gray-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">4</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">Admin Review</div>
                <div className="text-sm text-gray-400">Awaiting admin to apply changes</div>
              </div>
              <div className="text-xs text-gray-500 font-medium">Pending</div>
            </div>

            {/* Step 5 - Pending */}
            <div className="flex items-center gap-4 opacity-50">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-600 border-2 border-gray-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">5</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">Changes Live</div>
                <div className="text-sm text-gray-400">Updated details published to Bitcoin Maps</div>
              </div>
              <div className="text-xs text-gray-500 font-medium">Pending</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-lg font-medium transition-all"
          >
            Back to Home
          </Link>
          <Link
            href="/merchants"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#F7931A] to-[#FFA500] text-black px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-all"
          >
            View Merchant Directory
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Questions? Contact us at{' '}
            <a href="mailto:support@afribit.africa" className="text-[#F7931A] hover:underline">
              support@afribit.africa
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
