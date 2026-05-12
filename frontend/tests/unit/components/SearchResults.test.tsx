import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchResults } from '../../../src/components/search/SearchResults';
import { SearchResult } from '../../../src/services/search-service';
import { createMockArticle } from '../../__mocks__/mockArticle';

describe('SearchResults', () => {
  const createSearchResult = (overrides: Partial<SearchResult> = {}): SearchResult => ({
    article: createMockArticle(),
    relevanceScore: 0.9,
    highlightedSnippet: 'Test highlighted content',
    ...overrides,
  });

  it('should render loading state', () => {
    render(<SearchResults results={[]} isLoading />);
    
    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('should render empty state when no results', () => {
    render(<SearchResults results={[]} isLoading={false} />);
    
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('should render search results', () => {
    const results = [
      createSearchResult({ article: createMockArticle({ id: '1', title: 'First Result' }) }),
      createSearchResult({ article: createMockArticle({ id: '2', title: 'Second Result' }) }),
    ];

    render(<SearchResults results={results} isLoading={false} />);
    
    expect(screen.getByText('First Result')).toBeInTheDocument();
    expect(screen.getByText('Second Result')).toBeInTheDocument();
  });

  it('should render highlighted snippets', () => {
    const results = [
      createSearchResult({ highlightedSnippet: '<mark>React</mark> hooks tutorial' }),
    ];

    render(<SearchResults results={results} isLoading={false} />);
    
    const container = document.querySelector('#search-results');
    expect(container?.innerHTML).toContain('<mark>React</mark>');
  });

  it('should show relevance score', () => {
    const results = [
      createSearchResult({ relevanceScore: 0.95 }),
    ];

    render(<SearchResults results={results} isLoading={false} />);
    
    expect(screen.getByText('Relevance: 95%')).toBeInTheDocument();
  });

  it('should render tags', () => {
    const results = [
      createSearchResult({
        article: createMockArticle({ tagIds: ['react', 'typescript'] }),
      }),
    ];

    render(<SearchResults results={results} isLoading={false} />);
    
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });
});