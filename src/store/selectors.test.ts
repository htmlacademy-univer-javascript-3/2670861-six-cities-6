import { describe, it, expect } from 'vitest';
import {
  selectOffersState,
  selectOfferDetailsState,
  selectReviewsState,
  selectAuthState,
  selectCityTab,
  selectAllOffers,
  selectSorting,
  selectIsLoading,
  selectError,
  selectCurrentOffer,
  selectNearbyOffers,
  selectIsOfferLoading,
  selectComments,
  selectIsCommentsLoading,
  selectIsCommentSubmitting,
  selectAuthorizationStatus,
  selectUser,
  selectFavorites,
  selectFavoritesIsLoading,
  selectFavoritesError,
  selectFavoritesCount,
  selectCityOffers,
  selectSortedOffers,
  selectMapCenter,
  selectMainPageData,
} from './selectors';
import { RootState } from './index';

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
  {
    id: '3',
    title: 'Amsterdam hotel',
    type: 'hotel',
    price: 150,
    previewImage: 'image3.jpg',
    rating: 4.8,
    isPremium: false,
    isFavorite: false,
    city: {
      name: 'Amsterdam',
      location: {
        latitude: 52.3676,
        longitude: 4.9041,
        zoom: 10,
      },
    },
    location: {
      latitude: 52.3676,
      longitude: 4.9041,
      zoom: 10,
    },
    reviews: [],
  },
];

const mockUser: AuthInfo = {
  avatarUrl: 'avatar.jpg',
  email: 'test@test.com',
  id: 1,
  isPro: false,
  name: 'Test User',
  token: 'token123',
};

const mockFavorite: FavoriteOffer = {
  id: '1',
  title: 'Favorite hotel',
  type: 'hotel',
  price: 120,
  image: 'fav-image.jpg',
  ratingPercent: 90,
  isPremium: true,
  city: 'Paris',
  latitude: 48.8566,
  longitude: 2.3522,
};

const mockState: RootState = {
  offers: {
    cityTab: 'Paris',
    offers: mockOffers,
    sorting: 'popular',
    isLoading: false,
    error: null,
  },
  offerDetails: {
    currentOffer: {
      id: '1',
      title: 'Detailed offer',
      description: 'A great place',
      type: 'apartment',
      price: 100,
      images: ['image1.jpg'],
      city: mockOffers[0].city,
      location: mockOffers[0].location,
      goods: ['Wifi'],
      host: {
        isPro: false,
        name: 'Host',
        avatarUrl: 'host.jpg',
      },
      isPremium: false,
      isFavorite: false,
      rating: 4.5,
      bedrooms: 2,
      maxAdults: 4,
    },
    nearbyOffers: [mockOffers[0], mockOffers[1]],
    isOfferLoading: false,
    error: null,
  },
  reviews: {
    comments: [
      {
        id: '1',
        user: {
          name: 'User1',
          avatarUrl: 'avatar1.jpg',
          isPro: false,
        },
        rating: 5,
        comment: 'Great place!',
        date: '2023-01-01',
      },
    ],
    isCommentsLoading: false,
    isCommentSubmitting: false,
  },
  auth: {
    authorizationStatus: 'AUTH',
    user: mockUser,
  },
  favorites: {
    favorites: [mockFavorite],
    isLoading: false,
    error: null,
  },
};

