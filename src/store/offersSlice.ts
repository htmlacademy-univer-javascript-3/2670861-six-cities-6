import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchOffers, changeFavoriteStatus } from './api-actions';
import { logout } from './authSlice';
import { DEFAULT_CITY, DEFAULT_SORTING, ERROR_MESSAGES } from './constants';

interface OffersState {
  cityTab: City;
  offers: Offer[];
  sorting: SortingType;
  isLoading: boolean;
  error: string | null;
}

const initialState: OffersState = {
  cityTab: DEFAULT_CITY,
  offers: [],
  sorting: DEFAULT_SORTING,
  isLoading: false,
  error: null,
};

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    changeCity: (state, action: PayloadAction<City>) => {
      state.cityTab = action.payload;
    },
    setOffers: (state, action: PayloadAction<Offer[]>) => {
      state.offers = action.payload;
    },
    changeSorting: (state, action: PayloadAction<SortingType>) => {
      state.sorting = action.payload;
    },
    updateOfferFavorite: (
      state,
      action: PayloadAction<{ offerId: string; isFavorite: boolean }>
    ) => {
      const { offerId, isFavorite } = action.payload;
      const offer = state.offers.find((o) => o.id === offerId);
      if (offer) {
        offer.isFavorite = isFavorite;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.offers = action.payload;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || ERROR_MESSAGES.FETCH_OFFERS_FAILED;
      })
      .addCase(changeFavoriteStatus.fulfilled, (state, action) => {
        const updatedOffer = action.payload;
        const offer = state.offers.find((o) => o.id === updatedOffer.id);
        if (offer) {
          offer.isFavorite = updatedOffer.isFavorite;
        }
      })
      .addCase(logout, (state) => {
        // Reset all isFavorite fields to false when user logs out
        state.offers.forEach((offer) => {
          offer.isFavorite = false;
        });
      });
  },
});

export const { changeCity, setOffers, changeSorting, updateOfferFavorite } =
  offersSlice.actions;
export const offersReducer = offersSlice.reducer;
