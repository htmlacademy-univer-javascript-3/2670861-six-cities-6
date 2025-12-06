import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { offersReducer } from './offers-slice';
import { offerDetailsReducer } from './offer-details-slice';
import { reviewsReducer } from './reviews-slice';
import { authReducer } from './auth-slice';
import { favoritesReducer } from './favorites-slice';
import { createAPI } from '@/services/api';

const api = createAPI();

const rootReducer = combineReducers({
  offers: offersReducer,
  offerDetails: offerDetailsReducer,
  reviews: reviewsReducer,
  auth: authReducer,
  favorites: favoritesReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
