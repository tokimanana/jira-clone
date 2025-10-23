import { createReducer, on } from "@ngrx/store";
import { UsersState } from "./users.model";
import { UsersActions } from "./users.action";

export const initialeState: UsersState = {
    users: [],
    isLoading: false,
    error: null,
}

export const usersReducer = createReducer(
  initialeState,

  on(UsersActions.loadUsers, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(UsersActions.loadTasksSuccess, (state, { users }) => ({
    ...state,
    users: users,
    isLoading: false,
    error: null
  })),
  on(UsersActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  }))
)
