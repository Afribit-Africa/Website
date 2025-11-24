'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import {
  MapPin,
  Navigation,
  CheckCircle,
  XCircle,
  Camera,
  Upload,
  AlertCircle,
  Store,
  Bitcoin,
} from 'lucide-react';

interface Submission {
  id: string;
  businessName: string;
  category: string;
  location: string;
  latitude: number;
  longitude: number;
  paymentMethods: string[];
  contactEmail: string;
  submittedAt: string;
}

export default function VerifyMerchant() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const submissionId = params?.id as string;

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  // Form state
  const [businessExists, setBusinessExists] = useState<boolean | null>(null);
  const [businessNameMatches, setBusinessNameMatches] = useState<boolean | null>(null);
  const [correctedName, setCorrectedName] = useState('');
  const [businessOperating, setBusinessOperating] = useState<'open' | 'closed' | 'temporarily_closed' | null>(null);
  const [paymentMethodsVerified, setPaymentMethodsVerified] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [verifierNotes, setVerifierNotes] = useState('');
  const [verificationResult, setVerificationResult] = useState<'verified' | 'not_verified' | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && submissionId) {
      fetchSubmission();
      getUserLocation();
    }
  }, [status, submissionId]);

  const getUserLocation = async () => {
    if (!navigator.geolocation) return;

    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      return;
    }

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);

    // Check permission state first
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        
        if (result.state === 'denied') {
          // Don't attempt if already denied
          return;
        }
      } catch (error) {
        // Permissions API error, continue with direct request
      }
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: isIOS ? 30000 : (isAndroid ? 15000 : 10000),
          maximumAge: isMobile ? 5000 : 0,
        });
      });

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      setUserLocation(location);
    } catch (error) {
      // Geolocation error - silently fail for this optional feature
    }
  };

  const fetchSubmission = async () => {
    try {
      const response = await fetch(`/api/verifier/submission/${submissionId}`);
      const data = await response.json();

      if (data.success) {
        setSubmission(data.submission);
      } else {
        alert('Failed to load submission');
        router.push('/verifier/dashboard');
      }
    } catch (error) {
      alert('Failed to load submission');
      router.push('/verifier/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    // Haversine formula
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c); // Distance in meters
  };

  useEffect(() => {
    if (userLocation && submission) {
      const dist = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        submission.latitude,
        submission.longitude
      );
      setDistance(dist);
    }
  }, [userLocation, submission]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setPhotos([...photos, ...newPhotos].slice(0, 5)); // Max 5 photos
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handlePaymentMethodToggle = (method: string) => {
    if (paymentMethodsVerified.includes(method)) {
      setPaymentMethodsVerified(paymentMethodsVerified.filter((m) => m !== method));
    } else {
      setPaymentMethodsVerified([...paymentMethodsVerified, method]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userLocation) {
      alert('Please enable location access to submit verification');
      return;
    }

    if (businessExists === null || businessNameMatches === null || businessOperating === null) {
      alert('Please complete all required verification fields');
      return;
    }

    if (!verificationResult) {
      alert('Please select verification result (Verified/Not Verified)');
      return;
    }

    if (photos.length === 0) {
      alert('Please upload at least one photo of the business');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('submissionId', submissionId);
      formData.append('businessExists', businessExists.toString());
      formData.append('businessNameMatches', businessNameMatches.toString());
      formData.append('correctedName', correctedName);
      formData.append('businessOperating', businessOperating);
      formData.append('paymentMethodsVerified', JSON.stringify(paymentMethodsVerified));
      formData.append('verifierNotes', verifierNotes);
      formData.append('verificationResult', verificationResult);
      formData.append('verifierLatitude', userLocation.lat.toString());
      formData.append('verifierLongitude', userLocation.lng.toString());
      formData.append('distance', distance?.toString() || '0');

      photos.forEach((photo, index) => {
        formData.append(`photo_${index}`, photo);
      });

      const response = await fetch('/api/verifier/submit-verification', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert('Verification submitted successfully!');
        router.push('/verifier/dashboard');
      } else {
        alert(data.message || 'Failed to submit verification');
      }
    } catch (error) {
      alert('Failed to submit verification');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!submission) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-4 px-3 md:py-8 md:px-6 lg:px-8 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white mb-2 md:mb-3 flex items-center gap-1.5 md:gap-2 transition-colors text-xs md:text-sm"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1.5 md:mb-2">Verify Merchant</h1>
          <p className="text-xs md:text-sm text-gray-400">
            Complete on-ground verification for this business
          </p>
        </div>

        {/* Business Info Card */}
        <Card className="bg-[#1A1A1A] border-white/10 mb-4 md:mb-6">
          <CardHeader>
            <h2 className="text-base md:text-xl font-bold text-white flex items-center gap-2">
              <Store className="w-4 h-4 md:w-5 md:h-5 text-bitcoin" />
              Business Information
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="text-xs md:text-sm text-gray-400">Business Name</label>
                <p className="text-base md:text-lg font-semibold text-white">{submission.businessName}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="text-xs md:text-sm text-gray-400">Category</label>
                  <p className="text-sm md:text-base text-white">{submission.category}</p>
                </div>
                <div>
                  <label className="text-xs md:text-sm text-gray-400">Location</label>
                  <p className="text-sm md:text-base text-white">{submission.location}</p>
                </div>
              </div>
              <div>
                <label className="text-xs md:text-sm text-gray-400">Payment Methods</label>
                <div className="flex flex-wrap gap-1.5 md:gap-2 mt-1">
                  {submission.paymentMethods.map((method) => (
                    <span
                      key={method}
                      className="px-2 py-0.5 md:px-3 md:py-1 bg-bitcoin/20 text-bitcoin text-xs md:text-sm rounded-full"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
              {distance !== null && (
                <div className="flex items-center gap-1.5 md:gap-2 text-bitcoin text-xs md:text-sm">
                  <Navigation className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="font-medium">
                    {distance < 1000 ? `${distance}m` : `${(distance / 1000).toFixed(1)}km`} from your location
                  </span>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Verification Form */}
        <form onSubmit={handleSubmit}>
          <Card className="bg-[#1A1A1A] border-white/10 mb-4 md:mb-6">
            <CardHeader>
              <h2 className="text-base md:text-xl font-bold text-white">Verification Checklist</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4 md:space-y-6">
                {/* Business Exists */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2">
                    Does the business exist at this location? *
                  </label>
                  <div className="flex gap-2 md:gap-3">
                    <button
                      type="button"
                      onClick={() => setBusinessExists(true)}
                      className={`flex-1 py-2 md:py-2.5 rounded-lg border-2 transition-all text-xs md:text-sm font-medium ${
                        businessExists === true
                          ? 'border-green-500 bg-green-500/20 text-green-400'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 mx-auto mb-0.5 md:mb-1" />
                      <span>Yes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBusinessExists(false)}
                      className={`flex-1 py-2 md:py-2.5 rounded-lg border-2 transition-all text-xs md:text-sm font-medium ${
                        businessExists === false
                          ? 'border-red-500 bg-red-500/20 text-red-400'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5 md:w-4 md:h-4 mx-auto mb-0.5 md:mb-1" />
                      <span>No</span>
                    </button>
                  </div>
                </div>

                {/* Business Name Matches */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2">
                    Does the business name match? *
                  </label>
                  <div className="flex gap-2 md:gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setBusinessNameMatches(true);
                        setCorrectedName('');
                      }}
                      className={`flex-1 py-2 md:py-2.5 rounded-lg border-2 transition-all text-xs md:text-sm font-medium ${
                        businessNameMatches === true
                          ? 'border-green-500 bg-green-500/20 text-green-400'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 mx-auto mb-0.5 md:mb-1" />
                      <span>Yes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBusinessNameMatches(false)}
                      className={`flex-1 py-2 md:py-2.5 rounded-lg border-2 transition-all text-xs md:text-sm font-medium ${
                        businessNameMatches === false
                          ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <AlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4 mx-auto mb-0.5 md:mb-1" />
                      <span>Different</span>
                    </button>
                  </div>
                  {businessNameMatches === false && (
                    <div className="mt-2 md:mt-3">
                      <input
                        type="text"
                        value={correctedName}
                        onChange={(e) => setCorrectedName(e.target.value)}
                        placeholder="Enter the actual business name"
                        className="w-full px-3 py-2 md:px-4 md:py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-xs md:text-sm placeholder-gray-500 focus:border-bitcoin focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Business Operating */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2">
                    Business Operating Status *
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 md:gap-2">
                    <button
                      type="button"
                      onClick={() => setBusinessOperating('open')}
                      className={`py-2 md:py-2.5 rounded-lg border-2 transition-all text-xs md:text-sm font-medium ${
                        businessOperating === 'open'
                          ? 'border-green-500 bg-green-500/20 text-green-400'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      onClick={() => setBusinessOperating('temporarily_closed')}
                      className={`py-2 md:py-2.5 rounded-lg border-2 transition-all text-xs md:text-sm font-medium ${
                        businessOperating === 'temporarily_closed'
                          ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <span className="hidden sm:inline">Temp. Closed</span>
                      <span className="sm:hidden">Temp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBusinessOperating('closed')}
                      className={`py-2 md:py-2.5 rounded-lg border-2 transition-all text-xs md:text-sm font-medium ${
                        businessOperating === 'closed'
                          ? 'border-red-500 bg-red-500/20 text-red-400'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      Closed
                    </button>
                  </div>
                </div>

                {/* Payment Methods Verified */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2">
                    Which payment methods did you verify?
                  </label>
                  <div className="space-y-2">
                    {submission.paymentMethods.map((method) => (
                      <label
                        key={method}
                        className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 rounded-lg bg-[#0A0A0A] border border-white/10 hover:border-bitcoin/30 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={paymentMethodsVerified.includes(method)}
                          onChange={() => handlePaymentMethodToggle(method)}
                          className="w-4 h-4 md:w-5 md:h-5 rounded border-gray-600 text-bitcoin focus:ring-bitcoin focus:ring-offset-0"
                        />
                        <Bitcoin className="w-4 h-4 md:w-5 md:h-5 text-bitcoin" />
                        <span className="text-white text-xs md:text-sm">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2">
                    Upload Photos (At least 1 photo required) *
                  </label>
                  <div className="border-2 border-dashed border-white/10 rounded-lg p-4 md:p-6 text-center hover:border-bitcoin/30 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <Camera className="w-10 h-10 md:w-12 md:h-12 text-gray-500 mx-auto mb-2 md:mb-3" />
                      <p className="text-white font-medium mb-1 text-xs md:text-sm">
                        Tap to upload photos
                      </p>
                      <p className="text-gray-400 text-xs">
                        Max 5 photos (JPG, PNG)
                      </p>
                    </label>
                  </div>
                  {photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 md:gap-4 mt-3 md:mt-4">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-20 md:h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-0.5 right-0.5 md:top-1 md:right-1 p-0.5 md:p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Verifier Notes */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={verifierNotes}
                    onChange={(e) => setVerifierNotes(e.target.value)}
                    rows={3}
                    placeholder="Add any additional observations..."
                    className="w-full px-3 py-2 md:px-4 md:py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white text-xs md:text-sm placeholder-gray-500 focus:border-bitcoin focus:outline-none resize-none"
                  />
                </div>

                {/* Verification Result */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2 md:mb-3">
                    Final Verification Decision *
                  </label>
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    <button
                      type="button"
                      onClick={() => setVerificationResult('verified')}
                      className={`py-2.5 md:py-3 rounded-lg border-2 transition-all ${
                        verificationResult === 'verified'
                          ? 'border-green-500 bg-green-500/20'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <CheckCircle
                        className={`w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-1.5 ${
                          verificationResult === 'verified' ? 'text-green-400' : 'text-gray-400'
                        }`}
                      />
                      <p
                        className={`font-semibold text-xs md:text-sm ${
                          verificationResult === 'verified' ? 'text-green-400' : 'text-gray-400'
                        }`}
                      >
                        Verified
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 px-2">
                        Meets requirements
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVerificationResult('not_verified')}
                      className={`py-2.5 md:py-3 rounded-lg border-2 transition-all ${
                        verificationResult === 'not_verified'
                          ? 'border-red-500 bg-red-500/20'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <XCircle
                        className={`w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-1.5 ${
                          verificationResult === 'not_verified' ? 'text-red-400' : 'text-gray-400'
                        }`}
                      />
                      <p
                        className={`font-semibold text-xs md:text-sm ${
                          verificationResult === 'not_verified' ? 'text-red-400' : 'text-gray-400'
                        }`}
                      >
                        Not Verified
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 px-2">
                        Doesn't meet requirements
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-2 md:gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-2 md:px-6 md:py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm md:text-base font-medium transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 md:px-6 md:py-3 bg-bitcoin hover:bg-bitcoin/90 text-white rounded-lg text-sm md:text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size="sm" />
                  <span className="hidden sm:inline">Submitting...</span>
                  <span className="sm:hidden">Sending...</span>
                </span>
              ) : (
                <>
                  <span className="hidden sm:inline">Submit Verification</span>
                  <span className="sm:hidden">Submit</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
