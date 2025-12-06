import { describe, it, expect, beforeEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { configureStore } from '@reduxjs/toolkit';
import {
  fetchOffers,
  checkAuth,
  login,
  fetchOfferDetails,
  fetchComments,
  submitComment,
  fetchFavorites,
  changeFavoriteStatus,
} from './api-actions';
import { offersReducer } from './offers-slice';
import { offerDetailsReducer } from './offer-details-slice';
import { reviewsReducer } from './reviews-slice';
import { authReducer } from './auth-slice';
import { favoritesReducer } from './favorites-slice';
import { createAPI } from '../services/api';

const api = createAPI();
const mock = new MockAdapter(api);

const createTestStore = () =>
  configureStore({
    reducer: {
      offers: offersReducer,
      offerDetails: offerDetailsReducer,
      reviews: reviewsReducer,
      auth: authReducer,
      favorites: favoritesReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: api,
        },
      }),
  });

const store = createTestStore();

describe('API Actions', () => {
  beforeEach(() => {
    mock.reset();
  });

  describe('fetchOffers', () => {
    it('should dispatch fulfilled when API call succeeds', async () => {
      const mockOffers: Offer[] = [
        {
          id: '1',
          title: 'Test Offer',
          type: 'apartment',
          price: 100,
          previewImage: 'test.jpg',
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
      ];

      mock.onGet('/offers').reply(200, mockOffers);

      const result = await store.dispatch(fetchOffers());

      expect(result.type).toBe(fetchOffers.fulfilled.type);
      expect(result.payload).toEqual(mockOffers);
    });

    it('должен отправлять rejected при ошибке API вызова', async () => {
      mock.onGet('/offers').reply(500);

      const result = await store.dispatch(fetchOffers());

      expect(result.type).toBe(fetchOffers.rejected.type);
    });
  });

  describe('checkAuth', () => {
    it('должен отправлять fulfilled и устанавливать пользователя при успешном API вызове', async () => {
      const mockUser: AuthInfo = {
        id: 1,
        name: 'John Doe',
        avatarUrl: 'avatar.jpg',
        isPro: false,
        email: 'john@example.com',
        token: 'test-token',
      };

      mock.onGet('/login').reply(200, mockUser);

      const result = await store.dispatch(checkAuth());

      expect(result.type).toBe(checkAuth.fulfilled.type);
      expect(result.payload).toBeUndefined(); // checkAuth возвращает void
    });

    it('должен отправлять fulfilled при ошибке API вызова (ошибка обрабатывается внутри)', async () => {
      mock.onGet('/login').reply(401);

      const result = await store.dispatch(checkAuth());

      expect(result.type).toBe(checkAuth.fulfilled.type);
      expect(result.payload).toBeUndefined(); // checkAuth возвращает void
    });
  });

  describe('login', () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('должен отправлять fulfilled с данными пользователя при успешном входе', async () => {
      const mockUser: AuthInfo = {
        id: 1,
        name: 'John Doe',
        avatarUrl: 'avatar.jpg',
        isPro: false,
        email: 'test@example.com',
        token: 'test-token',
      };

      mock.onPost('/login', loginData).reply(200, mockUser);

      const result = await store.dispatch(login(loginData));

      expect(result.type).toBe(login.fulfilled.type);
      expect(result.payload).toEqual(mockUser);
    });

    it('должен отправлять rejected при ошибке входа', async () => {
      mock
        .onPost('/login', loginData)
        .reply(400, { message: 'Invalid credentials' });

      const result = await store.dispatch(login(loginData));

      expect(result.type).toBe(login.rejected.type);
    });
  });

  describe('fetchOfferDetails', () => {
    const offerId = '1';

    it('должен отправлять fulfilled с деталями предложения при успешном API вызове', async () => {
      const mockOfferDetails: OfferDetails = {
        id: '1',
        title: 'Beautiful apartment',
        description: 'A great place to stay',
        type: 'apartment',
        price: 100,
        images: ['image1.jpg'],
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
        goods: ['Wifi'],
        host: {
          isPro: true,
          name: 'John Doe',
          avatarUrl: 'avatar.jpg',
        },
        isPremium: true,
        isFavorite: false,
        rating: 4.5,
        bedrooms: 1,
        maxAdults: 2,
      };

      mock.onGet(`/offers/${offerId}`).reply(200, mockOfferDetails);

      const result = await store.dispatch(fetchOfferDetails(offerId));

      expect(result.type).toBe(fetchOfferDetails.fulfilled.type);
      expect(result.payload).toEqual(mockOfferDetails);
    });

    it('должен отправлять rejected при ошибке API вызова', async () => {
      mock.onGet(`/offers/${offerId}`).reply(404);

      const result = await store.dispatch(fetchOfferDetails(offerId));

      expect(result.type).toBe(fetchOfferDetails.rejected.type);
    });
  });

  describe('fetchComments', () => {
    const offerId = '1';

    it('должен отправлять fulfilled с комментариями при успешном API вызове', async () => {
      const mockComments: Review[] = [
        {
          id: '1',
          user: {
            name: 'John Doe',
            avatarUrl: 'avatar.jpg',
            isPro: true,
          },
          rating: 5,
          comment: 'Great place!',
          date: '2023-12-01T00:00:00.000Z',
        },
      ];

      mock.onGet(`/comments/${offerId}`).reply(200, mockComments);

      const result = await store.dispatch(fetchComments(offerId));

      expect(result.type).toBe(fetchComments.fulfilled.type);
      expect(result.payload).toEqual(mockComments);
    });

    it('должен отправлять rejected при ошибке API вызова', async () => {
      mock.onGet(`/comments/${offerId}`).reply(500);

      const result = await store.dispatch(fetchComments(offerId));

      expect(result.type).toBe(fetchComments.rejected.type);
    });
  });

  describe('submitComment', () => {
    const offerId = '1';
    const commentData = {
      comment: 'Great place to stay!',
      rating: 5,
    };

    it('должен отправлять fulfilled с новым комментарием при успешном API вызове', async () => {
      const mockNewComment: Review = {
        id: '2',
        user: {
          name: 'John Doe',
          avatarUrl: 'avatar.jpg',
          isPro: false,
        },
        rating: 5,
        comment: 'Great place to stay!',
        date: new Date().toISOString(),
      };

      mock
        .onPost(`/comments/${offerId}`, commentData)
        .reply(200, mockNewComment);

      const result = await store.dispatch(
        submitComment({ offerId, commentData })
      );

      expect(result.type).toBe(submitComment.fulfilled.type);
      expect(result.payload).toEqual(mockNewComment);
    });

    it('должен отправлять rejected при ошибке API вызова', async () => {
      mock.onPost(`/comments/${offerId}`, commentData).reply(400);

      const result = await store.dispatch(
        submitComment({ offerId, commentData })
      );

      expect(result.type).toBe(submitComment.rejected.type);
    });
  });

  describe('fetchFavorites', () => {
    it('должен отправлять fulfilled с избранными при успешном API вызове', async () => {
      const mockFavorites: Offer[] = [
        {
          id: '1',
          title: 'Favorite apartment',
          type: 'apartment',
          price: 120,
          previewImage: 'fav.jpg',
          rating: 4.8,
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
        },
      ];

      mock.onGet('/favorite').reply(200, mockFavorites);

      const result = await store.dispatch(fetchFavorites());

      expect(result.type).toBe(fetchFavorites.fulfilled.type);
      expect(result.payload).toEqual(mockFavorites);
    });

    it('должен отправлять rejected при ошибке API вызова', async () => {
      mock.onGet('/favorite').reply(500);

      const result = await store.dispatch(fetchFavorites());

      expect(result.type).toBe(fetchFavorites.rejected.type);
    });
  });

  describe('changeFavoriteStatus', () => {
    const favoriteData = {
      offerId: '1',
      status: 1 as const,
    };

    it('должен отправлять fulfilled с обновленным предложением при успешном API вызове', async () => {
      const mockUpdatedOffer: Offer = {
        id: '1',
        title: 'Updated apartment',
        type: 'apartment',
        price: 100,
        previewImage: 'test.jpg',
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

      // Настроить мок перед отправкой
      mock.reset();
      mock.onPost('/favorite/1/1').reply(200, mockUpdatedOffer);

      const result = await store.dispatch(changeFavoriteStatus(favoriteData));

      expect(result.type).toBe(changeFavoriteStatus.fulfilled.type);
      expect(result.payload).toEqual(mockUpdatedOffer);
    });

    it('должен отправлять rejected при ошибке API вызова', async () => {
      mock.reset();
      mock.onPost('/favorite/1/1').reply(500);

      const result = await store.dispatch(changeFavoriteStatus(favoriteData));

      expect(result.type).toBe(changeFavoriteStatus.rejected.type);
    });
  });
});
