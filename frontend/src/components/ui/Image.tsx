import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  aspectRatio?: 'auto' | 'square' | 'video' | 'wide';
  objectFit?: 'cover' | 'contain' | 'fill';
  loading?: 'lazy' | 'eager';
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ 
    src, 
    alt, 
    className, 
    fallbackSrc = '/images/placeholder.svg',
    aspectRatio = 'auto',
    objectFit = 'cover',
    loading = 'lazy',
    ...props 
  }, ref) => {
    const aspectRatioStyles = {
      auto: '',
      square: 'aspect-square',
      video: 'aspect-video',
      wide: 'aspect-[21/9]',
    };

    const objectFitStyles = {
      cover: 'object-cover',
      contain: 'object-contain',
      fill: 'object-fill',
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      if (fallbackSrc && img.src !== fallbackSrc) {
        img.src = fallbackSrc;
      }
    };

    return (
      <div className={cn('overflow-hidden rounded-lg bg-gray-100', aspectRatioStyles[aspectRatio])}>
        <img
          ref={ref}
          src={src}
          alt={alt}
          loading={loading}
          onError={handleError}
          className={cn(
            'w-full h-full transition-opacity duration-300',
            objectFitStyles[objectFit],
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Image.displayName = 'Image';

export default Image;