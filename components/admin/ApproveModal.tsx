/**
 * Approve Edit Request Modal
 *
 * Shown when admin clicks "Approve" button.
 * Sends confirmation email to merchant with token link.
 */

'use client';

import { Mail, AlertCircle, Send } from 'lucide-react';
import BaseAdminModal from './BaseAdminModal';

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
  return (
    <BaseAdminModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Approve Edit Request"
      icon={Mail}
      colorTheme="bitcoin"
      confirmText="Send Confirmation Email"
      confirmIcon={Send}
      loadingText="Sending..."
    >
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
    </BaseAdminModal>
  );
}
