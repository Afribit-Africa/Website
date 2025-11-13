"use client";

import { useState, useEffect } from 'react';
import { FiArrowRight, FiArrowLeft, FiCheck, FiCopy, FiZap, FiAlertCircle } from 'react-icons/fi';
import { SiBitcoin } from 'react-icons/si';
import QRCode from 'qrcode';
import PaymentLoader from '@/components/PaymentLoader';
import { DonationCardSkeleton } from '@/components/Skeleton';
import { motion } from 'framer-motion';

const DONATION_TIERS = [
  {
    id: 'custom',
    title: 'Custom Contribution',
    subtitle: 'General Empowerment Fund',
    amount: 0,
    perk: 'Every satoshi counts towards building a stronger Kibera! Your flexible support helps us cover essential daily operational costs like internet connectivity, workspace maintenance, and community outreach materials. While there\'s no formal recognition tier for custom amounts, your contribution directly impacts our ability to serve the community consistently.',
    description: 'Any amount',
    image: '/Media/Images/Kibera Aerial view.jpg',
    isCustom: true,
    bgGradient: 'from-bitcoin/30 to-orange-600/20'
  },
  {
    id: 'friend',
    title: 'Friend of Afribit Kibera',
    subtitle: 'Core Supporter',
    amount: 25,
    perk: 'Your name will be proudly listed on our online "Friends of Afribit Kibera" supporters page, plus a personalized digital thank-you note.',
    description: 'This vital contribution directly supports the DAILY OPERATIONAL SUCCESS and FOUNDATIONAL GROWTH of all Afribit Kibera initiatives. It helps cover essential administrative costs, communication tools, and basic supplies.',
    image: '/Media/Images/Mama mboga groceries accepting bitcoin.jpg',
    bgGradient: 'from-green-500/30 to-green-600/20'
  },
  {
    id: 'business',
    title: 'Business Accelerator Program',
    subtitle: 'Fuel local entrepreneurship',
    amount: 0,
    goal: 5000,
    perk: 'Have a business cluster or Boda Boda team named in your honor.',
    description: 'Support small community businesses and Bitcoin startups to scale sustainably. This program provides mentorship, digital tools, and business training. Will expand the Boda Boda Compliance Initiative from 10 to 40 riders.',
    image: '/Media/Images/Motorbike bitcoin onboarding.jpg',
    isCustom: true,
    bgGradient: 'from-blue-500/30 to-blue-600/20'
  },
  {
    id: 'education',
    title: 'Bitcoin Education Program',
    subtitle: 'Train 500 Community Ambassadors',
    amount: 0,
    goal: 12000,
    perk: 'Fund a training cohort or meetup that carries your name or organization\'s recognition.',
    description: 'Help us train and mentor 500 Bitcoin Community Ambassadors in one year. Each month, 50 Community Champions will be equipped to host meetups, spread digital financial literacy, and 10x the impact in their neighborhoods.',
    image: '/Media/Images/Trezor Academy session pics/IMG-20250914-WA0155.jpg',
    isCustom: true,
    bgGradient: 'from-purple-500/30 to-purple-600/20'
  },
  {
    id: 'equipment',
    title: 'Equipment for Efficiency & Scaling',
    subtitle: 'Tools for upcycling & waste management',
    amount: 0,
    goal: 9500,
    perk: 'Fund a specific piece of equipment to be named in your honor, leaving a visible and lasting impact in the community.',
    description: 'Empower upcycling and waste management groups with essential tools like sewing machines, handcarts, and a community baler. Equipment dramatically increases productivity and enables scaling.',
    image: '/Media/Images/Waste Collection.jpg',
    isCustom: true,
    bgGradient: 'from-yellow-500/30 to-yellow-600/20'
  },
  {
    id: 'upcycle',
    title: 'Upcycle Queen',
    subtitle: 'Empower a Micro-Entrepreneur',
    amount: 90,
    perk: 'A personal story and photo of the woman you have empowered, sent to you via email, plus recognition on our website.',
    description: 'Your contribution fully sponsors one young woman or mother in our UPCYCLING & WEEKEND EMPOWERMENT PROGRAM for one entire month. Our objective is to SCALE THIS PROGRAM FROM 7 TO 20 WOMEN.',
    image: '/Media/Images/Trezor Academy session pics/IMG-20250914-WA0155.jpg',
    bgGradient: 'from-pink-500/30 to-pink-600/20'
  },
  {
    id: 'waste',
    title: 'Satoshi Kwa Usafi',
    subtitle: 'Sats for Cleanups - Expand Waste Management',
    amount: 190,
    perk: 'A quarterly impact report on the waste management groups, including photos and collection metrics, plus recognition on our website.',
    description: 'You will fund one of our community WASTE MANAGEMENT GROUPS for an entire week. This covers the direct satoshi incentives paid to the team for collecting and sorting recyclables. Our target is to ADD 2 NEW GROUPS (CURRENTLY 4).',
    image: '/Media/Images/Waste Collection.jpg',
    bgGradient: 'from-teal-500/30 to-teal-600/20'
  }
];

