'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Search, Map, ArrowLeft, Bitcoin } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A0A00] to-[#0A0A0A] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #F7931A 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Bitcoin Orange Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-bitcoin/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-bitcoin/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-2xl w-full text-center">
          {/* Bitcoin Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-bitcoin/20 rounded-full mb-8 animate-pulse">
            <Bitcoin className="w-12 h-12 text-bitcoin" />
          </div>

          {/* 404 */}
          <h1 className="text-9xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-bitcoin via-orange-400 to-bitcoin mb-4">
            404
          </h1>

          {/* Message */}
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto">
            Oops! The page you're looking for seems to have wandered off the blockchain.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              variant="primary"
              onClick={() => router.back()}
              icon={<ArrowLeft className="w-5 h-5" />}
              className="w-full sm:w-auto"
            >
              Go Back
            </Button>
            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                icon={<Home className="w-5 h-5" />}
                className="w-full"
              >
                Go Home
              </Button>
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Looking for something specific?</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link href="/merchants">
                <div className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all cursor-pointer group">
                  <Search className="w-6 h-6 text-bitcoin mb-2 mx-auto group-hover:scale-110 transition-transform" />
                  <p className="text-white text-sm font-medium">Find Merchants</p>
                  <p className="text-gray-400 text-xs mt-1">Browse Bitcoin businesses</p>
                </div>
              </Link>

              <Link href="/maps">
                <div className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all cursor-pointer group">
                  <Map className="w-6 h-6 text-bitcoin mb-2 mx-auto group-hover:scale-110 transition-transform" />
                  <p className="text-white text-sm font-medium">Explore Maps</p>
                  <p className="text-gray-400 text-xs mt-1">View merchant locations</p>
                </div>
              </Link>

              <Link href="/about">
                <div className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all cursor-pointer group">
                  <Bitcoin className="w-6 h-6 text-bitcoin mb-2 mx-auto group-hover:scale-110 transition-transform" />
                  <p className="text-white text-sm font-medium">About Us</p>
                  <p className="text-gray-400 text-xs mt-1">Learn about Afribit</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Support Contact */}
          <p className="text-gray-400 text-sm mt-8">
            Need help? <a href="mailto:info@afribit.africa" className="text-bitcoin hover:underline">Contact us</a>
          </p>
        </div>
      </div>
    </div>
  );
}
