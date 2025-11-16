import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon, loading, children, className = '', disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 touch-manipulation';

    const variants = {
      primary: 'bg-bitcoin hover:bg-bitcoin-dark text-white shadow-lg shadow-bitcoin/20 hover:shadow-bitcoin/30 font-semibold',
      secondary: 'bg-white/10 hover:bg-white/15 text-white border-2 border-white/20 hover:border-white/30 hover:shadow-lg',
      ghost: 'bg-transparent hover:bg-white/10 text-white hover:text-white border-2 border-transparent hover:border-white/10',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm min-h-[40px] md:min-h-[36px]',
      md: 'px-6 py-3 text-base min-h-[48px] md:min-h-[44px]',
      lg: 'px-8 py-4 text-lg min-h-[56px] md:min-h-[52px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Processing...</span>
          </>
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
