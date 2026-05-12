import React from 'react';
import clsx from 'clsx';

export interface TagFilterProps {
  tags: { id: string; name: string; count?: number }[];
  selectedTags: string[];
  onChange: (tagIds: string[]) => void;
  className?: string;
}

export function TagFilter({ tags, selectedTags, onChange, className }: TagFilterProps) {
  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className={clsx('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Filter by Tags</h3>
        {selectedTags.length > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag.id);
          return (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className={clsx(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors',
                isSelected
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
              aria-pressed={isSelected}
            >
              <span>{tag.name}</span>
              {tag.count !== undefined && (
                <span className={clsx('text-xs', isSelected ? 'opacity-75' : 'text-gray-500')}>
                  ({tag.count})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TagFilter;