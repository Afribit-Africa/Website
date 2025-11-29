/**
 * Apply Changes Modal
 *
 * Shown when admin is ready to apply merchant-confirmed changes.
 * Final step: updates database, publishes to OSM, sends notification email.
 */

'use client';

import { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Database, MapPin } from 'lucide-react';

interface ApplyChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  businessName: string;
  hasOsmNode: boolean;
  changesCount: number;
}

export default function ApplyChangesModal({
  isOpen,
  onClose,
  onConfirm,
  businessName,
  hasOsmNode,
  changesCount
}: ApplyChangesModalProps) {
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
      setError(err.message || 'Failed to apply changes');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500/20 to-green-500/10 border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            Apply Confirmed Changes
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
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-green-300 font-body font-semibold mb-1">
                  Merchant Has Confirmed
                </p>
                <p className="text-sm text-green-200/90 font-body">
                  The merchant has verified these changes are correct by clicking the confirmation link.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-white font-heading mb-3">This action will:</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-3 text-sm text-gray-300 font-body">
                <Database className="w-4 h-4 text-bitcoin flex-shrink-0 mt-0.5" />
                <span>Update <strong className="text-white">{changesCount}</strong> field{changesCount !== 1 ? 's' : ''} in merchant database</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-300 font-body">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Mark <strong className="text-white">{businessName}</strong> as early adopter confirmed</span>
              </li>
              {hasOsmNode && (
                <li className="flex items-start gap-3 text-sm text-gray-300 font-body">
                  <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Publish updates to OpenStreetMap</span>
                </li>
              )}
              <li className="flex items-start gap-3 text-sm text-gray-300 font-body">
                <svg className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Send confirmation email to merchant</span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-300 font-body font-semibold mb-1">
                  Permanent Action
                </p>
                <p className="text-sm text-yellow-200/90 font-body">
                  Once applied, these changes will be live on Bitcoin Maps. Make sure you've reviewed all information carefully.
                </p>
              </div>
            </div>
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
            className="px-5 py-2.5 rounded-lg font-semibold font-heading bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Applying Changes...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Apply Changes Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
