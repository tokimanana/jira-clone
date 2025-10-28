import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import {
  Task,
  TaskStatus,
  TaskWithAssignee,
} from '../../store/tasks/tasks.model';
import {
  selectDoneTasksWithAssigneeName,
  selectInProgressTasksWithAssigneeName,
  selectMyDoneTasks,
  selectMyInProgressTasks,
  selectMyTasks,
  selectMyToDoTasks,
  selectToDoTasksWithAssigneeName,
} from '../../store/tasks/tasks.selectors';
import { TasksAction } from '../../store/tasks/tasks.actions';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from '../task-card/task-card.component';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { AddEditTaskComponent } from '../add-edit-task/add-edit-task.component';
import { UsersActions } from '../../store/users/users.action';

type FilterMode = 'all' | 'my';

@Component({
  selector: 'app-kanban-board',
  imports: [
    CommonModule,
    TaskCardComponent,
    DragDropModule,
    AddEditTaskComponent,
  ],
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.scss',
})
export class KanbanBoardComponent implements OnInit {
  private readonly store = inject(Store);

  readonly allToDoTasks$: Observable<TaskWithAssignee[]> = this.store.select(
    selectToDoTasksWithAssigneeName
  );
  readonly allInProgressTasks$: Observable<TaskWithAssignee[]> =
    this.store.select(selectInProgressTasksWithAssigneeName);
  readonly allDoneTasks$: Observable<TaskWithAssignee[]> = this.store.select(
    selectDoneTasksWithAssigneeName
  );

  readonly myToDoTasks$: Observable<TaskWithAssignee[]> = this.store.select(selectMyToDoTasks);
  readonly myInProgressTasks$: Observable<TaskWithAssignee[]> = this.store.select(selectMyInProgressTasks);
  readonly myDoneTasks$: Observable<TaskWithAssignee[]> = this.store.select(selectMyDoneTasks);

  private readonly COLUMN_STATUS_MAP: Record<string, TaskStatus> = {
    todo: 'To Do',
    inprogress: 'In Progress',
    done: 'Done',
  };

  filterMode: FilterMode = 'all';
  isModalOpen = false;
  editingTask: Task | null = null;

  ngOnInit(): void {
    this.store.dispatch(TasksAction.loadTasks());
    this.store.dispatch(UsersActions.loadUsers());
  }

  private readonly columnStatusMap: Record<string, TaskStatus> = {
    todo: 'To Do',
    inprogress: 'In Progress',
    done: 'Done',
  };

  openModal(task: Task | null = null): void {
    this.editingTask = task;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editingTask = null;
  }

  onDeleteTask(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.store.dispatch(TasksAction.deleteTask({ taskId }));
    }
  }

  setFilter(mode: FilterMode) {
    this.filterMode = mode;
  }

  //onDrop
  onDrop(event: CdkDragDrop<TaskWithAssignee[]>): void {
    if (event.previousContainer === event.container) return;
    const task = event.previousContainer.data[event.previousIndex];
    const newStatus = this.getColumnStatus(event.container.id);
    if (newStatus) {
      this.store.dispatch(
        TasksAction.updateTask({
          task: { id: task.id, status: newStatus },
        })
      );
    }
  }

  getColumnStatus(containerId: string): TaskStatus | null {
    // if (containerId.includes('todo')) return 'To Do';
    // if (containerId.includes('inprogress')) return 'In Progress';
    // if (containerId.includes('done')) return 'Done';
    // return null;

    const key = Object.keys(this.columnStatusMap).find(k => containerId.includes(k));
    return key ? this.columnStatusMap[key] : null;
  }
}
