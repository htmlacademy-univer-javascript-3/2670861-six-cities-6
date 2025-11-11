import CitiesList from '@components/CitiesList';
import Header from '@components/Header';
import Map from '@components/Map';
import OffersList from '@components/OffersList';
import SortingOptions from '@components/SortingOptions';
import { useAppSelector } from '@store/index';
import { sortOffers } from '@/components/SortingOptions/utils';
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
  const sorting = useAppSelector((state) => state.sorting);

  // Фильтруем предложения по выбранному городу
  const cityOffers = allOffers.filter((offer) => offer.city === city);

  // Применяем сортировку
  const offers = sortOffers(cityOffers, sorting);

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
              <SortingOptions />
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
