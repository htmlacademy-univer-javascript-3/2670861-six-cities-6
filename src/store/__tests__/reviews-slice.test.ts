import { describe, it, expect } from 'vitest';
import { reviewsReducer } from '../reviews-slice';
import { fetchComments, submitComment } from '../api-actions';

const mockReview: Review = {
  id: '1',
  user: {
    name: 'John Doe',
    avatarUrl: 'avatar.jpg',
    isPro: true,
  },
  rating: 5,
  comment: 'Great place to stay!',
  date: '2023-12-01T00:00:00.000Z',
};

const mockComments: Review[] = [mockReview];

describe('reviewsSlice reducer', () => {
  const initialState = {
    comments: [],
    isCommentsLoading: false,
    isCommentSubmitting: false,
  };

  it('should return the initial state', () => {
    const result = reviewsReducer(undefined, { type: undefined });
    expect(result).toEqual(initialState);
  });

  describe('fetchComments async actions', () => {
    it('should handle pending', () => {
      const action = { type: fetchComments.pending.type };
      const result = reviewsReducer(initialState, action);

      expect(result.isCommentsLoading).toBe(true);
      expect(result.comments).toEqual([]);
    });

    it('should handle fulfilled', () => {
      const loadingState = {
        ...initialState,
        isCommentsLoading: true,
      };

      const action = fetchComments.fulfilled(
        mockComments,
        'requestId',
        'offerId'
      );
      const result = reviewsReducer(loadingState, action);

      expect(result.isCommentsLoading).toBe(false);
      expect(result.comments).toEqual(mockComments);
    });

    it('should handle rejected', () => {
      const loadingState = {
        ...initialState,
        isCommentsLoading: true,
      };

      const action = fetchComments.rejected(
        new Error('API Error'),
        'requestId',
        'offerId'
      );
      const result = reviewsReducer(loadingState, action);

      expect(result.isCommentsLoading).toBe(false);
      expect(result.comments).toEqual([]);
    });
  });

  describe('submitComment async actions', () => {
    it('should handle pending', () => {
      const action = { type: submitComment.pending.type };
      const result = reviewsReducer(initialState, action);

      expect(result.isCommentSubmitting).toBe(true);
    });

    it('should handle fulfilled', () => {
      const submittingState = {
        ...initialState,
        isCommentSubmitting: true,
      };

      const action = submitComment.fulfilled(mockReview, 'requestId', {
        offerId: '1',
        commentData: { comment: 'Test', rating: 5 },
      });
      const result = reviewsReducer(submittingState, action);

      expect(result.isCommentSubmitting).toBe(false);
      expect(result.comments).toEqual([mockReview]);
    });

    it('should handle rejected', () => {
      const submittingState = {
        ...initialState,
        isCommentSubmitting: true,
      };

      const action = submitComment.rejected(
        new Error('API Error'),
        'requestId',
        {
          offerId: '1',
          commentData: { comment: 'Test', rating: 5 },
        }
      );
      const result = reviewsReducer(submittingState, action);

      expect(result.isCommentSubmitting).toBe(false);
      expect(result.comments).toEqual([]);
    });

    it('should append new comment to existing comments', () => {
      const stateWithComments = {
        ...initialState,
        comments: mockComments,
        isCommentSubmitting: true,
      };

      const newReview: Review = {
        ...mockReview,
        id: '2',
        comment: 'Another comment',
      };

      const action = submitComment.fulfilled(newReview, 'requestId', {
        offerId: '1',
        commentData: { comment: 'Another comment', rating: 4 },
      });
      const result = reviewsReducer(stateWithComments, action);

      expect(result.isCommentSubmitting).toBe(false);
      expect(result.comments).toHaveLength(2);
      expect(result.comments[1]).toEqual(newReview);
    });
  });
});
