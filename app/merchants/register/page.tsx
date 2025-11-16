'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Building2, MapPin, Bitcoin, UserCheck, ChevronRight, ChevronLeft, Check, Zap, Wifi } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { ErrorModal } from '@/components/ui/ErrorModal';

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

export default function MerchantRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
  const [formData, setFormData] = useState({
    businessName: '',
    categoryValue: '',
    description: '',
    latitude: -1.286389,
    longitude: 36.817223,
    address: '',
    phone: '',
    website: '',
    paymentOnchain: false,
    paymentLightning: false,
    paymentLightningContactless: false,
    contactName: '',
    contactEmail: '',
    contactRelationship: 'owner',
  });

  const steps = [
    { id: 1, title: 'Business', icon: Building2 },
    { id: 2, title: 'Location', icon: MapPin },
    { id: 3, title: 'Payments', icon: Bitcoin },
    { id: 4, title: 'Contact', icon: UserCheck },
  ];

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
    }

    setErrors(newErrors);

    // Show error modal if validation fails
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      setErrorModal({
        isOpen: true,
        message: firstError,
      });
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
    setErrors({}); // Clear errors when going back
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

    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateField('latitude', position.coords.latitude);
        updateField('longitude', position.coords.longitude);
      },
      (error) => {
        let message = 'Could not get your location. ';
        if (error.code === error.PERMISSION_DENIED) {
          message += 'Please enable location permissions in your browser settings.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message += 'Location information is unavailable.';
        } else {
          message += 'Request timed out. Please try again.';
        }
        setErrorModal({ isOpen: true, message });
      },
      { timeout: 10000, maximumAge: 0 }
    );
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
        <div className="text-center mb-8 md:mb-12 px-2">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-3 md:mb-4">
            Register Your <span className="text-gradient">Bitcoin</span> Business
          </h1>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed">
            Join BTCMap and showcase your business to the Bitcoin community
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-16 md:mb-20">
          <div className="flex items-center justify-center relative max-w-3xl mx-auto">
            {/* Step Items */}
            <div className="flex items-center justify-between w-full">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                const isUpcoming = currentStep < step.id;

                return (
                  <React.Fragment key={step.id}>
                    {/* Step Circle */}
                    <div className="relative flex flex-col items-center flex-1">
                      <div
                        className={`
                          w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center
                          transition-all duration-500 relative z-10 border-4
                          ${isCompleted
                            ? 'bg-green-500 border-green-500'
                            : isCurrent
                            ? 'bg-bitcoin border-bitcoin animate-pulse-subtle'
                            : 'bg-[#0A0A0A] border-white/20'
                          }
                        `}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5 md:w-6 md:h-6 text-white stroke-[3]" />
                        ) : (
                          <StepIcon className={`w-5 h-5 md:w-6 md:h-6 ${
                            isCurrent ? 'text-black' : 'text-white/40'
                          }`} />
                        )}
                      </div>

                      {/* Step Label */}
                      <span className={`
                        absolute -bottom-7 text-xs md:text-sm whitespace-nowrap font-medium
                        transition-colors duration-300
                        ${isCurrent
                          ? 'text-white font-semibold'
                          : isCompleted
                          ? 'text-white/70'
                          : 'text-white/40'
                        }
                      `}>
                        {step.title}
                      </span>
                    </div>

                    {/* Connecting Line */}
                    {index < steps.length - 1 && (
                      <div className="flex-1 h-[2px] mx-2 md:mx-4 relative">
                        <div className="absolute inset-0 bg-white/20 rounded-full" />
                        <div
                          className={`
                            absolute inset-0 rounded-full transition-all duration-500
                            ${currentStep > step.id ? 'bg-bitcoin w-full' : 'bg-transparent w-0'}
                          `}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="glass-card p-4 sm:p-6 md:p-8">
          {/* Step 1: Business Info */}
          {currentStep === 1 && (
            <div className="space-y-5 md:space-y-6 animate-island-expand">
              <div>
                <h2 className="text-xl md:text-2xl font-heading font-bold mb-2 text-white">Business Information</h2>
                <p className="text-gray-400 text-sm md:text-base">Tell us about your business</p>
              </div>

              <Input
                label="Business Name"
                value={formData.businessName}
                onChange={(e) => updateField('businessName', e.target.value)}
                placeholder="e.g., Kibera Coffee Shop"
                required
                error={errors.businessName}
                icon={<Building2 className="w-5 h-5" />}
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
                  className="w-full px-4 py-3 text-base md:text-sm bg-white/5 border-2 border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bitcoin focus:ring-2 focus:ring-bitcoin/30 hover:border-white/20 hover:bg-white/8 transition-all duration-200 resize-none touch-manipulation min-h-[120px]"
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Help customers find you with a detailed description
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-5 md:space-y-6 animate-island-expand">
              <div>
                <h2 className="text-xl md:text-2xl font-heading font-bold mb-2 text-white">Location</h2>
                <p className="text-gray-400 text-sm md:text-base">Where can customers find you?</p>
              </div>

              {/* Helper Alert */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h3 className="font-medium text-blue-400 mb-2 flex items-center gap-2 text-sm md:text-base">
                  <MapPin className="w-5 h-5 flex-shrink-0" />
                  Important: Accurate Location Required
                </h3>
                <p className="text-xs md:text-sm text-gray-300 mb-2 leading-relaxed">
                  For the best results, you should be <strong>physically at your business location</strong> or have a precise address. You can:
                </p>
                <ul className="text-xs md:text-sm text-gray-400 space-y-1 ml-4 list-disc leading-relaxed">
                  <li>Click "Use My Location" if you're at the business now</li>
                  <li>Click on the map below to select the exact location</li>
                  <li>Enter GPS coordinates from Google Maps</li>
                </ul>
              </div>

              <Input
                label="Physical Address"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="e.g., Olympic Estate, Kibera Road, Nairobi"
                required
                error={errors.address}
                icon={<MapPin className="w-5 h-5" />}
                helper="Enter your full street address"
              />

              {/* Map */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">
                  Select Location on Map <span className="text-bitcoin">*</span>
                </label>
                <div className="bg-white/5 border-2 border-white/10 rounded-lg overflow-hidden" style={{ height: '300px', minHeight: '300px' }}>
                  <LocationMap
                    center={[formData.latitude, formData.longitude]}
                    onLocationSelect={handleLocationSelect}
                  />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Click on the map to select your exact business location
                </p>
              </div>

              {/* GPS Coordinates */}
              <div className="bg-white/5 border-2 border-white/10 rounded-lg p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-medium text-white text-sm md:text-base">GPS Coordinates</h3>
                    <p className="text-xs md:text-sm text-gray-400 mt-1">Or enter coordinates manually</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={getCurrentLocation}
                    icon={<MapPin className="w-4 h-4" />}
                    className="w-full sm:w-auto"
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
            <div className="space-y-5 md:space-y-6 animate-island-expand">
              <div>
                <h2 className="text-xl md:text-2xl font-heading font-bold mb-2 text-white">Bitcoin Payment Methods</h2>
                <p className="text-gray-400 text-sm md:text-base">Select all payment methods you accept</p>
              </div>

              {errors.payment && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-xs md:text-sm">
                  {errors.payment}
                </div>
              )}

              <div className="space-y-4">
                <Checkbox
                  label="Lightning Network"
                  description="Instant, low-fee Bitcoin payments via Lightning"
                  icon={<Zap className="w-5 h-5" />}
                  checked={formData.paymentLightning}
                  onChange={(e) => updateField('paymentLightning', e.target.checked)}
                />

                <Checkbox
                  label="On-Chain Bitcoin"
                  description="Traditional Bitcoin transactions on the main blockchain"
                  icon={<Bitcoin className="w-5 h-5" />}
                  checked={formData.paymentOnchain}
                  onChange={(e) => updateField('paymentOnchain', e.target.checked)}
                />

                <Checkbox
                  label="NFC / Contactless"
                  description="Tap-to-pay with Bitcoin cards or devices"
                  icon={<Wifi className="w-5 h-5" />}
                  checked={formData.paymentLightningContactless}
                  onChange={(e) => updateField('paymentLightningContactless', e.target.checked)}
                />
              </div>

              <div className="bg-bitcoin/10 border border-bitcoin/30 rounded-lg p-4">
                <h3 className="font-medium text-bitcoin mb-2 flex items-center gap-2 text-sm md:text-base">
                  <Bitcoin className="w-5 h-5 flex-shrink-0" />
                  Need a Bitcoin Wallet?
                </h3>
                <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                  We recommend <a href="https://getalby.com" target="_blank" rel="noopener noreferrer" className="text-bitcoin underline">Alby</a> for Lightning,{' '}
                  <a href="https://muun.com" target="_blank" rel="noopener noreferrer" className="text-bitcoin underline">Muun</a> for on-chain, or{' '}
                  <a href="mailto:info@afribit.africa" className="text-bitcoin underline">contact us</a> for setup help.
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
            <div className="space-y-5 md:space-y-6 animate-island-expand">
              <div>
                <h2 className="text-xl md:text-2xl font-heading font-bold mb-2 text-white">Verification Contact</h2>
                <p className="text-gray-400 text-sm md:text-base">Who can we contact to verify this submission?</p>
              </div>

              <Input
                label="Your Full Name"
                value={formData.contactName}
                onChange={(e) => updateField('contactName', e.target.value)}
                placeholder="John Doe"
                required
                error={errors.contactName}
                icon={<UserCheck className="w-5 h-5" />}
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

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h3 className="font-medium text-green-400 mb-2 flex items-center gap-2 text-sm md:text-base">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  Almost Done!
                </h3>
                <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                  After submission, we'll review your business within 24-48 hours. You'll receive an email confirmation with a link to edit your submission if needed.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6 md:mt-8 pt-6 border-t border-white/10 gap-3">
            {currentStep > 1 ? (
              <button
                onClick={prevStep}
                className="
                  flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl
                  bg-white/5 hover:bg-white/10 border-2 border-white/10 hover:border-white/20
                  text-white font-medium transition-all duration-300
                  active:scale-95 touch-manipulation min-h-[48px]
                  shadow-lg shadow-black/20 hover:shadow-xl
                "
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="
                  flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl ml-auto
                  bg-bitcoin hover:bg-bitcoin-dark text-black font-semibold
                  transition-all duration-300 active:scale-95 touch-manipulation
                  shadow-lg shadow-bitcoin/30 hover:shadow-xl hover:shadow-bitcoin/40
                  min-h-[48px]
                "
              >
                <span>Continue</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="
                  flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl ml-auto
                  bg-bitcoin hover:bg-bitcoin-dark text-black font-semibold
                  transition-all duration-300 active:scale-95 touch-manipulation
                  shadow-lg shadow-bitcoin/30 hover:shadow-xl hover:shadow-bitcoin/40
                  disabled:opacity-50 disabled:cursor-not-allowed
                  min-h-[48px]
                "
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Submit for Review</span>
                    <Check className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6 md:mt-8 text-gray-500 text-xs md:text-sm px-4">
          <p className="leading-relaxed">
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
    </div>
  );
}
