import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';

// Базовые селекторы по доменам
export const selectOffersState = (state: RootState) => state.offers;
export const selectOfferDetailsState = (state: RootState) => state.offerDetails;
export const selectReviewsState = (state: RootState) => state.reviews;
export const selectAuthState = (state: RootState) => state.auth;

// Селекторы домена предложений
export const selectCityTab = (state: RootState) => state.offers.cityTab;
export const selectAllOffers = (state: RootState) => state.offers.offers;
export const selectSorting = (state: RootState) => state.offers.sorting;
export const selectIsLoading = (state: RootState) => state.offers.isLoading;
export const selectError = (state: RootState) => state.offers.error;

// Селекторы домена деталей предложения
export const selectCurrentOffer = (state: RootState) =>
  state.offerDetails.currentOffer;
export const selectNearbyOffers = (state: RootState) =>
  state.offerDetails.nearbyOffers;
export const selectIsOfferLoading = (state: RootState) =>
  state.offerDetails.isOfferLoading;

// Селекторы домена отзывов
export const selectComments = (state: RootState) => state.reviews.comments;
export const selectIsCommentsLoading = (state: RootState) =>
  state.reviews.isCommentsLoading;
export const selectIsCommentSubmitting = (state: RootState) =>
  state.reviews.isCommentSubmitting;

// Селекторы домена авторизации
export const selectAuthorizationStatus = (state: RootState) =>
  state.auth.authorizationStatus;
export const selectUser = (state: RootState) => state.auth.user;

export const selectFavorites = (state: RootState) => state.favorites.favorites;
export const selectFavoritesIsLoading = (state: RootState) =>
  state.favorites.isLoading;
export const selectFavoritesError = (state: RootState) => state.favorites.error;

export const selectFavoritesCount = createSelector(
  [selectFavorites],
  (favorites) => favorites.length
);

// Фильтрация предложений по выбранному городу
export const selectCityOffers = createSelector(
  [selectAllOffers, selectCityTab],
  (offers, cityTab) => offers.filter((offer) => offer.city.name === cityTab)
);

// Применение сортировки к отфильтрованным предложениям
export const selectSortedOffers = createSelector(
  [selectCityOffers, selectSorting],
  (cityOffers, sorting) => {
    const offersCopy = [...cityOffers];

    switch (sorting) {
      case 'price-low-to-high':
        return offersCopy.sort((a, b) => a.price - b.price);
      case 'price-high-to-low':
        return offersCopy.sort((a, b) => b.price - a.price);
      case 'top-rated-first':
        return offersCopy.sort((a, b) => b.rating - a.rating);
      case 'popular':
      default:
        return offersCopy;
    }
  }
);

// Расчет центра карты на основе отсортированных предложений
export const selectMapCenter = createSelector(
  [selectSortedOffers],
  (offers) => {
    const DEFAULT_MAP_CENTER: [number, number] = [
      52.3909553943508, 4.85309666406198,
    ];

    return offers.length > 0
      ? ([offers[0].location.latitude, offers[0].location.longitude] as [
          number,
          number
        ])
      : DEFAULT_MAP_CENTER;
  }
);

// Комплексный селектор для главной страницы
export const selectMainPageData = createSelector(
  [
    selectCityTab,
    selectSortedOffers,
    selectSorting,
    selectIsLoading,
    selectError,
    selectMapCenter,
  ],
  (cityTab, offers, sorting, isLoading, error, mapCenter) => ({
    cityTab,
    offers,
    sorting,
    isLoading,
    error,
    mapCenter,
  })
);
