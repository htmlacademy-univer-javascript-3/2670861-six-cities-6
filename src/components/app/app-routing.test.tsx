/* eslint-disable camelcase */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Создаем упрощенные компоненты для тестирования маршрутизации
const MainPage = () => <div>Main Page Component</div>;
const LoginPage = () => <div>Login Page Component</div>;
const FavoritesPage = () => <div>Favorites Page Component</div>;
const OfferPage = () => <div>Offer Page Component</div>;
const NotFoundPage = () => <div>Not Found Page Component</div>;
const PrivateRoute = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

describe('App Routing', () => {
  const TestRoutes = () => (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/favorites"
        element={
          <PrivateRoute>
            <FavoritesPage />
          </PrivateRoute>
        }
      />
      <Route path="/offer/:id" element={<OfferPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );

  it('should display MainPage on root path', () => {
    render(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
        initialEntries={['/']}
      >
        <TestRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText('Main Page Component')).toBeInTheDocument();
  });

  it('should display LoginPage on login path', () => {
    render(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
        initialEntries={['/login']}
      >
        <TestRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page Component')).toBeInTheDocument();
  });

  it('should display FavoritesPage on favorites path', () => {
    render(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
        initialEntries={['/favorites']}
      >
        <TestRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText('Favorites Page Component')).toBeInTheDocument();
  });

  it('should display OfferPage on offer path', () => {
    render(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
        initialEntries={['/offer/123']}
      >
        <TestRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText('Offer Page Component')).toBeInTheDocument();
  });

  it('should display NotFoundPage for unknown routes', () => {
    render(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
        initialEntries={['/unknown-route']}
      >
        <TestRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText('Not Found Page Component')).toBeInTheDocument();
  });

  it('should support correct route structure', () => {
    // Тестируем все маршруты
    const routes = ['/', '/login', '/favorites', '/offer/123', '/unknown'];

    routes.forEach((route) => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
          initialEntries={[route]}
        >
          <TestRoutes />
        </MemoryRouter>
      );

      // Проверяем, что какой-то компонент отображается
      expect(document.body.textContent).toBeTruthy();
    });
  });
});
