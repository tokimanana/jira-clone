import { AuthService } from './auth.service';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from './auth.action';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';

@Injectable()
export class AuthEffect {
  private action$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  // login
  login$ = createEffect(() =>
    this.action$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((userCredential) =>
            AuthActions.loginSuccess({
              uid: userCredential.user.uid,
              email: userCredential.user.email,
            })
          ),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // register
  register$ = createEffect(() =>
    this.action$.pipe(
      ofType(AuthActions.register),
      switchMap(({ name, email, password }) =>
        this.authService.register(email, password).pipe(
          //
          mergeMap((userCredential) =>
            this.authService
              .createUserDocument(
                userCredential.user.uid,
                userCredential.user.email!,
                name
              )
              .pipe(
                map(() =>
                  AuthActions.registerSuccess({
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                  })
                ),
                catchError((error) =>
                  of(AuthActions.registerFailure({ error: error.message }))
                )
              )
          )
        )
      )
    )
  );

  // logout
  logout$ = createEffect(() =>
    this.action$.pipe(
      ofType(AuthActions.logout),
      switchMap(() =>
        this.authService.logout().pipe(
          map(() => AuthActions.logoutSuccess()),
          tap(() => this.router.navigate(['/login']))
        )
      )
    )
  );

  //authSuccess
  authSucces$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
        tap(() => this.router.navigate(['/board']))
      ),
    { dispatch: false }
  );
}
