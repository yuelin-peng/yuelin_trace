import React from 'react';
import { cn } from '@/lib/utils';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { ReadingProgress } from '@/components/ui/ReadingProgress';
import { SkipLink } from '@/components/ui/SkipLink';

export interface ContentPageProps {
  children: React.ReactNode;
  className?: string;
  showReadingProgress?: boolean;
  maxWidth?: 'narrow' | 'default' | 'wide';
}

export const ContentPage: React.FC<ContentPageProps> = ({
  children,
  className,
  showReadingProgress = true,
  maxWidth = 'default',
}) => {
  const maxWidthStyles = {
    narrow: 'max-w-2xl',
    default: 'max-w-4xl',
    wide: 'max-w-6xl',
  };

  return (
    <div className="min-h-screen bg-white">
      <SkipLink />
      {showReadingProgress && <ReadingProgress />}
      <Navigation />
      
      <main id="main-content" className={cn('pt-16', className)} tabIndex={-1}>
        <article className={cn('mx-auto px-4 sm:px-6 lg:px-8 py-12', maxWidthStyles[maxWidth])}>
          {children}
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContentPage;