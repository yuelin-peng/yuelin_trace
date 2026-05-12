import React from 'react';
import clsx from 'clsx';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = clsx(
    'bg-gray-200',
    animation === 'pulse' && 'animate-pulse',
    animation === 'wave' && 'animate-shimmer',
    variant === 'circular' && 'rounded-full',
    variant === 'text' && 'rounded',
    variant === 'rectangular' && 'rounded-lg'
  );

  return (
    <div
      className={clsx(baseClasses, className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      role="status"
      aria-label="Loading..."
    />
  );
}

export function SkeletonArticleCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-3">
        <Skeleton variant="rectangular" width={60} height={24} />
        <Skeleton variant="rectangular" width={60} height={24} />
      </div>
      <Skeleton variant="text" width="80%" height={24} className="mb-2" />
      <Skeleton variant="text" width="100%" height={16} className="mb-1" />
      <Skeleton variant="text" width="60%" height={16} className="mb-4" />
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width={100} height={14} />
        <Skeleton variant="text" width={80} height={14} />
      </div>
    </div>
  );
}

export function SkeletonComment() {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="text" width={100} height={16} />
        <Skeleton variant="text" width={60} height={14} />
      </div>
      <Skeleton variant="text" width="90%" height={16} className="mb-1" />
      <Skeleton variant="text" width="70%" height={16} />
    </div>
  );
}

export function SkeletonSearchResult() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <Skeleton variant="text" width="60%" height={20} className="mb-2" />
      <Skeleton variant="text" width="100%" height={16} className="mb-1" />
      <Skeleton variant="text" width="80%" height={16} className="mb-3" />
      <div className="flex items-center justify-between">
        <Skeleton variant="rectangular" width={80} height={20} />
        <Skeleton variant="text" width={60} height={14} />
      </div>
    </div>
  );
}

export function SkeletonTopicCard() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton variant="text" width="60%" height={20} className="mb-2" />
          <Skeleton variant="rectangular" width={80} height={20} className="mb-2" />
          <Skeleton variant="text" width={100} height={12} />
        </div>
        <div className="flex gap-2">
          <Skeleton variant="rectangular" width={32} height={32} />
          <Skeleton variant="rectangular" width={32} height={32} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonArticleCard key={i} />
      ))}
    </div>
  );
}

export default Skeleton;