import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchOffers } from './api-actions';
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
      });
  },
});

export const { changeCity, setOffers, changeSorting } = offersSlice.actions;
export const offersReducer = offersSlice.reducer;
