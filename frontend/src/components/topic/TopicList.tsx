import React from 'react';
import clsx from 'clsx';
import { Topic } from '../../generated/com/yuelin/topic/v1/topic';
import TopicCard from './TopicCard';

export interface TopicListProps {
  topics: Topic[];
  isLoading?: boolean;
  onEdit: (topic: Topic) => void;
  onDelete: (topic: Topic) => void;
  className?: string;
}

export function TopicList({ topics, isLoading, onEdit, onDelete, className }: TopicListProps) {
  if (isLoading) {
    return (
      <div className={clsx('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 rounded-lg h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className={clsx('text-center py-12', className)}>
        <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <p className="mt-4 text-gray-500">No topics found</p>
        <p className="text-sm text-gray-400">Create your first topic to get started</p>
      </div>
    );
  }

  return (
    <div className={clsx('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}>
      {topics.map((topic) => (
        <TopicCard
          key={topic.id}
          topic={topic}
          onEdit={() => onEdit(topic)}
          onDelete={() => onDelete(topic)}
        />
      ))}
    </div>
  );
}

export default TopicList;