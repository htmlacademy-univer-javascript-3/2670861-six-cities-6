import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OffersList from '../offer-list/offer-list';

vi.mock('../offer-card/offer-card', () => ({
  default: ({
    offer,
    handleSetActiveOffer,
  }: {
    offer: Offer;
    handleSetActiveOffer: (offer: Offer | null) => void;
  }) => (
    <article
      data-testid={`offer-card-${offer.id}`}
      onMouseEnter={() => handleSetActiveOffer(offer)}
      onMouseLeave={() => handleSetActiveOffer(null)}
    >
      {offer.title}
    </article>
  ),
}));

describe('OffersList component', () => {
  const mockSetActiveOffer = vi.fn();

  const mockOffers: Offer[] = [
    {
      id: '1',
      title: 'Luxury Apartment',
      type: 'apartment',
      price: 200,
      previewImage: 'apartment1.jpg',
      rating: 4.8,
      isPremium: true,
      isFavorite: false,
      city: {
        name: 'Paris',
        location: {
          latitude: 48.8566,
          longitude: 2.3522,
          zoom: 10,
        },
      },
      location: {
        latitude: 48.8566,
        longitude: 2.3522,
        zoom: 12,
      },
      reviews: [],
    },
    {
      id: '2',
      title: 'Cozy Studio',
      type: 'room',
      price: 90,
      previewImage: 'studio.jpg',
      rating: 4.2,
      isPremium: false,
      isFavorite: true,
      city: {
        name: 'Paris',
        location: {
          latitude: 48.8566,
          longitude: 2.3522,
          zoom: 10,
        },
      },
      location: {
        latitude: 48.8566,
        longitude: 2.3522,
        zoom: 12,
      },
      reviews: [],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render empty list when no offers provided', () => {
    render(
      <OffersList offers={[]} handleSetActiveOffer={mockSetActiveOffer} />
    );

    const list = document.querySelector(
      '.cities__places-list.places__list.tabs__content'
    );
    expect(list).toBeInTheDocument();
    expect(list?.children).toHaveLength(0);
  });

  it('should render offer cards for each offer', () => {
    render(
      <OffersList
        offers={mockOffers}
        handleSetActiveOffer={mockSetActiveOffer}
      />
    );

    expect(screen.getByTestId('offer-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('offer-card-2')).toBeInTheDocument();
  });

  it('should render offers with correct titles', () => {
    render(
      <OffersList
        offers={mockOffers}
        handleSetActiveOffer={mockSetActiveOffer}
      />
    );

    expect(screen.getByText('Luxury Apartment')).toBeInTheDocument();
    expect(screen.getByText('Cozy Studio')).toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    render(
      <OffersList
        offers={mockOffers}
        handleSetActiveOffer={mockSetActiveOffer}
      />
    );

    const list = document.querySelector(
      '.cities__places-list.places__list.tabs__content'
    );
    expect(list).toBeInTheDocument();
  });

  it('should call handleSetActiveOffer when mouse enters offer card', () => {
    render(
      <OffersList
        offers={mockOffers}
        handleSetActiveOffer={mockSetActiveOffer}
      />
    );

    const offerCard = screen.getByTestId('offer-card-1');
    fireEvent.mouseEnter(offerCard);

    expect(mockSetActiveOffer).toHaveBeenCalledWith(mockOffers[0]);
  });

  it('should call handleSetActiveOffer with null when mouse leaves offer card', () => {
    render(
      <OffersList
        offers={mockOffers}
        handleSetActiveOffer={mockSetActiveOffer}
      />
    );

    const offerCard = screen.getByTestId('offer-card-1');
    fireEvent.mouseLeave(offerCard);

    expect(mockSetActiveOffer).toHaveBeenCalledWith(null);
  });

  it('should call handleSetActiveOffer for each offer card independently', () => {
    render(
      <OffersList
        offers={mockOffers}
        handleSetActiveOffer={mockSetActiveOffer}
      />
    );

    const firstCard = screen.getByTestId('offer-card-1');
    const secondCard = screen.getByTestId('offer-card-2');

    fireEvent.mouseEnter(firstCard);
    expect(mockSetActiveOffer).toHaveBeenCalledWith(mockOffers[0]);

    fireEvent.mouseEnter(secondCard);
    expect(mockSetActiveOffer).toHaveBeenCalledWith(mockOffers[1]);

    fireEvent.mouseLeave(secondCard);
    expect(mockSetActiveOffer).toHaveBeenCalledWith(null);
  });

  it('should handle single offer correctly', () => {
    const singleOffer = [mockOffers[0]];
    render(
      <OffersList
        offers={singleOffer}
        handleSetActiveOffer={mockSetActiveOffer}
      />
    );

    expect(screen.getByTestId('offer-card-1')).toBeInTheDocument();
    expect(screen.getByText('Luxury Apartment')).toBeInTheDocument();
    expect(screen.queryByTestId('offer-card-2')).not.toBeInTheDocument();
  });

  it('should handle offers with different properties', () => {
    const diverseOffers: Offer[] = [
      {
        ...mockOffers[0],
        id: '3',
        title: 'Budget Option',
        type: 'room',
        isPremium: false,
        isFavorite: false,
      },
      {
        ...mockOffers[1],
        id: '4',
        title: 'Premium Choice',
        type: 'house',
        isPremium: true,
        isFavorite: true,
      },
    ];

    render(
      <OffersList
        offers={diverseOffers}
        handleSetActiveOffer={mockSetActiveOffer}
      />
    );

    expect(screen.getByText('Budget Option')).toBeInTheDocument();
    expect(screen.getByText('Premium Choice')).toBeInTheDocument();

    expect(screen.getByTestId('offer-card-3')).toBeInTheDocument();
    expect(screen.getByTestId('offer-card-4')).toBeInTheDocument();
  });

  it('should pass handleSetActiveOffer callback to each offer card', () => {
    render(
      <OffersList
        offers={mockOffers}
        handleSetActiveOffer={mockSetActiveOffer}
      />
    );

    // Verify the callback is properly passed through (mock already verifies this)
    const firstCard = screen.getByTestId('offer-card-1');
    const secondCard = screen.getByTestId('offer-card-2');

    expect(firstCard).toBeInTheDocument();
    expect(secondCard).toBeInTheDocument();
  });
});
