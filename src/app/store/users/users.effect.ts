import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UsersService } from "./users.service";
import { UsersActions } from "./users.action";
import { catchError, map, of, switchMap } from "rxjs";


@Injectable()
export class UsersEffect {
  private action$ = inject(Actions)
  private readonly usersService = inject(UsersService);

  loadUsers$ = createEffect(() =>
  this.action$.pipe(
    ofType(UsersActions.loadUsers),
    switchMap(() =>
      this.usersService.getUsers().pipe(
        map((users) => UsersActions.loadUsersSuccess({
          users
        })),
        catchError((error) => of(UsersActions.loadUsersFailure({
          error: error.message
        })))
      )
    )
  ))
}
