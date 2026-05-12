import React, { useState, useCallback, useRef } from 'react';
import clsx from 'clsx';

export interface SearchBarProps {
  placeholder?: string;
  debounceMs?: number;
  onSearch: (query: string) => void;
  className?: string;
  isLoading?: boolean;
}

export function SearchBar({
  placeholder = 'Search articles...',
  debounceMs = 300,
  onSearch,
  className,
  isLoading = false,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        onSearch(value);
      }, debounceMs);
    },
    [onSearch, debounceMs]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      onSearch(query);
    },
    [query, onSearch]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx('relative', className)}
      role="search"
    >
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className={clsx(
            'w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'placeholder:text-gray-400 transition-colors',
            isLoading && 'opacity-70'
          )}
          aria-label="Search articles"
          aria-controls="search-results"
          disabled={isLoading}
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        {isLoading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="w-5 h-5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </span>
        )}
      </div>
    </form>
  );
}

export default SearchBar;