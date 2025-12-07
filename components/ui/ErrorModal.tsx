import React from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './Button';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
}) => {
  if (!isOpen) return null;

  // Detect if this is a success message
  const isSuccess = message.startsWith('✅');
  const defaultTitle = isSuccess ? 'Success' : 'Error';
  const displayTitle = title || defaultTitle;
  const iconBgColor = isSuccess ? 'bg-green-500/20' : 'bg-red-500/20';
  const iconColor = isSuccess ? 'text-green-500' : 'text-red-500';
  const Icon = isSuccess ? CheckCircle : AlertCircle;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-island-expand" onClick={onClose}>
      <div className="glass-card max-w-md w-full p-6 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${iconBgColor} mb-4`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>

        {/* Content */}
        <h3 className="text-xl font-heading font-bold text-white mb-2">
          {displayTitle}
        </h3>
        <p className="text-gray-300 mb-6 leading-relaxed whitespace-pre-line">
          {message}
        </p>

        {/* Action */}
        <Button
          variant="primary"
          onClick={onClose}
          className="w-full"
        >
          Okay, Got It
        </Button>
      </div>
    </div>
  );
};
