'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import Link from 'next/link';
import { SiBitcoin } from 'react-icons/si';
import { FiMapPin } from 'react-icons/fi';
import { Merchant, CATEGORY_INFO } from '@/lib/merchants-data';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Next.js
let DefaultIcon: any;

if (typeof window !== 'undefined') {
  DefaultIcon = Icon.Default.prototype;
  delete DefaultIcon._getIconUrl;
  
  Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

interface MerchantsMapProps {
  merchants: Merchant[];
}

const KIBERA_CENTER: [number, number] = [-1.3133, 36.7828];

export default function MerchantsMap({ merchants }: MerchantsMapProps) {
  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden border border-gray-800">
      <MapContainer
        center={KIBERA_CENTER}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {merchants.map((merchant) => {
          // Use real GPS coordinates if available, otherwise fallback to Kibera center
          const position: LatLngExpression = 
            merchant.latitude && merchant.longitude
              ? [merchant.latitude, merchant.longitude]
              : KIBERA_CENTER;
          
          const categoryInfo = CATEGORY_INFO[merchant.category || 'other'];
          
          return (
            <Marker key={merchant.id} position={position}>
              <Popup>
                <div className="p-3 min-w-60">
                  <div className="mb-3">
                    <h3 className="font-bold text-base text-gray-900 mb-1">{merchant.businessName}</h3>
                    <p className="text-xs text-gray-600">{merchant.ownerName}</p>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-start gap-2 text-xs text-gray-700">
                      <FiMapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-bitcoin" />
                      <span>{merchant.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <SiBitcoin className="w-3.5 h-3.5 shrink-0 text-bitcoin" />
                      <span className="font-mono truncate">{merchant.blinkAddress}</span>
                    </div>
                  </div>
                  
                  <Link
                    href={`/merchants/${merchant.slug}`}
                    className="block w-full px-4 py-2 bg-bitcoin text-black text-center text-xs font-bold rounded-lg hover:bg-bitcoin-light transition-colors"
                  >
                    View & Donate
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
