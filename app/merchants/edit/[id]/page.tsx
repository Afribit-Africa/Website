'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import dynamicImport from 'next/dynamic';
import { AlertCircle, CheckCircle, Loader2, Save, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

// Dynamically import map
const LocationMap = dynamicImport(() => import('@/components/LocationMap'), { ssr: false });

const BUSINESS_TYPES = [
  { value: '', label: 'Select business type...' },
  { value: 'restaurant', label: 'Restaurant / Cafe' },
  { value: 'bar', label: 'Bar / Pub' },
  { value: 'shop', label: 'Retail Shop' },
  { value: 'convenience', label: 'Convenience Store' },
  { value: 'hotel', label: 'Hotel / Accommodation' },
  { value: 'salon', label: 'Salon / Barbershop' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'electronics', label: 'Electronics Store' },
  { value: 'clothing', label: 'Clothing Store' },
  { value: 'service', label: 'Service Provider' },
  { value: 'other', label: 'Other Business' },
];

function EditSubmissionContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const submissionId = params.id as string;
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submission, setSubmission] = useState<any>(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid edit link. Please use the link from your confirmation page.');
      setIsLoading(false);
      return;
    }

    fetchSubmission();
  }, [submissionId, token]);

  const fetchSubmission = async () => {
    try {
      const response = await fetch(`/api/merchants/edit/${submissionId}?token=${token}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load submission');
      }

      setSubmission(data.submission);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load submission');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch(`/api/merchants/edit/${submissionId}?token=${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: submission.business_name,
          categoryValue: submission.category_value,
          description: submission.description,
          latitude: submission.latitude,
          longitude: submission.longitude,
          address: submission.address,
          phone: submission.phone,
          website: submission.website,
          paymentOnchain: submission.payment_onchain,
          paymentLightning: submission.payment_lightning,
          paymentLightningContactless: submission.payment_lightning_contactless,
          contactName: submission.contact_name,
          contactEmail: submission.contact_email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update submission');
      }

      setSuccess(true);
      toast.success('Submission updated successfully!');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update submission');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setSubmission((prev: any) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-bitcoin animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading submission...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
        <div className="max-w-md w-full glass-card p-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-white mb-2">
            Unable to Load Submission
          </h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link href="/">
            <Button variant="secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'approved': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const canEdit = submission.status === 'pending' || submission.status === 'rejected';

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12 md:py-20 px-4">
      <Toaster position="top-center" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                Edit Your <span className="text-gradient">Submission</span>
              </h1>
              <p className="text-gray-400">
                Update your business information below
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium border-2 ${getStatusColor(submission.status)} w-fit`}>
              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {!canEdit && (
          <div className="glass-card p-6 mb-6 border-2 border-blue-500/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1">Submission {submission.status === 'approved' ? 'Approved' : 'Published'}</h3>
                <p className="text-gray-400 text-sm">
                  {submission.status === 'approved'
                    ? 'Your submission has been approved and published. Changes are no longer allowed.'
                    : 'This submission is no longer editable.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {submission.status === 'rejected' && submission.rejection_reason && (
          <div className="glass-card p-6 mb-6 border-2 border-red-500/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1">Submission Rejected</h3>
                <p className="text-gray-400 text-sm mb-2">
                  Your submission was rejected for the following reason:
                </p>
                <p className="text-red-400 text-sm font-medium">
                  {submission.rejection_reason}
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Please address the issues and update your submission below.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Information */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-heading font-bold text-white mb-4">
              Business Information
            </h2>
            <div className="space-y-4">
              <Input
                label="Business Name"
                value={submission.business_name}
                onChange={(e) => updateField('business_name', e.target.value)}
                required
                disabled={!canEdit}
              />

              <Select
                label="Business Type"
                value={submission.category_value}
                onChange={(e) => updateField('category_value', e.target.value)}
                options={BUSINESS_TYPES}
                required
                disabled={!canEdit}
              />

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Description <span className="text-gray-500">(Optional)</span>
                </label>
                <textarea
                  value={submission.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={4}
                  disabled={!canEdit}
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bitcoin focus:ring-2 focus:ring-bitcoin/30 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-heading font-bold text-white mb-4">
              Location
            </h2>
            <div className="space-y-4">
              <Input
                label="Address"
                value={submission.address}
                onChange={(e) => updateField('address', e.target.value)}
                required
                disabled={!canEdit}
              />

              {canEdit && (
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Select Location on Map
                  </label>
                  <div className="bg-white/5 border-2 border-white/10 rounded-lg overflow-hidden" style={{ height: '300px' }}>
                    <LocationMap
                      center={[submission.latitude, submission.longitude]}
                      onLocationSelect={(lat, lng) => {
                        updateField('latitude', lat);
                        updateField('longitude', lng);
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Latitude"
                  type="number"
                  step="0.000001"
                  value={submission.latitude}
                  onChange={(e) => updateField('latitude', parseFloat(e.target.value))}
                  required
                  disabled={!canEdit}
                />
                <Input
                  label="Longitude"
                  type="number"
                  step="0.000001"
                  value={submission.longitude}
                  onChange={(e) => updateField('longitude', parseFloat(e.target.value))}
                  required
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-heading font-bold text-white mb-4">
              Bitcoin Payment Methods
            </h2>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={submission.payment_lightning}
                  onChange={(e) => updateField('payment_lightning', e.target.checked)}
                  disabled={!canEdit}
                  className="mt-1 w-5 h-5 rounded border-2 border-white/20 bg-white/5 text-bitcoin focus:ring-2 focus:ring-bitcoin/30 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div>
                  <div className="text-white font-medium">Lightning Network</div>
                  <div className="text-sm text-gray-400">Instant, low-fee Bitcoin payments</div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={submission.payment_onchain}
                  onChange={(e) => updateField('payment_onchain', e.target.checked)}
                  disabled={!canEdit}
                  className="mt-1 w-5 h-5 rounded border-2 border-white/20 bg-white/5 text-bitcoin focus:ring-2 focus:ring-bitcoin/30 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div>
                  <div className="text-white font-medium">On-Chain Bitcoin</div>
                  <div className="text-sm text-gray-400">Traditional Bitcoin blockchain transactions</div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={submission.payment_lightning_contactless}
                  onChange={(e) => updateField('payment_lightning_contactless', e.target.checked)}
                  disabled={!canEdit}
                  className="mt-1 w-5 h-5 rounded border-2 border-white/20 bg-white/5 text-bitcoin focus:ring-2 focus:ring-bitcoin/30 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div>
                  <div className="text-white font-medium">NFC / Contactless</div>
                  <div className="text-sm text-gray-400">Tap-to-pay with Bitcoin cards or devices</div>
                </div>
              </label>
            </div>
          </div>

          {/* Contact Details */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-heading font-bold text-white mb-4">
              Contact Details
            </h2>
            <div className="space-y-4">
              <Input
                label="Phone Number"
                type="tel"
                value={submission.phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
                disabled={!canEdit}
              />

              <Input
                label="Website"
                type="url"
                value={submission.website || ''}
                onChange={(e) => updateField('website', e.target.value)}
                disabled={!canEdit}
              />

              <Input
                label="Your Name"
                value={submission.contact_name}
                onChange={(e) => updateField('contact_name', e.target.value)}
                required
                disabled={!canEdit}
              />

              <Input
                label="Your Email"
                type="email"
                value={submission.contact_email}
                onChange={(e) => updateField('contact_email', e.target.value)}
                required
                disabled={!canEdit}
              />
            </div>
          </div>

          {/* Actions */}
          {canEdit && (
            <div className="flex gap-4">
              <Button
                type="submit"
                variant="primary"
                disabled={isSaving}
                loading={isSaving}
                icon={<Save className="w-5 h-5" />}
                className="flex-1"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Link href="/" className="flex-1">
                <Button variant="secondary" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          )}

          {success && (
            <div className="glass-card p-4 border-2 border-green-500/30">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-green-400 font-medium">Changes saved successfully!</p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default function EditSubmissionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-bitcoin animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <EditSubmissionContent />
    </Suspense>
  );
}
