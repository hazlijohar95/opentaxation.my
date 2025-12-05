import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Logo from '../Logo';

describe('Logo', () => {
  it('renders the logo text', () => {
    render(<Logo />);
    expect(screen.getByText('open')).toBeInTheDocument();
    expect(screen.getByText('taxation')).toBeInTheDocument();
    expect(screen.getByText('.my')).toBeInTheDocument();
  });

  it('applies size classes correctly', () => {
    const { rerender, container } = render(<Logo size="sm" />);
    // Default/sm uses text-lg sm:text-xl classes
    expect(container.querySelector('a')).toHaveClass('text-lg');

    rerender(<Logo size="lg" />);
    // lg size uses text-3xl sm:text-4xl classes
    expect(container.querySelector('a')).toHaveClass('text-3xl');
  });
});

