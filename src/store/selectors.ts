import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';

// Базовые селекторы
export const selectCityTab = (state: RootState) => state.cityTab;
export const selectAllOffers = (state: RootState) => state.offers;
export const selectSorting = (state: RootState) => state.sorting;
export const selectIsLoading = (state: RootState) => state.isLoading;
export const selectError = (state: RootState) => state.error;
export const selectAuthorizationStatus = (state: RootState) =>
  state.authorizationStatus;

// Мемоизированные селекторы для производных данных

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
