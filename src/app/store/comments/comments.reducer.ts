import { createReducer, on } from '@ngrx/store';
import { CommentsState } from './comments.model';
import { CommentsAction } from './comments.action';

export const initialState: CommentsState = {
  comments: [],
  isLoading: false,
  error: null,
};

export const commentReducer = createReducer(
  initialState,

  on(CommentsAction.loadComments, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(CommentsAction.loadCommentsSuccess, (state, { comments }) => ({
    ...state,
    comments,
    isLoading: false,
    error: null,
  })),

  on(
    CommentsAction.loadCommentsFailure,
    CommentsAction.addCommentsFailure,
    (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })
  ),

  on(CommentsAction.addComments, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  }))
);
