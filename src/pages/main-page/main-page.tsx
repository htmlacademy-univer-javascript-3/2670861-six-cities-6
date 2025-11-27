import CitiesList from '@/components/cities-list';
import Header from '@/components/header';
import MainEmpty from '@/components/main-empty';
import Map from '@components/map';
import OffersList from '@/components/offer-list';
import Spinner from '@/components/spinner';
import { useAppSelector, useAppDispatch } from '@store/index';
import { fetchOffers } from '@/store/api-actions';
import { useState, useEffect, useCallback, useMemo } from 'react';
import SortingOptions from '@/components/sorting-options';
import { selectMainPageData } from '@/store/selectors';
import classNames from 'classnames';

const CITIES: City[] = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf',
];

function MainPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);
  const { cityTab, offers, isLoading, error, mapCenter } =
    useAppSelector(selectMainPageData);

  const handleSetActiveOffer = useCallback((offer: Offer | null) => {
    setActiveOffer(offer);
  }, []);

  useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);

  const hasEmptyCollection = !isLoading && !error && offers.length === 0;

  // Мемоизируем вычисление класса для тэга main
  const mainTagClassName = useMemo(
    () =>
      classNames('page__main page__main--index', {
        'page__main--index-empty': hasEmptyCollection,
      }),
    [hasEmptyCollection]
  );

  return (
    <div className="page page--gray page--main">
      <Header favoritesCount={3} />

      <main className={mainTagClassName}>
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <CitiesList cities={CITIES} currentCity={cityTab} />
        </div>
        <div className="cities">
          <div
            className={`cities__places-container${
              hasEmptyCollection ? ' cities__places-container--empty' : ''
            } container`}
          >
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
              {!isLoading && !error && offers.length > 0 && (
                <>
                  <b className="places__found">
                    {offers.length} places to stay in {cityTab}
                  </b>
                  <SortingOptions />
                  <OffersList
                    offers={offers}
                    setActiveOffer={handleSetActiveOffer}
                  />
                </>
              )}
              {hasEmptyCollection && <MainEmpty city={cityTab} />}
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
