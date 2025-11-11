import classNames from 'classnames';
import { Link } from 'react-router-dom';

type Props = {
  offer: Offer;
  setActiveOffer: (offer: Offer | null) => void;
};

function OfferCard({ setActiveOffer, offer }: Props): JSX.Element {
  const {
    isPremium = false,
    isBookmarked = false,
    image,
    price,
    ratingPercent,
    title,
    type,
  } = offer;
  const bookmarkButtonClassName = classNames(
    'place-card__bookmark-button',
    'button',
    { 'place-card__bookmark-button--active': isBookmarked }
  );

  return (
    <article
      onMouseEnter={() => setActiveOffer(offer)}
      onMouseLeave={() => setActiveOffer(null)}
      className="cities__card place-card"
    >
      {isPremium || (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <div className="cities__image-wrapper place-card__image-wrapper">
        <Link to={`/offer/${offer.id}`}>
          <img
            className="place-card__image"
            src={image}
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
          <button className={bookmarkButtonClassName} type="button">
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">
              {isBookmarked ? 'In bookmarks' : 'To bookmarks'}
            </span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: `${ratingPercent}%` }}></span>
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

export default OfferCard;
