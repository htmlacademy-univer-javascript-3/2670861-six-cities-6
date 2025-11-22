import FavoritesList from '@/components/favorites-list';
import Header from '@/components/header';
import { Link } from 'react-router-dom';

type Props = {
  favorites: FavoriteOffer[];
};

function FavoritesPage({ favorites }: Props): JSX.Element {
  return (
    <div className="page">
      <Header favoritesCount={favorites.length} />

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
