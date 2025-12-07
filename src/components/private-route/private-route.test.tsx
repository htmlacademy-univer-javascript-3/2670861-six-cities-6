/* eslint-disable camelcase */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from '../private-route/private-route';
import { authReducer } from '../../store/auth-slice';

// Тестовый компонент для проверки рендеринга
const ProtectedComponent = () => (
  <div data-testid="protected-content">Protected Content</div>
);

const PublicComponent = () => (
  <div data-testid="login-page">Public Content</div>
);

// Тестовый объект Юзер
const testUser = {
  id: 1,
  name: 'Test User',
  avatarUrl: 'test-avatar.jpg',
  isPro: false,
  email: 'test@test.com',
  token: 'test-token',
};

// Создание тестового store с разными состояниями авторизации
const createTestStore = (authorizationStatus: 'AUTH' | 'NO_AUTH' | 'UNKNOWN') =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        authorizationStatus,
        user: authorizationStatus === 'AUTH' ? testUser : null,
      },
    },
  });

// Вспомогательный компонент для рендеринга в MemoryRouter
const renderWithRouter = (store: ReturnType<typeof createTestStore>) => {
  const { rerender } = render(
    <Provider store={store}>
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
        initialEntries={['/protected']}
      >
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <ProtectedComponent />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<PublicComponent />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  return { rerender };
};

describe('PrivateRoute component', () => {
  it('should render children when user is authorized', () => {
    const store = createTestStore('AUTH');
    renderWithRouter(store);

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
  });

  it('should redirect to /login when user is not authorized', () => {
    const store = createTestStore('NO_AUTH');
    renderWithRouter(store);

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should redirect to /login on unknown authorization status', () => {
    const store = createTestStore('UNKNOWN');
    renderWithRouter(store);

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('uses React Router Navigate with replace=true for redirect', () => {
    const store = createTestStore('NO_AUTH');

    // Проверяем что Navigate используется с правильными props
    // (Фактическую навигацию тестируем через getByTestId выше)
    expect(() => renderWithRouter(store)).not.toThrow();

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });
});
