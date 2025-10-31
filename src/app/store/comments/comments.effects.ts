import { CommentsService } from './comments.service';
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CommentsAction } from './comments.action';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUser } from '../auth/auth.selectors';


@Injectable()
export class CommentsEffect {
  private action$ = inject(Actions);
  private commentsService = inject(CommentsService);
  private store = inject(Store);

  loadComments$ = createEffect(() =>
    this.action$.pipe(
      ofType(CommentsAction.loadComments),
      switchMap(({ taskId }) =>
        this.commentsService.getComments(taskId).pipe(
          map((comments) => CommentsAction.loadCommentsSuccess({ comments })),
          catchError((error) =>
            of(CommentsAction.loadCommentsFailure({ error: error.message }))
          ),
        )
      )
    )
  );

  addComments$ = createEffect(() =>
    this.action$.pipe(
      ofType(CommentsAction.addComments),
      withLatestFrom(this.store.select(selectUser)),
      switchMap(([{taskId, content}, user]) => {

        if(!user.uid || !user.email) return of({type: '[comments]  User not logged in'})
        return this.commentsService.addComment(taskId, content, {uid: user.uid, email: user.email}).pipe(
          map(() => ({type: '[comments]  add comment successfull'})),
          catchError((error) => of(CommentsAction.addCommentsFailure({error: error.message})))
        )
      })
    )
  )
}
