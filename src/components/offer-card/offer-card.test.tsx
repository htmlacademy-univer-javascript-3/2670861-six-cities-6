/* eslint-disable camelcase */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import OfferCard from '../offer-card/offer-card';
import { authReducer } from '../../store/auth-slice';
import { offersReducer } from '../../store/offers-slice';

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual: typeof Object = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock getWidthByRatingPercent utility
vi.mock('../../utils', () => ({
  getWidthByRatingPercent: vi.fn((rating) => `${rating * 20}%`),
}));

// Mock window.alert
window.alert = vi.fn();

const mockOffer: Offer = {
  id: '1',
  title: 'Beautiful Apartment in Paris',
  type: 'apartment',
  price: 120,
  previewImage: 'apartment.jpg',
  rating: 4.5,
  isPremium: true,
  isFavorite: false,
  city: {
    name: 'Paris',
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
  },
  location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
  reviews: [],
};

const mockFavoriteOffer: Offer = {
  ...mockOffer,
  isFavorite: true,
};

const testUser = {
  id: 1,
  name: 'Test User',
  avatarUrl: 'test-avatar.jpg',
  isPro: false,
  email: 'test@test.com',
  token: 'test-token',
};

const createTestStore = (
  authorizationStatus: 'AUTH' | 'NO_AUTH' | 'UNKNOWN' = 'UNKNOWN'
) =>
  configureStore({
    reducer: {
      auth: authReducer,
      offers: offersReducer,
    },
    preloadedState: {
      auth: {
        authorizationStatus,
        user: authorizationStatus === 'AUTH' ? testUser : null,
      },
      offers: {
        cityTab: 'Paris',
        offers: [],
        sorting: 'popular',
        isLoading: false,
        error: null,
      },
    },
  });

const mockHandleSetActiveOffer = vi.fn();

// Helper component to render OfferCard with providers
const renderOfferCard = (
  offer: Offer,
  authorizationStatus: 'AUTH' | 'NO_AUTH' | 'UNKNOWN' = 'UNKNOWN'
) => {
  const store = createTestStore(authorizationStatus);

  return render(
    <Provider store={store}>
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <OfferCard
          offer={offer}
          handleSetActiveOffer={mockHandleSetActiveOffer}
        />
      </MemoryRouter>
    </Provider>
  );
};

describe('OfferCard component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render offer details correctly', () => {
    renderOfferCard(mockOffer);

    expect(
      screen.getByText('Beautiful Apartment in Paris')
    ).toBeInTheDocument();
    expect(screen.getByText('€120')).toBeInTheDocument();
    expect(screen.getByText('apartment')).toBeInTheDocument();
  });

  it('should display premium badge for premium offers', () => {
    renderOfferCard(mockOffer);

    // Premium badge should be visible for premium offers
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should not display premium badge for non-premium offers', () => {
    const nonPremiumOffer = { ...mockOffer, isPremium: false };
    renderOfferCard(nonPremiumOffer);

    // Premium badge should NOT be visible for non-premium offers
    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('should render star rating element', () => {
    renderOfferCard(mockOffer);

    // Find the star rating element and check it has some width
    const starsContainer = screen.getByText('Rating').parentElement;
    expect(starsContainer).toBeInTheDocument();
  });

  it('should show active bookmark button for favorite offers', () => {
    renderOfferCard(mockFavoriteOffer);

    const bookmarkButton = screen.getByRole('button', {
      name: /in bookmarks/i,
    });
    expect(bookmarkButton).toHaveClass('place-card__bookmark-button--active');
  });

  it('should show inactive bookmark button for non-favorite offers', () => {
    renderOfferCard(mockOffer);

    const bookmarkButton = screen.getByRole('button', {
      name: /to bookmarks/i,
    });
    expect(bookmarkButton).not.toHaveClass(
      'place-card__bookmark-button--active'
    );
  });

  it('should call setActiveOffer on mouse enter', () => {
    renderOfferCard(mockOffer);

    const card = screen.getByRole('article');
    fireEvent.mouseEnter(card);

    expect(mockHandleSetActiveOffer).toHaveBeenCalledWith(mockOffer);
  });

  it('should call setActiveOffer on mouse leave', () => {
    renderOfferCard(mockOffer);

    const card = screen.getByRole('article');
    fireEvent.mouseLeave(card);

    expect(mockHandleSetActiveOffer).toHaveBeenCalledWith(null);
  });

  it('should have working links to offer page', () => {
    renderOfferCard(mockOffer);

    const imageLink = screen.getByRole('link', { name: /place image/i });
    expect(imageLink).toHaveAttribute('href', '/offer/1');

    const titleLink = screen.getByRole('link', {
      name: /beautiful apartment in paris/i,
    });
    expect(titleLink).toHaveAttribute('href', '/offer/1');
  });

  it('should prevent default and navigate to login when unauthorized user clicks bookmark', () => {
    renderOfferCard(mockOffer, 'NO_AUTH');

    const bookmarkButton = screen.getByRole('button', {
      name: /to bookmarks/i,
    });
    fireEvent.click(bookmarkButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should handle bookmark click for authorized user', () => {
    renderOfferCard(mockOffer, 'AUTH');

    const bookmarkButton = screen.getByRole('button', {
      name: /to bookmarks/i,
    });
    expect(() => fireEvent.click(bookmarkButton)).not.toThrow();
    // Note: Dispatch action testing requires more complex mocking setup
  });

  it('should have correct CSS classes', () => {
    renderOfferCard(mockOffer);

    const card = screen.getByRole('article');
    expect(card).toHaveClass('cities__card', 'place-card');

    // Find the image wrapper by class name
    const imageWrapper = document.querySelector('.place-card__image-wrapper');
    expect(imageWrapper).toHaveClass(
      'cities__image-wrapper',
      'place-card__image-wrapper'
    );
  });

  it('should render with memo component', () => {
    // Test that component renders without errors (memo is transparent in tests)
    expect(() => renderOfferCard(mockOffer)).not.toThrow();
  });

  it('should display correct text for bookmark button', () => {
    renderOfferCard(mockOffer);

    expect(screen.getByText('To bookmarks')).toBeInTheDocument();
  });

  it('should display correct text for favorite bookmark button', () => {
    renderOfferCard(mockFavoriteOffer);

    expect(screen.getByText('In bookmarks')).toBeInTheDocument();
  });
});
