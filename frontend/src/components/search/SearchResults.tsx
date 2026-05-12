import React from 'react';
import clsx from 'clsx';
import { SearchResult } from '../../services/search-service';

export interface SearchResultsProps {
  results: SearchResult[];
  isLoading?: boolean;
  className?: string;
}

export function SearchResults({ results, isLoading, className }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className={clsx('py-8 text-center', className)} aria-live="polite" aria-busy="true">
        <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-500">Searching...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={clsx('py-8 text-center text-gray-500', className)} aria-live="polite">
        <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="mt-4">No results found</p>
        <p className="mt-2 text-sm text-gray-400">Try adjusting your search terms</p>
      </div>
    );
  }

  return (
    <div className={clsx('space-y-4', className)} id="search-results" aria-live="polite">
      {results.map((result, index) => (
        <article
          key={result.article.id || index}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            <a href={`/article/${result.article.id}`} className="hover:text-primary-600">
              {result.article.title || 'Untitled'}
            </a>
          </h3>
          {result.highlightedSnippet && (
            <p
              className="text-gray-600 text-sm mb-3 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: result.highlightedSnippet }}
            />
          )}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="flex items-center gap-2">
              {result.article.tagIds?.slice(0, 3).map((tagId) => (
                <span key={tagId} className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded text-xs">
                  {tagId}
                </span>
              ))}
            </span>
            <span className="text-xs opacity-60">
              Relevance: {Math.round(result.relevanceScore * 100)}%
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}

export default SearchResults;