export default function DonatePage() {
  const [step, setStep] = useState<'tiers' | 'details' | 'payment' | 'success'>('tiers');
  const [selectedTier, setSelectedTier] = useState<typeof DONATION_TIERS[0] | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lightningInvoice, setLightningInvoice] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [isExpired, setIsExpired] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'expired'>('pending');
  const [donationType, setDonationType] = useState<'anonymous' | 'named'>('anonymous');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');

  const handleTierSelect = (tier: typeof DONATION_TIERS[0]) => {
    setSelectedTier(tier);
    setStep('details');
  };

  const handleContinueToPayment = async () => {
    if (selectedTier?.isCustom && !customAmount) return;
    if (donationType === 'named' && (!donorName || !donorEmail)) {
      setError('Please provide your name and email for recognition');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const amount = selectedTier?.isCustom ? parseFloat(customAmount) : selectedTier?.amount;

      const response = await fetch('/api/donations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          tier: selectedTier?.id,
          donationType,
          donorName: donationType === 'named' ? donorName : undefined,
          donorEmail: donationType === 'named' ? donorEmail : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create invoice');
      }

      setInvoiceData(data.invoice);

      // Fetch payment methods with retry logic
      let paymentMethodsData = null;
      let lightningInvoice = null;
      let retries = 3;

      while (retries > 0 && !lightningInvoice) {
        try {
          // Only log in development mode
          if (process.env.NODE_ENV === 'development') {
            console.log(`Fetching payment methods (attempt ${4 - retries}/3)...`);
          }

          const paymentMethodsResponse = await fetch(`/api/donations/${data.invoice.id}/payment-methods`);
          paymentMethodsData = await paymentMethodsResponse.json();

          if (process.env.NODE_ENV === 'development') {
            console.log('Payment methods response:', {
              ok: paymentMethodsResponse.ok,
              status: paymentMethodsResponse.status,
              isArray: Array.isArray(paymentMethodsData),
              count: Array.isArray(paymentMethodsData) ? paymentMethodsData.length : 0,
              methods: Array.isArray(paymentMethodsData)
                ? paymentMethodsData.map((pm: any) => pm.paymentMethod)
                : 'not an array'
            });
          }

          if (paymentMethodsResponse.ok && Array.isArray(paymentMethodsData)) {
            // Find the Lightning payment method
            // BTCPay uses paymentMethodId field, not paymentMethod
            const lightningMethod = paymentMethodsData.find((pm: any) =>
              pm.paymentMethodId === 'BTC-LN' ||
              pm.paymentMethodId === 'BTC-LNURL' ||
              pm.paymentMethod === 'BTC-LightningNetwork' ||
              pm.paymentMethod === 'BTC_LightningNetwork' ||
              (pm.cryptoCode === 'BTC' && pm.paymentMethod?.includes('Lightning'))
            );

            if (process.env.NODE_ENV === 'development') {
              console.log('Lightning method search:', {
                found: !!lightningMethod,
                paymentMethodId: lightningMethod?.paymentMethodId,
                method: lightningMethod?.paymentMethod,
                hasDestination: !!lightningMethod?.destination,
                destination: lightningMethod?.destination?.substring(0, 20) + '...'
              });
            }

            if (lightningMethod?.destination) {
              lightningInvoice = lightningMethod.destination;
              break;
            }
          }

          // Wait before retry
          if (retries > 1) {
            if (process.env.NODE_ENV === 'development') {
              console.log('Lightning not ready, waiting 2 seconds...');
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
          retries--;
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching payment methods:', error);
          }
          retries--;
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      }

      // Use Lightning invoice if found, otherwise use checkout link
      const finalInvoice = lightningInvoice || data.invoice.checkoutLink;
      const invoiceType = lightningInvoice ? 'Lightning' : 'Checkout Link';

      if (process.env.NODE_ENV === 'development') {
        console.log(`Using ${invoiceType} for QR code:`, finalInvoice.substring(0, 30) + '...');
      }

      setLightningInvoice(finalInvoice);

      // Generate QR code
      const qrUrl = await QRCode.toDataURL(finalInvoice, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeDataUrl(qrUrl);
      setStep('payment');
    } catch (err: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Payment error:', err);
      }
      setError(err.message || 'Failed to create payment. Please try again.');
      setStep('details');
      setLightningInvoice('');
      setQrCodeDataUrl('');
      setInvoiceData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'details') {
      setStep('tiers');
      setError('');
    } else if (step === 'payment') {
      setStep('details');
    }
  };

  // Countdown Timer Effect
  useEffect(() => {
    if (step !== 'payment' || paymentStatus !== 'pending') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          setPaymentStatus('expired');
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, paymentStatus]);

  // Payment Status Polling Effect
  useEffect(() => {
    if (step !== 'payment' || !invoiceData?.id || paymentStatus !== 'pending') return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/donations/status?invoiceId=${invoiceData.id}`);
        const data = await response.json();

        if (data.success && data.invoice) {
          const status = data.invoice.status?.toLowerCase();

          if (status === 'settled' || status === 'processing' || status === 'paid') {
            setPaymentStatus('paid');
            setStep('success');
            clearInterval(pollInterval);

            // Send receipt email for named donations (with delay to ensure DB is updated)
            if (donationType === 'named' && donorEmail) {
              setTimeout(async () => {
                try {
                  const response = await fetch('/api/donations/send-receipt', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      invoiceId: invoiceData.id,
                      transactionId: data.invoice.id,
                    }),
                  });

                  if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Receipt email error:', errorData);
                  } else {
                    console.log('Receipt email sent successfully');
                  }
                } catch (emailError) {
                  console.error('Failed to send receipt email:', emailError);
                  // Don't block success flow if email fails
                }
              }, 2000); // Wait 2 seconds for DB to be fully updated
            }
          } else if (status === 'expired' || status === 'invalid') {
            setPaymentStatus('expired');
            setIsExpired(true);
            clearInterval(pollInterval);
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error polling payment status:', error);
        }
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [step, invoiceData, paymentStatus]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRegenerateInvoice = () => {
    setIsExpired(false);
    setPaymentStatus('pending');
    setTimeLeft(900);
    handleContinueToPayment();
  };

  return (
    <>
      {/* Payment Processing Loader */}
      {loading && <PaymentLoader message="Creating your Lightning invoice..." />}

      <div className="min-h-screen bg-black pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">
              Fuel the <span className="text-bitcoin">Bitcoin Revolution</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Your contribution powers financial freedom, environmental stewardship, and community resilience in Kibera
            </p>
          </div>

          {/* Step Indicator */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-center">
            {[
              { key: 'tiers', label: 'Choose Tier', num: 1 },
              { key: 'details', label: 'Details', num: 2 },
              { key: 'payment', label: 'Payment', num: 3 }
            ].map((s, idx) => (
              <div key={s.key} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 font-bold text-sm md:text-base transition-all duration-300 z-10 ${
                      step === s.key
                        ? 'bg-bitcoin border-bitcoin text-white shadow-lg shadow-bitcoin/50 scale-105'
                        : ['tiers', 'details', 'payment'].indexOf(step) > idx
                        ? 'bg-bitcoin/20 border-bitcoin text-bitcoin'
                        : 'bg-white/5 border-white/30 text-gray-400'
                    }`}
                    aria-label={`Step ${s.num}: ${s.label}`}
                    role="status"
                    aria-current={step === s.key ? 'step' : undefined}
                  >
                    {['tiers', 'details', 'payment'].indexOf(step) > idx ? <FiCheck className="w-5 h-5 md:w-6 md:h-6" /> : s.num}
                  </div>
                  <span className={`text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
                    step === s.key ? 'text-bitcoin font-bold' : 'text-gray-400'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div className={`w-16 md:w-24 lg:w-32 h-0.5 -mx-2 transition-all duration-300 ${
                    idx < ['tiers', 'details', 'payment'].indexOf(step)
                      ? 'bg-bitcoin'
                      : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
            </div>
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto">
          {/* Step 1: Tier Selection */}
          {step === 'tiers' && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-heading mb-3 text-center">Choose Your Impact</h2>
              <p className="text-sm md:text-base text-gray-300 text-center mb-8">Select a tier that resonates with you or contribute a custom amount</p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DONATION_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => handleTierSelect(tier)}
                    className="group relative overflow-hidden rounded-xl border-2 border-white/10 hover:border-bitcoin/40 transition-all duration-300 text-left hover:scale-[1.02] cursor-pointer bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm flex flex-col"
                    aria-label={`Select ${tier.title} donation tier${tier.isCustom ? '' : ` for $${tier.amount}`}`}
                  >
                    {/* Image Container - Fixed Aspect Ratio */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                      <img
                        src={tier.image}
                        alt={tier.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                      {/* Amount Badge */}
                      <div className="absolute top-3 right-3 bg-black/90 backdrop-blur-md text-white border border-bitcoin/50 px-3 py-1.5 rounded-full font-bold text-xs shadow-lg">
                        {tier.isCustom ? 'Any Amount' : `$${tier.amount}`}
                      </div>

                      {/* Goal Badge */}
                      {tier.goal && (
                        <div className="absolute top-3 left-3 bg-bitcoin/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full font-semibold text-xs shadow-lg">
                          Goal: ${tier.goal.toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Content - Better Structure */}
                    <div className="flex-1 flex flex-col p-5">
                      {/* Title & Subtitle */}
                      <div className="mb-3">
                        <h3 className="text-lg md:text-xl font-bold font-heading text-white mb-1">
                          {tier.title}
                        </h3>
                        {tier.subtitle && (
                          <p className="text-xs text-gray-400">{tier.subtitle}</p>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-300 mb-4 leading-relaxed line-clamp-3 flex-1">
                        {tier.description}
                      </p>

                      {/* Perk */}
                      <div className="pt-3 border-t border-white/10">
                        <div className="flex items-start gap-2">
                          <FiCheck className="w-4 h-4 text-bitcoin shrink-0 mt-0.5" />
                          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{tier.perk}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 'details' && selectedTier && (
            <div className="max-w-3xl mx-auto">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-400 hover:text-bitcoin transition-colors mb-6"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back to Tiers
              </button>

              <div className="bg-linear-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold font-heading mb-6 text-center text-white">Confirm Your Contribution</h2>

                {/* Selected Tier Summary with Image */}
                <div className="mb-6 overflow-hidden rounded-xl border border-white/10">
                  <div className="relative h-32 md:h-40">
                    <img
                      src={selectedTier.image}
                      alt={selectedTier.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/30" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">{selectedTier.title}</h3>
                      {selectedTier.subtitle && (
                        <p className="text-xs md:text-sm text-gray-200 mt-1 drop-shadow-md">{selectedTier.subtitle}</p>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white border-2 border-bitcoin px-3 py-1.5 rounded-full font-bold text-xs md:text-sm shadow-xl">
                      {selectedTier.isCustom ? 'Any Amount' : `$${selectedTier.amount}`}
                    </div>
                  </div>

                  <div className="p-4 md:p-6 bg-black/60">
                    {/* Description */}
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-bitcoin uppercase tracking-wide mb-2">Impact</h4>
                      <p className="text-sm text-gray-200 leading-relaxed">{selectedTier.description}</p>
                    </div>

                    {/* Goal if exists */}
                    {selectedTier.goal && (
                      <div className="mb-4 p-3 bg-bitcoin/10 border border-bitcoin/30 rounded-lg">
                        <p className="text-xs md:text-sm text-bitcoin font-bold">Goal: ${selectedTier.goal.toLocaleString()}</p>
                      </div>
                    )}

                    {/* Perk */}
                    <div>
                      <h4 className="text-xs font-semibold text-bitcoin uppercase tracking-wide mb-2">Your Perk</h4>
                      <div className="flex items-start gap-2">
                        <FiCheck className="w-4 h-4 text-bitcoin shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-200 leading-relaxed">{selectedTier.perk}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Custom Amount Input */}
                {selectedTier.isCustom && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-white uppercase mb-2">
                      Enter Amount (USD)
                    </label>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-4 py-4 bg-black/60 border-2 border-white/20 rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-bitcoin"
                      min="1"
                    />
                  </div>
                )}

                {/* Donation Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-white uppercase tracking-wide mb-4">
                    Choose Donation Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setDonationType('anonymous')}
                      className={`group p-5 rounded-xl border-2 transition-all relative overflow-hidden ${
                        donationType === 'anonymous'
                          ? 'bg-bitcoin/20 border-bitcoin text-white shadow-lg shadow-bitcoin/20'
                          : 'bg-white/5 border-white/20 text-gray-300 hover:border-white/40 hover:bg-white/10'
                      }`}
                      aria-pressed={donationType === 'anonymous'}
                      aria-label="Choose anonymous donation (no email required)"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {donationType === 'anonymous' && <FiCheck className="w-5 h-5 text-bitcoin" />}
                        <div className="font-bold text-base">Anonymous</div>
                      </div>
                      <div className="text-xs leading-relaxed">Quick donation with no signup needed</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDonationType('named')}
                      className={`group p-5 rounded-xl border-2 transition-all relative overflow-hidden ${
                        donationType === 'named'
                          ? 'bg-bitcoin/20 border-bitcoin text-white shadow-lg shadow-bitcoin/20'
                          : 'bg-white/5 border-white/20 text-gray-300 hover:border-white/40 hover:bg-white/10'
                      }`}
                      aria-pressed={donationType === 'named'}
                      aria-label="Choose named donation (receive perks and updates)"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {donationType === 'named' && <FiCheck className="w-5 h-5 text-bitcoin" />}
                        <div className="font-bold text-base">Get Perks</div>
                      </div>
                      <div className="text-xs leading-relaxed">Receive rewards and impact updates</div>
                    </button>
                  </div>
                </div>

                {/* Named Donation Fields */}
                {donationType === 'named' && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-white uppercase mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 bg-black/60 border-2 border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-bitcoin"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white uppercase mb-2">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 bg-black/60 border-2 border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-bitcoin"
                      />
                    </div>
                    <div className="p-3 bg-bitcoin/10 border border-bitcoin/30 rounded-lg">
                      <p className="text-xs text-gray-300">
                        We'll use your email to send your perk rewards and keep you updated on the impact of your donation.
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-400/30 rounded-lg flex items-start gap-2">
                    <FiAlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleContinueToPayment}
                  disabled={loading || (selectedTier.isCustom && !customAmount) || (donationType === 'named' && (!donorName || !donorEmail))}
                  className="w-full bg-bitcoin hover:bg-bitcoin-dark text-white font-semibold py-3 px-6 rounded-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-bitcoin/50"
                  aria-label="Continue to payment step"
                >
                  {loading ? 'Creating Invoice...' : 'Continue'}
                  {!loading && <FiArrowRight className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 'payment' && lightningInvoice && (
            <div className="max-w-2xl mx-auto">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-400 hover:text-bitcoin transition-colors mb-6"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back
              </button>

              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">Complete Your Contribution</h2>
                <div className="text-2xl md:text-3xl font-bold text-bitcoin mb-2">
                  ${selectedTier?.isCustom ? customAmount : selectedTier?.amount}
                </div>
                <p className="text-sm text-gray-300">{selectedTier?.title}</p>

                {/* Timer */}
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/20 rounded-full">
                  <div className={`w-2 h-2 rounded-full ${isExpired ? 'bg-red-500' : 'bg-green-500'}`} />
                  <span className={`text-xs md:text-sm font-mono font-semibold ${isExpired ? 'text-red-400' : 'text-gray-300'}`}>
                    {isExpired ? 'Expired' : `Expires in ${formatTime(timeLeft)}`}
                  </span>
                </div>
              </div>

              {isExpired ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
                  <FiAlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl md:text-2xl font-bold text-red-400 mb-2">Invoice Expired</h3>
                  <p className="text-sm md:text-base text-gray-300 mb-6">
                    This payment request has expired. Please generate a new invoice to continue.
                  </p>
                  <button
                    onClick={handleRegenerateInvoice}
                    className="bg-bitcoin hover:bg-bitcoin/90 text-white font-semibold py-3 px-6 rounded-lg transition-all inline-flex items-center gap-2"
                    aria-label="Generate new payment invoice"
                  >
                    Retry Payment
                    <FiArrowRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
              <div className="bg-linear-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6">
                {/* Payment Type Indicator */}
                {lightningInvoice && (
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {lightningInvoice.startsWith('lnbc') ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-bitcoin/20 border border-bitcoin/50 rounded-full text-bitcoin text-xs font-semibold">
                        <FiZap className="w-3 h-3" />
                        Lightning Network
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-yellow-400 text-xs font-semibold">
                        <FiAlertCircle className="w-3 h-3" />
                        Payment Link (Lightning unavailable)
                      </div>
                    )}
                  </div>
                )}

                {/* QR Code */}
                {qrCodeDataUrl && (
                  <div className="flex justify-center mb-6">
                    <div className="bg-white p-4 rounded-xl shadow-2xl">
                      <img
                        src={qrCodeDataUrl}
                        alt="Lightning Invoice QR Code"
                        className="w-48 h-48 md:w-56 md:h-56 object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* Lightning Invoice */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {lightningInvoice.startsWith('lnbc') ? 'Lightning Invoice' : 'Payment Link'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={lightningInvoice}
                      readOnly
                      className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white text-xs font-mono pr-20"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(lightningInvoice);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-bitcoin text-black text-xs font-semibold rounded-md hover:scale-105 transition-all flex items-center gap-1"
                      aria-label="Copy invoice to clipboard"
                    >
                      {copied ? (
                        <>
                          <FiCheck className="w-3 h-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <FiCopy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Wallet Buttons - Only show for Lightning invoices */}
                {lightningInvoice.startsWith('lnbc') && (
                  <div className="space-y-2 mb-6">
                    <p className="text-xs text-gray-400 text-center mb-3">Open with your favorite wallet:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`lightning:${lightningInvoice}`}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white hover:bg-white/10 transition-colors text-center"
                        aria-label="Open in Blink wallet"
                      >
                        Blink
                      </a>
                      <a
                        href={`lightning:${lightningInvoice}`}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white hover:bg-white/10 transition-colors text-center"
                        aria-label="Open in Phoenix wallet"
                      >
                        Phoenix
                      </a>
                      <a
                        href={`walletofsatoshi:lightning:${lightningInvoice}`}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white hover:bg-white/10 transition-colors text-center"
                        aria-label="Open in Wallet of Satoshi"
                      >
                        Wallet of Satoshi
                      </a>
                      <a
                        href={`lightning:${lightningInvoice}`}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white hover:bg-white/10 transition-colors text-center"
                        aria-label="Open in BlueWallet"
                      >
                        BlueWallet
                      </a>
                      <a
                        href={`lightning:${lightningInvoice}`}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white hover:bg-white/10 transition-colors text-center"
                        aria-label="Open in Breez wallet"
                      >
                        Breez
                      </a>
                      <a
                        href={`lightning:${lightningInvoice}`}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white hover:bg-white/10 transition-colors text-center"
                        aria-label="Open in Zeus wallet"
                      >
                        Zeus
                      </a>
                    </div>
                  </div>
                )}

                {/* Payment Link Button - Only show when Lightning unavailable */}
                {!lightningInvoice.startsWith('lnbc') && (
                  <div className="mb-6">
                    <a
                      href={lightningInvoice}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full block px-6 py-3 bg-bitcoin hover:bg-bitcoin-dark text-white font-bold rounded-xl text-center transition-all"
                    >
                      Open Payment Page
                    </a>
                  </div>
                )}

                {/* Instructions */}
                <div className="p-3 bg-bitcoin/10 border border-bitcoin/30 rounded-lg">
                  <p className="text-xs text-gray-300">
                    <span className="font-semibold">Pay with Lightning:</span> Scan the QR code or click a wallet button above. The payment is instant and has minimal fees.
                  </p>
                </div>
              </div>

              {/* Perk Instructions */}
              <div className="mt-6 bg-white/5 border border-white/10 rounded-lg p-4">
                <h3 className="font-semibold text-sm mb-2">How to Claim Your Perk</h3>
                <ol className="text-xs text-gray-400 space-y-1">
                  <li>1. Complete your donation using any method above</li>
                  <li>2. Email <span className="text-bitcoin">connect@afribit.africa</span> with your payment proof</li>
                  <li>3. Include the name/logo for recognition</li>
                  <li>4. Receive your perks within 2 weeks</li>
                </ol>
              </div>
              </>
              )}
            </div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto text-center"
            >
              {/* Confetti Animation */}
              <div className="relative mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.6, times: [0, 0.6, 1] }}
                  className="w-32 h-32 mx-auto bg-bitcoin rounded-full flex items-center justify-center shadow-2xl shadow-bitcoin/50"
                >
                  <FiCheck className="w-16 h-16 text-white" />
                </motion.div>

                {/* Floating particles */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0.5],
                      x: Math.cos((i / 12) * Math.PI * 2) * 150,
                      y: Math.sin((i / 12) * Math.PI * 2) * 150,
                    }}
                    transition={{
                      duration: 1.5,
                      delay: 0.3 + i * 0.05,
                      ease: "easeOut"
                    }}
                    className="absolute top-1/2 left-1/2 w-3 h-3 bg-bitcoin rounded-full"
                    style={{ transformOrigin: 'center' }}
                  />
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 bg-gradient-to-r from-bitcoin via-orange-400 to-bitcoin bg-clip-text text-transparent">
                  Payment Received!
                </h2>
                <p className="text-lg md:text-xl text-gray-300 mb-2">
                  Thank you for your generous contribution
                </p>
                <div className="text-2xl md:text-3xl font-bold text-bitcoin mb-8">
                  ${selectedTier?.isCustom ? customAmount : selectedTier?.amount}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 mb-8"
              >
                <h3 className="text-xl font-bold mb-4">What Happens Next?</h3>
                <div className="space-y-4 text-left">
                  {donationType === 'named' ? (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-bitcoin/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-bitcoin font-bold text-sm">1</span>
                        </div>
                        <div>
                          <p className="text-gray-300">
                            <span className="font-semibold text-white">Confirmation Email:</span> We'll send your perks and impact updates to {donorEmail}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-bitcoin/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-bitcoin font-bold text-sm">2</span>
                        </div>
                        <div>
                          <p className="text-gray-300">
                            <span className="font-semibold text-white">Your Recognition:</span> Your name will be added to our supporters page and you'll receive your tier-specific perks within 2 weeks
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-bitcoin/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-bitcoin font-bold text-sm">3</span>
                        </div>
                        <div>
                          <p className="text-gray-300">
                            <span className="font-semibold text-white">Immediate Impact:</span> Your contribution is already making a difference in Kibera
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-bitcoin/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-bitcoin font-bold text-sm">1</span>
                        </div>
                        <div>
                          <p className="text-gray-300">
                            <span className="font-semibold text-white">Anonymous Contribution:</span> Your donation has been received and no personal information was collected
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-bitcoin/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-bitcoin font-bold text-sm">2</span>
                        </div>
                        <div>
                          <p className="text-gray-300">
                            <span className="font-semibold text-white">Immediate Impact:</span> Your contribution is already making a difference in Kibera
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-bitcoin/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-bitcoin font-bold text-sm">3</span>
                        </div>
                        <div>
                          <p className="text-gray-300">
                            <span className="font-semibold text-white">Want Recognition?</span> Email us at <a href="mailto:connect@afribit.africa" className="text-bitcoin hover:underline">connect@afribit.africa</a> with your payment details to claim your perks
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <button
                  onClick={() => {
                    setStep('tiers');
                    setSelectedTier(null);
                    setCustomAmount('');
                    setLightningInvoice('');
                    setQrCodeDataUrl('');
                    setInvoiceData(null);
                    setTimeLeft(900);
                    setIsExpired(false);
                    setPaymentStatus('pending');
                    setDonationType('anonymous');
                    setDonorName('');
                    setDonorEmail('');
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 px-6 rounded-lg transition-all border border-white/20"
                  aria-label="Make another donation"
                >
                  Donate Again
                </button>
                <a
                  href="/"
                  className="bg-bitcoin hover:bg-bitcoin/90 text-white font-semibold py-2.5 px-6 rounded-lg transition-all inline-flex items-center justify-center gap-2"
                  aria-label="Return to homepage"
                >
                  Back to Home
                  <FiArrowRight className="w-5 h-5" />
                </a>
              </motion.div>

              {/* Social Share */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="mt-8 pt-8 border-t border-white/10"
              >
                <p className="text-sm text-gray-400 mb-4">Share your support with the community</p>
                <div className="flex gap-3 justify-center">
                  <a
                    href={`https://twitter.com/intent/tweet?text=I%20just%20contributed%20to%20@afribitkibera%20to%20support%20Bitcoin%20adoption%20in%20Kibera!%20Join%20me:%20https://afribit.africa/donate`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
          </div>
        </div>
      </div>
    </>
  );
}
