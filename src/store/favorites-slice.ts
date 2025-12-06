import { createSlice } from '@reduxjs/toolkit';
import { fetchFavorites, changeFavoriteStatus } from './api-actions';
import { ERROR_MESSAGES } from './constants';
import { mapOfferToFavorite } from '../utils/favorites';

interface FavoritesState {
  favorites: FavoriteOffer[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  favorites: [],
  isLoading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavoritesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        // Преобразование offers в формат favorite offers
        state.favorites = action.payload.map(mapOfferToFavorite);
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || ERROR_MESSAGES.FETCH_FAVORITES_FAILED;
      })
      .addCase(changeFavoriteStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(changeFavoriteStatus.fulfilled, (state, action) => {
        const updatedOffer = action.payload;
        if (updatedOffer.isFavorite) {
          // Добавить в избранное, если еще не добавлено
          const existingIndex = state.favorites.findIndex(
            (fav) => fav.id === updatedOffer.id
          );
          if (existingIndex === -1) {
            state.favorites.push(mapOfferToFavorite(updatedOffer));
          }
        } else {
          // Удалить из избранного
          state.favorites = state.favorites.filter(
            (fav) => fav.id !== updatedOffer.id
          );
        }
      })
      .addCase(changeFavoriteStatus.rejected, (state, action) => {
        state.error =
          action.error.message || ERROR_MESSAGES.ADD_TO_FAVORITES_FAILED;
      });
  },
});

export const { clearFavoritesError } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;
