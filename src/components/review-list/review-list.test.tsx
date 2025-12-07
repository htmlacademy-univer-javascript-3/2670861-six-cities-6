import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import ReviewsList from '../review-list/review-list';
import { authReducer } from '../../store/auth-slice';

vi.mock('../review/review', () => ({
  default: ({ review }: { review: Review }) => (
    <li data-testid={`review-${review.id}`}>{review.comment}</li>
  ),
}));

vi.mock('../review-form/review-form', () => ({
  default: () => <div data-testid="review-form">ReviewForm</div>,
}));

const createTestStore = (
  authorizationStatus: AuthorizationStatus = 'NO_AUTH'
) =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        authorizationStatus,
        user: null,
      },
    },
  });

const renderReviewsList = (
  reviews: Review[] = [],
  authorizationStatus: AuthorizationStatus = 'NO_AUTH'
) => {
  const store = createTestStore(authorizationStatus);

  render(
    <Provider store={store}>
      <ReviewsList reviews={reviews} />
    </Provider>
  );
};

describe('ReviewsList component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockReviews: Review[] = [
    {
      id: '1',
      user: {
        name: 'John Doe',
        avatarUrl: 'avatar.jpg',
        isPro: false,
      },
      rating: 4,
      comment: 'Great place to stay!',
      date: '2023-12-01',
    },
    {
      id: '2',
      user: {
        name: 'Jane Smith',
        avatarUrl: 'avatar2.jpg',
        isPro: true,
      },
      rating: 5,
      comment: 'Amazing experience!',
      date: '2023-12-15',
    },
  ];

  it('should render reviews title with correct count', () => {
    renderReviewsList(mockReviews);

    expect(screen.getByText('Reviews ·')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render all reviews', () => {
    renderReviewsList(mockReviews);

    const reviewElements = screen.getAllByTestId(/^review-/);
    expect(reviewElements).toHaveLength(2);

    expect(screen.getByTestId('review-1')).toBeInTheDocument();
    expect(screen.getByTestId('review-2')).toBeInTheDocument();
  });

  it('should render reviews content', () => {
    renderReviewsList(mockReviews);

    expect(screen.getByText('Great place to stay!')).toBeInTheDocument();
    expect(screen.getByText('Amazing experience!')).toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    renderReviewsList(mockReviews);

    const section = document.querySelector('.offer__reviews.reviews');
    expect(section).toBeInTheDocument();

    const title = document.querySelector('.reviews__title');
    expect(title).toBeInTheDocument();

    const reviewsList = document.querySelector('.reviews__list');
    expect(reviewsList).toBeInTheDocument();
  });

  it('should render review form when user is authenticated', () => {
    renderReviewsList(mockReviews, 'AUTH');
    expect(screen.getByTestId('review-form')).toBeInTheDocument();
  });

  it('should not render review form when user is not authenticated', () => {
    renderReviewsList(mockReviews, 'NO_AUTH');
    expect(screen.queryByTestId('review-form')).not.toBeInTheDocument();
  });

  it('should not render review form with unknown authorization status', () => {
    renderReviewsList(mockReviews, 'UNKNOWN');
    expect(screen.queryByTestId('review-form')).not.toBeInTheDocument();
  });

  it('should handle empty reviews array', () => {
    renderReviewsList([]);

    expect(screen.getByText('Reviews ·')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();

    const reviewElements = screen.queryAllByTestId(/^review-/);
    expect(reviewElements).toHaveLength(0);
  });

  it('should render single review correctly', () => {
    renderReviewsList([mockReviews[0]]);

    expect(screen.getByText('Reviews ·')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();

    const reviewElements = screen.getAllByTestId(/^review-/);
    expect(reviewElements).toHaveLength(1);

    expect(screen.getByTestId('review-1')).toBeInTheDocument();
    expect(screen.getByText('Great place to stay!')).toBeInTheDocument();
  });
});
