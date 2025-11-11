import Review from '@components/Review';
import ReviewForm from '@components/ReviewForm';
import { useAppSelector } from '@store/index';

type Props = {
  reviews: Review[];
};

function ReviewsList({ reviews }: Props): JSX.Element {
  const { currentOffer, authorizationStatus } = useAppSelector((state) => ({
    currentOffer: state.currentOffer,
    authorizationStatus: state.authorizationStatus,
  }));

  return (
    <section className="offer__reviews reviews">
      <h2 className="reviews__title">
        Reviews &middot;{' '}
        <span className="reviews__amount">{reviews.length}</span>
      </h2>
      <ul className="reviews__list">
        {reviews.map((review) => (
          <Review key={review.id} review={review} />
        ))}
      </ul>
      {authorizationStatus === 'AUTH' && <ReviewForm />}
    </section>
  );
}

export default ReviewsList;
