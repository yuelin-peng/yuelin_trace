import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../../src/components/common/Button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('should call onClick handler', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    fireEvent.click(screen.getByText('Click Me'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when isDisabled is true', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} isDisabled>Click Me</Button>);
    
    expect(screen.getByText('Click Me')).toBeDisabled();
    
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should show loading state', () => {
    render(<Button isLoading>Loading</Button>);
    
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.getByText('Loading')).toBeDisabled();
  });

  it('should render different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByText('Primary')).toBeInTheDocument();

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByText('Secondary')).toBeInTheDocument();

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByText('Outline')).toBeInTheDocument();

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByText('Ghost')).toBeInTheDocument();
  });
});
