'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, CheckCircle, AlertTriangle, Satellite, Clock, X } from 'lucide-react';

interface GPSPrecisionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationCapture: (latitude: number, longitude: number, accuracy: number) => void;
  targetAccuracy?: number; // Auto-capture when accuracy reaches this value (default: 10m)
  warningAccuracy?: number; // Show warning when accuracy is worse than this (default: 50m)
  businessName?: string;
}

export default function GPSPrecisionDialog({
  isOpen,
  onClose,
  onLocationCapture,
  targetAccuracy = 10,
  warningAccuracy = 50,
  businessName
}: GPSPrecisionDialogProps) {
  const [isCollecting, setIsCollecting] = useState(false);
  const [currentAccuracy, setCurrentAccuracy] = useState<number | null>(null);
  const [bestAccuracy, setBestAccuracy] = useState<number | null>(null);
  const [bestPosition, setBestPosition] = useState<{ latitude: number; longitude: number } | null>(null);
  const [satelliteCount, setSatelliteCount] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [autoCapturing, setAutoCapturing] = useState(false);

  const watchIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const accuracyHistory = useRef<number[]>([]);

  useEffect(() => {
    if (isOpen && isCollecting) {
      startGPSCollection();
    }

    return () => {
      stopGPSCollection();
    };
  }, [isOpen, isCollecting]);

  const startGPSCollection = () => {
    if (!navigator.geolocation) {
      setError('GPS is not supported on this device');
      return;
    }

    setError(null);
    startTimeRef.current = Date.now();
    accuracyHistory.current = [];

    // Start timer
    timerRef.current = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    // Watch position with high accuracy settings
    const options: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: Infinity // Keep trying
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        setCurrentAccuracy(accuracy);
        accuracyHistory.current.push(accuracy);

        // Estimate satellite count from accuracy (rough approximation)
        // Better accuracy generally means more satellites
        const estimatedSatellites = accuracy < 10 ? 8 : accuracy < 20 ? 6 : accuracy < 30 ? 4 : 3;
        setSatelliteCount(estimatedSatellites);

        // Update best position if this is more accurate
        if (bestAccuracy === null || accuracy < bestAccuracy) {
          setBestAccuracy(accuracy);
          setBestPosition({ latitude, longitude });

          // Auto-capture if target accuracy is reached
          if (accuracy <= targetAccuracy && !autoCapturing) {
            setAutoCapturing(true);
            setTimeout(() => {
              handleCapture(latitude, longitude, accuracy);
            }, 500);
          }
        }
      },
      (error) => {
        let errorMessage = 'Failed to get GPS location';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in your device settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'GPS signal unavailable. Move to an area with clear sky view.';
            break;
          case error.TIMEOUT:
            errorMessage = 'GPS request timed out. Please try again.';
            break;
        }

        setError(errorMessage);
        stopGPSCollection();
      },
      options
    );
  };

  const stopGPSCollection = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleCapture = (lat?: number, lng?: number, acc?: number) => {
    const latitude = lat || bestPosition?.latitude;
    const longitude = lng || bestPosition?.longitude;
    const accuracy = acc || bestAccuracy;

    if (latitude && longitude && accuracy !== null) {
      onLocationCapture(latitude, longitude, accuracy);
      handleClose();
    }
  };

  const handleClose = () => {
    stopGPSCollection();
    setIsCollecting(false);
    setCurrentAccuracy(null);
    setBestAccuracy(null);
    setBestPosition(null);
    setSatelliteCount(null);
    setTimeElapsed(0);
    setError(null);
    setAutoCapturing(false);
    onClose();
  };

  const getAccuracyQuality = (accuracy: number | null): {
    label: string;
    color: string;
    bgColor: string;
    suggestion: string;
  } => {
    if (accuracy === null) {
      return {
        label: 'Waiting...',
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/20',
        suggestion: 'Initializing GPS...'
      };
    }

    if (accuracy <= targetAccuracy) {
      return {
        label: 'Excellent',
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        suggestion: 'Great accuracy! Capturing automatically...'
      };
    }

    if (accuracy <= warningAccuracy) {
      return {
        label: 'Good',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        suggestion: 'Waiting for better signal...'
      };
    }

    return {
      label: 'Poor',
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      suggestion: 'Move to open area with clear sky view'
    };
  };

  const quality = getAccuracyQuality(currentAccuracy);
  const progress = currentAccuracy
    ? Math.max(0, Math.min(100, ((warningAccuracy - currentAccuracy) / warningAccuracy) * 100))
    : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-bitcoin/30 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-bitcoin/10 border-b border-bitcoin/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-bitcoin/20 flex items-center justify-center">
                <Navigation className="w-5 h-5 text-bitcoin" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">GPS Precision Mode</h3>
                {businessName && (
                  <p className="text-sm text-gray-400">{businessName}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Confirmation Step */}
          {!isCollecting && !error && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-100">
                  <p className="font-semibold mb-2">Are you at your business location right now?</p>
                  <p className="text-blue-200/80">
                    For accurate GPS coordinates, you must be physically present at the exact business location.
                    The system will collect the most precise coordinates possible.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-white">GPS Collection Tips:</p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-bitcoin mt-0.5">✓</span>
                    <span>Stand outdoors with clear view of the sky</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bitcoin mt-0.5">✓</span>
                    <span>Stay still during GPS collection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bitcoin mt-0.5">✓</span>
                    <span>Wait 5-30 seconds for best accuracy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bitcoin mt-0.5">✓</span>
                    <span>Avoid areas near tall buildings</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsCollecting(true)}
                  className="flex-1 px-4 py-3 bg-bitcoin text-black rounded-lg hover:bg-bitcoin-light transition-colors font-bold flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  Yes, Start GPS
                </button>
              </div>
            </div>
          )}

          {/* Collection in Progress */}
          {isCollecting && !error && (
            <div className="space-y-5">
              {/* Current Accuracy Display */}
              <div className={`${quality.bgColor} border-2 ${quality.bgColor.replace('/20', '/40')} rounded-xl p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-300">Current Accuracy</span>
                  <span className={`text-xs font-bold ${quality.color}`}>{quality.label}</span>
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {currentAccuracy !== null ? `±${Math.round(currentAccuracy)}m` : 'Searching...'}
                </div>
                <p className={`text-sm ${quality.color}`}>{quality.suggestion}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Progress to target ({targetAccuracy}m)</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-bitcoin to-green-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-bitcoin" />
                    <span className="text-xs text-gray-400">Time Elapsed</span>
                  </div>
                  <div className="text-xl font-bold text-white">{timeElapsed}s</div>
                </div>

                <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Satellite className="w-4 h-4 text-bitcoin" />
                    <span className="text-xs text-gray-400">Satellites</span>
                  </div>
                  <div className="text-xl font-bold text-white">
                    {satelliteCount !== null ? `~${satelliteCount}` : '--'}
                  </div>
                </div>
              </div>

              {/* Best Accuracy Info */}
              {bestAccuracy !== null && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-semibold text-green-400">Best Reading</span>
                  </div>
                  <div className="text-2xl font-bold text-white">±{Math.round(bestAccuracy)}m</div>
                  <p className="text-xs text-green-300 mt-1">
                    Will auto-capture at ±{targetAccuracy}m or you can manually capture now
                  </p>
                </div>
              )}

              {/* Warning for long wait times */}
              {timeElapsed > 120 && currentAccuracy && currentAccuracy > targetAccuracy && (
                <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-100">
                    <p className="font-semibold mb-1">Taking longer than expected</p>
                    <p className="text-yellow-200/80">
                      This may indicate GPS hardware issues or poor signal conditions.
                      You can manually capture the current best reading if needed.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCapture()}
                  disabled={!bestPosition || autoCapturing}
                  className="flex-1 px-4 py-3 bg-bitcoin text-black rounded-lg hover:bg-bitcoin-light disabled:bg-gray-600 disabled:text-gray-400 transition-colors font-bold flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  {autoCapturing ? 'Capturing...' : 'Capture Now'}
                </button>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-100">
                  <p className="font-semibold mb-2">GPS Error</p>
                  <p className="text-red-200/80">{error}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setError(null);
                    setIsCollecting(true);
                  }}
                  className="flex-1 px-4 py-3 bg-bitcoin text-black rounded-lg hover:bg-bitcoin-light transition-colors font-bold"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
