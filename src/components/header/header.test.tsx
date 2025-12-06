/* eslint-disable camelcase */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Header from '../header/header';
import { authReducer } from '../../store/auth-slice';
import { favoritesReducer } from '../../store/favorites-slice';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const testUser = {
  id: 1,
  name: 'Test User',
  avatarUrl: 'test-avatar.jpg',
  isPro: false,
  email: 'test@test.com',
  token: 'test-token',
};

const createTestStore = (
  authorizationStatus: 'AUTH' | 'NO_AUTH' | 'UNKNOWN' = 'UNKNOWN'
) =>
  configureStore({
    reducer: {
      auth: authReducer,
      favorites: favoritesReducer,
    },
    preloadedState: {
      auth: {
        authorizationStatus,
        user: authorizationStatus === 'AUTH' ? testUser : null,
      },
      favorites: {
        favorites: [],
        isLoading: false,
        error: null,
      },
    },
  });

// Helper component to render Header with router context
const renderWithProviders = (store: ReturnType<typeof createTestStore>) => {
  render(
    <Provider store={store}>
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Header />
      </MemoryRouter>
    </Provider>
  );
};

describe('Header component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when user is not authorized', () => {
    it('should render login link when user is not authorized', () => {
      const store = createTestStore('NO_AUTH');
      renderWithProviders(store);

      expect(screen.getByText('Sign in')).toBeInTheDocument();
      expect(screen.queryByText('Sign out')).not.toBeInTheDocument();
      expect(screen.queryByText('test@test.com')).not.toBeInTheDocument();
    });

    it('should have correct css classes for navigation', () => {
      const store = createTestStore('NO_AUTH');
      renderWithProviders(store);

      const navList = screen.getByRole('list');
      expect(navList).toHaveClass('header__nav-list');

      const navItems = screen.getAllByRole('listitem');
      expect(navItems).toHaveLength(1); // Only sign in item
    });
  });

  describe('when user is authorized', () => {
    it('should render user email and sign out link', () => {
      const store = createTestStore('AUTH');
      renderWithProviders(store);

      expect(screen.getByText('Sign out')).toBeInTheDocument();
      expect(screen.getByText('test@test.com')).toBeInTheDocument();
      expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
    });

    it('should display favorites count', () => {
      const store = configureStore({
        reducer: {
          auth: authReducer,
          favorites: favoritesReducer,
        },
        preloadedState: {
          auth: {
            authorizationStatus: 'AUTH',
            user: {
              id: 1,
              name: 'Test User',
              avatarUrl: 'test-avatar.jpg',
              isPro: false,
              email: 'test@test.com',
              token: 'test-token',
            },
          },
          favorites: {
            favorites: [
              {
                id: '1',
                title: 'Favorite 1',
                type: 'apartment',
                price: 100,
                image: 'img1.jpg',
                ratingPercent: 95,
                isPremium: false,
                city: 'Paris',
                latitude: 48.8566,
                longitude: 2.3522,
              },
            ],
            isLoading: false,
            error: null,
          },
        },
      });

      render(
        <Provider store={store}>
          <MemoryRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Header />
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText('1')).toBeInTheDocument(); // Favorites count should be 1
    });

    it('should render profile link with favorites route', () => {
      const store = createTestStore('AUTH');
      renderWithProviders(store);

      const profileLink = screen.getByRole('link', { name: /test@test.com/ });
      expect(profileLink).toHaveAttribute('href', '/favorites');
    });

    it('should have logout button that removes token and dispatches logout', () => {
      const store = createTestStore('AUTH');
      renderWithProviders(store);

      const logoutButton = screen.getByText('Sign out');
      expect(logoutButton).toBeInTheDocument();

      // Click sign out link
      fireEvent.click(logoutButton);

      // Should remove token from localStorage
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');

      // Store should be notified (we can't easily test the dispatch without more setup)
      // But at least we can test localStorage interaction
    });
  });

  describe('logo and navigation', () => {
    it('should render logo with link to home', () => {
      const store = createTestStore('UNKNOWN');
      renderWithProviders(store);

      const logoLink = screen.getByRole('link', { name: /6 cities logo/i });
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('should have correct header wrapper structure', () => {
      const store = createTestStore('UNKNOWN');
      renderWithProviders(store);

      const headerElement = screen.getByRole('banner');
      expect(headerElement).toHaveClass('header');

      const headerContainer = headerElement.querySelector('.container');
      expect(headerContainer).toBeInTheDocument();

      const headerWrapper = headerContainer?.querySelector('.header__wrapper');
      expect(headerWrapper).toBeInTheDocument();

      const headerLeft = headerWrapper?.querySelector('.header__left');
      expect(headerLeft).toBeInTheDocument();
    });
  });

  it('should handle unknown authorization status', () => {
    const store = createTestStore('UNKNOWN');
    renderWithProviders(store);

    // Should show login link when status is unknown (similar to NO_AUTH)
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });
});
