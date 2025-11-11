import CitiesList from '@components/CitiesList';
import Header from '@components/Header';
import Map from '@components/Map';
import OffersList from '@components/OffersList';
import { useAppSelector } from '@store/index';
import { useState } from 'react';

type Props = {
  isAuthorized?: boolean;
};

const CITIES: City[] = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf',
];

function MainPage({ isAuthorized = true }: Props): JSX.Element {
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);
  const city = useAppSelector((state) => state.city);
  const allOffers = useAppSelector((state) => state.offers);

  // Фильтруем предложения по выбранному городу
  const offers = allOffers.filter((offer) => offer.city === city);

  // Центр карты - координаты первого предложения в выбранном городе или дефолтные
  const mapCenter: [number, number] =
    offers.length > 0
      ? [offers[0].latitude, offers[0].longitude]
      : [52.3909553943508, 4.85309666406198];

  return (
    <div className="page page--gray page--main">
      <Header isAuthorized={isAuthorized} favoritesCount={3} />

      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <CitiesList cities={CITIES} currentCity={city} />
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">
                {offers.length} places to stay in {city}
              </b>
              <form className="places__sorting" action="#" method="get">
                <span className="places__sorting-caption">Sort by</span>
                <span className="places__sorting-type" tabIndex={0}>
                  Popular
                  <svg className="places__sorting-arrow" width="7" height="4">
                    <use xlinkHref="#icon-arrow-select"></use>
                  </svg>
                </span>
                <ul className="places__options places__options--custom places__options--opened">
                  <li
                    className="places__option places__option--active"
                    tabIndex={0}
                  >
                    Popular
                  </li>
                  <li className="places__option" tabIndex={0}>
                    Price: low to high
                  </li>
                  <li className="places__option" tabIndex={0}>
                    Price: high to low
                  </li>
                  <li className="places__option" tabIndex={0}>
                    Top rated first
                  </li>
                </ul>
              </form>
              <OffersList offers={offers} setActiveOffer={setActiveOffer} />
            </section>
            <div className="cities__right-section">
              <section className="cities__map map">
                <Map
                  offers={offers}
                  activeOffer={activeOffer}
                  center={mapCenter}
                />
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;
