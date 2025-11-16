'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Plus, Edit, Trash2, MapPin, Bitcoin, Search, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

interface Merchant {
  id: string;
  business_name: string;
  category_value: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  payment_onchain: boolean;
  payment_lightning: boolean;
  payment_lightning_contactless: boolean;
  status: 'pending' | 'approved' | 'published' | 'rejected';
  submitted_at: string;
  osm_node_id?: string;
}

export default function MerchantManagementPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [filteredMerchants, setFilteredMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);

  useEffect(() => {
    fetchMerchants();
  }, []);

  useEffect(() => {
    filterMerchants();
  }, [merchants, searchQuery, statusFilter]);

  const fetchMerchants = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/merchants/list');
      const data = await response.json();

      if (data.success) {
        setMerchants(data.merchants);
      } else {
        toast.error('Failed to load merchants');
      }
    } catch (error) {
      toast.error('Error fetching merchants');
    } finally {
      setIsLoading(false);
    }
  };

  const filterMerchants = () => {
    let filtered = [...merchants];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(m =>
        m.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category_value.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(m => m.status === statusFilter);
    }

    setFilteredMerchants(filtered);
  };

  const handleDelete = async (id: string, businessName: string) => {
    if (!confirm(`Are you sure you want to delete "${businessName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/merchants/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Merchant deleted successfully');
        fetchMerchants();
      } else {
        toast.error(data.error || 'Failed to delete merchant');
      }
    } catch (error) {
      toast.error('Error deleting merchant');
    }
  };

  const handleEdit = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setShowEditModal(true);
  };

  const handleView = (merchant: Merchant) => {
    // Navigate to merchant detail page or show details modal
    window.open(`/merchants/${merchant.id}`, '_blank');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'published':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">
            Merchant Management
          </h1>
          <p className="text-gray-400">
            Manage all merchants in the database
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-5 h-5" />}
          onClick={() => setShowAddModal(true)}
        >
          Add Merchant
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">Total</p>
              <p className="text-2xl font-bold text-white">{merchants.length}</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">Published</p>
              <p className="text-2xl font-bold text-green-400">
                {merchants.filter(m => m.status === 'published').length}
              </p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">
                {merchants.filter(m => m.status === 'pending').length}
              </p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">Lightning</p>
              <p className="text-2xl font-bold text-bitcoin">
                {merchants.filter(m => m.payment_lightning).length}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search merchants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bitcoin"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-bitcoin"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="published">Published</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Merchants Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : filteredMerchants.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-gray-400">
              {searchQuery || statusFilter !== 'all'
                ? 'No merchants found matching your filters'
                : 'No merchants in the database yet'}
            </p>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="text-left p-4 text-gray-400 font-medium">Business Name</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Category</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Location</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Payment Methods</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMerchants.map((merchant) => (
                  <tr key={merchant.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4">
                      <p className="text-white font-medium">{merchant.business_name}</p>
                      {merchant.osm_node_id && (
                        <p className="text-xs text-gray-500">OSM: {merchant.osm_node_id}</p>
                      )}
                    </td>
                    <td className="p-4 text-gray-300">{merchant.category_value}</td>
                    <td className="p-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{merchant.address}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {merchant.payment_lightning && (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                            ⚡ Lightning
                          </span>
                        )}
                        {merchant.payment_onchain && (
                          <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded">
                            ₿ On-chain
                          </span>
                        )}
                        {merchant.payment_lightning_contactless && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                            NFC
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 border rounded text-xs font-medium ${getStatusBadgeColor(merchant.status)}`}>
                        {merchant.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(merchant)}
                          className="p-2 hover:bg-white/10 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleEdit(merchant)}
                          className="p-2 hover:bg-white/10 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(merchant.id, merchant.business_name)}
                          className="p-2 hover:bg-white/10 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TODO: Add modal for adding/editing merchants */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Add New Merchant</h2>
            <p className="text-gray-400 mb-4">Coming soon: Form to manually add merchants</p>
            <Button onClick={() => setShowAddModal(false)}>Close</Button>
          </div>
        </div>
      )}

      {showEditModal && selectedMerchant && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Edit Merchant</h2>
            <p className="text-gray-400 mb-4">Editing: {selectedMerchant.business_name}</p>
            <Button onClick={() => setShowEditModal(false)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}
