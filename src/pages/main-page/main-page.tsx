import CitiesList from '@/components/cities-list';
import Header from '@/components/header';
import Map from '@components/map';
import OffersList from '@/components/offer-list';
import Spinner from '@/components/spinner';
import { useAppSelector, useAppDispatch } from '@store/index';
import { fetchOffers } from '@/store/api-actions';
import { useState, useEffect } from 'react';
import SortingOptions from '@/components/sorting-options';
import { sortOffers } from '@/utils/sorting';
import { getFirstLocation } from '@/utils/location';

const CITIES: City[] = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf',
];

const DEFAULT_MAP_CENTER: [number, number] = [
  52.3909553943508, 4.85309666406198,
];

function MainPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);
  const { cityTab, allOffers, sorting, isLoading, error } = useAppSelector(
    (state) => ({
      cityTab: state.cityTab,
      allOffers: state.offers,
      sorting: state.sorting,
      isLoading: state.isLoading,
      error: state.error,
    })
  );

  useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);

  // Фильтруем предложения по выбранному городу
  const cityOffers = allOffers.filter((offer) => offer.city.name === cityTab);

  // Применяем сортировку
  const offers = sortOffers(cityOffers, sorting);

  // Центр карты - координаты первого предложения в выбранном городе или дефолтные
  const mapCenter: [number, number] =
    offers.length > 0 ? getFirstLocation(offers[0]) : DEFAULT_MAP_CENTER;

  return (
    <div className="page page--gray page--main">
      <Header favoritesCount={3} />

      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <CitiesList cities={CITIES} currentCity={cityTab} />
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              {isLoading && <Spinner />}
              {error && !isLoading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <p>Error loading offers: {error}</p>
                  <button
                    onClick={() => {
                      dispatch(fetchOffers());
                    }}
                  >
                    Try again
                  </button>
                </div>
              )}
              {!isLoading && !error && (
                <>
                  <b className="places__found">
                    {offers.length} places to stay in {cityTab}
                  </b>
                  <SortingOptions />
                  <OffersList offers={offers} setActiveOffer={setActiveOffer} />
                </>
              )}
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
