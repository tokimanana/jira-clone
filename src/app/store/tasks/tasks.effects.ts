import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TasksService } from './tasks.service';
import { TasksAction } from './tasks.actions';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class TasksEffect {
  private action$ = inject(Actions);
  private tasksService = inject(TasksService);

  loadTasks$ = createEffect(() =>
    this.action$.pipe(
      ofType(TasksAction.loadTasks),
      switchMap(() =>
        this.tasksService.getTasks().pipe(
          map((tasks) => TasksAction.loadTasksSuccess({ tasks })),
          catchError((error) =>
            of(TasksAction.loadTasksFailure({ error: error.message }))
          )
        )
      )
    )
  );

  //addEffect
  addTask$ = createEffect(() =>
    this.action$.pipe(
      ofType(TasksAction.addTask),
      switchMap(({ taskData }) =>
        this.tasksService.addTasks(taskData).pipe(
          map((docRef) =>
            TasksAction.addTaskSuccess({
              task: { ...taskData, id: docRef.id },
            })
          ),
          catchError((error) =>
            of(TasksAction.addTaskFailure({ error: error.message }))
          )
        )
      )
    )
  );

  //updateEffect
  updateTask$ = createEffect(() =>
    this.action$.pipe(
      ofType(TasksAction.updateTask),
      switchMap(({ task }) =>
        this.tasksService.updateTask(task).pipe(
          map(() => TasksAction.updateTaskSuccess({ task })),
          catchError((error) =>
            of(TasksAction.updateTaskFailure({ error: error.message }))
          )
        )
      )
    )
  );

  //deleteTask$
  deleteTask$ = createEffect(() =>
    this.action$.pipe(
      ofType(TasksAction.deleteTask),
      switchMap(({ taskId }) =>
        this.tasksService.deleteTask(taskId).pipe(
          map(() => TasksAction.deleteTaskSuccess({ taskId })),
          catchError((error) =>
            of(TasksAction.deleteTaskFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
