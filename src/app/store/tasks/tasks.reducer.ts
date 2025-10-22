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
  })),

  on(TasksAction.addTask, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  // addTaskSuccess : Optimistic UI - affiche immédiatement sans attendre Firestore
  on(TasksAction.addTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task],
    isLoading: false,
    error: null,
  })),

  on(
    TasksAction.addTaskFailure,
    TasksAction.updateTaskFailure,
    TasksAction.deleteTaskFailure,
    (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })
  ),

  on(TasksAction.updateTask, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(TasksAction.updateTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map((t) => (t.id === task.id ? { ...t, ...task } : t)),
    isLoading: false,
    error: null,
  })),

  on(TasksAction.deleteTask, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(TasksAction.deleteTaskSuccess, (state, { taskId }) => ({
    ...state,
    tasks: state.tasks.filter((t) => t.id !== taskId),
    isLoading: false,
    error: null,
  }))
);
