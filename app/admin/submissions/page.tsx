'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Zap,
  Bitcoin,
  Wifi,
} from 'lucide-react';
import { format } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';

interface Submission {
  id: string;
  businessName: string;
  categoryValue: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  phone?: string;
  website?: string;
  paymentOnchain: boolean;
  paymentLightning: boolean;
  paymentLightningContactless: boolean;
  contactName: string;
  contactEmail: string;
  status: string;
  submittedAt: string;
  isEarlyAdopter: boolean;
  adopterNumber?: number;
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'published' | 'rejected';

export default function SubmissionsPage() {
  const router = useRouter();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionNotes, setActionNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/submissions?status=${filter}`);
      const data = await response.json();

      if (data.success) {
        setSubmissions(data.submissions);
      } else {
        toast.error('Failed to load submissions');
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedSubmission) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/admin/submissions/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: selectedSubmission.id,
          notes: actionNotes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Submission approved successfully!');
        setShowApproveModal(false);
        setSelectedSubmission(null);
        setActionNotes('');
        fetchSubmissions();
      } else {
        toast.error(data.error || 'Failed to approve submission');
      }
    } catch (error) {
      console.error('Error approving:', error);
      toast.error('An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedSubmission || !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/admin/submissions/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: selectedSubmission.id,
          reason: rejectionReason,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Submission rejected. Email sent to merchant.');
        setShowRejectModal(false);
        setSelectedSubmission(null);
        setRejectionReason('');
        fetchSubmissions();
      } else {
        toast.error(data.error || 'Failed to reject submission');
      }
    } catch (error) {
      console.error('Error rejecting:', error);
      toast.error('An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredSubmissions = submissions.filter((sub) =>
    sub.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.contactName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: 'warning',
      approved: 'info',
      published: 'success',
      rejected: 'error',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">
          Merchant Submissions
        </h1>
        <p className="text-gray-400">
          Review and manage merchant registration submissions
        </p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by business name, email, or contact..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bitcoin"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              {['all', 'pending', 'approved', 'published', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setFilter(status as StatusFilter);
                    router.push(`/admin/submissions?status=${status}`);
                  }}
                  className={`
                    px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all
                    ${filter === status
                      ? 'bg-bitcoin text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardBody className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Business
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Payment Methods
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-white">
                            {submission.businessName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {submission.categoryValue}
                          </p>
                          {submission.isEarlyAdopter && (
                            <Badge variant="info" className="mt-1">
                              Early Adopter #{submission.adopterNumber}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-white">{submission.contactName}</p>
                          <p className="text-xs text-gray-400">{submission.contactEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {submission.paymentLightning && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                              <Zap className="w-3 h-3" />
                              <span>Lightning</span>
                            </div>
                          )}
                          {submission.paymentOnchain && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-bitcoin/20 text-bitcoin rounded text-xs">
                              <Bitcoin className="w-3 h-3" />
                              <span>On-chain</span>
                            </div>
                          )}
                          {submission.paymentLightningContactless && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                              <Wifi className="w-3 h-3" />
                              <span>NFC</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(submission.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(submission.submittedAt), 'MMM d, yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setShowDetailModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {submission.status === 'pending' && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedSubmission(submission);
                                  setShowApproveModal(true);
                                }}
                                className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedSubmission(submission);
                                  setShowRejectModal(true);
                                }}
                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Detail Modal */}
      {showDetailModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {selectedSubmission.businessName}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {selectedSubmission.categoryValue}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              {/* Description */}
              {selectedSubmission.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                  <p className="text-white">{selectedSubmission.description}</p>
                </div>
              )}

              {/* Location */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Location</h3>
                <div className="space-y-2">
                  {selectedSubmission.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-bitcoin mt-1" />
                      <span className="text-white">{selectedSubmission.address}</span>
                    </div>
                  )}
                  <p className="text-sm text-gray-400">
                    Coordinates: {selectedSubmission.latitude}, {selectedSubmission.longitude}
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-bitcoin" />
                    <span className="text-white">{selectedSubmission.contactEmail}</span>
                  </div>
                  {selectedSubmission.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-bitcoin" />
                      <span className="text-white">{selectedSubmission.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Payment Methods</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSubmission.paymentLightning && (
                    <Badge variant="warning">Lightning Network</Badge>
                  )}
                  {selectedSubmission.paymentOnchain && (
                    <Badge variant="info">On-chain Bitcoin</Badge>
                  )}
                  {selectedSubmission.paymentLightningContactless && (
                    <Badge variant="info">NFC/Contactless</Badge>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Status</h3>
                {getStatusBadge(selectedSubmission.status)}
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">Approve Submission</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <p className="text-gray-400">
                Approve <strong className="text-white">{selectedSubmission.businessName}</strong>?
                This will publish it to OpenStreetMap and BTCMap.
              </p>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="Add any notes about this approval..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bitcoin resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowApproveModal(false);
                    setSelectedSubmission(null);
                    setActionNotes('');
                  }}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleApprove}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                  loading={isProcessing}
                  disabled={isProcessing}
                >
                  Approve
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <h2 className="text-xl font-semibold text-white">Reject Submission</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <p className="text-gray-400">
                Reject <strong className="text-white">{selectedSubmission.businessName}</strong>?
                The merchant will receive an email with the reason and an edit link.
              </p>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Rejection Reason <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a clear reason for rejection..."
                  rows={4}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bitcoin resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedSubmission(null);
                    setRejectionReason('');
                  }}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleReject}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                  loading={isProcessing}
                  disabled={isProcessing}
                >
                  Reject
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
