import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Spinner from '../spinner/spinner';

describe('Spinner component', () => {
  it('should render the spinner container', () => {
    render(<Spinner />);

    // The component renders a div with flex centering styles
    const container = document.querySelector('div[style*="display: flex"]');
    expect(container).toBeInTheDocument();
  });

  it('should render the spinning animation element', () => {
    render(<Spinner />);

    // Check for the spinning div with circular border
    const spinnerElement = document.querySelector(
      'div[style*="border-radius: 50%"]'
    );
    expect(spinnerElement).toBeInTheDocument();
  });

  it('should include the keyframes animation in the style tag', () => {
    render(<Spinner />);

    // Check if the style tag with keyframes is present
    const styleElement = document.querySelector('style');
    expect(styleElement).toBeInTheDocument();
    expect(styleElement?.textContent).toContain('@keyframes spin');
    expect(styleElement?.textContent).toContain('transform: rotate(0deg)');
    expect(styleElement?.textContent).toContain('transform: rotate(360deg)');
  });
});
