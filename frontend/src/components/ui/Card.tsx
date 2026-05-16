import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated';
  isInteractive?: boolean;
  onClick?: () => void;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, variant = 'default', isInteractive, onClick, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion();
    
    const baseStyles = 'rounded-lg bg-white p-6';
    const variantStyles = {
      default: 'border border-gray-200',
      outlined: 'border-2 border-gray-300',
      elevated: 'shadow-lg',
    };
    
    const interactiveStyles = isInteractive ? 'cursor-pointer hover:shadow-xl transition-shadow' : '';
    
    const cardContent = (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], interactiveStyles, className)}
        onClick={onClick}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    );

    if (shouldReduceMotion || !isInteractive) {
      return cardContent;
    }

    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.2 }}
      >
        {cardContent}
      </motion.div>
    );
  }
);
Card.displayName = 'Card';

export default Card;