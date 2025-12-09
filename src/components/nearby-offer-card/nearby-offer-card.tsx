import { getWidthByRatingPercent } from '@/utils/formatters';
import classNames from 'classnames';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/index';
import { selectAuthorizationStatus } from '@/store/selectors';
import { changeFavoriteStatus } from '@/store/api-actions';
import { useMemo } from 'react';

type Props = {
  offer: Offer;
};

function NearbyOfferCard({ offer }: Props): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);

  const {
    isPremium = false,
    isFavorite = false,
    previewImage,
    price,
    rating,
    title,
    type,
  } = offer;

  const bookmarkButtonClassName = useMemo(
    () =>
      classNames('place-card__bookmark-button', 'button', {
        'place-card__bookmark-button--active': isFavorite,
      }),
    [isFavorite]
  );

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (authorizationStatus !== 'AUTH') {
      navigate('/login');
      return;
    }

    const newStatus = isFavorite ? 0 : 1;
    dispatch(changeFavoriteStatus({ offerId: offer.id, status: newStatus }))
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
  };

  return (
    <article className="near-places__card place-card">
      {isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <div className="near-places__image-wrapper place-card__image-wrapper">
        <Link to={`/offer/${offer.id}`}>
          <img
            className="place-card__image"
            src={previewImage}
            width="260"
            height="200"
            alt="Place image"
          />
        </Link>
      </div>
      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button
            className={bookmarkButtonClassName}
            type="button"
            onClick={handleBookmarkClick}
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">
              {isFavorite ? 'In bookmarks' : 'To bookmarks'}
            </span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: `${getWidthByRatingPercent(rating)}%` }} />
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`/offer/${offer.id}`}>{title}</Link>
        </h2>
        <p className="place-card__type">{type}</p>
      </div>
    </article>
  );
}

export default NearbyOfferCard;
