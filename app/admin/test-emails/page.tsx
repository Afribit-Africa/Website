'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function EmailTestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Redirect if not admin
  if (status === 'unauthenticated' || (status === 'authenticated' && (session?.user as any)?.role !== 'admin')) {
    router.push('/admin/login');
    return null;
  }

  const sendTestEmail = async (emailType: 'confirmation' | 'applied' | 'rejected') => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailType })
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#F7931A] mb-2">Email Testing</h1>
        <p className="text-gray-400 mb-8">Test edit request emails - All will be sent to spiraedmunds@gmail.com</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Confirmation Email */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-bold text-blue-400 mb-3">Merchant Confirmation</h2>
            <p className="text-gray-400 text-sm mb-4">
              Email sent after admin approves edit request. Contains:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Side-by-side comparison table</li>
                <li>Orange CTA button with token link</li>
                <li>7-day expiry warning</li>
                <li>Security disclaimer</li>
              </ul>
            </p>
            <button
              onClick={() => sendTestEmail('confirmation')}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Confirmation Email'}
            </button>
          </div>

          {/* Changes Applied Email */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-bold text-green-400 mb-3">Changes Applied</h2>
            <p className="text-gray-400 text-sm mb-4">
              Email sent after admin applies changes. Contains:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Green success theme</li>
                <li>List of updated fields</li>
                <li>View Map buttons (Afribit + BTCMap)</li>
                <li>Thank you message</li>
              </ul>
            </p>
            <button
              onClick={() => sendTestEmail('applied')}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Applied Email'}
            </button>
          </div>

          {/* Rejection Email */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-400 mb-3">Edit Rejected</h2>
            <p className="text-gray-400 text-sm mb-4">
              Email sent when admin rejects request. Contains:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Yellow warning theme</li>
                <li>Clear rejection reason</li>
                <li>4-step resubmission guidance</li>
                <li>Support contact info</li>
              </ul>
            </p>
            <button
              onClick={() => sendTestEmail('rejected')}
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Rejection Email'}
            </button>
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <div className={`bg-white/5 backdrop-blur-md border rounded-lg p-6 ${
            result.success ? 'border-green-500/50' : 'border-red-500/50'
          }`}>
            <h3 className={`text-xl font-bold mb-3 ${
              result.success ? 'text-green-400' : 'text-red-400'
            }`}>
              {result.success ? '✓ Success!' : '✗ Error'}
            </h3>
            <pre className="text-sm text-gray-300 overflow-x-auto bg-black/50 rounded p-4">
              {JSON.stringify(result, null, 2)}
            </pre>
            {result.success && (
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-300 text-sm">
                  ✉️ Email sent to <strong>spiraedmunds@gmail.com</strong>
                  <br />
                  Check your inbox (and spam folder) for the test email.
                  <br />
                  Email Type: <strong>{result.emailType}</strong>
                  {result.emailId && (
                    <>
                      <br />
                      Email ID: <code className="text-xs">{result.emailId}</code>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
          <h3 className="text-yellow-300 font-bold mb-3">📋 Testing Instructions</h3>
          <ol className="text-gray-300 space-y-2 list-decimal list-inside">
            <li>Click any button above to send a test email</li>
            <li>Check <strong>spiraedmunds@gmail.com</strong> inbox</li>
            <li>Verify email design, content, and links</li>
            <li>Test confirmation button/link (will show test token page)</li>
            <li>Check mobile responsiveness by viewing on phone</li>
            <li>Verify all images and styling load correctly</li>
          </ol>
        </div>

        {/* Quick Links */}
        <div className="mt-6 flex gap-4">
          <a
            href="/admin/dashboard"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-center hover:bg-white/10 transition-colors"
          >
            ← Back to Dashboard
          </a>
          <a
            href="/admin/edit-requests"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-center hover:bg-white/10 transition-colors"
          >
            View Edit Requests →
          </a>
        </div>
      </div>
    </div>
  );
}
