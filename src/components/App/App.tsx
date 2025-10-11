import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from '@pages/MainPage';
import LoginPage from '@pages/LoginPage';
import OfferPage from '@pages/OfferPage';
import FavoritesPage from '@pages/FavoritesPage';
import NotFoundPage from '@pages/NotFoundPage';
import PrivateRoute from '@components/PrivateRoute';

type Props = {
  offers: Offer[];
};

function App({ offers }: Props): JSX.Element {
  const isAuthorized = false; // Пока всегда не авторизован

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage offers={offers} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/favorites"
          element={
            <PrivateRoute isAuthorized={isAuthorized}>
              <FavoritesPage />
            </PrivateRoute>
          }
        />
        <Route path="/offer/:id" element={<OfferPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
