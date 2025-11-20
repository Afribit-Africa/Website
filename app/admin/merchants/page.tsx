'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { MapPin, Bitcoin, Calendar, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface Merchant {
  id: string;
  businessName: string;
  categoryValue: string;
  address: string;
  latitude: number;
  longitude: number;
  paymentOnchain: boolean;
  paymentLightning: boolean;
  submittedAt: string;
  publishedAt: string;
  isEarlyAdopter: boolean;
  adopterNumber?: number;
}

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      const response = await fetch('/api/admin/merchants');
      const data = await response.json();

      if (data.success) {
        setMerchants(data.merchants);
      }
    } catch (error) {
      // Error fetching merchants
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">
          Published Merchants
        </h1>
        <p className="text-gray-400">
          View all merchants that have been published to BTCMap
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">Total Merchants</p>
              <p className="text-3xl font-bold text-white">{merchants.length}</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">Early Adopters</p>
              <p className="text-3xl font-bold text-purple-400">
                {merchants.filter(m => m.isEarlyAdopter).length}
              </p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">Lightning Enabled</p>
              <p className="text-3xl font-bold text-yellow-400">
                {merchants.filter(m => m.paymentLightning).length}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Merchants Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : merchants.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-gray-400">No published merchants yet</p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {merchants.map((merchant) => (
            <Card key={merchant.id} className="hover:border-white/20 transition-all">
              <CardBody className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {merchant.businessName}
                  </h3>
                  <p className="text-sm text-gray-400">{merchant.categoryValue}</p>
                </div>

                {merchant.isEarlyAdopter && (
                  <Badge variant="info">Early Adopter #{merchant.adopterNumber}</Badge>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-gray-400">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{merchant.address || 'No address provided'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>Published {format(new Date(merchant.publishedAt), 'MMM d, yyyy')}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {merchant.paymentLightning && (
                    <Badge variant="warning">Lightning</Badge>
                  )}
                  {merchant.paymentOnchain && (
                    <Badge variant="info">On-chain</Badge>
                  )}
                </div>

                <a
                  href={`https://btcmap.org/merchant/${merchant.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-bitcoin hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View on BTCMap</span>
                </a>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
