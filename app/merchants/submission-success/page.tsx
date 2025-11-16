'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SubmissionSuccessPage() {
  const router = useRouter();
  const [editToken, setEditToken] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve from session storage
    const token = sessionStorage.getItem('merchantEditToken');
    const id = sessionStorage.getItem('merchantSubmissionId');

    if (token && id) {
      setEditToken(token);
      setSubmissionId(id);
    }
  }, []);

  const editUrl = submissionId && editToken
    ? `/merchants/edit/${submissionId}?token=${editToken}`
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
          {/* Success Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Submission Received!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for registering your Bitcoin business
            </p>
          </div>

          {/* What Happens Next */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold text-gray-900">What happens next?</h2>

            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-semibold mr-3">
                  1
                </div>
                <p className="text-gray-700">
                  <strong>Confirmation Email:</strong> Check your inbox for a confirmation email with your edit link
                </p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-semibold mr-3">
                  2
                </div>
                <p className="text-gray-700">
                  <strong>Review Process:</strong> Our team will review your submission (typically 1-3 business days)
                </p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-semibold mr-3">
                  3
                </div>
                <p className="text-gray-700">
                  <strong>Publication:</strong> Once approved, your business will be added to OpenStreetMap and BTCMap
                </p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-semibold mr-3">
                  4
                </div>
                <p className="text-gray-700">
                  <strong>Go Live:</strong> Your business will be visible to the global Bitcoin community!
                </p>
              </div>
            </div>
          </div>

          {/* Edit Link */}
          {editUrl && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Need to make changes?</h3>
              <p className="text-sm text-gray-600 mb-3">
                You can edit your submission before it's approved using this link:
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <code className="flex-1 bg-white px-3 py-2 rounded border border-orange-300 text-xs break-all">
                  {editUrl}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(window.location.origin + editUrl)}
                  className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors text-sm font-medium"
                >
                  Copy Link
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 This link has also been sent to your email. Save it to edit your submission later!
              </p>
            </div>
          )}

          {/* Early Adopter Badge Info */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <span className="text-2xl mr-3">🎉</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Early Adopter Program</h3>
                <p className="text-sm text-gray-700">
                  The first 50 approved merchants receive a special <strong>Early Adopter Badge</strong> and priority listing on Afribit's merchant directory!
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="flex-1 text-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              Back to Home
            </Link>
            <Link
              href="/merchants"
              className="flex-1 text-center px-6 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-semibold"
            >
              View Merchant Directory
            </Link>
          </div>

          {/* Support */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Questions or issues?{' '}
              <Link href="/contact" className="text-orange-600 hover:text-orange-700 font-medium">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
