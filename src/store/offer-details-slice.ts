import { createSlice } from '@reduxjs/toolkit';
import {
  fetchOfferDetails,
  fetchNearbyOffers,
  changeFavoriteStatus,
} from './api-actions';
import { logout } from './auth-slice';

interface OfferDetailsState {
  currentOffer: OfferDetails | null;
  nearbyOffers: Offer[];
  isOfferLoading: boolean;
  error: string | null;
}

const initialState: OfferDetailsState = {
  currentOffer: null,
  nearbyOffers: [],
  isOfferLoading: false,
  error: null,
};

const offerDetailsSlice = createSlice({
  name: 'offerDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOfferDetails.pending, (state) => {
        state.isOfferLoading = true;
        state.currentOffer = null;
        state.error = null;
      })
      .addCase(fetchOfferDetails.fulfilled, (state, action) => {
        state.isOfferLoading = false;
        state.currentOffer = action.payload;
        state.error = null;
      })
      .addCase(fetchOfferDetails.rejected, (state, action) => {
        state.isOfferLoading = false;
        state.currentOffer = null;
        state.error = action.error.message || 'Failed to load offer details';
      })
      .addCase(fetchNearbyOffers.fulfilled, (state, action) => {
        state.nearbyOffers = action.payload;
      })
      .addCase(changeFavoriteStatus.fulfilled, (state, action) => {
        const updatedOffer = action.payload;
        if (state.currentOffer && state.currentOffer.id === updatedOffer.id) {
          state.currentOffer.isFavorite = updatedOffer.isFavorite;
        }
        // Также обновляем isFavorite в nearbyOffers
        const nearbyOfferIndex = state.nearbyOffers.findIndex(
          (offer) => offer.id === updatedOffer.id
        );
        if (nearbyOfferIndex !== -1) {
          state.nearbyOffers[nearbyOfferIndex].isFavorite =
            updatedOffer.isFavorite;
        }
      })
      .addCase(logout, (state) => {
        // Сброс полей isFavorite при выходе пользователя
        if (state.currentOffer) {
          state.currentOffer.isFavorite = false;
        }
        state.nearbyOffers.forEach((offer) => {
          offer.isFavorite = false;
        });
      });
  },
});

export const offerDetailsReducer = offerDetailsSlice.reducer;
