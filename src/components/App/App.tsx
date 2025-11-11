import PrivateRoute from '@components/PrivateRoute';
import FavoritesPage from '@pages/FavoritesPage';
import LoginPage from '@pages/LoginPage';
import MainPage from '@pages/MainPage';
import NotFoundPage from '@pages/NotFoundPage';
import OfferPage from '@pages/OfferPage';
import { store } from '@store/index';
import { checkAuth } from '@store/api-actions';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@store/index';

function AppContent(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const authorizationStatus = useSelector(
    (state: RootState) => state.authorizationStatus
  );

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const isAuthorized = authorizationStatus === 'AUTH';

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/favorites"
          element={
            <PrivateRoute>
              <FavoritesPage favorites={[]} isAuthorized={isAuthorized} />
            </PrivateRoute>
          }
        />
        <Route path="/offer/:id" element={<OfferPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
