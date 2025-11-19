'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Mail, Edit, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function SuccessContent() {
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  const editToken = searchParams.get('token');
  const email = searchParams.get('email');
  const [copied, setCopied] = useState(false);
  const [editLink, setEditLink] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && submissionId && editToken) {
      setEditLink(`${window.location.origin}/merchants/edit/${submissionId}?token=${editToken}`);
    }
  }, [submissionId, editToken]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Icon */}
        <div className="text-center mb-6 md:mb-8 animate-island-expand">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-500/20 mb-4 md:mb-6">
            <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-3 md:mb-4 px-2">
            Submission <span className="text-gradient">Received!</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg px-4">
            Thank you for registering your business with Afribit
          </p>
        </div>

        {/* Info Cards */}
        <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
          {/* Important Notice Card */}
          <div className="glass-card p-4 md:p-6 border-2 border-bitcoin/30">
            <h2 className="text-lg md:text-xl font-heading font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 md:w-5 md:h-5 text-bitcoin" />
              <span className="text-base md:text-xl">📧 Check Your Email</span>
            </h2>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
              <p className="text-green-200 font-medium mb-2 text-sm md:text-base">
                ✅ Confirmation email sent to {email}
              </p>
              <p className="text-gray-300 text-xs md:text-sm">
                We've sent you an email with all the details and your secure edit link. Please check your inbox (and spam folder just in case).
              </p>
            </div>

            {/* Edit Link - Minimized */}
            <div className="bg-[#0A0A0A] border border-bitcoin/30 rounded-lg p-3 md:p-4 mb-3">
              <label className="text-xs md:text-sm text-gray-400 mb-2 block font-medium">Your Secure Edit Link:</label>
              <code className="text-xs md:text-sm text-bitcoin break-all block mb-3 bg-black/50 p-2 rounded">
                {editLink}
              </code>
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                <Button
                  variant="primary"
                  onClick={copyToClipboard}
                  className="flex-1 text-sm md:text-base py-2 md:py-2.5"
                >
                  {copied ? '✓ Copied!' : 'Copy Link'}
                </Button>
                <Link href={editLink} className="flex-1">
                  <Button variant="secondary" className="w-full text-sm md:text-base py-2 md:py-2.5">
                    Open Edit Page
                  </Button>
                </Link>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center">
              💡 Bookmark this page or the edit link for easy access
            </p>
          </div>

          {/* What's Next Card */}
          <div className="glass-card p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-heading font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
              <span>What Happens Next?</span>
            </h2>
            <ul className="space-y-2 md:space-y-3 text-gray-400 text-sm md:text-base">
              <li className="flex items-start gap-2 md:gap-3">
                <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-bitcoin/20 text-bitcoin flex items-center justify-center text-xs md:text-sm font-bold">1</span>
                <p className="pt-0.5">Your submission has been received and is <span className="text-white font-medium">pending review</span></p>
              </li>
              <li className="flex items-start gap-2 md:gap-3">
                <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-bitcoin/20 text-bitcoin flex items-center justify-center text-xs md:text-sm font-bold">2</span>
                <p className="pt-0.5">Our admin team will review your business within <span className="text-white font-medium">24-48 hours</span></p>
              </li>
              <li className="flex items-start gap-2 md:gap-3">
                <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-bitcoin/20 text-bitcoin flex items-center justify-center text-xs md:text-sm font-bold">3</span>
                <p className="pt-0.5">Use the <span className="text-white font-medium">edit link above</span> to check status or make changes before approval</p>
              </li>
              <li className="flex items-start gap-2 md:gap-3">
                <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-bitcoin/20 text-bitcoin flex items-center justify-center text-xs md:text-sm font-bold">4</span>
                <p className="pt-0.5">Once approved, your business will appear on <span className="text-white font-medium">BTCMap.org</span> and our merchant directory</p>
              </li>
            </ul>
          </div>

          {/* Submission Details */}
          <div className="glass-card p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-heading font-bold text-white mb-3 md:mb-4">
              Submission Details
            </h2>
            <div className="space-y-2 text-xs md:text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-gray-400">Submission ID:</span>
                <span className="text-white font-mono text-right break-all">{submissionId}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-400">Contact Email:</span>
                <span className="text-white text-right break-all">{searchParams.get('email') || 'N/A'}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-400">Status:</span>
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded text-xs font-medium">
                  Pending Review
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-400">Submitted:</span>
                <span className="text-white text-right">{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
          <Link href="/merchants" className="w-full sm:w-auto">
            <Button variant="secondary" icon={<MapPin className="w-4 h-4 md:w-5 md:h-5" />} className="w-full sm:w-auto text-sm md:text-base">
              View Merchant Directory
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto text-sm md:text-base">
              Back to Homepage
            </Button>
          </Link>
        </div>

        {/* Help */}
        <div className="text-center mt-6 md:mt-8 text-gray-500 text-xs md:text-sm px-4">
          <p>
            Questions or need help? Contact us at{' '}
            <a href="mailto:info@afribit.africa" className="text-bitcoin hover:underline">
              info@afribit.africa
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
