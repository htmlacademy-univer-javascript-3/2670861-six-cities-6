import MainPage from '../../pages/MainPage/MainPage';
// import LoginPage from '../../pages/LoginPage/LoginPage';
// import OfferPage from '../../pages/OfferPage/OfferPage';
// import FavoritesPage from '../../pages/FavoritesPage/FavoritesPage';

type Props = {
  offers: Offer[];
};

function App({ offers }: Props): JSX.Element {
  return (
    <>
      <MainPage offers={offers} />
      {/* <LoginPage /> */}
      {/* <OfferPage /> */}
      {/* <FavoritesPage /> */}
    </>
  );
}

export default App;
