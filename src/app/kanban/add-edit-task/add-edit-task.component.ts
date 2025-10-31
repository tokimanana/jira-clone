import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Task, TaskStatus } from '../../store/tasks/tasks.model';
import { filter, first, Observable } from 'rxjs';
import { User } from '../../store/users/users.model';
import { Store } from '@ngrx/store';
import { selectAllUsers } from '../../store/users/users.selectors';
import { UsersActions } from '../../store/users/users.action';
import { TasksAction } from '../../store/tasks/tasks.actions';
import { selectCurrentUserId } from '../../store/auth/auth.selectors';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { CommentWithAuthName } from '../../store/comments/comments.model';
import { selectCommentsWithAuthorDetails } from '../../store/comments/comments.selectors';
import { CommentsAction } from '../../store/comments/comments.action';

@Component({
  selector: 'app-add-edit-task',
  imports: [FormsModule, CommonModule, AsyncPipe],
  templateUrl: './add-edit-task.component.html',
  styleUrl: './add-edit-task.component.scss',
})
export class AddEditTaskComponent implements OnInit {
  @Input() task?: Task | null;

  private readonly store = inject(Store);

  //add

  //edit
  @Output() close = new EventEmitter<void>();

  //form
  taskData: {
    title: string;
    description: string;
    status: TaskStatus;
    assigneeId: string | null;
  } = {
    title: '',
    description: '',
    status: 'To Do',
    assigneeId: null,
  };

  newComment = '';

  isEditMode = false;

  users$: Observable<User[]> = this.store.select(selectAllUsers);
  comments$: Observable<CommentWithAuthName[]> = this.store.select(selectCommentsWithAuthorDetails);

  ngOnInit(): void {
    this.store.dispatch(UsersActions.loadUsers());

    if (this.task) {
      this.isEditMode = true;
      this.taskData = {
        title: this.task.title,
        description: this.task.description,
        status: this.task.status,
        assigneeId: this.task.assigneeId || null,
      };
      this.store.dispatch(CommentsAction.loadComments({taskId: this.task.id}));
    } else {
      this.isEditMode = false;
    }
  }

  onSubmit() {
    const payload = {
      title: this.taskData.title,
      description: this.taskData.description,
      status: this.taskData.status,
      assigneeId: this.taskData.assigneeId === null ? undefined : this.taskData.assigneeId,
    };

    if(this.isEditMode && this.task) {
      this.store.dispatch(TasksAction.updateTask({
          task: {...payload, id: this.task.id}
      }))
    } else {
      this.store.select(selectCurrentUserId).pipe(
        filter(uid => !!uid),
        first()
      ).subscribe(reporterId => {
        this.store.dispatch(TasksAction.addTask({
          taskData: {...payload, reporterId: reporterId!}
        }))
      })
    }

    this.onClose();
  }

  onClose(): void {
    this.close.emit();
  }

  onAddComment() {
    if(!this.newComment.trim() || !this.task) return;
    this.store.dispatch(CommentsAction.addComments({taskId: this.task?.id, content: this.newComment}));
    this.newComment = '';
  }
}
