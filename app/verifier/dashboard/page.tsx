'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import {
  MapPin,
  Navigation,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface NearbySubmission {
  id: string;
  businessName: string;
  location: string;
  latitude: number;
  longitude: number;
  distance: number;
  submittedAt: string;
}

export default function VerifierDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [nearbySubmissions, setNearbySubmissions] = useState<NearbySubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      requestLocationAndFetchNearby();
    }
  }, [status]);

  const requestLocationAndFetchNearby = async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setLocationError('Location access requires a secure connection (HTTPS)');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLocationError(null);

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
      await fetchNearbySubmissions(location.lat, location.lng);
    } catch (error: any) {
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
        setLocationError('Location access is blocked. Please check your browser settings and enable location for this site.');
      }
      setIsLoading(false);
    }
  };

  const fetchNearbySubmissions = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`/api/verifier/nearby-submissions?lat=${lat}&lng=${lng}&radius=20`);
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
      <div className="py-4 px-3 md:py-8 md:px-6 lg:px-8 pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Verifier Dashboard
            </h1>
            <p className="text-sm md:text-base text-gray-400">
              Welcome, {session?.user?.name || 'Verifier'}. Verify merchants in your area.
            </p>
          </div>

          {userLocation && (
            <Card className="bg-[#1A1A1A] border-white/10 mb-6">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-bitcoin/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-bitcoin" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Your Location</p>
                      <p className="text-white font-medium">
                        {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={requestLocationAndFetchNearby}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    title="Refresh location"
                  >
                    <RefreshCw className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </CardBody>
            </Card>
          )}

          {locationError && (
            <Card className="bg-red-500/10 border-red-500/20 mb-6">
              <CardBody>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-400 font-medium mb-1">Location Error</p>
                    <p className="text-gray-300 text-sm mb-3">{locationError}</p>
                    <button
                      onClick={requestLocationAndFetchNearby}
                      className="px-4 py-2 bg-bitcoin hover:bg-bitcoin/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Retry
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

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
                  Showing merchants within 20 meters of your location
                </p>
              )}
            </CardHeader>
            <CardBody>
              {nearbySubmissions.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg mb-2">No merchants nearby</p>
                  <p className="text-gray-500 text-sm">
                    Move closer to a merchant location or refresh to check again
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
                          Verify Now
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <div className="mt-6">
            <Link
              href="/verifier/history"
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors inline-block"
            >
              View Verification History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
