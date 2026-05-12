import React from 'react';
import clsx from 'clsx';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'main';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
}

const maxWidthClasses = {
  sm: 'max-w-xl',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  '2xl': 'max-w-7xl',
  full: 'max-w-full',
};

const paddingClasses = 'px-4 sm:px-6 lg:px-8';

export function ResponsiveContainer({
  children,
  className,
  as: Component = 'div',
  maxWidth = 'xl',
  padding = true,
}: ResponsiveContainerProps) {
  return (
    <Component
      className={clsx(
        'w-full mx-auto',
        maxWidthClasses[maxWidth],
        padding && paddingClasses,
        className
      )}
    >
      {children}
    </Component>
  );
}

interface GridProps {
  children: React.ReactNode;
  cols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
  className?: string;
}

export function ResponsiveGrid({ children, cols = {}, gap = 'gap-6', className }: GridProps) {
  const colClasses = [
    'grid',
    cols.sm ? `sm:grid-cols-${cols.sm}` : 'sm:grid-cols-1',
    cols.md ? `md:grid-cols-${cols.md}` : 'md:grid-cols-2',
    cols.lg ? `lg:grid-cols-${cols.lg}` : 'lg:grid-cols-3',
    cols.xl ? `xl:grid-cols-${cols.xl}` : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={clsx(colClasses, gap, className)}>{children}</div>;
}

interface BreakpointShowProps {
  children: React.ReactNode;
  showOn?: ('sm' | 'md' | 'lg' | 'xl')[];
  hideOn?: ('sm' | 'md' | 'lg' | 'xl')[];
  className?: string;
}

export function BreakpointShow({ children, showOn, hideOn, className }: BreakpointShowProps) {
  const showClasses = showOn?.map((bp) => `${bp}:flex`).join(' ') || '';
  const hideClasses = hideOn?.map((bp) => `${bp}:hidden`).join(' ') || '';

  return <div className={clsx(showClasses, hideClasses, className)}>{children}</div>;
}

export function MobileHide({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx('hidden sm:block', className)}>{children}</div>;
}

export function DesktopHide({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx('sm:hidden', className)}>{children}</div>;
}

export default ResponsiveContainer;