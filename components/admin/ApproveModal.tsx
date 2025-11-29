/**
 * Approve Edit Request Modal
 *
 * Shown when admin clicks "Approve" button.
 * Sends confirmation email to merchant with token link.
 */

'use client';

import { useState } from 'react';
import { X, Mail, AlertCircle, Send } from 'lucide-react';

interface ApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  merchantEmail: string;
  businessName: string;
}

export default function ApproveModal({
  isOpen,
  onClose,
  onConfirm,
  merchantEmail,
  businessName
}: ApproveModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await onConfirm();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to approve edit request');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-bitcoin/20 to-bitcoin/10 border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-bitcoin" />
            Approve Edit Request
          </h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-sm text-gray-300 font-body mb-3">
              This will send a confirmation email to:
            </p>
            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-3">
              <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span className="text-blue-300 font-medium font-body">{merchantEmail}</span>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-300 font-body font-semibold mb-2">
                  Two-Step Approval Process
                </p>
                <ul className="text-sm text-yellow-200/90 font-body space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-bitcoin font-bold">1.</span>
                    <span>Merchant receives email with confirmation link</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bitcoin font-bold">2.</span>
                    <span>Merchant must click link to verify changes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-bitcoin font-bold">3.</span>
                    <span>You'll then be able to apply the changes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-sm text-gray-400 font-body">
              <strong className="text-white">Business:</strong> {businessName}
            </p>
            <p className="text-sm text-gray-400 font-body mt-2">
              <strong className="text-white">Confirmation link expires:</strong> 7 days
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-sm text-red-300 font-body">{error}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white/5 border-t border-white/10 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg font-semibold font-heading text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg font-semibold font-heading bg-gradient-to-r from-bitcoin to-orange-500 text-black hover:shadow-lg hover:shadow-bitcoin/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Confirmation Email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
