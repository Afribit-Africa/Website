/**
 * Base Admin Modal Component
 *
 * Reusable modal wrapper for all admin actions (approve, reject, apply changes).
 * Provides consistent layout, styling, and behavior across admin modals.
 */

'use client';

import { useState, ReactNode } from 'react';
import { X, LucideIcon } from 'lucide-react';

export interface BaseAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (...args: any[]) => Promise<void>;
  title: string;
  icon: LucideIcon;
  colorTheme: 'bitcoin' | 'green' | 'red';
  confirmText: string;
  confirmIcon?: LucideIcon;
  loadingText?: string;
  children: ReactNode | ((context: ModalContext) => ReactNode);
  disableConfirm?: boolean;
  customConfirmHandler?: (...args: any[]) => Promise<void>;
}

interface ModalContext {
  error: string | null;
  setError: (error: string | null) => void;
  isLoading: boolean;
  handleConfirm: (...args: any[]) => Promise<void>;
}

const themeConfig = {
  bitcoin: {
    header: 'bg-gradient-to-r from-bitcoin/20 to-bitcoin/10',
    icon: 'text-bitcoin',
    button: 'bg-gradient-to-r from-bitcoin to-orange-500 text-black hover:shadow-bitcoin/30',
    spinner: 'border-black/30 border-t-black',
  },
  green: {
    header: 'bg-gradient-to-r from-green-500/20 to-green-500/10',
    icon: 'text-green-400',
    button: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-green-500/30',
    spinner: 'border-white/30 border-t-white',
  },
  red: {
    header: 'bg-gradient-to-r from-red-500/20 to-red-500/10',
    icon: 'text-red-400',
    button: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-red-500/30',
    spinner: 'border-white/30 border-t-white',
  },
};

export default function BaseAdminModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  icon: Icon,
  colorTheme,
  confirmText,
  confirmIcon: ConfirmIcon,
  loadingText = 'Processing...',
  children,
  disableConfirm = false,
  customConfirmHandler,
}: BaseAdminModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const theme = themeConfig[colorTheme];

  const handleConfirm = async (...args: any[]) => {
    if (customConfirmHandler) {
      return customConfirmHandler(...args);
    }

    setIsLoading(true);
    setError(null);

    try {
      await onConfirm(...args);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setError(null);
      onClose();
    }
  };

  const modalContext: ModalContext = {
    error,
    setError,
    isLoading,
    handleConfirm,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className={`${theme.header} border-b border-white/10 px-6 py-4 flex items-center justify-between`}>
          <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2">
            <Icon className={`w-5 h-5 ${theme.icon}`} />
            {title}
          </h3>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {typeof children === 'function' ? children(modalContext) : children}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-sm text-red-300 font-body">{error}</p>
            </div>
          )}
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
            onClick={() => handleConfirm()}
            disabled={isLoading || disableConfirm}
            className={`px-5 py-2.5 rounded-lg font-semibold font-heading ${theme.button} hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
          >
            {isLoading ? (
              <>
                <div className={`w-4 h-4 border-2 ${theme.spinner} rounded-full animate-spin`} />
                {loadingText}
              </>
            ) : (
              <>
                {ConfirmIcon && <ConfirmIcon className="w-4 h-4" />}
                {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to manage modal state and error handling
 */
export function useAdminModal() {
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  return { error, setError, clearError };
}
