import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import OfferHost from './offer-host';

const mockHost = {
  isPro: false,
  name: 'John Doe',
  avatarUrl: 'https://example.com/avatar.jpg',
};

const mockDescription = 'This is a beautiful apartment in the heart of Paris.';

const mockProHost = {
  ...mockHost,
  isPro: true,
};

describe('OfferHost component', () => {
  it('should render host details correctly', () => {
    render(<OfferHost host={mockHost} description={mockDescription} />);

    expect(screen.getByText('Meet the host')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText(mockDescription)).toBeInTheDocument();
  });

  it('should render host avatar with correct attributes', () => {
    render(<OfferHost host={mockHost} description={mockDescription} />);

    const avatar = screen.getByAltText('Host avatar');
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    expect(avatar).toHaveAttribute('width', '74');
    expect(avatar).toHaveAttribute('height', '74');
  });

  it('should display Pro status for pro hosts', () => {
    render(<OfferHost host={mockProHost} description={mockDescription} />);

    expect(screen.getByText('Pro')).toBeInTheDocument();
  });

  it('should not display Pro status for non-pro hosts', () => {
    render(<OfferHost host={mockHost} description={mockDescription} />);

    expect(screen.queryByText('Pro')).not.toBeInTheDocument();
  });

  it('should apply correct CSS classes for avatar wrapper', () => {
    const { container } = render(
      <OfferHost host={mockHost} description={mockDescription} />
    );
    const avatarWrapper = container.querySelector('.offer__avatar-wrapper');

    expect(avatarWrapper).toHaveClass(
      'offer__avatar-wrapper',
      'user__avatar-wrapper'
    );
    expect(avatarWrapper).not.toHaveClass('offer__avatar-wrapper--pro');
  });

  it('should apply Pro CSS class for pro hosts', () => {
    const { container } = render(
      <OfferHost host={mockProHost} description={mockDescription} />
    );
    const avatarWrapper = container.querySelector('.offer__avatar-wrapper');

    expect(avatarWrapper).toHaveClass(
      'offer__avatar-wrapper',
      'user__avatar-wrapper',
      'offer__avatar-wrapper--pro'
    );
  });

  it('should have correct semantic structure', () => {
    const { container } = render(
      <OfferHost host={mockHost} description={mockDescription} />
    );

    expect(container.querySelector('.offer__host')).toBeInTheDocument();
    expect(
      container.querySelector('.offer__host-user.user')
    ).toBeInTheDocument();
    expect(container.querySelector('.offer__description')).toBeInTheDocument();
    expect(container.querySelector('.offer__text')).toBeInTheDocument();
  });

  it('should render with different host names', () => {
    const customHost = { ...mockHost, name: 'Jane Smith' };

    render(<OfferHost host={customHost} description={mockDescription} />);

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should handle empty description', () => {
    const { container } = render(<OfferHost host={mockHost} description="" />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();

    const descriptionElement = container.querySelector('.offer__text');
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement).toHaveTextContent('');
  });
});
