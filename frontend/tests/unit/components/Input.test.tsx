import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../../../src/components/common/Input';

describe('Input', () => {
  it('should render with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('should call onChange handler', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('should show error message', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('should show helper text', () => {
    render(<Input helperText="Enter your email address" />);
    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
  });

  it('should be disabled when isDisabled is true', () => {
    render(<Input isDisabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should render with icons', () => {
    render(<Input hasIcon leftIcon={<span>Icon</span>} />);
    expect(screen.getByText('Icon')).toBeInTheDocument();
  });
});
