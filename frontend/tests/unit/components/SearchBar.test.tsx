import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar } from '../../../src/components/search/SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render with placeholder', () => {
    render(<SearchBar onSearch={mockOnSearch} placeholder="Search articles..." />);
    
    expect(screen.getByPlaceholderText('Search articles...')).toBeInTheDocument();
  });

  it('should call onSearch with debounce', async () => {
    render(<SearchBar onSearch={mockOnSearch} debounceMs={300} />);
    
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'test query' } });
    
    // Should not call immediately due to debounce
    expect(mockOnSearch).not.toHaveBeenCalled();
    
    // Advance timers
    jest.advanceTimersByTime(300);
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test query');
    });
  });

  it('should show loading state', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading />);
    
    expect(screen.getByRole('searchbox')).toBeDisabled();
  });

  it('should handle form submission', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const form = screen.getByRole('search').closest('form');
    const input = screen.getByRole('searchbox');
    
    fireEvent.change(input, { target: { value: 'search term' } });
    fireEvent.submit(form!);
    
    // Should call immediately on submit, not debounced
    expect(mockOnSearch).toHaveBeenCalledWith('search term');
  });
});
