'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FiArrowLeft, 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiMap,
  FiList,
  FiExternalLink,
  FiCopy,
  FiCheck,
  FiShoppingBag,
  FiTruck,
  FiTool,
  FiGlobe,
  FiMonitor,
  FiHeart,
  FiMoreHorizontal,
  FiScissors
} from 'react-icons/fi';
import { MdRestaurant } from 'react-icons/md';
import { SiBitcoin } from 'react-icons/si';
import QRCode from 'react-qr-code';
import { getMerchantBySlug, CATEGORY_INFO } from '@/lib/merchants-data';
import { generateWalletLinks } from '@/lib/blink-client';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  restaurant: <MdRestaurant className="w-full h-full" />,
  transport: <FiTruck className="w-full h-full" />,
  beauty: <FiScissors className="w-full h-full" />,
  shop: <FiShoppingBag className="w-full h-full" />,
  service: <FiTool className="w-full h-full" />,
  tourism: <FiGlobe className="w-full h-full" />,
  tech: <FiMonitor className="w-full h-full" />,
  nonprofit: <FiHeart className="w-full h-full" />,
  other: <FiMoreHorizontal className="w-full h-full" />
};

export default function MerchantPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const merchant = getMerchantBySlug(slug);

  const [viewMode, setViewMode] = useState<'details' | 'map'>('details');
  const [donationAmount, setDonationAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [error, setError] = useState('');

  if (!merchant) {
    return (
      <div className="min-h-screen bg-dark pt-8 md:pt-32 pb-24 md:pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-6">Merchant Not Found</h1>
            <p className="text-gray-400 text-lg mb-8">The merchant you're looking for doesn't exist.</p>
            <Link 
              href="/maps"
              className="btn btn-primary btn-lg"
            >
              View All Merchants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const categoryInfo = CATEGORY_INFO[merchant.category || 'other'];

  const handleCreateInvoice = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/merchants/invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchantSlug: merchant.slug,
          amount: parseFloat(donationAmount),
          memo: `Donation of ${donationAmount} sats to ${merchant.businessName}`
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create invoice');
      }

      setInvoice(data.invoice);
    } catch (err: any) {
      setError(err.message || 'Failed to create donation invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPaymentLink = () => {
    if (invoice?.paymentRequest) {
      navigator.clipboard.writeText(invoice.paymentRequest);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const walletLinks = invoice ? generateWalletLinks(invoice.paymentRequest) : null;

  return (
    <div className="min-h-screen bg-dark pt-8 md:pt-32 pb-24 md:pb-20">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Back Button */}
        <Link 
          href="/maps"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-bitcoin transition-all mb-8 font-semibold"
        >
          <FiArrowLeft className="w-4 h-4" /> Back to Merchants
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="rounded-2xl bg-linear-to-b from-white/5 to-white/2 border border-white/10 p-8 mb-8">
              <div className="flex items-start justify-between mb-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-20 h-20 rounded-2xl ${categoryInfo.color} flex items-center justify-center border`}>
                      <div className="w-10 h-10">
                        {CATEGORY_ICONS[merchant.category || 'other']}
                      </div>
                    </div>
                    <div>
                      <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-2">{merchant.businessName}</h1>
                      <p className="text-gray-400 text-lg">Operated by {merchant.ownerName}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${categoryInfo.color}`}>
                    {categoryInfo.name}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('details')}
                    className={`p-3 rounded-xl transition-all ${
                      viewMode === 'details' 
                        ? 'bg-bitcoin text-black' 
                        : 'bg-black/50 text-gray-400 hover:text-white border border-gray-800'
                    }`}
                  >
                    <FiList className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`p-3 rounded-xl transition-all ${
                      viewMode === 'map' 
                        ? 'bg-bitcoin text-black' 
                        : 'bg-black/50 text-gray-400 hover:text-white border border-gray-800'
                    }`}
                  >
                    <FiMap className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {viewMode === 'details' ? (
                <>
                  {/* Description */}
                  <p className="text-gray-300 text-lg leading-relaxed mb-8">{merchant.description}</p>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-black/30 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-bitcoin/10 border border-bitcoin/20 flex items-center justify-center shrink-0">
                        <FiMapPin className="w-5 h-5 text-bitcoin" />
                      </div>
                      <span className="text-gray-200">{merchant.location}</span>
                    </div>
                    
                    {merchant.phoneNumber && (
                      <a 
                        href={`tel:+254${merchant.phoneNumber}`}
                        className="flex items-center gap-4 p-4 rounded-xl bg-black/30 border border-white/5 hover:border-bitcoin/30 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-bitcoin/10 border border-bitcoin/20 flex items-center justify-center shrink-0">
                          <FiPhone className="w-5 h-5 text-bitcoin" />
                        </div>
                        <span className="text-gray-200 group-hover:text-bitcoin transition-colors font-numbers">+254 {merchant.phoneNumber}</span>
                      </a>
                    )}
                    
                    {merchant.email && (
                      <a 
                        href={`mailto:${merchant.email}`}
                        className="flex items-center gap-4 p-4 rounded-xl bg-black/30 border border-white/5 hover:border-bitcoin/30 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-bitcoin/10 border border-bitcoin/20 flex items-center justify-center shrink-0">
                          <FiMail className="w-5 h-5 text-bitcoin" />
                        </div>
                        <span className="text-gray-200 group-hover:text-bitcoin transition-colors">{merchant.email}</span>
                      </a>
                    )}
                    
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-black/30 border border-white/5">
                      <div className="w-10 h-10 rounded-lg bg-bitcoin/10 border border-bitcoin/20 flex items-center justify-center shrink-0">
                        <SiBitcoin className="w-5 h-5 text-bitcoin" />
                      </div>
                      <span className="text-gray-200 font-mono text-sm truncate">{merchant.blinkAddress}</span>
                    </div>
                  </div>

                  {/* BTCMap Link */}
                  {merchant.btcMapUrl && (
                    <div className="mt-8 pt-8 border-t border-white/10">
                      <a
                        href={merchant.btcMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-bitcoin hover:text-bitcoin-light transition-colors font-semibold"
                      >
                        View on BTCMap <FiExternalLink className="w-4 h-4" />
                      </a>
                      <p className="text-sm text-gray-500 mt-3">
                        Merchant data provided by <a href="https://btcmap.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-400">BTCMap.org</a>
                      </p>
                    </div>
                  )}
                </>
              ) : (
                /* Map View */
                <div className="space-y-4">
                  <div className="h-[500px] rounded-xl overflow-hidden border border-white/10">
                    {merchant.btcMapNodeId ? (
                      <iframe
                        src={`https://btcmap.org/map?lat=-1.3133&long=36.7828#${merchant.btcMapNodeId}`}
                        className="w-full h-full border-0"
                        title={`${merchant.businessName} on BTCMap`}
                      />
                    ) : (
                      <iframe
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(merchant.location + ', Nairobi, Kenya')}`}
                        className="w-full h-full border-0"
                        title={`${merchant.businessName} location`}
                      />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Map data © <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-400">OpenStreetMap</a> contributors
                    {merchant.btcMapUrl && (
                      <> · Enhanced by <a href="https://btcmap.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-400">BTCMap</a></>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Donation Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-linear-to-b from-white/5 to-white/2 border border-white/10 p-6 sticky top-32">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-bitcoin/10 border border-bitcoin/20 flex items-center justify-center">
                  <SiBitcoin className="w-6 h-6 text-bitcoin" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-white">Support {merchant.ownerName}</h2>
              </div>

              {!invoice ? (
                <>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Send Bitcoin directly to this merchant using the Lightning Network. Your donation goes straight to their wallet.
                  </p>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      Amount (satoshis)
                    </label>
                    <input
                      type="number"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      placeholder="Enter amount in sats"
                      className="w-full px-4 py-3 bg-black/50 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-bitcoin transition-colors font-numbers"
                      min="1"
                    />
                    <p className="text-xs text-gray-500 mt-3 font-numbers">
                      Suggested: 1,000 sats ≈ $1 USD
                    </p>
                  </div>

                  {error && (
                    <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleCreateInvoice}
                    disabled={loading || !donationAmount}
                    className="btn btn-primary btn-lg w-full"
                  >
                    {loading ? 'Creating Invoice...' : 'Generate Payment Invoice'}
                  </button>

                  <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-xs text-gray-500 leading-relaxed">
                      <SiBitcoin className="inline w-3 h-3" /> 100% of your donation goes to the merchant via Blink Lightning wallet. No fees from Afribit.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="font-heading text-lg font-bold text-white mb-4">Scan to Pay</h3>
                    <div className="bg-white p-6 rounded-xl">
                      <QRCode
                        value={invoice.paymentRequest}
                        size={256}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      Payment Request
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={invoice.paymentRequest}
                        readOnly
                        className="flex-1 px-3 py-2 bg-black/50 border border-gray-800 rounded-xl text-white text-xs font-mono"
                      />
                      <button
                        onClick={handleCopyPaymentLink}
                        className="px-4 py-2 bg-bitcoin/10 border border-bitcoin/20 rounded-xl text-bitcoin hover:bg-bitcoin/20 transition-all flex items-center justify-center"
                      >
                        {copiedLink ? <FiCheck className="w-5 h-5" /> : <FiCopy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <p className="text-sm font-semibold text-gray-300">Open in wallet:</p>
                    {walletLinks && (
                      <div className="grid grid-cols-2 gap-2">
                        <a href={walletLinks.blink} className="px-4 py-2.5 bg-black/50 border border-gray-800 rounded-xl text-white text-sm font-semibold hover:border-bitcoin/50 hover:bg-bitcoin/5 transition-all text-center">Blink</a>
                        <a href={walletLinks.phoenix} className="px-4 py-2.5 bg-black/50 border border-gray-800 rounded-xl text-white text-sm font-semibold hover:border-bitcoin/50 hover:bg-bitcoin/5 transition-all text-center">Phoenix</a>
                        <a href={walletLinks.muun} className="px-4 py-2.5 bg-black/50 border border-gray-800 rounded-xl text-white text-sm font-semibold hover:border-bitcoin/50 hover:bg-bitcoin/5 transition-all text-center">Muun</a>
                        <a href={walletLinks.bluewallet} className="px-4 py-2.5 bg-black/50 border border-gray-800 rounded-xl text-white text-sm font-semibold hover:border-bitcoin/50 hover:bg-bitcoin/5 transition-all text-center">BlueWallet</a>
                        <a href={walletLinks.breez} className="px-4 py-2.5 bg-black/50 border border-gray-800 rounded-xl text-white text-sm font-semibold hover:border-bitcoin/50 hover:bg-bitcoin/5 transition-all text-center">Breez</a>
                        <a href={walletLinks.zeus} className="px-4 py-2.5 bg-black/50 border border-gray-800 rounded-xl text-white text-sm font-semibold hover:border-bitcoin/50 hover:bg-bitcoin/5 transition-all text-center">Zeus</a>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setInvoice(null);
                      setDonationAmount('');
                    }}
                    className="w-full px-6 py-3 bg-black/50 border border-gray-800 rounded-xl text-white font-semibold hover:border-bitcoin/50 hover:bg-bitcoin/5 transition-all"
                  >
                    Create Another Donation
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
