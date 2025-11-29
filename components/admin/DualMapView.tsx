'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Location {
  lat: number;
  lng: number;
}

interface DualMapViewProps {
  oldLocation: Location;
  newLocation: Location;
  businessName: string;
}

export default function DualMapView({ oldLocation, newLocation, businessName }: DualMapViewProps) {
  // Calculate center point between two locations
  const center: LatLngExpression = [
    (oldLocation.lat + newLocation.lat) / 2,
    (oldLocation.lng + newLocation.lng) / 2
  ];

  // Custom icons for old and new locations
  const oldIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="12" fill="#EF4444" stroke="white" stroke-width="3"/>
        <text x="16" y="21" font-size="16" font-weight="bold" text-anchor="middle" fill="white">✗</text>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });

  const newIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="12" fill="#10B981" stroke="white" stroke-width="3"/>
        <text x="16" y="21" font-size="16" font-weight="bold" text-anchor="middle" fill="white">✓</text>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });

  // Line connecting old and new locations
  const linePositions: LatLngExpression[] = [
    [oldLocation.lat, oldLocation.lng],
    [newLocation.lat, newLocation.lng]
  ];

  // Calculate zoom level based on distance
  const calculateZoom = () => {
    const latDiff = Math.abs(oldLocation.lat - newLocation.lat);
    const lngDiff = Math.abs(oldLocation.lng - newLocation.lng);
    const maxDiff = Math.max(latDiff, lngDiff);

    if (maxDiff > 0.1) return 12;
    if (maxDiff > 0.01) return 14;
    if (maxDiff > 0.001) return 16;
    return 18;
  };

  return (
    <div className="relative">
      <MapContainer
        center={center}
        zoom={calculateZoom()}
        style={{ height: '400px', width: '100%', borderRadius: '8px' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Old Location Marker */}
        <Marker position={[oldLocation.lat, oldLocation.lng]} icon={oldIcon}>
          <Popup>
            <div className="text-center">
              <div className="font-bold text-red-600">Original Location</div>
              <div className="text-sm text-gray-600">{businessName}</div>
              <div className="text-xs text-gray-500 mt-1">
                {oldLocation.lat.toFixed(6)}, {oldLocation.lng.toFixed(6)}
              </div>
            </div>
          </Popup>
        </Marker>

        {/* New Location Marker */}
        <Marker position={[newLocation.lat, newLocation.lng]} icon={newIcon}>
          <Popup>
            <div className="text-center">
              <div className="font-bold text-green-600">New Location</div>
              <div className="text-sm text-gray-600">{businessName}</div>
              <div className="text-xs text-gray-500 mt-1">
                {newLocation.lat.toFixed(6)}, {newLocation.lng.toFixed(6)}
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Line connecting locations */}
        <Polyline
          positions={linePositions}
          color="#F7931A"
          weight={2}
          dashArray="5, 10"
        />
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-xs z-[1000]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-white">Original Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-white">New Location</span>
        </div>
      </div>
    </div>
  );
}
