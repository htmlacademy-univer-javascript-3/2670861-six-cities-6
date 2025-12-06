import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MainEmpty from '../main-empty/main-empty';

describe('MainEmpty component', () => {
  it('should display empty message', () => {
    render(<MainEmpty city="Paris" />);

    expect(screen.getByText('No places to stay available')).toBeInTheDocument();
  });

  it('should display city name in message', () => {
    render(<MainEmpty city="Amsterdam" />);

    expect(
      screen.getByText(
        'We could not find any property available at the moment in Amsterdam'
      )
    ).toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    const { container } = render(<MainEmpty city="Paris" />);

    expect(container.firstChild).toHaveClass('cities__no-places');
    expect(
      container.querySelector('.cities__status-wrapper')
    ).toBeInTheDocument();
    expect(container.querySelector('.tabs__content')).toBeInTheDocument();
    expect(container.querySelector('.cities__status')).toBeInTheDocument();
    expect(
      container.querySelector('.cities__status-description')
    ).toBeInTheDocument();
  });

  it('should display different cities correctly', () => {
    const { rerender } = render(<MainEmpty city="Paris" />);
    expect(screen.getByText(/Paris/)).toBeInTheDocument();

    rerender(<MainEmpty city="Cologne" />);
    expect(screen.getByText(/Cologne/)).toBeInTheDocument();

    rerender(<MainEmpty city="Brussels" />);
    expect(screen.getByText(/Brussels/)).toBeInTheDocument();
  });
});
