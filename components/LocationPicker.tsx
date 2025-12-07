'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Navigation, Loader2, AlertTriangle, MapPin } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { calculateDistance } from '@/lib/utils/distance';

const GPSPrecisionDialog = dynamic(() => import('./GPSPrecisionDialog'), {
  ssr: false,
  loading: () => null,
});

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
  const [showGPSPrecisionDialog, setShowGPSPrecisionDialog] = useState(false);
  const [accuracy, setAccuracy] = useState<number | undefined>();

  useEffect(() => {
    setPosition([currentLat, currentLng]);
  }, [currentLat, currentLng]);

  const handleUseCurrentLocation = () => {
    setShowGPSPrecisionDialog(true);
  };

  const handleGPSLocationCapture = (latitude: number, longitude: number, accuracy: number) => {
    const newPos: [number, number] = [latitude, longitude];
    setPosition(newPos);
    setAccuracy(accuracy);
    onLocationChange(latitude, longitude, true, accuracy);
  };

  // Convert distance from km to meters for display
  const getDistanceInMeters = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    return calculateDistance(lat1, lon1, lat2, lon2) * 1000;
  };

  const distance = calculateDistance(initialLat, initialLng, position[0], position[1]);

  return (
    <div className="space-y-4">
      {/* GPS Button */}
      <div className="flex gap-3">
        <button
          onClick={handleUseCurrentLocation}
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Navigation className="w-5 h-5" />
          Use My Current Location
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
      <div className="bg-bitcoin/10 border border-bitcoin/30 rounded-lg p-3">
        <p className="text-sm text-gray-300 font-body">
          <strong className="text-bitcoin">How to use:</strong> Click the "Use My Current Location" button while at your business,
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
        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Original Location</p>
          <p className="text-sm font-mono text-white">
            {initialLat.toFixed(6)}, {initialLng.toFixed(6)}
          </p>
        </div>
        <div className="bg-bitcoin/10 border border-bitcoin/50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">New Location</p>
          <p className="text-sm font-mono text-bitcoin font-semibold">
            {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </p>
        </div>
      </div>

      {/* Distance Info */}
      {distance > 10 && (
        <div className={`border-l-4 p-3 rounded ${
          distance > 5000
            ? 'bg-red-500/10 border-red-500'
            : distance > 1000
            ? 'bg-yellow-500/10 border-yellow-400'
            : 'bg-bitcoin/10 border-bitcoin'
        }`}>
          <p className="text-sm font-medium text-white">
            Distance from original location: <strong className="text-bitcoin">{Math.round(distance)}m</strong>
            {distance > 1000 && ` (${(distance / 1000).toFixed(2)}km)`}
          </p>
          {distance > 5000 && (
            <p className="text-sm text-red-400 mt-1">
              ⚠️ <strong>Warning:</strong> This is a significant distance. Please verify that your new location is correct.
            </p>
          )}
        </div>
      )}

      {/* Map Legend */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
        <p className="text-xs font-semibold text-white mb-2">Map Legend:</p>
        <div className="space-y-1 text-xs text-gray-300">
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

      {/* GPS Precision Dialog */}
      <GPSPrecisionDialog
        isOpen={showGPSPrecisionDialog}
        onClose={() => setShowGPSPrecisionDialog(false)}
        onLocationCapture={handleGPSLocationCapture}
        targetAccuracy={10}
        warningAccuracy={50}
        businessName={businessName}
      />
    </div>
  );
}
