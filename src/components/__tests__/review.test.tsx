import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Review from '../review/review';

const mockReview: Review = {
  id: '1',
  user: {
    name: 'John Doe',
    avatarUrl: 'https://example.com/avatar.jpg',
    isPro: true,
  },
  rating: 5,
  comment: 'Great place to stay! Very comfortable and clean.',
  date: '2023-12-01T00:00:00.000Z',
};

describe('Review component', () => {
  it('should render the review container with correct structure', () => {
    render(<Review review={mockReview} />);

    // Check if the main review element is present
    const reviewElement = document.querySelector('.reviews__item');
    expect(reviewElement).toBeInTheDocument();
  });

  it('should render user information correctly', () => {
    render(<Review review={mockReview} />);

    // Check user avatar
    const avatar = screen.getByAltText('Reviews avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', mockReview.user.avatarUrl);

    // Check user name
    expect(screen.getByText(mockReview.user.name)).toBeInTheDocument();
  });

  it('should render rating stars with correct width', () => {
    render(<Review review={mockReview} />);

    // Check rating stars container
    const ratingStars = document.querySelector('.reviews__stars');
    expect(ratingStars).toBeInTheDocument();

    // Check if the span has the correct width calculation (5 * 20% = 100%)
    const ratingSpan = ratingStars?.querySelector('span');
    expect(ratingSpan).toBeInTheDocument();
    expect(ratingSpan).toHaveStyle({ width: '100%' }); // 5 stars = 100%
  });

  it('should render the comment text', () => {
    render(<Review review={mockReview} />);

    expect(screen.getByText(mockReview.comment)).toBeInTheDocument();
  });

  it('should render the formatted date', () => {
    render(<Review review={mockReview} />);

    // Check date element
    const timeElement = document.querySelector('.reviews__time');
    expect(timeElement).toBeInTheDocument();
    expect(timeElement).toHaveAttribute('dateTime', mockReview.date);

    // Check formatted date (December 2023)
    expect(screen.getByText('December 2023')).toBeInTheDocument();
  });

  it('should render different rating values correctly', () => {
    const reviewWith3Stars: Review = {
      ...mockReview,
      rating: 3,
    };

    render(<Review review={reviewWith3Stars} />);

    // 3 stars = 60% width
    const ratingSpan = document.querySelector('.reviews__stars span');
    expect(ratingSpan).toHaveStyle({ width: '60%' });
  });

  it('should handle long comments', () => {
    const longComment =
      'This is a very long comment that goes on and on. '.repeat(5);
    const reviewWithLongComment: Review = {
      ...mockReview,
      comment: longComment,
    };

    render(<Review review={reviewWithLongComment} />);

    expect(screen.getByText(longComment.trim())).toBeInTheDocument();
  });

  it('should render pro user indicator (based on user.isPro)', () => {
    render(<Review review={mockReview} />);

    // The component doesn't render different content for pro users,
    // but the data is passed and could be used for styling
    expect(screen.getByText(mockReview.user.name)).toBeInTheDocument();
  });
});
