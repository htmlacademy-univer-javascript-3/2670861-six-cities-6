import { createSlice } from '@reduxjs/toolkit';
import {
  fetchOfferDetails,
  fetchNearbyOffers,
  changeFavoriteStatus,
} from './api-actions';
import { logout } from './authSlice';

interface OfferDetailsState {
  currentOffer: OfferDetails | null;
  nearbyOffers: Offer[];
  isOfferLoading: boolean;
}

const initialState: OfferDetailsState = {
  currentOffer: null,
  nearbyOffers: [],
  isOfferLoading: false,
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
      })
      .addCase(fetchOfferDetails.fulfilled, (state, action) => {
        state.isOfferLoading = false;
        state.currentOffer = action.payload;
      })
      .addCase(fetchOfferDetails.rejected, (state) => {
        state.isOfferLoading = false;
        state.currentOffer = null;
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
