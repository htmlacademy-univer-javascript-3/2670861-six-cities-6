import { describe, it, expect } from 'vitest';
import {
  offersReducer,
  changeCity,
  setOffers,
  changeSorting,
  updateOfferFavorite,
} from './offers-slice';
import { fetchOffers, changeFavoriteStatus } from './api-actions';
import { logout } from './auth-slice';

const mockOffers: Offer[] = [
  {
    id: '1',
    title: 'Beautiful apartment',
    type: 'apartment',
    price: 100,
    previewImage: 'image1.jpg',
    rating: 4.5,
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
      zoom: 10,
    },
    reviews: [],
  },
  {
    id: '2',
    title: 'Cozy room',
    type: 'room',
    price: 80,
    previewImage: 'image2.jpg',
    rating: 4.0,
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
      zoom: 10,
    },
    reviews: [],
  },
];

describe('offersSlice reducer', () => {
  const initialState = {
    cityTab: 'Paris' as const,
    offers: [],
    sorting: 'popular' as const,
    isLoading: false,
    error: null,
  };

  it('should return the initial state', () => {
    const result = offersReducer(undefined, { type: undefined });
    expect(result).toEqual(initialState);
  });

  describe('changeCity action', () => {
    it('should change the city tab', () => {
      const action = changeCity('Amsterdam');
      const result = offersReducer(initialState, action);

      expect(result.cityTab).toBe('Amsterdam');
    });
  });

  describe('setOffers action', () => {
    it('should set offers data', () => {
      const action = setOffers(mockOffers);
      const result = offersReducer(initialState, action);

      expect(result.offers).toEqual(mockOffers);
    });
  });

  describe('changeSorting action', () => {
    it('should change sorting type', () => {
      const action = changeSorting('price-low-to-high');
      const result = offersReducer(initialState, action);

      expect(result.sorting).toBe('price-low-to-high');
    });
  });

  describe('updateOfferFavorite action', () => {
    it('should update favorite status for existing offer', () => {
      const stateWithOffers = {
        ...initialState,
        offers: mockOffers,
      };

      const action = updateOfferFavorite({ offerId: '1', isFavorite: true });
      const result = offersReducer(stateWithOffers, action);

      expect(result.offers[0].isFavorite).toBe(true);
      expect(result.offers[1].isFavorite).toBe(true); // unchanged
    });

    it('should not affect non-existing offer', () => {
      const stateWithOffers = {
        ...initialState,
        offers: mockOffers,
      };

      const action = updateOfferFavorite({
        offerId: 'non-existing',
        isFavorite: true,
      });
      const result = offersReducer(stateWithOffers, action);

      expect(result.offers[0].isFavorite).toBe(false);
      expect(result.offers[1].isFavorite).toBe(true);
    });
  });

  describe('fetchOffers async actions', () => {
    it('should handle pending', () => {
      const action = { type: fetchOffers.pending.type };
      const result = offersReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle fulfilled', () => {
      const loadingState = {
        ...initialState,
        isLoading: true,
      };

      const action = fetchOffers.fulfilled(mockOffers, 'requestId', undefined);
      const result = offersReducer(loadingState, action);

      expect(result.isLoading).toBe(false);
      expect(result.offers).toEqual(mockOffers);
    });

    it('should handle rejected', () => {
      const loadingState = {
        ...initialState,
        isLoading: true,
      };

      const action = fetchOffers.rejected(
        new Error('API Error'),
        'requestId',
        undefined
      );
      const result = offersReducer(loadingState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('changeFavoriteStatus fulfilled', () => {
    it('should update favorite status on success', () => {
      const stateWithOffers = {
        ...initialState,
        offers: mockOffers,
      };

      const updatedOffer = { ...mockOffers[0], isFavorite: true };
      const action = changeFavoriteStatus.fulfilled(updatedOffer, 'requestId', {
        offerId: '1',
        status: 1,
      });
      const result = offersReducer(stateWithOffers, action);

      expect(result.offers[0].isFavorite).toBe(true);
      expect(result.offers[1].isFavorite).toBe(true); // unchanged
    });
  });

  describe('logout action', () => {
    it('should reset all offers favorite status to false', () => {
      const stateWithOffers = {
        ...initialState,
        offers: mockOffers,
      };

      const action = logout();
      const result = offersReducer(stateWithOffers, action);

      expect(result.offers[0].isFavorite).toBe(false);
      expect(result.offers[1].isFavorite).toBe(false);
    });
  });
});
