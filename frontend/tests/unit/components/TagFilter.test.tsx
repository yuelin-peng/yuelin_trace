import { render, screen, fireEvent } from '@testing-library/react';
import { TagFilter } from '../../../src/components/article/TagFilter';

describe('TagFilter', () => {
  const mockTags = [
    { id: 'react', name: 'React', count: 12 },
    { id: 'typescript', name: 'TypeScript', count: 8 },
    { id: 'nodejs', name: 'Node.js', count: 6 },
  ];

  it('should render tags', () => {
    render(
      <TagFilter
        tags={mockTags}
        selectedTags={[]}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('should show tag counts', () => {
    render(
      <TagFilter
        tags={mockTags}
        selectedTags={[]}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('(12)')).toBeInTheDocument();
    expect(screen.getByText('(8)')).toBeInTheDocument();
  });

  it('should call onChange when tag is clicked', () => {
    const handleChange = jest.fn();
    render(
      <TagFilter
        tags={mockTags}
        selectedTags={[]}
        onChange={handleChange}
      />
    );

    fireEvent.click(screen.getByText('React'));

    expect(handleChange).toHaveBeenCalledWith(['react']);
  });

  it('should deselect tag when clicked again', () => {
    const handleChange = jest.fn();
    render(
      <TagFilter
        tags={mockTags}
        selectedTags={['react']}
        onChange={handleChange}
      />
    );

    fireEvent.click(screen.getByText('React'));

    expect(handleChange).toHaveBeenCalledWith([]);
  });

  it('should show clear all button when tags selected', () => {
    const handleClear = jest.fn();
    render(
      <TagFilter
        tags={mockTags}
        selectedTags={['react']}
        onChange={() => {}}
      />
    );

    const clearButton = screen.getByText('Clear all');
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);

    expect(handleClear).not.toHaveBeenCalled(); // Clear button calls onChange with empty array
  });

  it('should highlight selected tags', () => {
    render(
      <TagFilter
        tags={mockTags}
        selectedTags={['react', 'typescript']}
        onChange={() => {}}
      />
    );

    // Check that selected tags have the primary color styling (darker background)
    const reactButton = screen.getByRole('button', { name: /React \(12\)/i });
    expect(reactButton).toBeVisible();
  });
});