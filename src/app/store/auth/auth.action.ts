import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<{ email: string; password: string }>(),
    'Login success': props<{ uid: string; email: string | null }>(),
    'Login Failure': props<{ error: string }>(),

    'Register': props<{ name: string; email: string; password: string }>(),
    'Register success': props<{ uid: string; email: string | null }>(),
    'Register Failure': props<{ error: string }>(),

    'Logout': emptyProps(),
    'Logout Success': emptyProps(),
  },
});
