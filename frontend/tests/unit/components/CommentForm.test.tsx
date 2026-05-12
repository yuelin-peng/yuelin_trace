import { render, screen, fireEvent } from '@testing-library/react';
import { CommentForm } from '../../../src/components/comment/CommentForm';

describe('CommentForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with placeholder', () => {
    render(<CommentForm onSubmit={mockOnSubmit} placeholder="Write a comment..." />);
    
    expect(screen.getByPlaceholderText('Write a comment...')).toBeInTheDocument();
  });

  it('should call onSubmit with content', () => {
    render(<CommentForm onSubmit={mockOnSubmit} />);
    
    const textarea = screen.getByLabelText('Comment content');
    fireEvent.change(textarea, { target: { value: 'Test comment' } });
    
    const submitButton = screen.getByRole('button', { name: /post/i });
    fireEvent.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith('Test comment');
  });

  it('should not submit empty content', () => {
    render(<CommentForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /post/i });
    expect(submitButton).toBeDisabled();
  });

  it('should toggle emoji picker', () => {
    render(<CommentForm onSubmit={mockOnSubmit} />);
    
    const emojiButton = screen.getByLabelText('Add emoji');
    fireEvent.click(emojiButton);
    
    expect(screen.getByRole('dialog', { name: 'Emoji picker' })).toBeInTheDocument();
  });

  it('should insert emoji into textarea', () => {
    render(<CommentForm onSubmit={mockOnSubmit} />);
    
    // Open emoji picker
    const emojiButton = screen.getByLabelText('Add emoji');
    fireEvent.click(emojiButton);
    
    // Click first emoji
    const emoji = screen.getByLabelText('Insert 😀');
    fireEvent.click(emoji);
    
    const textarea = screen.getByLabelText('Comment content');
    expect(textarea).toHaveValue('😀');
  });

  it('should show loading state', () => {
    render(<CommentForm onSubmit={mockOnSubmit} isLoading />);
    
    const submitButton = screen.getByRole('button', { name: /posting/i });
    expect(submitButton).toBeDisabled();
  });
});
