import { describe, it, expect } from 'vitest';
import { favoritesReducer, clearFavoritesError } from './favorites-slice';
import { fetchFavorites, changeFavoriteStatus } from './api-actions';
import { mapOfferToFavorite } from '../utils/favorites';

const mockOffer: Offer = {
  id: '1',
  title: 'Beautiful apartment',
  type: 'apartment',
  price: 100,
  previewImage: 'image1.jpg',
  rating: 4.5,
  isPremium: true,
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
};

const mockFavoriteOffer = mapOfferToFavorite(mockOffer);

describe('favoritesSlice reducer', () => {
  const initialState = {
    favorites: [],
    isLoading: false,
    error: null,
  };

  it('should return the initial state', () => {
    const result = favoritesReducer(undefined, { type: undefined });
    expect(result).toEqual(initialState);
  });

  describe('clearFavoritesError action', () => {
    it('should clear error', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error',
      };

      const action = clearFavoritesError();
      const result = favoritesReducer(stateWithError, action);

      expect(result.error).toBeNull();
    });
  });

  describe('fetchFavorites async actions', () => {
    it('should handle pending', () => {
      const action = { type: fetchFavorites.pending.type };
      const result = favoritesReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle fulfilled', () => {
      const loadingState = {
        ...initialState,
        isLoading: true,
      };

      const offers = [mockOffer];
      const expectedFavorites = offers.map(mapOfferToFavorite);

      const action = fetchFavorites.fulfilled(offers, 'requestId', undefined);
      const result = favoritesReducer(loadingState, action);

      expect(result.isLoading).toBe(false);
      expect(result.favorites).toEqual(expectedFavorites);
    });

    it('should handle rejected', () => {
      const loadingState = {
        ...initialState,
        isLoading: true,
      };

      const action = fetchFavorites.rejected(
        new Error('API Error'),
        'requestId',
        undefined
      );
      const result = favoritesReducer(loadingState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('changeFavoriteStatus fulfilled', () => {
    it('should add offer to favorites when status is 1', () => {
      const action = changeFavoriteStatus.fulfilled(mockOffer, 'requestId', {
        offerId: '1',
        status: 1,
      });
      const result = favoritesReducer(initialState, action);

      expect(result.favorites).toHaveLength(1);
      expect(result.favorites[0]).toEqual(mockFavoriteOffer);
    });

    it('should not duplicate existing favorite offer', () => {
      const stateWithFavorite = {
        ...initialState,
        favorites: [mockFavoriteOffer],
      };

      const action = changeFavoriteStatus.fulfilled(mockOffer, 'requestId', {
        offerId: '1',
        status: 1,
      });
      const result = favoritesReducer(stateWithFavorite, action);

      expect(result.favorites).toHaveLength(1);
      expect(result.favorites[0]).toEqual(mockFavoriteOffer);
    });

    it('should remove offer from favorites when status is 0', () => {
      const stateWithFavorite = {
        ...initialState,
        favorites: [mockFavoriteOffer],
      };

      const offerToRemove = { ...mockOffer, isFavorite: false };
      const action = changeFavoriteStatus.fulfilled(
        offerToRemove,
        'requestId',
        {
          offerId: '1',
          status: 0,
        }
      );
      const result = favoritesReducer(stateWithFavorite, action);

      expect(result.favorites).toEqual([]);
    });

    it('should leave favorites unchanged if offer not found when removing', () => {
      const stateWithDifferentFavorite = {
        ...initialState,
        favorites: [mockFavoriteOffer],
      };

      const differentOffer = { ...mockOffer, id: '2', isFavorite: false };
      const action = changeFavoriteStatus.fulfilled(
        differentOffer,
        'requestId',
        {
          offerId: '2',
          status: 0,
        }
      );
      const result = favoritesReducer(stateWithDifferentFavorite, action);

      expect(result.favorites).toHaveLength(1);
      expect(result.favorites[0]).toEqual(mockFavoriteOffer);
    });
  });

  describe('changeFavoriteStatus rejected', () => {
    it('should set error on rejection', () => {
      const action = changeFavoriteStatus.rejected(
        new Error('Network Error'),
        'requestId',
        {
          offerId: '1',
          status: 1,
        }
      );
      const result = favoritesReducer(initialState, action);

      expect(result.error).toBe('Network Error');
    });
  });

  describe('changeFavoriteStatus pending', () => {
    it('should clear error on pending', () => {
      const stateWithError = {
        ...initialState,
        error: 'Previous error',
      };

      const action = { type: changeFavoriteStatus.pending.type };
      const result = favoritesReducer(stateWithError, action);

      expect(result.error).toBeNull();
    });
  });
});
