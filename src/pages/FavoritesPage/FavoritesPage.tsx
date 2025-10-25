import FavoritesList from '@components/FavoritesList';
import Header from '@components/Header';
import { Link } from 'react-router-dom';

type Props = {
  favorites: FavoriteOffer[];
  isAuthorized?: boolean;
};

function FavoritesPage({ favorites, isAuthorized = true }: Props): JSX.Element {
  return (
    <div className="page">
      <Header isAuthorized={isAuthorized} favoritesCount={favorites.length} />

      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>
            <FavoritesList favorites={favorites} />
          </section>
        </div>
      </main>
      <footer className="footer container">
        <Link className="footer__logo-link" to="/">
          <img
            className="footer__logo"
            src="img/logo.svg"
            alt="6 cities logo"
            width="64"
            height="33"
          />
        </Link>
      </footer>
    </div>
  );
}

export default FavoritesPage;
