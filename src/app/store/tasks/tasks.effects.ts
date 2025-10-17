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
}
