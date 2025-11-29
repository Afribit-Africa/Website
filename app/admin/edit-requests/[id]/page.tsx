'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ApproveModal from '@/components/admin/ApproveModal';
import ApplyChangesModal from '@/components/admin/ApplyChangesModal';
import RejectModal from '@/components/admin/RejectModal';

// Dynamic import for map component to avoid SSR issues
const MapWithMarkers = dynamic(() => import('@/components/admin/DualMapView'), {
  ssr: false,
  loading: () => <div className="h-96 bg-white/5 rounded-lg animate-pulse"></div>
});

type EditRequestStatus = 'pending' | 'approved' | 'merchant_confirmed' | 'applied' | 'rejected';

interface EditRequest {
  id: number;
  merchant_id: number;
  business_name: string;
  business_name_old: string | null;
  business_name_new: string | null;
  category: string;
  category_old: string | null;
  category_new: string | null;
  location_old: string | null;
  location_new: string | null;
  phone_old: string | null;
  phone_new: string | null;
  blink_address_old: string | null;
  blink_address_new: string | null;
  latitude_old: number | null;
  latitude_new: number | null;
  longitude_old: number | null;
  longitude_new: number | null;
  location_accuracy: number | null;
  osm_node_id: string | null;
  status: EditRequestStatus;
  submitted_at: string;
  submitter_name: string;
  submitter_email: string;
  admin_notes: string | null;
  reviewed_at: string | null;
  reviewed_by_name: string | null;
  merchant_confirmed_at: string | null;
  token_expires_at: string | null;
}

