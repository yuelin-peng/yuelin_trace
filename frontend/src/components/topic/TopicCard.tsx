import React from 'react';
import clsx from 'clsx';
import { Topic } from '../../generated/com/yuelin/topic/v1/topic';

export interface TopicCardProps {
  topic: Topic;
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}

export function TopicCard({ topic, onEdit, onDelete, className }: TopicCardProps) {
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className={clsx('bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{topic.name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">/{topic.slug}</span>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Created {formatDate(topic.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100 transition-colors"
            title="Edit topic"
            aria-label="Edit topic"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            title="Delete topic"
            aria-label="Delete topic"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TopicCard;