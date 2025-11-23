'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import {
  MapPin,
  Navigation,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

interface NearbySubmission {
  id: string;
  businessName: string;
  location: string;
  latitude: number;
  longitude: number;
  distance: number; // in meters
  submittedAt: string;
  verificationStatus: string;
}

interface VerifierStats {
  totalVerifications: number;
  verifiedCount: number;
  notVerifiedCount: number;
  pendingCount: number;
}

export default function VerifierDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [nearbySubmissions, setNearbySubmissions] = useState<NearbySubmission[]>([]);
  const [stats, setStats] = useState<VerifierStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [hasCheckedPermission, setHasCheckedPermission] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    // Check browser permission status and show modal only if needed
    if (status === 'authenticated' && !hasCheckedPermission) {
      setHasCheckedPermission(true);

      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          if (result.state === 'granted') {
            setLocationPermission('granted');
            setIsLoading(false);
            // Auto-fetch location if already granted
            requestLocationAndFetchNearby();
          } else if (result.state === 'denied') {
            setLocationPermission('denied');
            setShowLocationModal(false);
            setIsLoading(false);
          } else {
            // prompt state - show modal
            setShowLocationModal(true);
            setIsLoading(false);
          }
        }).catch(() => {
          // Fallback if permissions API not supported
          setShowLocationModal(true);
          setIsLoading(false);
        });
      } else {
        // Fallback if permissions API not supported
        setShowLocationModal(true);
        setIsLoading(false);
      }
    }
  }, [status, hasCheckedPermission]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchVerifierStats();
    }
  }, [status]);

  const requestLocationAndFetchNearby = async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLocationPermission('denied');
      setShowLocationModal(false);
      setIsLoading(false);
      return;
    }

    // Check HTTPS requirement
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setLocationError('Location access requires a secure connection (HTTPS)');
      setLocationPermission('denied');
      setShowLocationModal(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Detect mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: isMobile,
          timeout: isIOS ? 25000 : 10000,
          maximumAge: isMobile ? 5000 : 0,
        });
      });

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      setUserLocation(location);
      setLocationPermission('granted');
      setShowLocationModal(false);
      setLocationError(null);
      await fetchNearbySubmissions(location.lat, location.lng);
    } catch (error: any) {
      setShowLocationModal(false);
      setLocationPermission('denied');

      // Handle different error types with mobile-specific messages
      if (error && typeof error === 'object' && 'code' in error) {
        if (error.code === 1) {
          if (isMobile) {
            if (isIOS) {
              setLocationError('Location access denied. Go to Settings > Safari > Location Services, and allow location access.');
            } else {
              setLocationError('Location access denied. Tap the lock icon in your browser\'s address bar and allow location access.');
            }
          } else {
            setLocationError('Location access denied. Please enable location permissions in your browser settings.');
          }
        } else if (error.code === 2) {
          setLocationError('Location unavailable. Please check your device settings and ensure location services are enabled.');
        } else if (error.code === 3) {
          setLocationError('Location request timed out. Please ensure you have a good GPS signal and try again.');
        } else {
          setLocationError('Unable to get your location. Please try again.');
        }
      } else {
        // Generic error or permissions policy error
        setLocationError('Location access is blocked. Please check your browser settings and enable location for this site.');
      }
      setIsLoading(false);
    }
  };

  const fetchNearbySubmissions = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`/api/verifier/nearby-submissions?lat=${lat}&lng=${lng}&radius=5000`);
      const data = await response.json();

      if (data.success) {
        setNearbySubmissions(data.submissions);
      } else {
        setLocationError(data.message || 'Failed to fetch nearby submissions');
      }
    } catch (error) {
      setLocationError('Failed to load nearby submissions');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVerifierStats = async () => {
    try {
      const response = await fetch('/api/verifier/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      // Error fetching verifier stats
    }
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${meters}m away`;
    }
    return `${(meters / 1000).toFixed(1)}km away`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-black to-[#1A1A1A]">
      {/* Location Permission Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-bitcoin/20 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-bitcoin" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Enable Location Access</h2>
              <p className="text-gray-400 mb-6">
                To show you nearby merchants that need verification, we need access to your location.
                Your location is only used to find merchants within 5km of you.
              </p>

              <div className="bg-[#0A0A0A] border border-white/5 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-gray-300 mb-2 font-medium">How it works:</p>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-bitcoin flex-shrink-0 mt-0.5" />
                    <span>Click "Allow Location" below</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-bitcoin flex-shrink-0 mt-0.5" />
                    <span>Grant permission when your browser asks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-bitcoin flex-shrink-0 mt-0.5" />
                    <span>View nearby merchants sorted by distance</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={requestLocationAndFetchNearby}
                  className="w-full px-6 py-3 bg-bitcoin hover:bg-bitcoin/90 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Navigation className="w-5 h-5" />
                  Allow Location
                </button>
                <button
                  onClick={() => {
                    setShowLocationModal(false);
                    setLocationPermission('denied');
                    setLocationError('Location access is required to see nearby merchants. You can enable it later.');
                    setIsLoading(false);
                  }}
                  className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg font-medium transition-colors"
                >
                  Skip for Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="py-4 px-3 md:py-8 md:px-6 lg:px-8 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Verifier Dashboard
            </h1>
            <p className="text-sm md:text-base text-gray-400">
              Welcome, {session?.user?.name || 'Verifier'}. Verify merchants in your area.
            </p>
          </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-8">
            <Card className="bg-[#1A1A1A] border-white/10">
              <CardBody>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                  <div>
                    <p className="text-gray-400 text-xs md:text-sm mb-1">Total Verifications</p>
                    <p className="text-xl md:text-2xl font-bold text-white">{stats.totalVerifications}</p>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-bitcoin/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-bitcoin" />
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-[#1A1A1A] border-white/10">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Verified</p>
                    <p className="text-2xl font-bold text-green-400">{stats.verifiedCount}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-[#1A1A1A] border-white/10">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Not Verified</p>
                    <p className="text-2xl font-bold text-red-400">{stats.notVerifiedCount}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-[#1A1A1A] border-white/10">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Pending</p>
                    <p className="text-2xl font-bold text-yellow-400">{stats.pendingCount}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Location Status */}
        {locationError && (
          <Card className="bg-red-500/10 border-red-500/20 mb-6">
            <CardBody>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-400 font-medium mb-1">Location Error</p>
                  <p className="text-gray-300 text-sm">{locationError}</p>
                  {locationPermission === 'denied' && (
                    <button
                      onClick={() => {
                        setLocationError(null);
                        setLocationPermission('prompt');
                        setShowLocationModal(true);
                      }}
                      className="mt-3 px-4 py-2 bg-bitcoin hover:bg-bitcoin/90 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Enable Location Access
                    </button>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Nearby Submissions */}
        <Card className="bg-[#1A1A1A] border-white/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-bitcoin" />
              <h2 className="text-xl font-bold text-white">
                Nearby Merchants to Verify
              </h2>
            </div>
            {userLocation && (
              <p className="text-sm text-gray-400 mt-1">
                Showing merchants within 5km of your location
              </p>
            )}
          </CardHeader>
          <CardBody>
            {nearbySubmissions.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">No pending verifications nearby</p>
                <p className="text-gray-500 text-sm">
                  All merchants in your area have been verified
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {nearbySubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="p-4 rounded-lg bg-[#0A0A0A] border border-white/5 hover:border-bitcoin/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {submission.businessName}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{submission.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Navigation className="w-4 h-4 text-bitcoin" />
                            <span className="text-bitcoin font-medium">
                              {formatDistance(submission.distance)}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          Submitted on {formatDate(submission.submittedAt)}
                        </p>
                      </div>
                      <Link
                        href={`/verifier/verify/${submission.id}`}
                        className="px-4 py-2 bg-bitcoin hover:bg-bitcoin/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Verify
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6 flex gap-4">
          <Link
            href="/verifier/history"
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors"
          >
            View History
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}
