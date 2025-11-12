"use client";

import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AlertProps {
  variant: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
}

export function Alert({ variant, title, message, onClose }: AlertProps) {
  const variants = {
    success: {
      bg: 'bg-green-500/10 border-green-500/30',
      icon: CheckCircle,
      iconColor: 'text-green-500',
    },
    error: {
      bg: 'bg-red-500/10 border-red-500/30',
      icon: XCircle,
      iconColor: 'text-red-500',
    },
    warning: {
      bg: 'bg-yellow-500/10 border-yellow-500/30',
      icon: AlertCircle,
      iconColor: 'text-yellow-500',
    },
    info: {
      bg: 'bg-blue-500/10 border-blue-500/30',
      icon: Info,
      iconColor: 'text-blue-500',
    },
  };

  const { bg, icon: Icon, iconColor } = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${bg} border rounded-lg p-4 mb-4`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`${iconColor} shrink-0 mt-0.5`} size={20} />
        <div className="flex-1">
          {title && <h4 className="font-semibold text-white mb-1">{title}</h4>}
          <p className="text-sm text-gray-300">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close alert"
          >
            <XCircle size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

interface ToastProps extends AlertProps {
  isVisible: boolean;
  duration?: number;
}

export function Toast({ isVisible, duration = 5000, onClose, ...alertProps }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed top-4 right-4 z-50 max-w-md"
        >
          <Alert {...alertProps} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ErrorMessageProps {
  error?: string | null;
  className?: string;
}

export function ErrorMessage({ error, className = '' }: ErrorMessageProps) {
  if (!error) return null;

  return (
    <motion.p
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={`text-red-500 text-sm mt-1 ${className}`}
    >
      {error}
    </motion.p>
  );
}
