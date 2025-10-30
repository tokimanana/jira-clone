import { createActionGroup, props } from '@ngrx/store';
import { Comment } from './comments.model';

export const CommentsAction = createActionGroup({
  source: 'Comments',
  events: {
    'Load Comments': props<{ taskId: string }>(),
    'Load Comments Success': props<{ comments: Comment[] }>(),
    'Load Comments Failure': props<{ error: string }>(),

    'Add Comments': props<{ taskId: string; content: string }>(),
    'Add Comments Failure': props<{ error: string }>(),
  },
});

// no need of Add Comments Success once we will be havinf real-time listener which will handle our update
