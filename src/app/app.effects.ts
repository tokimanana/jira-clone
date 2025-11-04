import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { SpinnerService } from './shared/services/spinner.service';
import { ToastService } from './shared/services/toast.service';
import { TasksAction } from './store/tasks/tasks.actions';
import { CommentsAction } from './store/comments/comments.action';
import { AuthActions } from './store/auth/auth.action';

@Injectable()
export class AppEffects {
  private readonly actions$ = inject(Actions);
  private readonly spinnerService = inject(SpinnerService);
  private readonly toastService = inject(ToastService);

  // ═══════════════════════════════════════════════════════════
  // SPINNER EFFECTS
  // ═══════════════════════════════════════════════════════════

  /**
   * Affiche le spinner pour les actions critiques qui nécessitent un feedback visuel.
   *
   * Actions concernées:
   * - Authentification (login, register)
   * - Opérations CRUD sur les tasks (add, update, delete)
   *
   * Note: loadTasks n'est pas inclus pour utiliser un skeleton à la place.
   */
  readonly showSpinner$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        // Auth
        AuthActions.login,
        AuthActions.register,
        // Tasks
        TasksAction.addTask,
        TasksAction.updateTask,
        TasksAction.deleteTask
      ),
      tap(() => this.spinnerService.show())
    ),
    { dispatch: false }
  );

  /**
   * Cache le spinner quand les actions se terminent (succès ou échec).
   *
   * Important: Pour chaque action dans showSpinner$, il doit y avoir
   * les actions success ET failure correspondantes ici.
   */
  readonly hideSpinner$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        // Auth
        AuthActions.loginSuccess,
        AuthActions.loginFailure,
        AuthActions.registerSuccess,
        AuthActions.registerFailure,
        // Tasks
        TasksAction.addTaskSuccess,
        TasksAction.addTaskFailure,
        TasksAction.updateTaskSuccess,
        TasksAction.updateTaskFailure,
        TasksAction.deleteTaskSuccess,
        TasksAction.deleteTaskFailure
      ),
      tap(() => this.spinnerService.hide())
    ),
    { dispatch: false }
  );

  // ═══════════════════════════════════════════════════════════
  // TOAST EFFECTS - ERRORS
  // ═══════════════════════════════════════════════════════════

  /**
   * Affiche un toast d'erreur avec un message approprié selon le type d'erreur.
   *
   * Gère les erreurs Firestore courantes:
   * - permission-denied : Problème de règles de sécurité
   * - unavailable : Problème réseau
   * - unauthenticated : Utilisateur non connecté
   * - not-found : Document inexistant
   */
  readonly handleErrors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AuthActions.loginFailure,
        AuthActions.registerFailure,
        TasksAction.addTaskFailure,
        TasksAction.updateTaskFailure,
        TasksAction.deleteTaskFailure,
        CommentsAction.addCommentsFailure,
        CommentsAction.loadCommentsFailure
      ),
      tap(({ error }) => {
        const errorMessage = this.getErrorMessage(error);
        this.toastService.error(errorMessage);
      })
    ),
    { dispatch: false }
  );

  // ═══════════════════════════════════════════════════════════
  // TOAST EFFECTS - SUCCESS
  // ═══════════════════════════════════════════════════════════

  /**
   * Affiche un toast de succès pour les actions importantes.
   *
   * Note: Seulement pour les actions où le feedback est utile.
   * Évite de spammer l'utilisateur avec trop de notifications.
   *
   * À commenter si vous trouvez ça trop verbeux.
   */
  readonly handleSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TasksAction.addTaskSuccess,
        TasksAction.deleteTaskSuccess
        // Note: updateTaskSuccess est exclu pour éviter le spam (drag & drop)
      ),
      tap((action) => {
        if (action.type === TasksAction.addTaskSuccess.type) {
          this.toastService.success('✅ Task created successfully');
        } else if (action.type === TasksAction.deleteTaskSuccess.type) {
          this.toastService.success('✅ Task deleted successfully');
        }
      })
    ),
    { dispatch: false }
  );

  // ═══════════════════════════════════════════════════════════
  // HELPER METHODS
  // ═══════════════════════════════════════════════════════════


   //Convertit les codes d'erreur Firestore en messages utilisateur
  private getErrorMessage(error: string): string {
    // Erreur de permission (règles Firestore)
    if (error.includes('permission-denied') ||
        error.includes('Missing or insufficient permissions')) {
      return '🚫 You don\'t have permission to perform this action';
    }

    // Erreur réseau
    if (error.includes('unavailable') || error.includes('network')) {
      return '🌐 Network error. Please check your connection';
    }

    // Utilisateur non authentifié
    if (error.includes('unauthenticated')) {
      return '🔒 Please log in to continue';
    }

    // Document non trouvé
    if (error.includes('not-found')) {
      return '❌ Resource not found';
    }

    // Email déjà utilisé (register)
    if (error.includes('email-already-in-use')) {
      return '📧 This email is already registered';
    }

    // Mot de passe invalide (login)
    if (error.includes('invalid-credential') || error.includes('wrong-password')) {
      return '🔑 Invalid email or password';
    }

    // Erreur générique
    return '❌ An error occurred. Please try again';
  }
}
