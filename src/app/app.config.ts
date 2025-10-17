import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ActionReducer, MetaReducer, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { localStorageSync } from 'ngrx-store-localstorage';
import { authReducer } from './store/auth/auth.reducer';

import { routes } from './app.routes';
import { environment } from '../environments/environment.development';
import { AuthState } from './store/auth/auth.model';
import { AuthEffect } from './store/auth/auth.effects';
import { tasksReducer } from './store/tasks/tasks.reducer';
import { TasksState } from './store/tasks/tasks.model';
import { TasksEffect } from './store/tasks/tasks.effects';

// Interface pour typer l'état global
export interface AppState {
  router: unknown;
  auth: AuthState;
  tasks: TasksState;
}

export function localStorageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return localStorageSync({
    keys: ['auth'],
    rehydrate: true,
  })(reducer);
}

const metaReducers: MetaReducer<AppState>[] = [localStorageSyncReducer];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore(
      {
        router: routerReducer,
        auth: authReducer,
        tasks: tasksReducer,
      },
      { metaReducers }
    ),
    provideEffects([AuthEffect, TasksEffect]),
    provideStoreDevtools(),
    provideRouterStore(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
