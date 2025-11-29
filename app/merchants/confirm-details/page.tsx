'use client';

import { useState } from 'react';
import MerchantSearch from '@/components/MerchantSearch';
import EditRequestForm from '@/components/EditRequestForm';
import { CheckCircle, AlertCircle, Info, ArrowLeft } from 'lucide-react';

interface Merchant {
  id: number;
  businessName: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  blinkAddress?: string;
  adopterNumber: number;
  confirmed: boolean;
  osmNodeId: string;
}

export default function ConfirmDetailsPage() {
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleMerchantSelect = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setSubmitted(false);
  };

  const handleSuccess = () => {
    setSubmitted(true);
    setSelectedMerchant(null);
  };

  const handleCancel = () => {
    setSelectedMerchant(null);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 sm:p-12 text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-14 h-14 text-green-400" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white mb-4">
              Thank You!
            </h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              Your edit request has been submitted successfully. Our admin team will review your changes and update your business details within 24-48 hours.
            </p>
            <p className="text-sm text-gray-400 mb-8">
              You'll receive an email confirmation shortly at the address you provided.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-bitcoin hover:bg-bitcoin-dark text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-bitcoin/20 hover:shadow-bitcoin/30 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
              Submit Another Business
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-40 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Banner */}
        <div className="bg-black border-2 border-bitcoin/30 rounded-2xl shadow-2xl shadow-bitcoin/20 p-6 sm:p-10 mb-8 text-white relative overflow-hidden">
          <div className="relative z-10 flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-bitcoin/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-bitcoin/30">
                <Info className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-4xl font-bold font-heading mb-4 tracking-tight">
                Early Adopter - Confirm Your Business Details
              </h1>
              <p className="text-white/95 text-lg mb-6 leading-relaxed">
                As one of our first 40+ merchants, you were registered manually. We need your help to verify and correct your business information, especially your exact location coordinates.
              </p>
              <div className="space-y-3">
                <p className="font-semibold text-lg">How it works:</p>
                <ol className="list-decimal list-inside space-y-2 text-white/90 text-base">
                  <li>Search for your business name below</li>
                  <li>Verify and edit your business details</li>
                  <li className="font-semibold">Important: Confirm your exact location (ideally while at your business premises)</li>
                  <li>Submit for admin review</li>
                  <li>We'll update both our database and OpenStreetMap (BTC Maps)</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-6 mb-8 rounded-r-2xl backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-semibold text-yellow-300 mb-2">Only Early Adopters</h3>
              <p className="text-sm text-yellow-200/90 leading-relaxed">
                This tool is for the first 40+ merchants who were registered manually. If you recently registered online, your details are already correct.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {!selectedMerchant ? (
            <MerchantSearch onSelect={handleMerchantSelect} />
          ) : (
            <>
              <div className="bg-white/5 backdrop-blur-sm px-6 sm:px-8 py-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-heading text-white mb-1">
                    Editing: {selectedMerchant.businessName}
                  </h2>
                  <p className="text-sm text-gray-400">
                    Early Adopter #{selectedMerchant.adopterNumber}
                  </p>
                </div>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Choose Different Business
                </button>
              </div>
              <EditRequestForm
                merchant={selectedMerchant}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-500/10 border-l-4 border-blue-500 p-6 rounded-r-2xl backdrop-blur-sm">
          <h3 className="text-base font-semibold text-blue-300 mb-3 font-heading">Need Help?</h3>
          <p className="text-sm text-blue-200/90 mb-3 leading-relaxed">
            If you have questions or encounter any issues, please contact us:
          </p>
          <div className="text-sm text-blue-200/80">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
              <span>Email: <a href="mailto:info@afribit.africa" className="text-blue-300 hover:text-blue-200 underline transition-colors">info@afribit.africa</a></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
