import React, { useState } from 'react';
import clsx from 'clsx';

export interface TopicFormProps {
  initialName?: string;
  onSubmit: (name: string) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

export function TopicForm({
  initialName = '',
  onSubmit,
  onCancel,
  isLoading = false,
  error,
  className,
}: TopicFormProps) {
  const [name, setName] = useState(initialName);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setValidationError('Topic name is required');
      return;
    }
    if (trimmedName.length < 2) {
      setValidationError('Topic name must be at least 2 characters');
      return;
    }
    if (trimmedName.length > 50) {
      setValidationError('Topic name must be less than 50 characters');
      return;
    }

    onSubmit(trimmedName);
  };

  return (
    <form onSubmit={handleSubmit} className={clsx('space-y-4', className)}>
      {(error || validationError) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
          {error || validationError}
        </div>
      )}

      <div>
        <label htmlFor="topicName" className="block text-sm font-medium text-gray-700 mb-1">
          Topic Name
        </label>
        <input
          type="text"
          id="topicName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Enter topic name..."
          disabled={isLoading}
          maxLength={50}
          autoFocus
        />
        <p className="mt-1 text-xs text-gray-500">
          {name.length}/50 characters
        </p>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || !name.trim()}
          className={clsx(
            'px-4 py-2 rounded-lg font-medium transition-colors',
            isLoading || !name.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          )}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

export default TopicForm;