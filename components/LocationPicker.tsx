'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Navigation, Loader2, AlertTriangle, MapPin } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom icons
const originalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const currentIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface LocationPickerProps {
  initialLat: number;
  initialLng: number;
  currentLat: number;
  currentLng: number;
  businessName: string;
  onLocationChange: (lat: number, lng: number, usedGPS: boolean, accuracy?: number) => void;
}

// Component to handle map clicks and dragging
function LocationMarker({
  position,
  setPosition,
  onLocationChange
}: {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
  onLocationChange: (lat: number, lng: number, usedGPS: boolean) => void;
}) {
  const markerRef = useRef<any>(null);

  useMapEvents({
    click(e) {
      const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      onLocationChange(e.latlng.lat, e.latlng.lng, false);
    },
  });

  return (
    <Marker
      position={position}
      icon={currentIcon}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          const newPos: [number, number] = [pos.lat, pos.lng];
          setPosition(newPos);
          onLocationChange(pos.lat, pos.lng, false);
        },
      }}
      ref={markerRef}
    >
      <Popup>
        <strong>New Location</strong>
        <br />
        Lat: {position[0].toFixed(6)}
        <br />
        Lng: {position[1].toFixed(6)}
        <br />
        <span className="text-xs text-gray-600">Drag marker or click map to adjust</span>
      </Popup>
    </Marker>
  );
}

export default function LocationPicker({
  initialLat,
  initialLng,
  currentLat,
  currentLng,
  businessName,
  onLocationChange,
}: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number]>([currentLat, currentLng]);
  const [showGPSModal, setShowGPSModal] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [accuracy, setAccuracy] = useState<number | undefined>();

  useEffect(() => {
    setPosition([currentLat, currentLng]);
  }, [currentLat, currentLng]);

  const handleUseCurrentLocation = () => {
    setShowGPSModal(true);
    setGpsError('');
  };

  const confirmUseGPS = () => {
    setShowGPSModal(false);
    setGpsLoading(true);
    setGpsError('');

    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser');
      setGpsLoading(false);
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 30000, // 30 seconds
      maximumAge: 0 // No cache
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy: posAccuracy } = position.coords;
        const newPos: [number, number] = [latitude, longitude];

        setPosition(newPos);
        setAccuracy(posAccuracy);
        onLocationChange(latitude, longitude, true, posAccuracy);
        setGpsLoading(false);
      },
      (error) => {
        let errorMessage = 'Failed to get your location';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Please check your device settings.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
        }

        setGpsError(errorMessage);
        setGpsLoading(false);
      },
      options
    );
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

  const distance = calculateDistance(initialLat, initialLng, position[0], position[1]);

  return (
    <div className="space-y-4">
      {/* GPS Modal */}
      {showGPSModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Important: Location Accuracy
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  To ensure accurate coordinates for <strong>{businessName}</strong>, you <strong>MUST be physically present at your business premises</strong> when using this feature.
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Why this matters:</strong> Your business location will be published on Bitcoin Maps and OpenStreetMap. Incorrect coordinates will make it difficult for customers to find you.
                  </p>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>✓ Stand inside or directly outside your business</p>
                  <p>✓ Ensure GPS/location services are enabled</p>
                  <p>✓ Wait for accurate signal (usually 5-30 seconds)</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowGPSModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmUseGPS}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                I'm at my business - Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GPS Error */}
      {gpsError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">{gpsError}</div>
          </div>
        </div>
      )}

      {/* GPS Button */}
      <div className="flex gap-3">
        <button
          onClick={handleUseCurrentLocation}
          disabled={gpsLoading}
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
        >
          {gpsLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Getting your location...
            </>
          ) : (
            <>
              <Navigation className="w-5 h-5" />
              Use My Current Location
            </>
          )}
        </button>
      </div>

      {/* GPS Accuracy Display */}
      {accuracy !== undefined && (
        <div className={`border-l-4 p-3 ${
          accuracy <= 20
            ? 'bg-green-500/10 border-green-500 text-green-400'
            : accuracy <= 50
            ? 'bg-yellow-500/10 border-yellow-400 text-yellow-400'
            : 'bg-orange-500/10 border-orange-500 text-orange-400'
        }`}>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">
              GPS Accuracy: ±{Math.round(accuracy)}m
            </span>
            {accuracy > 50 && (
              <span className="text-orange-400 text-xs">
                (Try moving to an open area for better accuracy)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Map Instructions */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
        <p className="text-sm text-blue-300 font-body">
          <strong className="text-blue-400">How to use:</strong> Click the blue "Use My Current Location" button while at your business,
          or drag the green marker on the map to your exact location. You can also click anywhere on the map to place the marker.
        </p>
      </div>

      {/* Map Container */}
      <div className="rounded-lg overflow-hidden border-2 border-gray-300 shadow-lg">
        <MapContainer
          center={position}
          zoom={16}
          style={{ height: '400px', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Original location marker (red) */}
          <Marker position={[initialLat, initialLng]} icon={originalIcon}>
            <Popup>
              <strong>Original Location</strong>
              <br />
              Lat: {initialLat.toFixed(6)}
              <br />
              Lng: {initialLng.toFixed(6)}
            </Popup>
          </Marker>

          {/* Current/new location marker (green, draggable) */}
          <LocationMarker
            position={position}
            setPosition={setPosition}
            onLocationChange={onLocationChange}
          />
        </MapContainer>
      </div>

      {/* Coordinates Display */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Original Location</p>
          <p className="text-sm font-mono">
            {initialLat.toFixed(6)}, {initialLng.toFixed(6)}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">New Location</p>
          <p className="text-sm font-mono">
            {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </p>
        </div>
      </div>

      {/* Distance Info */}
      {distance > 10 && (
        <div className={`border-l-4 p-3 ${
          distance > 5000
            ? 'bg-red-50 border-red-500'
            : distance > 1000
            ? 'bg-yellow-50 border-yellow-400'
            : 'bg-blue-50 border-blue-400'
        }`}>
          <p className="text-sm font-medium">
            Distance from original location: <strong>{Math.round(distance)}m</strong>
            {distance > 1000 && ` (${(distance / 1000).toFixed(2)}km)`}
          </p>
          {distance > 5000 && (
            <p className="text-sm text-red-700 mt-1">
              ⚠️ <strong>Warning:</strong> This is a significant distance. Please verify that your new location is correct.
            </p>
          )}
        </div>
      )}

      {/* Map Legend */}
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <p className="text-xs font-semibold text-gray-700 mb-2">Map Legend:</p>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Red marker = Original location (before correction)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Green marker = New location (drag to adjust)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
