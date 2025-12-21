'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Navigation, CheckCircle, AlertTriangle, Satellite, Clock, X, Target, BarChart3 } from 'lucide-react';

interface GPSReading {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface GPSPrecisionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationCapture: (latitude: number, longitude: number, accuracy: number) => void;
  targetAccuracy?: number; // Auto-capture when accuracy reaches this value (default: 10m)
  warningAccuracy?: number; // Show warning when accuracy is worse than this (default: 50m)
  businessName?: string;
  minReadings?: number; // Minimum readings before allowing capture (ODK-style)
}

/**
 * Calculate weighted average of GPS coordinates using ODK methodology
 * Readings with better accuracy get more weight
 */
function calculateWeightedAverage(readings: GPSReading[]): {
  latitude: number;
  longitude: number;
  accuracy: number;
  standardDeviation: number;
} {
  if (readings.length === 0) {
    return { latitude: 0, longitude: 0, accuracy: Infinity, standardDeviation: Infinity };
  }

  if (readings.length === 1) {
    return {
      latitude: readings[0].latitude,
      longitude: readings[0].longitude,
      accuracy: readings[0].accuracy,
      standardDeviation: 0,
    };
  }

  // Calculate weights inversely proportional to accuracy (lower accuracy = higher weight)
  // Using 1/accuracy^2 to heavily favor accurate readings (ODK methodology)
  const weights = readings.map(r => 1 / (r.accuracy * r.accuracy));
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  // Calculate weighted average
  let weightedLat = 0;
  let weightedLng = 0;
  let weightedAcc = 0;

  readings.forEach((reading, i) => {
    const normalizedWeight = weights[i] / totalWeight;
    weightedLat += reading.latitude * normalizedWeight;
    weightedLng += reading.longitude * normalizedWeight;
    weightedAcc += reading.accuracy * normalizedWeight;
  });

  // Calculate standard deviation of distances from the weighted mean
  // This gives us an idea of how stable the readings are
  const distances = readings.map(r => {
    const latDiff = (r.latitude - weightedLat) * 111320; // Convert to meters (approx)
    const lngDiff = (r.longitude - weightedLng) * 111320 * Math.cos(weightedLat * Math.PI / 180);
    return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
  });

  const meanDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
  const squaredDiffs = distances.map(d => (d - meanDistance) ** 2);
  const standardDeviation = Math.sqrt(squaredDiffs.reduce((sum, d) => sum + d, 0) / distances.length);

  return {
    latitude: weightedLat,
    longitude: weightedLng,
    accuracy: weightedAcc,
    standardDeviation,
  };
}

/**
 * Filter outlier readings using IQR method
 * Removes readings that are statistical outliers
 */
function filterOutliers(readings: GPSReading[]): GPSReading[] {
  if (readings.length < 4) return readings;

  // Calculate median position
  const sortedLats = [...readings].sort((a, b) => a.latitude - b.latitude);
  const sortedLngs = [...readings].sort((a, b) => a.longitude - b.longitude);

  const midIndex = Math.floor(readings.length / 2);
  const medianLat = sortedLats[midIndex].latitude;
  const medianLng = sortedLngs[midIndex].longitude;

  // Calculate distances from median
  const distances = readings.map(r => {
    const latDiff = (r.latitude - medianLat) * 111320;
    const lngDiff = (r.longitude - medianLng) * 111320 * Math.cos(medianLat * Math.PI / 180);
    return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
  });

  // Calculate IQR
  const sortedDistances = [...distances].sort((a, b) => a - b);
  const q1Index = Math.floor(sortedDistances.length * 0.25);
  const q3Index = Math.floor(sortedDistances.length * 0.75);
  const q1 = sortedDistances[q1Index];
  const q3 = sortedDistances[q3Index];
  const iqr = q3 - q1;
  const upperBound = q3 + 1.5 * iqr;

  // Filter out outliers (readings too far from median)
  return readings.filter((r, i) => distances[i] <= upperBound || distances[i] < r.accuracy * 2);
}

