// cn() utility - Conditional class merging with Tailwind
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines clsx and tailwind-merge for conditional class merging
 * Use this for all component className props
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate responsive class strings
 * Usage: responsive('text-sm', 'md:text-base', 'lg:text-lg')
 */
export function responsive(...classes: string[]) {
  return classes.join(' ');
}

/**
 * Conditionally apply classes based on breakpoint
 */
export function breakpoint(
  base: string,
  options: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  }
) {
  const classes = [base];
  if (options.sm) classes.push(`sm:${options.sm}`);
  if (options.md) classes.push(`md:${options.md}`);
  if (options.lg) classes.push(`lg:${options.lg}`);
  if (options.xl) classes.push(`xl:${options.xl}`);
  if (options['2xl']) classes.push(`2xl:${options['2xl']}`);
  return classes.join(' ');
}