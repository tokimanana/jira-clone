import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { User } from "./users.model";


export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    'Load Users': emptyProps(),
    'Load Tasks Success': props<{ users: User[] }>(),
    'Load Tasks Failure': props<{ error: string }>(),
  }
})
