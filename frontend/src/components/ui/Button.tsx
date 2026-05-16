import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion();
    
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variantStyles = {
      primary: 'bg-[#0284c7] text-white hover:bg-[#0369a1] focus-visible:ring-[#0284c7]',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500 border border-gray-200',
      ghost: 'hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500',
      danger: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500',
    };
    
    const sizeStyles = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-11 px-6 text-lg',
    };
    
    const buttonContent = (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        disabled={props.disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );

    if (shouldReduceMotion) {
      return buttonContent;
    }

    return (
      <motion.div
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
      >
        {buttonContent}
      </motion.div>
    );
  }
);
Button.displayName = 'Button';

export default Button;