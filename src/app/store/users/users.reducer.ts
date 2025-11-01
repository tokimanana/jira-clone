import { createReducer, on } from "@ngrx/store";
import { UsersState } from "./users.model";
import { UsersActions } from "./users.action";

export const initialState: UsersState = {
    users: [],
    isLoading: false,
    error: null,
}

export const usersReducer = createReducer(
  initialState,

  on(UsersActions.loadUsers, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(UsersActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users: users,
    isLoading: false,
    error: null
  })),
  on(UsersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  }))
)
