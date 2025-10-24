import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TasksState, TaskWithAssignee } from './tasks.model';
import { selectAllUsers } from '../users/users.selectors';

export const selectTasksState = createFeatureSelector<TasksState>('tasks');

export const selectAllTasks = createSelector(
  selectTasksState,
  (state) => state.tasks
);

export const selectTasksWithAssigneeInfo = createSelector(
  selectAllTasks,
  selectAllUsers,
  (tasks, users): TaskWithAssignee[] => {
    const userMap = new Map(users.map((user) => [user.uid, user.name]));

    return tasks.map((task) => ({
      ...task,
      assigneeName: task.assigneeId ? userMap.get(task.assigneeId) : undefined,
    }));
  }
);

export const selectToDoTasksWithAssigneeName = createSelector(selectTasksWithAssigneeInfo, (tasks) =>
  tasks.filter((task) => task.status === 'To Do')
);

export const selectInProgressTasksWithAssigneeName = createSelector(selectTasksWithAssigneeInfo, (tasks) =>
  tasks.filter((task) => task.status === 'In Progress')
);

export const selectDoneTasksWithAssigneeName = createSelector(selectTasksWithAssigneeInfo, (tasks) =>
  tasks.filter((task) => task.status === 'Done')
);
