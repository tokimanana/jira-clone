import { createReducer, on } from '@ngrx/store';
import { TasksState } from './tasks.model';
import { TasksAction } from './tasks.actions';

export const initialState: TasksState = {
  tasks: [],
  isLoading: false,
  error: null,
};

export const tasksReducer = createReducer(
  initialState,

  on(TasksAction.loadTasks, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(TasksAction.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    isLoading: false,
    error: null,
  })),
  on(TasksAction.loadTasksFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);
