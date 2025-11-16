'use client';

import { useState, Suspense, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, AlertTriangle, X, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Toaster } from 'react-hot-toast';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false);

  // Check for OAuth error on mount and when error param changes
  useEffect(() => {
    if (error === 'OAuthAccountNotLinked' || error === 'OAuthSignin' || error === 'AccessDenied') {
      setShowAccessDeniedModal(true);
    }
  }, [error]);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      // Let NextAuth handle the redirect
      await signIn('google', {
        callbackUrl: '/admin/dashboard',
      });
    } catch (error) {
      setShowAccessDeniedModal(true);
      setIsGoogleLoading(false);
    }
  };

  const closeModal = () => {
    setShowAccessDeniedModal(false);
    // Remove error from URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete('error');
    router.replace(`/admin/login${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <Toaster position="top-center" />

      {/* Access Denied Modal */}
      {showAccessDeniedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card max-w-md w-full p-6 border-2 border-red-500/30 relative">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-heading font-bold text-white text-center mb-2">
              Access Denied
            </h2>

            {/* Message */}
            <p className="text-gray-300 text-center mb-4">
              Your email is not authorized for admin access to this system.
            </p>

            <p className="text-sm text-gray-400 text-center mb-6">
              Only authorized Afribit administrators can log in. If you believe this is an error, please contact the system administrator.
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={closeModal}
                variant="secondary"
                className="flex-1"
              >
                Close
              </Button>
              <a href="mailto:info@afribit.africa" className="flex-1">
                <Button variant="primary" className="w-full">
                  Contact Admin
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow-lg">
            <ShieldCheck className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-4xl font-heading font-bold text-white mb-3">
            Admin Portal
          </h1>
          <p className="text-gray-400 text-lg">
            Afribit Merchant Management
          </p>
        </div>

        {/* Google Sign In Button - Centered */}
        <div className="flex justify-center mb-8">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-8 rounded-lg flex items-center justify-center gap-4 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Google Logo SVG */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>

            <span className="text-lg">
              {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">
            Authorized administrators only
          </p>
          <p className="text-xs text-gray-600">
            Need assistance?{' '}
            <a href="mailto:info@afribit.africa" className="text-white hover:text-gray-300 transition-colors">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