describe('Selectors', () => {
  describe('Domain state selectors', () => {
    it('selectOffersState should return offers state', () => {
      expect(selectOffersState(mockState)).toEqual(mockState.offers);
    });

    it('selectOfferDetailsState should return offerDetails state', () => {
      expect(selectOfferDetailsState(mockState)).toEqual(
        mockState.offerDetails
      );
    });

    it('selectReviewsState should return reviews state', () => {
      expect(selectReviewsState(mockState)).toEqual(mockState.reviews);
    });

    it('selectAuthState should return auth state', () => {
      expect(selectAuthState(mockState)).toEqual(mockState.auth);
    });
  });

  describe('Offers domain selectors', () => {
    it('selectCityTab should return city tab', () => {
      expect(selectCityTab(mockState)).toBe('Paris');
    });

    it('selectAllOffers should return all offers', () => {
      expect(selectAllOffers(mockState)).toEqual(mockOffers);
    });

    it('selectSorting should return sorting type', () => {
      expect(selectSorting(mockState)).toBe('popular');
    });

    it('selectIsLoading should return loading state', () => {
      expect(selectIsLoading(mockState)).toBe(false);
    });

    it('selectError should return error state', () => {
      expect(selectError(mockState)).toBeNull();
    });
  });

  describe('Offer details domain selectors', () => {
    it('selectCurrentOffer should return current offer', () => {
      expect(selectCurrentOffer(mockState)).toEqual(
        mockState.offerDetails.currentOffer
      );
    });

    it('selectNearbyOffers should return nearby offers', () => {
      expect(selectNearbyOffers(mockState)).toEqual(
        mockState.offerDetails.nearbyOffers
      );
    });

    it('selectIsOfferLoading should return offer loading state', () => {
      expect(selectIsOfferLoading(mockState)).toBe(false);
    });
  });

  describe('Reviews domain selectors', () => {
    it('selectComments should return comments', () => {
      expect(selectComments(mockState)).toEqual(mockState.reviews.comments);
    });

    it('selectIsCommentsLoading should return comments loading state', () => {
      expect(selectIsCommentsLoading(mockState)).toBe(false);
    });

    it('selectIsCommentSubmitting should return comment submitting state', () => {
      expect(selectIsCommentSubmitting(mockState)).toBe(false);
    });
  });

  describe('Auth domain selectors', () => {
    it('selectAuthorizationStatus should return authorization status', () => {
      expect(selectAuthorizationStatus(mockState)).toBe('AUTH');
    });

    it('selectUser should return user data', () => {
      expect(selectUser(mockState)).toEqual(mockUser);
    });
  });

  describe('Favorites domain selectors', () => {
    it('selectFavorites should return favorites list', () => {
      expect(selectFavorites(mockState)).toEqual([mockFavorite]);
    });

    it('selectFavoritesIsLoading should return favorites loading state', () => {
      expect(selectFavoritesIsLoading(mockState)).toBe(false);
    });

    it('selectFavoritesError should return favorites error state', () => {
      expect(selectFavoritesError(mockState)).toBeNull();
    });
  });

  describe('Complex selectors', () => {
    describe('selectFavoritesCount', () => {
      it('should return count of favorites', () => {
        expect(selectFavoritesCount(mockState)).toBe(1);
      });

      it('should return 0 for empty favorites', () => {
        const emptyFavoritesState: RootState = {
          ...mockState,
          favorites: {
            ...mockState.favorites,
            favorites: [],
          },
        };
        expect(selectFavoritesCount(emptyFavoritesState)).toBe(0);
      });
    });

    describe('selectCityOffers', () => {
      it('should return offers filtered by selected city', () => {
        expect(selectCityOffers(mockState)).toEqual([
          mockOffers[0],
          mockOffers[1],
        ]);
      });

      it('should return only Amsterdam offers when Amsterdam is selected', () => {
        const amsterdamState: RootState = {
          ...mockState,
          offers: {
            ...mockState.offers,
            cityTab: 'Amsterdam',
          },
        };
        expect(selectCityOffers(amsterdamState)).toEqual([mockOffers[2]]);
      });

      it('should return empty array when no offers match city', () => {
        const noMatchState: RootState = {
          ...mockState,
          offers: {
            ...mockState.offers,
            cityTab: 'Berlin',
          },
        };
        expect(selectCityOffers(noMatchState)).toEqual([]);
      });
    });

    describe('selectSortedOffers', () => {
      it('should return offers in popular order (default, no sorting)', () => {
        const result = selectSortedOffers(mockState);
        expect(result).toEqual([mockOffers[0], mockOffers[1]]); // оферы только для Парижа
      });

      it('should sort offers by price low to high', () => {
        const lowToHighState: RootState = {
          ...mockState,
          offers: {
            ...mockState.offers,
            sorting: 'price-low-to-high',
          },
        };
        const result = selectSortedOffers(lowToHighState);
        expect(result[0].price).toBe(80);
        expect(result[1].price).toBe(100);
      });

      it('should sort offers by price high to low', () => {
        const highToLowState: RootState = {
          ...mockState,
          offers: {
            ...mockState.offers,
            sorting: 'price-high-to-low',
          },
        };
        const result = selectSortedOffers(highToLowState);
        expect(result[0].price).toBe(100);
        expect(result[1].price).toBe(80);
      });

      it('should sort offers by top rated first', () => {
        const topRatedState: RootState = {
          ...mockState,
          offers: {
            ...mockState.offers,
            sorting: 'top-rated-first',
          },
        };
        const result = selectSortedOffers(topRatedState);
        expect(result[0].rating).toBe(4.5);
        expect(result[1].rating).toBe(4.0);
      });

      it('should return empty array when no offers for city', () => {
        const noOffersState: RootState = {
          ...mockState,
          offers: {
            ...mockState.offers,
            cityTab: 'Berlin',
          },
        };
        expect(selectSortedOffers(noOffersState)).toEqual([]);
      });
    });

    describe('selectMapCenter', () => {
      it('should return first offer location when offers exist', () => {
        const result = selectMapCenter(mockState);
        expect(result).toEqual([48.8566, 2.3522]);
      });

      it('should return default coordinates when no offers', () => {
        const noOffersState: RootState = {
          ...mockState,
          offers: {
            ...mockState.offers,
            cityTab: 'Berlin',
          },
        };
        const result = selectMapCenter(noOffersState);
        expect(result).toEqual([52.3909553943508, 4.85309666406198]);
      });
    });

    describe('selectMainPageData', () => {
      it('should return comprehensive main page data', () => {
        const result = selectMainPageData(mockState);

        expect(result).toEqual({
          cityTab: 'Paris',
          offers: [mockOffers[0], mockOffers[1]], // сортированные оферы только для Парижа
          sorting: 'popular',
          isLoading: false,
          error: null,
          mapCenter: [48.8566, 2.3522],
        });
      });

      it('should include error in result', () => {
        const errorState: RootState = {
          ...mockState,
          offers: {
            ...mockState.offers,
            error: 'API Error',
          },
        };
        const result = selectMainPageData(errorState);
        expect(result.error).toBe('API Error');
      });

      it('should include loading state', () => {
        const loadingState: RootState = {
          ...mockState,
          offers: {
            ...mockState.offers,
            isLoading: true,
          },
        };
        const result = selectMainPageData(loadingState);
        expect(result.isLoading).toBe(true);
      });
    });
  });
});
