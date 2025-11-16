import React from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, icon, className = '', ...props }, ref) => {
    return (
      <label className="flex items-start gap-4 p-5 md:p-6 bg-white/5 border-2 border-white/10 rounded-xl cursor-pointer hover:bg-white/10 hover:border-bitcoin/50 transition-all duration-300 group active:scale-[0.98] touch-manipulation min-h-[80px] md:min-h-[72px]">
        <input
          ref={ref}
          type="checkbox"
          className="
            mt-1.5 w-6 h-6 md:w-5 md:h-5 rounded border-2 border-white/30 bg-white/5
            text-bitcoin focus:ring-2 focus:ring-bitcoin/50 focus:ring-offset-0 focus:border-bitcoin
            cursor-pointer transition-all checked:border-bitcoin checked:bg-bitcoin
            hover:border-bitcoin/70
          "
          {...props}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            {icon && <span className="text-bitcoin group-hover:scale-110 transition-transform flex-shrink-0">{icon}</span>}
            <span className="text-white font-medium text-base md:text-sm group-hover:text-bitcoin transition-colors">{label}</span>
          </div>
          {description && (
            <p className="text-sm md:text-xs text-gray-400 mt-2 leading-relaxed">{description}</p>
          )}
        </div>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
