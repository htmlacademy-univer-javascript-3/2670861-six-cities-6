import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useCallback } from 'react';
import Header from '@/components/header';
import NetworkError from '@/components/network-error';
import ReviewsList from '@/components/review-list';
import Map from '@components/map';
import NearbyOffersList from '@/components/nearby-offer-list';
import Spinner from '@/components/spinner';
import OfferHost from '@/components/offer-host';
import { useAppSelector, useAppDispatch } from '@store/index';
import {
  selectCurrentOffer,
  selectNearbyOffers,
  selectCommentsSortedLimited,
  selectIsOfferLoading,
  selectOfferError,
  selectAuthorizationStatus,
} from '@store/selectors';
import {
  fetchOfferDetails,
  fetchNearbyOffers,
  fetchComments,
  changeFavoriteStatus,
} from '@store/api-actions';
import { capitalizeFirst, getWidthByRatingPercent } from '@/utils/formatters';
import classNames from 'classnames';

function OfferPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);

  const currentOffer = useAppSelector(selectCurrentOffer);
  const nearbyOffers = useAppSelector(selectNearbyOffers);
  const comments = useAppSelector(selectCommentsSortedLimited);
  const isOfferLoading = useAppSelector(selectIsOfferLoading);
  const error = useAppSelector(selectOfferError);

  const handleBookmarkClick = () => {
    if (authorizationStatus !== 'AUTH') {
      navigate('/login');
      return;
    }

    if (currentOffer) {
      const newStatus = currentOffer.isFavorite ? 0 : 1;
      dispatch(
        changeFavoriteStatus({ offerId: currentOffer.id, status: newStatus })
      )
        .unwrap()
        .then(() => {
          // Статус избранного успешно обновлен
        })
        .catch(() => {
          // eslint-disable-next-line no-alert
          alert(
            'Failed to update favorite status. Please check your connection and try again.'
          );
        });
    }
  };

  const handleRetryOffer = useCallback(() => {
    if (id) {
      dispatch(fetchOfferDetails(id))
        .unwrap()
        .catch(() => {
          // Ошибка будет обработана редюсером offerDetailsSlice
        });
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id) {
      dispatch(fetchOfferDetails(id))
        .unwrap()
        .catch(() => {
          // Ошибка будет обработана редюсером offerDetailsSlice
          // и отображена в пользовательском интерфейсе ниже
        });
      dispatch(fetchNearbyOffers(id));
      dispatch(fetchComments(id));
    }
  }, [dispatch, id]);

  const bookmarkButtonClassName = useMemo(
    () =>
      classNames('offer__bookmark-button', 'button', {
        'offer__bookmark-button--active': currentOffer?.isFavorite,
      }),
    [currentOffer?.isFavorite]
  );

  // Состояние загрузки
  if (isOfferLoading && !error) {
    return (
      <div className="page">
        <Header />
        <main className="page__main page__main--offer">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spinner />
          </div>
        </main>
      </div>
    );
  }

  // Состояние ошибки (включая 404 для несуществующих предложений)
  if (!isOfferLoading && error) {
    return (
      <div className="page">
        <Header />
        <main className="page__main page__main--offer">
          <NetworkError
            handleClick={handleRetryOffer}
            loadables="offer details"
            error={error}
          />
        </main>
      </div>
    );
  }

  // Если мы не загружаемся и у нас нет предложения, но также нет ошибки, значит
  // предложение никогда не пытались загрузить (недопустимый формат ID и т.д.)
  if (!isOfferLoading && !currentOffer && !error && id) {
    return (
      <div className="page">
        <Header />
        <main className="page__main page__main--offer">
          <div
            style={{ textAlign: 'center', padding: '50px', color: '#ff6b6b' }}
          >
            <h2>Offer Not Found</h2>
            <p>The offer you are looking for does not exist.</p>
            <button
              onClick={() => navigate('/')}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#4481c3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Go to Main Page
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Все еще загружается
  if (isOfferLoading) {
    return (
      <div className="page">
        <Header />
        <main className="page__main page__main--offer">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spinner />
          </div>
        </main>
      </div>
    );
  }

  // На данный момент у нас должен быть currentOffer
  if (!currentOffer) {
    return (
      <div className="page">
        <Header />
        <main className="page__main page__main--offer">
          <div
            style={{ textAlign: 'center', padding: '50px', color: '#ff6b6b' }}
          >
            <h2>Offer Not Available</h2>
            <p>This offer is currently unavailable.</p>
            <button
              onClick={() => navigate('/')}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#4481c3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Go to Main Page
            </button>
          </div>
        </main>
      </div>
    );
  }

  const offer = currentOffer;
  const mappedOffer = {
    id: offer.id,
    title: offer.title,
    price: offer.price,
    location: offer.location,
    isFavorite: offer.isFavorite,
    isPremium: offer.isPremium,
    rating: offer.rating,
    type: offer.type,
    city: offer.city,
    previewImage: '',
    reviews: [],
  } as Offer;

  return (
    <div className="page">
      <Header />

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {offer.images.map((image, index) => (
                <div key={image} className="offer__image-wrapper">
                  <img
                    className="offer__image"
                    src={image}
                    alt={`Photo ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {offer.isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}
              <div className="offer__name-wrapper">
                <h1 className="offer__name">{offer.title}</h1>
                <button
                  className={bookmarkButtonClassName}
                  type="button"
                  onClick={handleBookmarkClick}
                >
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">
                    {offer.isFavorite ? 'In bookmarks' : 'To bookmarks'}
                  </span>
                </button>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span
                    style={{
                      width: `${getWidthByRatingPercent(offer.rating)}%`,
                    }}
                  />
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">
                  {offer.rating.toFixed(1)}
                </span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {capitalizeFirst(offer.type)}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {offer.bedrooms} Bedroom
                  {offer.bedrooms !== 1 ? 's' : ''}
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {offer.maxAdults} adult{offer.maxAdults !== 1 ? 's' : ''}
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">&euro;{offer.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                {/* eslint-disable-next-line quotes */}
                <h2 className="offer__inside-title">{"What's inside"}</h2>
                <ul className="offer__inside-list">
                  {offer.goods.map((good) => (
                    <li key={good} className="offer__inside-item">
                      {good}
                    </li>
                  ))}
                </ul>
              </div>
              <OfferHost host={offer.host} description={offer.description} />
              <ReviewsList reviews={comments} />
            </div>
          </div>
          <section className="offer__map map">
            <Map
              offers={[...nearbyOffers, mappedOffer]}
              activeOffer={mappedOffer}
              center={[offer.location.latitude, offer.location.longitude]}
            />
          </section>
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">
              Other places in the neighbourhood
            </h2>
            <NearbyOffersList offers={nearbyOffers} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default OfferPage;
