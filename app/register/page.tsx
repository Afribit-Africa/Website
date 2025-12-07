'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Check, Zap, Bitcoin } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { ErrorModal } from '@/components/ui/ErrorModal';
import GPSPrecisionDialog from '@/components/GPSPrecisionDialog';

// Dynamically import map to avoid SSR issues
const LocationMap = dynamic(() => import('@/components/LocationMap'), { ssr: false });

const BUSINESS_TYPES = [
  { value: '', label: 'Select business type...' },
  { value: 'restaurant', label: 'Restaurant / Cafe' },
  { value: 'bar', label: 'Bar / Pub' },
  { value: 'shop', label: 'Retail Shop' },
  { value: 'convenience', label: 'Convenience Store' },
  { value: 'hotel', label: 'Hotel / Accommodation' },
  { value: 'salon', label: 'Salon / Barbershop' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'electronics', label: 'Electronics Store' },
  { value: 'clothing', label: 'Clothing Store' },
  { value: 'service', label: 'Service Provider' },
  { value: 'other', label: 'Other Business' },
];

const STEP_TITLES = ['Business Details', 'Location', 'Payment Methods', 'Contact Info'];

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
  const [showGPSPrecisionDialog, setShowGPSPrecisionDialog] = useState(false);

  // Bot Protection
  const [honeypot, setHoneypot] = useState('');
  const [mathAnswer, setMathAnswer] = useState('');
  const [mathQuestion, setMathQuestion] = useState({ num1: 0, num2: 0, answer: 0 });

  const [formData, setFormData] = useState({
    businessName: '',
    categoryValue: '',
    description: '',
    latitude: -1.286389,
    longitude: 36.817223,
    address: '',
    phone: '',
    website: '',
    lightningAddress: '',
    paymentOnchain: false,
    paymentLightning: false,
    paymentLightningContactless: false,
    contactName: '',
    contactEmail: '',
    contactRelationship: 'owner',
  });

  // Generate math question for bot protection
  useEffect(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setMathQuestion({ num1, num2, answer: num1 + num2 });
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('afribit-registration-draft');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed.formData);
        setCurrentStep(parsed.currentStep);
      } catch (e) {
        // Invalid saved data, ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('afribit-registration-draft', JSON.stringify({ formData, currentStep }));
  }, [formData, currentStep]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.businessName.trim()) {
        newErrors.businessName = 'Business name is required';
      }
      if (!formData.categoryValue) {
        newErrors.categoryValue = 'Please select a business type';
      }
    }

    if (step === 2) {
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
      }
      if (formData.latitude < -90 || formData.latitude > 90) {
        newErrors.latitude = 'Invalid latitude (-90 to 90)';
      }
      if (formData.longitude < -180 || formData.longitude > 180) {
        newErrors.longitude = 'Invalid longitude (-180 to 180)';
      }
    }

    if (step === 3) {
      if (!formData.paymentOnchain && !formData.paymentLightning && !formData.paymentLightningContactless) {
        newErrors.payment = 'Please select at least one Bitcoin payment method';
      }
    }

    if (step === 4) {
      if (!formData.contactName.trim()) {
        newErrors.contactName = 'Your name is required';
      }
      if (!formData.contactEmail.trim()) {
        newErrors.contactEmail = 'Your email is required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.contactEmail)) {
        newErrors.contactEmail = 'Please enter a valid email address';
      }

      // Bot Protection Checks
      if (honeypot) {
        // Honeypot filled - likely a bot
        newErrors.bot = 'Spam detected. Please try again.';
      }
      if (!mathAnswer || parseInt(mathAnswer) !== mathQuestion.answer) {
        newErrors.mathAnswer = 'Please solve the math question correctly';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      setErrorModal({ isOpen: true, message: firstError });
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    updateField('latitude', lat);
    updateField('longitude', lng);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorModal({
        isOpen: true,
        message: 'Geolocation is not supported by your browser. Please enter coordinates manually.',
      });
      return;
    }

    // Check if we're on HTTPS (required for geolocation on mobile)
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setErrorModal({
        isOpen: true,
        message: 'Location access requires a secure connection (HTTPS). Please use the secure version of this site.',
      });
      return;
    }

    // Open GPS precision dialog
    setShowGPSPrecisionDialog(true);
  };

  const handleGPSLocationCapture = (latitude: number, longitude: number, accuracy: number) => {
    updateField('latitude', latitude);
    updateField('longitude', longitude);

    // Show success message
    setErrorModal({
      isOpen: true,
      message: `✅ High-precision location captured!\n\nLatitude: ${latitude.toFixed(6)}\nLongitude: ${longitude.toFixed(6)}\nAccuracy: ±${Math.round(accuracy)}m\n\n${accuracy <= 10 ? '🎯 Excellent GPS accuracy!' : accuracy <= 20 ? '✓ Good GPS accuracy!' : '⚠️ Fair accuracy - consider recapturing outdoors for better precision.'}`,
    });
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/merchants/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          categoryKey: 'amenity',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.removeItem('afribit-registration-draft');
        router.push(`/merchants/success?id=${data.submissionId}&token=${data.editToken}&email=${encodeURIComponent(formData.contactEmail)}`);
      } else {
        setErrorModal({
          isOpen: true,
          message: data.error || 'Submission failed. Please check your information and try again.',
        });
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        message: 'Network error. Please check your internet connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12 md:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-3 md:mb-4">
            Register Your <span className="text-gradient">Bitcoin</span> Business
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
            Join BTCMap and showcase your business to the Bitcoin community
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-6 md:p-8">
          {/* Step 1: Business Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-heading font-bold mb-2 text-white">Business Information</h2>
                <p className="text-gray-400">Tell us about your business</p>
              </div>

              <Input
                label="Business Name"
                value={formData.businessName}
                onChange={(e) => updateField('businessName', e.target.value)}
                placeholder="e.g., Kibera Coffee Shop"
                required
                error={errors.businessName}
              />

              <Select
                label="Business Type"
                value={formData.categoryValue}
                onChange={(e) => updateField('categoryValue', e.target.value)}
                options={BUSINESS_TYPES}
                required
                error={errors.categoryValue}
                helper="Select the category that best describes your business"
              />

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Description <span className="text-gray-500">(Optional)</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Describe your business, products, or services..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bitcoin focus:ring-2 focus:ring-bitcoin/30 transition-all resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Help customers find you with a detailed description
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-heading font-bold mb-2 text-white">Location</h2>
                <p className="text-gray-400">Where can customers find you?</p>
              </div>

              <Input
                label="Physical Address"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="e.g., Olympic Estate, Kibera Road, Nairobi"
                required
                error={errors.address}
                helper="Enter your full street address"
              />

              {/* Map */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">
                  Select Location on Map <span className="text-bitcoin">*</span>
                </label>
                <div className="bg-white/5 border-2 border-white/10 rounded-lg overflow-hidden" style={{ height: '350px' }}>
                  <LocationMap
                    center={[formData.latitude, formData.longitude]}
                    onLocationSelect={handleLocationSelect}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Click on the map to select your exact business location
                </p>
              </div>

              {/* GPS Coordinates */}
              <div className="bg-white/5 border-2 border-white/10 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-white">GPS Coordinates</h3>
                    <p className="text-sm text-gray-400 mt-1">Or enter coordinates manually</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={getCurrentLocation}
                  >
                    Use My Location
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Latitude"
                    type="number"
                    step="0.000001"
                    value={formData.latitude}
                    onChange={(e) => updateField('latitude', parseFloat(e.target.value) || 0)}
                    placeholder="-1.286389"
                    required
                    error={errors.latitude}
                  />
                  <Input
                    label="Longitude"
                    type="number"
                    step="0.000001"
                    value={formData.longitude}
                    onChange={(e) => updateField('longitude', parseFloat(e.target.value) || 0)}
                    placeholder="36.817223"
                    required
                    error={errors.longitude}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payments */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-heading font-bold mb-2 text-white">Bitcoin Payment Methods</h2>
                <p className="text-gray-400">Select all payment methods you accept</p>
              </div>

              {errors.payment && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm">
                  {errors.payment}
                </div>
              )}

              <div className="space-y-4">
                <Checkbox
                  label="Lightning Network"
                  description="Instant, low-fee Bitcoin payments via Lightning"
                  checked={formData.paymentLightning}
                  onChange={(e) => updateField('paymentLightning', e.target.checked)}
                />

                <Checkbox
                  label="On-Chain Bitcoin"
                  description="Traditional Bitcoin transactions on the main blockchain"
                  checked={formData.paymentOnchain}
                  onChange={(e) => updateField('paymentOnchain', e.target.checked)}
                />

                <Checkbox
                  label="NFC / Contactless"
                  description="Tap-to-pay with Bitcoin cards or devices"
                  checked={formData.paymentLightningContactless}
                  onChange={(e) => updateField('paymentLightningContactless', e.target.checked)}
                />
              </div>

              {/* Lightning Address - Prominent */}
              <div className="bg-bitcoin/10 border-2 border-bitcoin/40 rounded-lg p-5">
                <h3 className="font-semibold text-bitcoin mb-2 flex items-center gap-2 text-base md:text-lg">
                  <Zap className="w-6 h-6 flex-shrink-0" />
                  Lightning Address
                </h3>
                <p className="text-xs md:text-sm text-gray-300 leading-relaxed mb-4">
                  Share your Lightning address so customers and donors can easily send you Bitcoin payments.
                </p>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    Your Lightning Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
                      <Zap className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={formData.lightningAddress}
                      onChange={(e) => updateField('lightningAddress', e.target.value)}
                      placeholder="yourname@blink.sv"
                      className="w-full px-4 py-3 pl-12 text-sm md:text-base bg-white/5 border-2 border-white/10 rounded-lg text-white placeholder-gray-500 placeholder:text-xs md:placeholder:text-sm focus:outline-none focus:border-bitcoin focus:ring-2 focus:ring-bitcoin/30 hover:border-white/20 hover:bg-white/8 transition-all duration-200 touch-manipulation min-h-[48px] md:min-h-[44px]"
                    />
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">Looks like an email - get one from wallets below</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h3 className="font-medium text-white mb-3 flex items-center gap-2 text-sm md:text-base">
                  <Bitcoin className="w-5 h-5 flex-shrink-0" />
                  Need a Bitcoin Wallet?
                </h3>
                <p className="text-xs md:text-sm text-gray-300 leading-relaxed mb-3">
                  Get a Lightning address from these recommended wallets:
                </p>
                <ul className="space-y-2 text-xs md:text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-bitcoin flex-shrink-0 mt-0.5" />
                    <span><a href="https://blink.sv" target="_blank" rel="noopener noreferrer" className="text-bitcoin font-semibold underline">Blink</a> - Easy Lightning wallet with instant payments (yourname@blink.sv)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-bitcoin flex-shrink-0 mt-0.5" />
                    <span><a href="https://www.fedi.xyz" target="_blank" rel="noopener noreferrer" className="text-bitcoin font-semibold underline">Fedi</a> - Community-powered Bitcoin wallet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-bitcoin flex-shrink-0 mt-0.5" />
                    <span><a href="https://muun.com" target="_blank" rel="noopener noreferrer" className="text-bitcoin font-semibold underline">Muun</a> - Lightning & on-chain in one app</span>
                  </li>
                </ul>
                <p className="text-xs text-gray-400 mt-3">
                  Need help? <a href="mailto:info@afribit.africa" className="text-bitcoin underline">Contact us</a> for wallet setup assistance.
                </p>
              </div>

              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+254 700 000 000"
                helper="Include country code (e.g., +254 for Kenya)"
              />

              <Input
                label="Website"
                type="url"
                value={formData.website}
                onChange={(e) => updateField('website', e.target.value)}
                placeholder="https://yourbusiness.com"
                helper="Optional - helps customers learn more about you"
              />
            </div>
          )}

          {/* Step 4: Contact */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-heading font-bold mb-2 text-white">Verification Contact</h2>
                <p className="text-gray-400">Who can we contact to verify this submission?</p>
              </div>

              <Input
                label="Your Full Name"
                value={formData.contactName}
                onChange={(e) => updateField('contactName', e.target.value)}
                placeholder="John Doe"
                required
                error={errors.contactName}
              />

              <Input
                label="Your Email Address"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => updateField('contactEmail', e.target.value)}
                placeholder="you@example.com"
                required
                error={errors.contactEmail}
                helper="We'll send confirmation and edit link to this email"
              />

              {/* Honeypot Field - Hidden from real users */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Math CAPTCHA - Simple bot protection */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Simple Math Question <span className="text-red-400">*</span>
                </label>
                <p className="text-gray-400 text-sm mb-3">
                  What is {mathQuestion.num1} + {mathQuestion.num2}?
                </p>
                <Input
                  type="number"
                  value={mathAnswer}
                  onChange={(e) => setMathAnswer(e.target.value)}
                  placeholder="Your answer"
                  required
                  error={errors.mathAnswer}
                />
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h3 className="font-medium text-green-400 mb-2 flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Almost Done!
                </h3>
                <p className="text-sm text-gray-300">
                  After submission, we'll review your business within 24-48 hours. You'll receive an email confirmation with a link to edit your submission if needed.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            {currentStep > 1 ? (
              <Button
                variant="secondary"
                onClick={prevStep}
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <Button
                variant="primary"
                onClick={nextStep}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Submit for Review'}
              </Button>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>
            Need help? Contact us at{' '}
            <a href="mailto:info@afribit.africa" className="text-bitcoin hover:underline">
              info@afribit.africa
            </a>
          </p>
        </div>
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
        message={errorModal.message}
      />

      {/* GPS Precision Dialog */}
      <GPSPrecisionDialog
        isOpen={showGPSPrecisionDialog}
        onClose={() => setShowGPSPrecisionDialog(false)}
        onLocationCapture={handleGPSLocationCapture}
        targetAccuracy={10}
        warningAccuracy={50}
        businessName={formData.businessName || 'Your Business'}
      />
    </div>
  );
}
