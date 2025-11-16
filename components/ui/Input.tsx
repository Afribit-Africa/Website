import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, icon, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-white">
            {label}
            {props.required && <span className="text-bitcoin ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-3 md:py-3 text-base md:text-sm bg-white/5 border-2 border-white/10 rounded-lg
              text-white placeholder-gray-500
              focus:outline-none focus:border-bitcoin focus:ring-2 focus:ring-bitcoin/30
              hover:border-white/20 hover:bg-white/8
              transition-all duration-200
              touch-manipulation min-h-[48px] md:min-h-[44px]
              ${icon ? 'pl-12' : ''}
              ${error ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/30' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {helper && !error && (
          <p className="text-xs text-gray-400 leading-relaxed">{helper}</p>
        )}
        {error && (
          <p className="text-xs text-red-400 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
