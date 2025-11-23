'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { MapPin, Bitcoin, Calendar, ExternalLink, Trash2, Edit, Search, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMerchants, setSelectedMerchants] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [merchantToDelete, setMerchantToDelete] = useState<Merchant | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleDeleteClick = (merchant: Merchant) => {
    setMerchantToDelete(merchant);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!merchantToDelete) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/merchants/${merchantToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Merchant deleted successfully!');
        setShowDeleteModal(false);
        setMerchantToDelete(null);
        fetchMerchants();
      } else {
        toast.error(data.error || 'Failed to delete merchant');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMerchants.size === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedMerchants.size} merchant(s)?`)) {
      return;
    }

    setIsProcessing(true);
    let successCount = 0;
    let failCount = 0;

    for (const id of Array.from(selectedMerchants)) {
      try {
        const response = await fetch(`/api/admin/merchants/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        failCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully deleted ${successCount} merchant(s)`);
    }
    if (failCount > 0) {
      toast.error(`Failed to delete ${failCount} merchant(s)`);
    }

    setSelectedMerchants(new Set());
    setIsProcessing(false);
    fetchMerchants();
  };

  const toggleSelectMerchant = (id: string) => {
    const newSelected = new Set(selectedMerchants);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedMerchants(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedMerchants.size === filteredMerchants.length) {
      setSelectedMerchants(new Set());
    } else {
      setSelectedMerchants(new Set(filteredMerchants.map(m => m.id)));
    }
  };

  const filteredMerchants = merchants.filter(merchant =>
    merchant.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    merchant.categoryValue.toLowerCase().includes(searchQuery.toLowerCase()) ||
    merchant.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">
            Published Merchants
          </h1>
          <p className="text-gray-400">
            View and manage all merchants published to BTCMap
          </p>
        </div>
        {selectedMerchants.size > 0 && (
          <Button
            variant="primary"
            onClick={handleBulkDelete}
            disabled={isProcessing}
            className="bg-red-500 hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected ({selectedMerchants.size})
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <Card>
        <CardBody className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by business name, category, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bitcoin"
            />
          </div>
        </CardBody>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
        <Card>
          <CardBody className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">Filtered Results</p>
              <p className="text-3xl font-bold text-bitcoin">{filteredMerchants.length}</p>
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
        <div>
          {/* Bulk Actions Bar */}
          {filteredMerchants.length > 0 && (
            <Card className="mb-4">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedMerchants.size === filteredMerchants.length && filteredMerchants.length > 0}
                      onChange={toggleSelectAll}
                      className="w-5 h-5 rounded border-white/20 bg-white/5 text-bitcoin focus:ring-bitcoin focus:ring-offset-0"
                    />
                    <span className="text-sm text-gray-400">
                      Select All ({filteredMerchants.length})
                    </span>
                  </label>
                  {selectedMerchants.size > 0 && (
                    <span className="text-sm text-bitcoin font-medium">
                      {selectedMerchants.size} selected
                    </span>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Merchants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMerchants.map((merchant) => (
              <Card key={merchant.id} className="hover:border-white/20 transition-all relative">
                {/* Selection Checkbox */}
                <div className="absolute top-4 right-4 z-10">
                  <input
                    type="checkbox"
                    checked={selectedMerchants.has(merchant.id)}
                    onChange={() => toggleSelectMerchant(merchant.id)}
                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-bitcoin focus:ring-bitcoin focus:ring-offset-0 cursor-pointer"
                  />
                </div>

                <CardBody className="p-6 space-y-4">
                  <div className="pr-8">
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

                  <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                    <a
                      href={`https://btcmap.org/merchant/${merchant.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-bitcoin hover:underline flex-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View on BTCMap</span>
                    </a>
                    <button
                      onClick={() => handleDeleteClick(merchant)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Merchant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && merchantToDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-400" />
                Delete Merchant
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 text-sm font-medium mb-2">⚠️ Warning: This action cannot be undone</p>
                <p className="text-gray-300 text-sm">
                  Are you sure you want to permanently delete <strong className="text-white">{merchantToDelete.businessName}</strong>?
                  This will remove it from your database but NOT from BTCMap.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Business:</span>
                  <span className="text-white font-medium">{merchantToDelete.businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white">{merchantToDelete.categoryValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Published:</span>
                  <span className="text-white">{format(new Date(merchantToDelete.publishedAt), 'MMM d, yyyy')}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setMerchantToDelete(null);
                  }}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleDeleteConfirm}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                  loading={isProcessing}
                  disabled={isProcessing}
                >
                  Delete Permanently
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
