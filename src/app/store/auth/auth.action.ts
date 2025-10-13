import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'login': props<{ email: string; password: string }>(),
    'Login success': props<{ uid: string; email: string | null }>(),
    'Login Failure': props<{ error: string }>(),

    'register': props<{ name: string; email: string; password: string }>(),
    'Register success': props<{ uid: string; email: string | null }>(),
    'Register Failure': props<{ error: string }>(),

    'logout': emptyProps(),
    'Logout Success': emptyProps(),
  },
});
