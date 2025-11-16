import React from 'react';
import { X, AlertCircle } from 'lucide-react';
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
  title = 'Error',
  message,
}) => {
  if (!isOpen) return null;

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
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mb-4">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-heading font-bold text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-300 mb-6 leading-relaxed">
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
