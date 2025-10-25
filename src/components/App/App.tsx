import { favorites } from '@/mocks/favorites';
import { offers } from '@/mocks/offers';
import PrivateRoute from '@components/PrivateRoute';
import FavoritesPage from '@pages/FavoritesPage';
import LoginPage from '@pages/LoginPage';
import MainPage from '@pages/MainPage';
import NotFoundPage from '@pages/NotFoundPage';
import OfferPage from '@pages/OfferPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App(): JSX.Element {
  const isAuthorized = true; // Пока всегда авторизован

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<MainPage offers={offers} isAuthorized={isAuthorized} />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/favorites"
          element={
            <PrivateRoute isAuthorized={isAuthorized}>
              <FavoritesPage
                favorites={favorites}
                isAuthorized={isAuthorized}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/offer/:id"
          element={<OfferPage isAuthorized={isAuthorized} />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
