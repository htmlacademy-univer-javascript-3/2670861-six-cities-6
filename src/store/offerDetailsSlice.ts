import { createSlice } from '@reduxjs/toolkit';
import { fetchOfferDetails, fetchNearbyOffers } from './api-actions';

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
      });
  },
});

export const offerDetailsReducer = offerDetailsSlice.reducer;
