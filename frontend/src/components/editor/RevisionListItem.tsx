import React from 'react';
import clsx from 'clsx';
import { RevisionWithPreview } from '../../services/revision-service';

export interface RevisionListItemProps {
  revision: RevisionWithPreview;
  isSelected: boolean;
  onSelect: () => void;
  onRestore: () => void;
  className?: string;
}

export function RevisionListItem({
  revision,
  isSelected,
  onSelect,
  onRestore,
  className,
}: RevisionListItemProps) {
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getRelativeTime = (date: Date | undefined) => {
    if (!date) return '';
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(date);
  };

  return (
    <div
      className={clsx(
        'p-3 hover:bg-gray-50 transition-colors cursor-pointer',
        isSelected && 'bg-primary-50 border-l-4 border-primary-600',
        className
      )}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">#{revision.id.slice(-6)}</span>
            <span className="text-xs text-gray-500">{getRelativeTime(revision.createdAt)}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {revision.preview || 'No preview available'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            by {revision.authorId || 'Unknown'}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRestore();
            }}
            className="p-1.5 text-gray-400 hover:text-primary-600 rounded transition-colors"
            title="Restore this revision"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          {isSelected && (
            <span className="w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default RevisionListItem;