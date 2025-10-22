import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UsersState } from "./users.model";


export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectAllUsers = createSelector(
  selectUsersState,
  (state) => state.users
);
