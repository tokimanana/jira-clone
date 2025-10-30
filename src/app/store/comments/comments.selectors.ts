import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CommentsState, CommentWithAuthName } from './comments.model';
import { selectAllUsers } from '../users/users.selectors';

export const selectCommentsState =
  createFeatureSelector<CommentsState>('comments');

export const selectAllComments = createSelector(
  selectCommentsState,
  (state) => state.comments
);

export const selectCommentsLoading = createSelector(
  selectCommentsState,
  (state) => state.isLoading
);

export const selectCommentsError = createSelector(
  selectCommentsState,
  (state) => state.error
);

export const selectCommentsWithAuthorDetails = createSelector(
  selectAllComments,
  selectAllUsers,
  (comments, users): CommentWithAuthName[] => {
    const userMap = new Map<string, string>(
      users.map((user) => [user.uid, user.name])
    );

    return comments.map((comment) => ({
      ...comment,
      authorName: userMap.get(comment.authorId),
    }));
  }
);
