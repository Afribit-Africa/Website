import { Metadata } from 'next';
import { ArrowLeft, Database, Clock, CheckCircle2, AlertTriangle, Server } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Infrastructure Migration | Afribit Africa',
  description: 'Information about our ongoing database migration and service updates.',
  robots: 'noindex, nofollow',
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Back Link */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
            <Server className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Infrastructure Migration
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're upgrading our systems to serve you better
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 mt-1">
              <Clock className="w-6 h-6 text-orange-500 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Current Status: Migration in Progress
              </h2>
              <p className="text-gray-600">
                <span className="font-semibold">Started:</span> December 13, 2025 at 11:00 AM EAT
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Expected completion:</span> Within 24 hours
              </p>
            </div>
          </div>

          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full w-[40%] animate-pulse"></div>
          </div>
        </div>

        {/* What's Happening */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-6 h-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900">What's Happening?</h2>
          </div>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Our previous database hosting provider's contract has expired, and we're taking this opportunity to migrate to a more robust, scalable infrastructure. This upgrade will improve:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Performance:</strong> Faster response times for all services</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Reliability:</strong> 99.9% uptime with automated backups</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Security:</strong> Enhanced data protection and encryption</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Scalability:</strong> Better support for growing merchant network</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Affected Services */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-gray-900">Temporarily Affected Services</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <h3 className="font-semibold text-gray-900 mb-2">Merchant Registration</h3>
              <p className="text-sm text-gray-600">New merchant submissions are temporarily paused during migration</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <h3 className="font-semibold text-gray-900 mb-2">Verifier Dashboard</h3>
              <p className="text-sm text-gray-600">Location verification features are temporarily unavailable</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <h3 className="font-semibold text-gray-900 mb-2">Admin Portal</h3>
              <p className="text-sm text-gray-600">Merchant management and approval functions are offline</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <h3 className="font-semibold text-gray-900 mb-2">Edit Requests</h3>
              <p className="text-sm text-gray-600">Merchant information updates are temporarily disabled</p>
            </div>
          </div>
        </div>

        {/* Unaffected Services */}
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Services Still Available</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Merchant Directory</h3>
                <p className="text-sm text-gray-600">Browse existing merchants (cached data)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Interactive Map</h3>
                <p className="text-sm text-gray-600">View merchant locations on BTCMap</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Donations</h3>
                <p className="text-sm text-gray-600">Bitcoin donations via BTCPay Server</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Website Content</h3>
                <p className="text-sm text-gray-600">All informational pages remain accessible</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Migration Timeline</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Phase 1: Data Backup (Completed)</p>
                <p className="text-sm text-gray-600">Full database backup created and verified</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600 animate-pulse" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Phase 2: Migration (In Progress)</p>
                <p className="text-sm text-gray-600">Transferring data to new infrastructure</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Phase 3: Testing & Verification</p>
                <p className="text-sm text-gray-600">Comprehensive testing of all systems</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Phase 4: Service Restoration</p>
                <p className="text-sm text-gray-600">All services back online with improved performance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions or Concerns?</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            We appreciate your patience during this upgrade. If you have urgent merchant-related matters or questions about the migration, please reach out to our team.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              Contact Us
            </Link>
            <a
              href="mailto:info@afribit.africa"
              className="inline-flex items-center px-6 py-3 bg-white text-orange-600 border-2 border-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium"
            >
              Email: info@afribit.africa
            </a>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
