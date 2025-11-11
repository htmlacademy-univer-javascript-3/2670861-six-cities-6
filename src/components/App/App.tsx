import { favorites } from '@/mocks/favorites';
import PrivateRoute from '@components/PrivateRoute';
import FavoritesPage from '@pages/FavoritesPage';
import LoginPage from '@pages/LoginPage';
import MainPage from '@pages/MainPage';
import NotFoundPage from '@pages/NotFoundPage';
import OfferPage from '@pages/OfferPage';
import { store } from '@store/index';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App(): JSX.Element {
  const isAuthorized = true; // Пока всегда авторизован

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage isAuthorized={isAuthorized} />} />
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
    </Provider>
  );
}

export default App;
