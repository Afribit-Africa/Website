'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Donor {
  id: number;
  invoice_id: string;
  name: string;
  email: string;
  amount: number;
  tier: string;
  donation_type: string;
  created_at: string;
}

interface DonorStats {
  total_donations: number;
  total_amount: number;
  named_donations: number;
  anonymous_donations: number;
}

export default function DonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [stats, setStats] = useState<DonorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'list' | 'stats'>('list');

  useEffect(() => {
    fetchDonors();
    fetchStats();
  }, []);

  const fetchDonors = async () => {
    try {
      const response = await fetch('/api/donors');
      const data = await response.json();
      if (data.success) {
        setDonors(data.donors);
      }
    } catch (error) {
      console.error('Failed to fetch donors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/donors?type=stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-bitcoin text-xl">Loading donors...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-display text-bitcoin mb-8"
        >
          Donor Management
        </motion.h1>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-6 py-3 rounded-lg font-heading transition-all ${
              activeTab === 'list'
                ? 'bg-bitcoin text-black'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            Donor List ({donors.length})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 rounded-lg font-heading transition-all ${
              activeTab === 'stats'
                ? 'bg-bitcoin text-black'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            Statistics
          </button>
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div className="bg-gray-900 border border-bitcoin/20 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Total Donations</div>
              <div className="text-3xl font-numbers text-bitcoin">
                {stats.total_donations}
              </div>
            </div>
            <div className="bg-gray-900 border border-bitcoin/20 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Total Amount</div>
              <div className="text-3xl font-numbers text-bitcoin">
                ${stats.total_amount.toFixed(2)}
              </div>
            </div>
            <div className="bg-gray-900 border border-bitcoin/20 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Named Donations</div>
              <div className="text-3xl font-numbers text-green-500">
                {stats.named_donations}
              </div>
            </div>
            <div className="bg-gray-900 border border-bitcoin/20 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-2">Anonymous</div>
              <div className="text-3xl font-numbers text-blue-500">
                {stats.anonymous_donations}
              </div>
            </div>
          </motion.div>
        )}

        {/* Donor List Tab */}
        {activeTab === 'list' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-900 border border-bitcoin/20 rounded-lg overflow-hidden"
          >
            {donors.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                No named donors yet. Anonymous donations are not shown here.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-heading uppercase tracking-wider text-gray-400">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-heading uppercase tracking-wider text-gray-400">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-heading uppercase tracking-wider text-gray-400">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-heading uppercase tracking-wider text-gray-400">
                        Tier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-heading uppercase tracking-wider text-gray-400">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {donors.map((donor) => (
                      <tr key={donor.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {donor.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {donor.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-bitcoin font-numbers">
                          ${donor.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <span className="px-2 py-1 bg-bitcoin/20 text-bitcoin rounded-full text-xs uppercase">
                            {donor.tier}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatDate(donor.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* Export Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => {
              const csv = [
                ['Name', 'Email', 'Amount', 'Tier', 'Date'],
                ...donors.map((d) => [
                  d.name,
                  d.email,
                  d.amount,
                  d.tier,
                  formatDate(d.created_at),
                ]),
              ]
                .map((row) => row.join(','))
                .join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `donors-${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
            }}
            className="px-6 py-3 bg-bitcoin text-black rounded-lg font-heading hover:bg-bitcoin/90 transition-colors"
          >
            Export to CSV
          </button>
        </div>
      </div>
    </div>
  );
}
