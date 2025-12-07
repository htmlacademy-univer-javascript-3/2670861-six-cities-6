import { render, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import App from './app';
import { authReducer } from '../../store/auth-slice';
import { offersReducer } from '../../store/offers-slice';
import { offerDetailsReducer } from '../../store/offer-details-slice';
import { reviewsReducer } from '../../store/reviews-slice';
import { favoritesReducer } from '../../store/favorites-slice';

const mockDispatch = vi.fn();

vi.mock('react-redux', async () => {
  const actual: typeof Object = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useAppSelector: vi.fn(() => 'NO_AUTH'), // Default auth status
  };
});

const createTestStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      offers: offersReducer,
      offerDetails: offerDetailsReducer,
      reviews: reviewsReducer,
      favorites: favoritesReducer,
    },
  });

describe('App component', () => {
  it('should render without crashing', () => {
    const store = createTestStore();

    expect(() => {
      act(() => {
        render(
          <Provider store={store}>
            <App />
          </Provider>
        );
      });
    }).not.toThrow();
  });

  it('should render with Redux Provider and Router', () => {
    const store = createTestStore();

    let container: HTMLElement;
    act(() => {
      const result = render(
        <Provider store={store}>
          <App />
        </Provider>
      );
      container = result.container;
    });

    // Check that the app renders something
    expect(container!).toBeInTheDocument();
  });
});