export default function EditRequestDetail() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const params = useParams();
  const requestId = params.id as string;

  const [editRequest, setEditRequest] = useState<EditRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (sessionStatus === 'loading') return;
    if (sessionStatus === 'unauthenticated' || (session?.user as any)?.role !== 'admin') {
      router.push('/');
    }
  }, [session, sessionStatus, router]);

  // Fetch edit request details
  useEffect(() => {
    const fetchEditRequest = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/edit-requests/${requestId}`);
        const data = await res.json();
        if (data.success && data.editRequest) {
          const req = data.editRequest;
          // Map API response to component interface
          const mapped: EditRequest = {
            id: req.id,
            merchant_id: req.merchantId,
            business_name: req.businessName.old || req.businessName.new,
            business_name_old: req.businessName.old,
            business_name_new: req.businessName.new,
            category: req.category.old || req.category.new,
            category_old: req.category.old,
            category_new: req.category.new,
            location_old: req.location.old.address,
            location_new: req.location.new.address,
            phone_old: req.phone.old,
            phone_new: req.phone.new,
            blink_address_old: req.blinkAddress.old,
            blink_address_new: req.blinkAddress.new,
            latitude_old: req.location.old.lat,
            latitude_new: req.location.new.lat,
            longitude_old: req.location.old.lng,
            longitude_new: req.location.new.lng,
            location_accuracy: req.locationAccuracy,
            osm_node_id: req.osmNodeId,
            status: req.status,
            submitted_at: req.submittedAt,
            submitter_name: req.submitter.name,
            submitter_email: req.submitter.email,
            admin_notes: req.adminNotes,
            reviewed_at: req.reviewedAt,
            reviewed_by_name: req.reviewedBy?.name,
            merchant_confirmed_at: req.merchantConfirmedAt,
            token_expires_at: req.tokenExpiresAt
          };
          setEditRequest(mapped);
        } else {
          alert('Failed to load edit request');
          router.push('/admin/edit-requests');
        }
      } catch (error) {
        console.error('Failed to fetch edit request:', error);
        alert('Failed to load edit request');
        router.push('/admin/edit-requests');
      } finally {
        setLoading(false);
      }
    };

    if ((session?.user as any)?.role === 'admin') {
      fetchEditRequest();
    }
  }, [session, requestId, router]);

  const handleApprove = async (adminNotes: string) => {
    if (!editRequest) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/edit-requests/${requestId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes })
      });

      const data = await res.json();
      if (data.success) {
        alert('✅ Approval email sent to merchant!');
        window.location.reload();
      } else {
        alert(`Failed to approve: ${data.error}`);
      }
    } catch (error) {
      console.error('Approval error:', error);
      alert('Failed to approve request');
    } finally {
      setActionLoading(false);
      setShowApproveModal(false);
    }
  };

  const handleApplyChanges = async () => {
    if (!editRequest) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/apply-changes/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();
      if (data.success) {
        alert('✅ Changes applied successfully!');
        window.location.reload();
      } else {
        alert(`Failed to apply changes: ${data.error}`);
      }
    } catch (error) {
      console.error('Apply changes error:', error);
      alert('Failed to apply changes');
    } finally {
      setActionLoading(false);
      setShowApplyModal(false);
    }
  };

  const handleReject = async (rejectionReason: string) => {
    if (!editRequest) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/edit-requests/${requestId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason })
      });

      const data = await res.json();
      if (data.success) {
        alert('✅ Request rejected and merchant notified');
        window.location.reload();
      } else {
        alert(`Failed to reject: ${data.error}`);
      }
    } catch (error) {
      console.error('Rejection error:', error);
      alert('Failed to reject request');
    } finally {
      setActionLoading(false);
      setShowRejectModal(false);
    }
  };

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
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  const countChanges = () => {
    if (!editRequest) return 0;
    let count = 0;
    if (editRequest.business_name_new && editRequest.business_name_new !== editRequest.business_name_old) count++;
    if (editRequest.category_new && editRequest.category_new !== editRequest.category_old) count++;
    if (editRequest.location_new && editRequest.location_new !== editRequest.location_old) count++;
    if (editRequest.phone_new && editRequest.phone_new !== editRequest.phone_old) count++;
    if (editRequest.blink_address_new && editRequest.blink_address_new !== editRequest.blink_address_old) count++;
    if (editRequest.latitude_new && editRequest.longitude_new &&
        (editRequest.latitude_new !== editRequest.latitude_old || editRequest.longitude_new !== editRequest.longitude_old)) count++;
    return count;
  };

  if (sessionStatus === 'loading' || loading || (session?.user as any)?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7931A]"></div>
      </div>
    );
  }

  if (!editRequest) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Edit request not found</div>
      </div>
    );
  }

  const distance = editRequest.latitude_old && editRequest.longitude_old &&
                   editRequest.latitude_new && editRequest.longitude_new
    ? calculateDistance(
        editRequest.latitude_old,
        editRequest.longitude_old,
        editRequest.latitude_new,
        editRequest.longitude_new
      )
    : null;

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/edit-requests"
            className="text-[#F7931A] hover:text-[#F7931A]/80 mb-4 inline-flex items-center gap-2"
          >
            ← Back to Edit Requests
          </Link>
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Edit Request #{editRequest.id}
              </h1>
              <p className="text-gray-400">{editRequest.business_name}</p>
            </div>
            <div>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(editRequest.status)}`}>
                {formatStatus(editRequest.status)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Changes Comparison Table */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-bold text-[#F7931A] mb-4">Proposed Changes</h2>
              <div className="space-y-4">
                {/* Business Name */}
                {editRequest.business_name_new && editRequest.business_name_new !== editRequest.business_name_old && (
                  <div className="border-b border-white/10 pb-4">
                    <div className="text-sm text-gray-400 mb-2">Business Name</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Current</div>
                        <div className="text-red-400 line-through">{editRequest.business_name_old || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">New</div>
                        <div className="text-green-400 font-medium">{editRequest.business_name_new}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Category */}
                {editRequest.category_new && editRequest.category_new !== editRequest.category_old && (
                  <div className="border-b border-white/10 pb-4">
                    <div className="text-sm text-gray-400 mb-2">Category</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Current</div>
                        <div className="text-red-400 line-through">{editRequest.category_old || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">New</div>
                        <div className="text-green-400 font-medium">{editRequest.category_new}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Location/Address */}
                {editRequest.location_new && editRequest.location_new !== editRequest.location_old && (
                  <div className="border-b border-white/10 pb-4">
                    <div className="text-sm text-gray-400 mb-2">Address</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Current</div>
                        <div className="text-red-400 line-through">{editRequest.location_old || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">New</div>
                        <div className="text-green-400 font-medium">{editRequest.location_new}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {editRequest.phone_new && editRequest.phone_new !== editRequest.phone_old && (
                  <div className="border-b border-white/10 pb-4">
                    <div className="text-sm text-gray-400 mb-2">Phone Number</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Current</div>
                        <div className="text-red-400 line-through">{editRequest.phone_old || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">New</div>
                        <div className="text-green-400 font-medium">{editRequest.phone_new}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Blink Address */}
                {editRequest.blink_address_new && editRequest.blink_address_new !== editRequest.blink_address_old && (
                  <div className="border-b border-white/10 pb-4">
                    <div className="text-sm text-gray-400 mb-2">Blink Address</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Current</div>
                        <div className="text-red-400 line-through break-all">{editRequest.blink_address_old || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">New</div>
                        <div className="text-green-400 font-medium break-all">{editRequest.blink_address_new}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* GPS Coordinates */}
                {editRequest.latitude_new && editRequest.longitude_new &&
                 (editRequest.latitude_new !== editRequest.latitude_old || editRequest.longitude_new !== editRequest.longitude_old) && (
                  <div className="pb-4">
                    <div className="text-sm text-gray-400 mb-2">GPS Coordinates</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Current</div>
                        <div className="text-red-400 line-through text-sm">
                          {editRequest.latitude_old?.toFixed(6)}, {editRequest.longitude_old?.toFixed(6)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">New</div>
                        <div className="text-green-400 font-medium text-sm">
                          {editRequest.latitude_new.toFixed(6)}, {editRequest.longitude_new.toFixed(6)}
                        </div>
                        {editRequest.location_accuracy && (
                          <div className="text-xs text-gray-500 mt-1">
                            Accuracy: ±{editRequest.location_accuracy.toFixed(0)}m
                          </div>
                        )}
                        {distance && (
                          <div className={`text-xs mt-1 ${distance > 100 ? 'text-yellow-400' : 'text-green-400'}`}>
                            Distance moved: {distance.toFixed(0)}m {distance > 100 && '⚠️'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Map View */}
            {editRequest.latitude_old && editRequest.longitude_old &&
             editRequest.latitude_new && editRequest.longitude_new && (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
                <h2 className="text-xl font-bold text-[#F7931A] mb-4">Location Changes</h2>
                <MapWithMarkers
                  oldLocation={{
                    lat: editRequest.latitude_old,
                    lng: editRequest.longitude_old
                  }}
                  newLocation={{
                    lat: editRequest.latitude_new,
                    lng: editRequest.longitude_new
                  }}
                  businessName={editRequest.business_name}
                />
              </div>
            )}
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Submitter Info */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Submitter Details</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Name</div>
                  <div className="text-white">{editRequest.submitter_name}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Email</div>
                  <div className="text-white text-sm break-all">{editRequest.submitter_email}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Submitted</div>
                  <div className="text-white">{formatDate(editRequest.submitted_at)}</div>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Status Timeline</h3>
              <div className="space-y-4">
                {/* Submitted */}
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div>
                    <div className="text-white font-medium">Submitted</div>
                    <div className="text-xs text-gray-500">{formatDate(editRequest.submitted_at)}</div>
                  </div>
                </div>

                {/* Reviewed */}
                {editRequest.reviewed_at && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                    <div>
                      <div className="text-white font-medium">
                        {editRequest.status === 'rejected' ? 'Rejected' : 'Reviewed'}
                      </div>
                      <div className="text-xs text-gray-500">{formatDate(editRequest.reviewed_at)}</div>
                      {editRequest.reviewed_by_name && (
                        <div className="text-xs text-gray-500">by {editRequest.reviewed_by_name}</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Merchant Confirmed */}
                {editRequest.merchant_confirmed_at && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <div>
                      <div className="text-white font-medium">Merchant Confirmed</div>
                      <div className="text-xs text-gray-500">{formatDate(editRequest.merchant_confirmed_at)}</div>
                    </div>
                  </div>
                )}

                {/* Applied */}
                {editRequest.status === 'applied' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
                    <div>
                      <div className="text-white font-medium">Changes Applied</div>
                      <div className="text-xs text-gray-500">Live on map</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Notes */}
            {editRequest.admin_notes && (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Admin Notes</h3>
                <div className="text-gray-300 text-sm whitespace-pre-wrap">{editRequest.admin_notes}</div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
              <div className="space-y-3">
                {editRequest.status === 'pending' && (
                  <>
                    <button
                      onClick={() => setShowApproveModal(true)}
                      disabled={actionLoading}
                      className="w-full bg-gradient-to-r from-[#F7931A] to-[#FFA500] text-black font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      ✓ Approve & Send Confirmation
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      disabled={actionLoading}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      ✗ Reject Request
                    </button>
                  </>
                )}

                {editRequest.status === 'approved' && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="text-blue-300 text-sm">
                      ⏳ Waiting for merchant to confirm via email link
                    </div>
                    {editRequest.token_expires_at && (
                      <div className="text-xs text-gray-500 mt-2">
                        Link expires: {formatDate(editRequest.token_expires_at)}
                      </div>
                    )}
                  </div>
                )}

                {editRequest.status === 'merchant_confirmed' && (
                  <button
                    onClick={() => setShowApplyModal(true)}
                    disabled={actionLoading}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    ✓ Apply Changes Now
                  </button>
                )}

                {editRequest.status === 'applied' && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                    <div className="text-emerald-300 text-sm font-medium mb-2">
                      ✓ Changes Applied Successfully
                    </div>
                    <div className="text-xs text-gray-400">
                      This edit request has been completed and the changes are live.
                    </div>
                  </div>
                )}

                {editRequest.status === 'rejected' && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div className="text-red-300 text-sm font-medium">
                      ✗ Request Rejected
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showApproveModal && (
        <ApproveModal
          isOpen={showApproveModal}
          onClose={() => setShowApproveModal(false)}
          merchantEmail={editRequest.submitter_email}
          businessName={editRequest.business_name}
          onConfirm={async () => {
            await handleApprove('');
          }}
        />
      )}

      {showApplyModal && (
        <ApplyChangesModal
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          businessName={editRequest.business_name}
          hasOsmNode={!!editRequest.osm_node_id}
          changesCount={countChanges()}
          onConfirm={handleApplyChanges}
        />
      )}

      {showRejectModal && (
        <RejectModal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          businessName={editRequest.business_name}
          merchantEmail={editRequest.submitter_email}
          onConfirm={handleReject}
        />
      )}
    </div>
  );
}
