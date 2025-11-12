"use client";

import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <Loader2 className={`${sizes[size]} animate-spin text-bitcoin ${className}`} />
  );
}

interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function LoadingButton({
  isLoading,
  children,
  className = '',
  disabled,
  onClick,
  type = 'button',
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`relative ${className} ${isLoading || disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner size="sm" />
        </span>
      )}
      <span className={isLoading ? 'invisible' : ''}>{children}</span>
    </button>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export function LoadingOverlay({ isLoading, message = 'Loading...' }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900 border border-bitcoin/20 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-xl">
        <Spinner size="lg" />
        <p className="text-white font-medium">{message}</p>
      </div>
    </div>
  );
}

interface LoadingDotsProps {
  className?: string;
}

export function LoadingDots({ className = '' }: LoadingDotsProps) {
  return (
    <div className={`flex gap-1 ${className}`}>
      <span className="w-2 h-2 bg-bitcoin rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-bitcoin rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-bitcoin rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}