export default function GPSPrecisionDialog({
  isOpen,
  onClose,
  onLocationCapture,
  targetAccuracy = 10,
  warningAccuracy = 50,
  businessName,
  minReadings = 5, // ODK typically requires minimum 5 readings
}: GPSPrecisionDialogProps) {
  const [isCollecting, setIsCollecting] = useState(false);
  const [currentAccuracy, setCurrentAccuracy] = useState<number | null>(null);
  const [readings, setReadings] = useState<GPSReading[]>([]);
  const [averagedPosition, setAveragedPosition] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
    standardDeviation: number;
  } | null>(null);
  const [satelliteCount, setSatelliteCount] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [autoCapturing, setAutoCapturing] = useState(false);
  const [stabilityScore, setStabilityScore] = useState<number>(0);

  const watchIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // Calculate if readings are stable enough for accurate capture
  const isStable = useCallback(() => {
    if (readings.length < minReadings) return false;
    if (!averagedPosition) return false;

    // Check if standard deviation is low (readings are consistent)
    // And averaged accuracy is good
    return averagedPosition.standardDeviation < 15 && averagedPosition.accuracy < warningAccuracy;
  }, [readings.length, minReadings, averagedPosition, warningAccuracy]);

  // Update averaged position whenever readings change
  useEffect(() => {
    if (readings.length > 0) {
      const filtered = filterOutliers(readings);
      const averaged = calculateWeightedAverage(filtered);
      setAveragedPosition(averaged);

      // Calculate stability score (0-100)
      const readingScore = Math.min(readings.length / minReadings, 1) * 30;
      const accuracyScore = Math.max(0, (warningAccuracy - averaged.accuracy) / warningAccuracy) * 40;
      const stabilityValue = Math.max(0, (20 - averaged.standardDeviation) / 20) * 30;
      setStabilityScore(Math.round(readingScore + accuracyScore + stabilityValue));

      // Auto-capture when conditions are met
      if (readings.length >= minReadings &&
          averaged.accuracy <= targetAccuracy &&
          averaged.standardDeviation < 10 &&
          !autoCapturing) {
        setAutoCapturing(true);
        setTimeout(() => {
          handleCapture();
        }, 500);
      }
    }
  }, [readings, minReadings, targetAccuracy, warningAccuracy, autoCapturing]);

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
    setReadings([]);
    setAveragedPosition(null);
    startTimeRef.current = Date.now();

    // Start timer
    timerRef.current = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    // Watch position with high accuracy settings
    const options: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 30000
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const now = Date.now();

        setCurrentAccuracy(accuracy);

        // Throttle readings to prevent too many updates
        // Collect a reading every 500ms minimum
        if (now - lastUpdateRef.current >= 500) {
          lastUpdateRef.current = now;

          const newReading: GPSReading = {
            latitude,
            longitude,
            accuracy,
            timestamp: now,
          };

          setReadings(prev => {
            // Keep last 20 readings (sliding window for better averaging)
            const updated = [...prev, newReading].slice(-20);
            return updated;
          });
        }

        // Estimate satellite count from accuracy
        const estimatedSatellites = accuracy < 5 ? 10 : accuracy < 10 ? 8 : accuracy < 20 ? 6 : accuracy < 30 ? 4 : 3;
        setSatelliteCount(estimatedSatellites);
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

  const handleCapture = () => {
    if (averagedPosition && averagedPosition.accuracy !== Infinity) {
      onLocationCapture(
        averagedPosition.latitude,
        averagedPosition.longitude,
        averagedPosition.accuracy
      );
      handleClose();
    }
  };

  const handleClose = () => {
    stopGPSCollection();
    setIsCollecting(false);
    setCurrentAccuracy(null);
    setReadings([]);
    setAveragedPosition(null);
    setSatelliteCount(null);
    setTimeElapsed(0);
    setError(null);
    setAutoCapturing(false);
    setStabilityScore(0);
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
        suggestion: readings.length < minReadings
          ? `Collecting readings (${readings.length}/${minReadings})...`
          : 'Great accuracy! Ready to capture.'
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

  const quality = getAccuracyQuality(averagedPosition?.accuracy ?? currentAccuracy);
  const canCapture = readings.length >= minReadings && averagedPosition && averagedPosition.accuracy !== Infinity;

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
              {/* ODK-Style Readings Counter */}
              <div className="flex items-center justify-between bg-black/30 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-bitcoin" />
                  <span className="text-sm font-semibold text-white">Readings Collected</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${readings.length >= minReadings ? 'text-green-400' : 'text-bitcoin'}`}>
                    {readings.length}
                  </span>
                  <span className="text-sm text-gray-400">/ {minReadings} min</span>
                </div>
              </div>

              {/* Averaged Position Display */}
              <div className={`${quality.bgColor} border-2 ${quality.bgColor.replace('/20', '/40')} rounded-xl p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-300">Averaged Accuracy</span>
                  <span className={`text-xs font-bold ${quality.color}`}>{quality.label}</span>
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {averagedPosition && averagedPosition.accuracy !== Infinity
                    ? `±${Math.round(averagedPosition.accuracy)}m`
                    : 'Calculating...'}
                </div>
                <p className={`text-sm ${quality.color}`}>{quality.suggestion}</p>
              </div>

              {/* Stability Indicator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Stability Score
                  </span>
                  <span>{stabilityScore}%</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      stabilityScore > 70 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                      stabilityScore > 40 ? 'bg-gradient-to-r from-bitcoin to-yellow-400' :
                      'bg-gradient-to-r from-red-500 to-orange-400'
                    }`}
                    style={{ width: `${stabilityScore}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 text-center">
                  {stabilityScore < 40 ? 'Stay still and wait for more readings...' :
                   stabilityScore < 70 ? 'Position stabilizing...' :
                   'Position stable! Ready to capture.'}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3 text-bitcoin" />
                    <span className="text-xs text-gray-400">Time</span>
                  </div>
                  <div className="text-lg font-bold text-white">{timeElapsed}s</div>
                </div>

                <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center gap-1 mb-1">
                    <Satellite className="w-3 h-3 text-bitcoin" />
                    <span className="text-xs text-gray-400">Sats</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {satelliteCount !== null ? `~${satelliteCount}` : '--'}
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3 text-bitcoin" />
                    <span className="text-xs text-gray-400">Current</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {currentAccuracy !== null ? `±${Math.round(currentAccuracy)}m` : '--'}
                  </div>
                </div>
              </div>

              {/* Standard Deviation Info */}
              {averagedPosition && readings.length >= 3 && (
                <div className={`${
                  averagedPosition.standardDeviation < 10 ? 'bg-green-500/10 border-green-500/30' :
                  averagedPosition.standardDeviation < 20 ? 'bg-yellow-500/10 border-yellow-500/30' :
                  'bg-red-500/10 border-red-500/30'
                } border rounded-lg p-3`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Target className={`w-4 h-4 ${
                      averagedPosition.standardDeviation < 10 ? 'text-green-400' :
                      averagedPosition.standardDeviation < 20 ? 'text-yellow-400' :
                      'text-red-400'
                    }`} />
                    <span className="text-sm font-semibold text-white">Position Consistency</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    σ = {averagedPosition.standardDeviation.toFixed(1)}m
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {averagedPosition.standardDeviation < 10
                      ? 'Readings are highly consistent'
                      : averagedPosition.standardDeviation < 20
                      ? 'Readings are moderately consistent'
                      : 'Readings are varying - stay still'}
                  </p>
                </div>
              )}

              {/* Warning for long wait times */}
              {timeElapsed > 120 && averagedPosition && averagedPosition.accuracy > targetAccuracy && (
                <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-100">
                    <p className="font-semibold mb-1">Taking longer than expected</p>
                    <p className="text-yellow-200/80">
                      Try moving to a more open area. You can manually capture the current averaged position if needed.
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
                  onClick={handleCapture}
                  disabled={!canCapture || autoCapturing}
                  className="flex-1 px-4 py-3 bg-bitcoin text-black rounded-lg hover:bg-bitcoin-light disabled:bg-gray-600 disabled:text-gray-400 transition-colors font-bold flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  {autoCapturing ? 'Capturing...' :
                   !canCapture ? `Wait (${readings.length}/${minReadings})` :
                   'Capture Now'}
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
