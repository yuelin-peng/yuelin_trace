import React, { useState } from 'react';
import clsx from 'clsx';
import CommentForm from './CommentForm';

export interface CommentComposerProps {
  parentId?: string;
  parentAuthor?: string;
  onSubmit: (content: string, parentId?: string) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function CommentComposer({
  parentId,
  parentAuthor,
  onSubmit,
  onCancel,
  isLoading = false,
  className,
}: CommentComposerProps) {
  const [content, setContent] = useState('');

  const handleSubmit = (text: string) => {
    onSubmit(text, parentId);
    setContent('');
  };

  return (
    <div className={clsx('bg-gray-50 rounded-lg p-4', className)}>
      {parentAuthor && (
        <p className="text-sm text-gray-500 mb-2">
          Replying to <span className="font-medium text-gray-700">{parentAuthor}</span>
        </p>
      )}
      <CommentForm
        onSubmit={handleSubmit}
        placeholder={parentId ? 'Write a reply...' : 'Write a comment...'}
        isLoading={isLoading}
      />
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="mt-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  );
}

export default CommentComposer;