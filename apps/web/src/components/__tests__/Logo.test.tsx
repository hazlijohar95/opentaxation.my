import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Logo from '../Logo';

describe('Logo', () => {
  it('renders the logo text', () => {
    render(<Logo />);
    expect(screen.getByText('Open-Corporation')).toBeInTheDocument();
    expect(screen.getByText('.com')).toBeInTheDocument();
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Logo size="sm" />);
    expect(screen.getByText('Open-Corporation').closest('span')).toHaveClass('text-xl');

    rerender(<Logo size="lg" />);
    expect(screen.getByText('Open-Corporation').closest('span')).toHaveClass('text-5xl');
  });
});

