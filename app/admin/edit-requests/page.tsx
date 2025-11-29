'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type EditRequestStatus = 'pending' | 'approved' | 'merchant_confirmed' | 'applied' | 'rejected';

interface EditRequest {
  id: number;
  merchant_id: number;
  business_name: string;
  business_name_old: string | null;
  category: string;
  category_old: string | null;
  status: EditRequestStatus;
  submitted_at: string;
  submitter_name: string;
  submitter_email: string;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  merchant_confirmed: number;
  applied: number;
  rejected: number;
}

export default function EditRequestsDashboard() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<EditRequestStatus | 'all'>('all');
  const [editRequests, setEditRequests] = useState<EditRequest[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    approved: 0,
    merchant_confirmed: 0,
    applied: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Redirect if not admin
  useEffect(() => {
    if (sessionStatus === 'loading') return;
    if (sessionStatus === 'unauthenticated' || (session?.user as any)?.role !== 'admin') {
      router.push('/');
    }
  }, [session, sessionStatus, router]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/edit-requests/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    if ((session?.user as any)?.role === 'admin') {
      fetchStats();
    }
  }, [session]);

  // Fetch edit requests
  useEffect(() => {
    const fetchEditRequests = async () => {
      setLoading(true);
      try {
        const statusParam = activeTab === 'all' ? '' : `&status=${activeTab}`;
        const res = await fetch(`/api/admin/edit-requests?limit=100${statusParam}`);
        const data = await res.json();
        if (data.success && data.editRequests) {
          // Map API response to component interface
          const mapped = data.editRequests.map((req: any) => ({
            id: req.id,
            merchant_id: req.merchantId,
            business_name: req.businessName,
            business_name_old: req.businessNameOld,
            category: req.category,
            category_old: req.categoryOld,
            status: req.status,
            submitted_at: req.submittedAt,
            submitter_name: req.submitterName,
            submitter_email: req.submitterEmail
          }));
          setEditRequests(mapped);
        }
      } catch (error) {
        console.error('Failed to fetch edit requests:', error);
      } finally {
        setLoading(false);
      }
    };

    if ((session?.user as any)?.role === 'admin') {
      fetchEditRequests();
    }
  }, [session, activeTab]);

  // Filter by search query
  const filteredRequests = editRequests.filter((req) =>
    req.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.submitter_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.submitter_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: EditRequestStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'approved':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'merchant_confirmed':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'applied':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const formatStatus = (status: EditRequestStatus) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (sessionStatus === 'loading' || (session?.user as any)?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7931A]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#F7931A] mb-2">Edit Requests</h1>
          <p className="text-gray-400">Manage merchant business details update requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Total</div>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-yellow-500/10 backdrop-blur-md border border-yellow-500/30 rounded-lg p-4">
            <div className="text-yellow-300 text-sm mb-1">Pending</div>
            <div className="text-3xl font-bold text-yellow-300">{stats.pending}</div>
          </div>
          <div className="bg-blue-500/10 backdrop-blur-md border border-blue-500/30 rounded-lg p-4">
            <div className="text-blue-300 text-sm mb-1">Approved</div>
            <div className="text-3xl font-bold text-blue-300">{stats.approved}</div>
          </div>
          <div className="bg-green-500/10 backdrop-blur-md border border-green-500/30 rounded-lg p-4">
            <div className="text-green-300 text-sm mb-1">Confirmed</div>
            <div className="text-3xl font-bold text-green-300">{stats.merchant_confirmed}</div>
          </div>
          <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 rounded-lg p-4">
            <div className="text-emerald-300 text-sm mb-1">Applied</div>
            <div className="text-3xl font-bold text-emerald-300">{stats.applied}</div>
          </div>
          <div className="bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-lg p-4">
            <div className="text-red-300 text-sm mb-1">Rejected</div>
            <div className="text-3xl font-bold text-red-300">{stats.rejected}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {['all', 'pending', 'approved', 'merchant_confirmed', 'applied', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as any);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-[#F7931A] text-black'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {tab === 'all' ? 'All' : formatStatus(tab as EditRequestStatus)}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by business name, submitter name, or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#F7931A]/50"
          />
        </div>

        {/* Table */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F7931A]"></div>
            </div>
          ) : paginatedRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No edit requests found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Business Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Submitter
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {paginatedRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          #{request.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{request.business_name}</div>
                          {request.business_name_old && request.business_name !== request.business_name_old && (
                            <div className="text-xs text-gray-500 line-through">{request.business_name_old}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {request.category}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-white">{request.submitter_name}</div>
                          <div className="text-xs text-gray-500">{request.submitter_email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                            {formatStatus(request.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatDate(request.submitted_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            href={`/admin/edit-requests/${request.id}`}
                            className="text-[#F7931A] hover:text-[#F7931A]/80 font-medium"
                          >
                            View Details →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                  <div className="text-sm text-gray-400">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredRequests.length)} of {filteredRequests.length} results
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded ${
                            currentPage === page
                              ? 'bg-[#F7931A] text-black'
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
