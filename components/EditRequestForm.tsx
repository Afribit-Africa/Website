'use client';

import { useState } from 'react';
import { Check, AlertTriangle, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CATEGORY_INFO } from '@/lib/merchants-data';

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-white/5 rounded-lg flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-bitcoin" />
    </div>
  ),
});

interface Merchant {
  id: number;
  businessName: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  blinkAddress: string;
  adopterNumber: number;
  confirmed: boolean;
  osmNodeId: string;
}

interface EditRequestFormProps {
  merchant: {
    id?: number | string;
    businessName: string;
    category: string;
    address: string;
    latitude: number;
    longitude: number;
    phone?: string;
    blinkAddress?: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  businessName: string;
  blinkAddress: string;
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  category: string;
  submitterName: string;
  submitterEmail: string;
  submitterPhone: string;
  reasonForEdit: string;
  usedCurrentLocation: boolean;
  locationAccuracy?: number;
}

export default function EditRequestForm({ merchant, onSuccess, onCancel }: EditRequestFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationConfirmed, setLocationConfirmed] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    businessName: merchant.businessName,
    blinkAddress: merchant.blinkAddress || '',
    latitude: merchant.latitude,
    longitude: merchant.longitude,
    address: merchant.address,
    phone: merchant.phone || '',
    category: merchant.category,
    submitterName: '',
    submitterEmail: '',
    submitterPhone: '',
    reasonForEdit: '',
    usedCurrentLocation: false,
  });

  const totalSteps = 6; // Increased from 5 to include category selection

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (lat: number, lng: number, usedGPS: boolean, accuracy?: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      usedCurrentLocation: usedGPS,
      locationAccuracy: accuracy
    }));
    setLocationConfirmed(true);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const distanceMoved = calculateDistance(
    merchant.latitude,
    merchant.longitude,
    formData.latitude,
    formData.longitude
  );

  const hasChanges =
    formData.businessName !== merchant.businessName ||
    formData.blinkAddress !== merchant.blinkAddress ||
    formData.phone !== merchant.phone ||
    formData.address !== merchant.address ||
    distanceMoved > 10;

  const canProceedToNextStep = () => {
    switch (step) {
      case 1: return true;
      case 2: return formData.businessName.trim().length > 0;
      case 3: return formData.blinkAddress.trim().length > 0 && formData.blinkAddress.toLowerCase().endsWith('@blink.sv');
      case 4: return locationConfirmed;
      case 5: return (
        formData.submitterName.trim().length > 0 &&
        formData.submitterEmail.trim().length > 0 &&
        formData.reasonForEdit.trim().length >= 10
      );
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!canProceedToNextStep()) {
      setError('Please complete all required fields');
      return;
    }

    if (!hasChanges) {
      setError('No changes detected. Please make at least one change before submitting.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/merchants/edit-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantId: merchant.id,
          ...formData
        })
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
      } else {
        setError(data.error || 'Failed to submit edit request');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-10">
      {/* Progress Steps */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          {[1, 2, 3, 4, 5].map((stepNum) => (
            <div
              key={stepNum}
              className={`flex items-center ${stepNum < totalSteps ? 'flex-1' : ''}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold font-numbers transition-all ${
                  stepNum < step
                    ? 'bg-green-500/20 text-green-400 border-2 border-green-500 shadow-lg shadow-green-500/20'
                    : stepNum === step
                    ? 'bg-transparent text-white border-2 border-bitcoin shadow-lg shadow-bitcoin/30 scale-110'
                    : 'bg-white/5 text-gray-500 border border-white/20'
                }`}
              >
                {stepNum < step ? <Check className="w-5 h-5" /> : stepNum}
              </div>
              {stepNum < totalSteps && (
                <div
                  className={`h-1 flex-1 mx-2 transition-all ${
                    stepNum < step ? 'bg-green-500' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-400 text-center">
          Step {step} of {totalSteps}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-400">{error}</div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="space-y-6 min-h-[400px]">
        {step === 1 && (
          <div>
            <h3 className="text-2xl font-bold font-heading text-white mb-6">
              Review Current Details
            </h3>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 space-y-4 border border-white/10">
              <div>
                <span className="text-sm font-medium text-gray-400">Business Name:</span>
                <p className="text-white text-lg">{merchant.businessName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-400">Category:</span>
                <p className="text-white">{merchant.category}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-400">Address:</span>
                <p className="text-white">{merchant.address}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-400">Phone:</span>
                <p className="text-white">{merchant.phone || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-400">Blink Address:</span>
                <p className="text-white">{merchant.blinkAddress || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-400">Location:</span>
                <p className="text-white text-sm font-numbers">
                  {merchant.latitude.toFixed(6)}, {merchant.longitude.toFixed(6)}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              In the following steps, you'll be able to correct any incorrect information.
            </p>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-2xl font-bold font-heading text-white mb-6">
              Select Business Category
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(CATEGORY_INFO).map(([key, { name, color }]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleInputChange('category', key)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    formData.category === key
                      ? 'border-bitcoin bg-bitcoin/10 shadow-lg shadow-bitcoin/20'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${color}`}>
                    {name}
                  </div>
                </button>
              ))}
            </div>
            {formData.category !== merchant.category && (
              <div className="mt-4 bg-yellow-500/10 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <p className="text-sm text-yellow-300">
                  <strong>Changed from:</strong> {CATEGORY_INFO[merchant.category]?.name || merchant.category}
                </p>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-2xl font-bold font-heading text-white mb-6">
              Confirm Business Name
            </h3>
            <Input
              label="Business Name"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              placeholder="Enter your business name"
              required
            />
            {formData.businessName !== merchant.businessName && (
              <div className="mt-4 bg-yellow-500/10 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <p className="text-sm text-yellow-300">
                  <strong>Changed from:</strong> {merchant.businessName}
                </p>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="text-2xl font-bold font-heading text-white mb-6">
              Confirm Blink Address
            </h3>
            <Input
              label="Blink Address"
              value={formData.blinkAddress}
              onChange={(e) => handleInputChange('blinkAddress', e.target.value)}
              placeholder="e.g., yourbusiness@blink.sv"
              helper="Your Bitcoin Lightning Network payment address"
              required
            />
            {formData.blinkAddress !== merchant.blinkAddress && (
              <div className="mt-4 bg-yellow-500/10 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <p className="text-sm text-yellow-300">
                  <strong>Changed from:</strong> {merchant.blinkAddress || 'Not set'}
                </p>
              </div>
            )}
            {formData.blinkAddress && !formData.blinkAddress.toLowerCase().endsWith('@blink.sv') && (
              <div className="mt-4 bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-sm text-red-300 font-body">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  <strong>Invalid format:</strong> Blink address must end with @blink.sv
                </p>
              </div>
            )}
          </div>
        )}

        {step === 5 && (
          <div>
            <h3 className="text-2xl font-bold font-heading text-white mb-6">
              Confirm Business Location
            </h3>

            <div className="bg-red-500/10 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-300">
                  <p className="font-semibold mb-1">IMPORTANT: Location Accuracy</p>
                  <p>For best results, <strong>visit your business premises</strong> before confirming the location. Use the "Use My Current Location" button while physically at your business for precise coordinates.</p>
                </div>
              </div>
            </div>

            <LocationPicker
              initialLat={merchant.latitude}
              initialLng={merchant.longitude}
              currentLat={formData.latitude}
              currentLng={formData.longitude}
              businessName={merchant.businessName}
              onLocationChange={handleLocationChange}
            />

            {distanceMoved > 10 && (
              <div className={`mt-4 border-l-4 p-4 rounded-r-lg ${
                distanceMoved > 5000
                  ? 'bg-red-500/10 border-red-500'
                  : distanceMoved > 1000
                  ? 'bg-yellow-500/10 border-yellow-500'
                  : 'bg-blue-500/10 border-blue-500'
              }`}>
                <p className={`text-sm font-medium ${
                  distanceMoved > 5000
                    ? 'text-red-300'
                    : distanceMoved > 1000
                    ? 'text-yellow-300'
                    : 'text-blue-300'
                }`}>
                  Location moved: <strong>{Math.round(distanceMoved)}m</strong> from original position
                </p>
                {distanceMoved > 5000 && (
                  <p className="text-sm text-red-300 mt-1">
                    ⚠️ This is a significant distance change. Please verify the location is correct.
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 space-y-4">
              <Input
                label="Full Address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter full address"
              />

              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+254..."
              />
            </div>
          </div>
        )}

        {step === 6 && (
          <div>
            <h3 className="text-2xl font-bold font-heading text-white mb-6">
              Your Contact Information
            </h3>

            <div className="space-y-4 mb-6">
              <Input
                label="Your Full Name"
                value={formData.submitterName}
                onChange={(e) => handleInputChange('submitterName', e.target.value)}
                placeholder="Enter your full name"
                required
              />

              <Input
                label="Your Email"
                type="email"
                value={formData.submitterEmail}
                onChange={(e) => handleInputChange('submitterEmail', e.target.value)}
                placeholder="your@email.com"
                helper="We'll send confirmation and status updates to this email"
                required
              />

              <Input
                label="Your Phone Number"
                type="tel"
                value={formData.submitterPhone}
                onChange={(e) => handleInputChange('submitterPhone', e.target.value)}
                placeholder="+254..."
              />

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Reason for Changes <span className="text-bitcoin">*</span>
                </label>
                <textarea
                  value={formData.reasonForEdit}
                  onChange={(e) => handleInputChange('reasonForEdit', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bitcoin focus:ring-2 focus:ring-bitcoin/30 hover:border-white/20 hover:bg-white/8 transition-all duration-200"
                  placeholder="Please explain why you're making these changes (minimum 10 characters)"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {formData.reasonForEdit.length}/10 characters minimum
                </p>
              </div>
            </div>

            {/* Summary of Changes */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h4 className="font-semibold text-white mb-4 font-heading">Summary of Changes:</h4>
              <div className="space-y-2 text-sm">
                {formData.businessName !== merchant.businessName && (
                  <div className="text-gray-300">
                    <span className="font-medium text-bitcoin">Business Name:</span> {merchant.businessName} → {formData.businessName}
                  </div>
                )}
                {formData.category !== merchant.category && (
                  <div className="text-gray-300">
                    <span className="font-medium text-bitcoin">Category:</span> {CATEGORY_INFO[merchant.category]?.name || merchant.category} → {CATEGORY_INFO[formData.category]?.name || formData.category}
                  </div>
                )}
                {formData.blinkAddress !== merchant.blinkAddress && (
                  <div className="text-gray-300">
                    <span className="font-medium text-bitcoin">Blink Address:</span> {merchant.blinkAddress || 'Not set'} → {formData.blinkAddress}
                  </div>
                )}
                {distanceMoved > 10 && (
                  <div className="text-gray-300">
                    <span className="font-medium text-bitcoin">Location:</span> Moved {Math.round(distanceMoved)}m
                    {formData.usedCurrentLocation && ' (using GPS)'}
                  </div>
                )}
                {formData.address !== merchant.address && (
                  <div className="text-gray-300">
                    <span className="font-medium text-bitcoin">Address:</span> Updated
                  </div>
                )}
                {formData.phone !== merchant.phone && (
                  <div className="text-gray-300">
                    <span className="font-medium text-bitcoin">Phone:</span> {merchant.phone || 'Not set'} → {formData.phone}
                  </div>
                )}
                {!hasChanges && (
                  <div className="text-yellow-400">
                    No changes detected
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
        <Button
          variant="ghost"
          onClick={() => step === 1 ? onCancel() : setStep(step - 1)}
          icon={<ArrowLeft className="w-5 h-5" />}
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </Button>

        {step < totalSteps ? (
          <Button
            variant="primary"
            onClick={() => setStep(step + 1)}
            disabled={!canProceedToNextStep()}
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Continue
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading || !canProceedToNextStep() || !hasChanges}
            loading={loading}
            icon={<Check className="w-5 h-5" />}
          >
            {loading ? 'Submitting...' : 'Submit Changes'}
          </Button>
        )}
      </div>
    </div>
  );
}
