/**
 * Reject Edit Request Modal
 *
 * Shown when admin clicks "Reject" button.
 * Requires reason (min 20 characters) and sends rejection email to merchant.
 */

'use client';

import { useState } from 'react';
import { XCircle, AlertTriangle } from 'lucide-react';
import BaseAdminModal from './BaseAdminModal';

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

  const isReasonValid = reason.trim().length >= 20;
  const remainingChars = 20 - reason.trim().length;

  const handleConfirmWithReason = async () => {
    await onConfirm(reason.trim());
    setReason(''); // Reset form after success
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <BaseAdminModal
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirmWithReason}
      title="Reject Edit Request"
      icon={XCircle}
      colorTheme="red"
      confirmText="Reject Request"
      confirmIcon={XCircle}
      loadingText="Rejecting..."
      disableConfirm={!isReasonValid}
    >
      {({ isLoading, setError }) => (
        <>
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
        </>
      )}
    </BaseAdminModal>
  );
}
