import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const Heading = forwardRef<HTMLHeadingElement, TypographyProps & { level?: 1 | 2 | 3 | 4 | 5 | 6 }>(
  ({ children, className, level = 1, as, ...props }, ref) => {
    const Component = as || (`h${level}` as keyof JSX.IntrinsicElements);
    
    const sizeStyles = {
      1: 'text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight',
      2: 'text-3xl sm:text-4xl font-bold tracking-tight',
      3: 'text-2xl sm:text-3xl font-semibold',
      4: 'text-xl sm:text-2xl font-semibold',
      5: 'text-lg sm:text-xl font-semibold',
      6: 'text-base sm:text-lg font-semibold',
    };

    return React.createElement(
      Component,
      {
        ref,
        className: cn(sizeStyles[level], 'text-gray-900 mb-4 mt-8 first:mt-0', className),
        ...props,
      },
      children
    );
  }
);
Heading.displayName = 'Heading';

export const Text = forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ children, className, as = 'p', ...props }, ref) => {
    return React.createElement(
      as,
      {
        ref,
        className: cn('text-base text-gray-700 leading-relaxed mb-4', className),
        ...props,
      },
      children
    );
  }
);
Text.displayName = 'Text';

export const Lead = forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-xl text-gray-600 leading-relaxed mb-6', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
Lead.displayName = 'Lead';

export const Small = forwardRef<HTMLSpanElement, TypographyProps>(
  ({ children, className, as = 'span', ...props }, ref) => {
    return React.createElement(
      as,
      {
        ref,
        className: cn('text-sm text-gray-500', className),
        ...props,
      },
      children
    );
  }
);
Small.displayName = 'Small';

export const Blockquote = forwardRef<HTMLQuoteElement, TypographyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <blockquote
        ref={ref}
        className={cn(
          'border-l-4 border-[#0284c7] pl-4 italic text-gray-700 my-6',
          className
        )}
        {...props}
      >
        {children}
      </blockquote>
    );
  }
);
Blockquote.displayName = 'Blockquote';

export const Divider = forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => {
    return (
      <hr
        ref={ref}
        className={cn('my-8 border-gray-200', className)}
        {...props}
      />
    );
  }
);
Divider.displayName = 'Divider';

export const Code = forwardRef<HTMLElement, TypographyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <code
        ref={ref}
        className={cn(
          'bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono',
          className
        )}
        {...props}
      >
        {children}
      </code>
    );
  }
);
Code.displayName = 'Code';

export const Pre = forwardRef<HTMLPreElement, TypographyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <pre
        ref={ref}
        className={cn(
          'bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6 text-sm',
          className
        )}
        {...props}
      >
        {children}
      </pre>
    );
  }
);
Pre.displayName = 'Pre';