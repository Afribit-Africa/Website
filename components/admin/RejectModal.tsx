/**
 * Reject Edit Request Modal
 *
 * Shown when admin clicks "Reject" button.
 * Requires reason (min 20 characters) and sends rejection email to merchant.
 */

'use client';

import { useState } from 'react';
import { X, XCircle, AlertTriangle } from 'lucide-react';

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  businessName: string;
  merchantEmail: string;
}

export default function RejectModal({
  isOpen,
  onClose,
  onConfirm,
  businessName,
  merchantEmail
}: RejectModalProps) {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isReasonValid = reason.trim().length >= 20;
  const remainingChars = 20 - reason.trim().length;

  const handleConfirm = async () => {
    if (!isReasonValid) {
      setError('Rejection reason must be at least 20 characters');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onConfirm(reason.trim());
      setReason('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to reject edit request');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setReason('');
      setError(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500/20 to-red-500/10 border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            Reject Edit Request
          </h3>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-sm text-gray-300 font-body mb-2">
              <strong className="text-white">Business:</strong> {businessName}
            </p>
            <p className="text-sm text-gray-300 font-body">
              <strong className="text-white">Merchant Email:</strong> {merchantEmail}
            </p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-300 font-body font-semibold mb-1">
                  Rejection Reason Required
                </p>
                <p className="text-sm text-yellow-200/90 font-body">
                  The merchant will receive your reason in an email. Be clear and helpful so they can submit a corrected request.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="rejection-reason" className="block text-sm font-semibold text-white font-heading mb-2">
              Reason for Rejection <span className="text-red-400">*</span>
            </label>
            <textarea
              id="rejection-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Example: The GPS coordinates appear to be incorrect. Please verify your location using the map and try again. The provided address also needs to be more specific..."
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 font-body focus:outline-none focus:ring-2 focus:ring-bitcoin/50 focus:border-bitcoin/50 transition-all min-h-[120px] resize-y"
              disabled={isLoading}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-400 font-body">
                Minimum 20 characters
              </p>
              {!isReasonValid && reason.length > 0 && (
                <p className="text-xs text-red-400 font-body">
                  {remainingChars} more character{remainingChars !== 1 ? 's' : ''} needed
                </p>
              )}
              {isReasonValid && (
                <p className="text-xs text-green-400 font-body">
                  ✓ Valid
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-sm text-red-300 font-body">{error}</p>
            </div>
          )}

          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-sm text-gray-400 font-body">
              <strong className="text-white">What happens next:</strong>
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-gray-400 font-body">
              <li className="flex items-start gap-2">
                <span className="text-bitcoin">•</span>
                <span>Merchant receives email with your rejection reason</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-bitcoin">•</span>
                <span>Edit request status changes to "Rejected"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-bitcoin">•</span>
                <span>Merchant can submit a new corrected request</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white/5 border-t border-white/10 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg font-semibold font-heading text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || !isReasonValid}
            className="px-5 py-2.5 rounded-lg font-semibold font-heading bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Rejecting...
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                Reject Request
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
