import { createSlice } from '@reduxjs/toolkit';
import { fetchComments, submitComment } from './api-actions';

interface ReviewsState {
  comments: Review[];
  isCommentsLoading: boolean;
  isCommentSubmitting: boolean;
}

const initialState: ReviewsState = {
  comments: [],
  isCommentsLoading: false,
  isCommentSubmitting: false,
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.isCommentsLoading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isCommentsLoading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state) => {
        state.isCommentsLoading = false;
        state.comments = [];
      })
      .addCase(submitComment.pending, (state) => {
        state.isCommentSubmitting = true;
      })
      .addCase(submitComment.fulfilled, (state, action) => {
        state.isCommentSubmitting = false;
        // Immutable array operation - create new array instead of mutating
        state.comments = [...state.comments, action.payload];
      })
      .addCase(submitComment.rejected, (state) => {
        state.isCommentSubmitting = false;
      });
  },
});

export const reviewsReducer = reviewsSlice.reducer;
