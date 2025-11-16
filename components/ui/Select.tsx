import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helper?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helper, options, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-white">
            {label}
            {props.required && <span className="text-bitcoin ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full px-4 py-3 md:py-3 text-base md:text-sm bg-white/5 border-2 border-white/10 rounded-lg
              text-white appearance-none cursor-pointer
              focus:outline-none focus:border-bitcoin focus:ring-2 focus:ring-bitcoin/30
              hover:border-white/20 hover:bg-white/8
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              touch-manipulation min-h-[48px] md:min-h-[44px]
              ${error ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/30' : ''}
              ${className}
            `}
            {...props}
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-[#1a1a1a] text-white py-3 hover:bg-white/10"
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDown className="w-5 h-5 text-white/70" />
          </div>
        </div>
        {helper && !error && (
          <p className="text-xs text-gray-400 leading-relaxed">{helper}</p>
        )}
        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
