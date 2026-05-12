import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

export interface Tag {
  id: string;
  name: string;
}

export interface TagInputProps {
  value: string[];
  onChange: (tagIds: string[]) => void;
  availableTags?: Tag[];
  onTagCreate?: (name: string) => Promise<string>;
  isDisabled?: boolean;
  className?: string;
}

export function TagInput({
  value,
  onChange,
  availableTags = [],
  onTagCreate,
  isDisabled = false,
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredTags = availableTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(tag.id)
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTag = (tagId: string, tagName: string) => {
    if (!value.includes(tagId)) {
      onChange([...value, tagId]);
    }
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeTag = (tagId: string) => {
    onChange(value.filter((id) => id !== tagId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && filteredTags[selectedIndex]) {
        addTag(filteredTags[selectedIndex].id, filteredTags[selectedIndex].name);
      } else if (inputValue.trim() && onTagCreate && filteredTags.length === 0) {
        onTagCreate(inputValue.trim()).then((newTagId) => {
          addTag(newTagId, inputValue.trim());
        });
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredTags.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const selectedTags = availableTags.filter((t) => value.includes(t.id));

  return (
    <div ref={containerRef} className={clsx('relative', className)}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Tags
      </label>
      
      <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed">
        {selectedTags.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-sm"
          >
            {tag.name}
            <button
              type="button"
              onClick={() => removeTag(tag.id)}
              className="hover:text-primary-900"
              disabled={isDisabled}
              aria-label={`Remove ${tag.name} tag`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? 'Add tags...' : ''}
          disabled={isDisabled}
          className="flex-1 min-w-[120px] bg-transparent focus:outline-none text-sm"
          aria-label="Tag input"
          aria-describedby="tag-help"
        />
      </div>

      {showSuggestions && filteredTags.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredTags.map((tag, index) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => addTag(tag.id, tag.name)}
              className={clsx(
                'w-full px-3 py-2 text-left text-sm hover:bg-gray-50',
                index === selectedIndex && 'bg-gray-100'
              )}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}

      <p id="tag-help" className="mt-1 text-xs text-gray-400">
        Type to search or create new tags. Press Enter to add.
      </p>
    </div>
  );
}

export default TagInput;