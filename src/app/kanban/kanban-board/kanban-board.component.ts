import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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
  selectMyToDoTasks,
  selectToDoTasksWithAssigneeName,
} from '../../store/tasks/tasks.selectors';
import { TasksAction } from '../../store/tasks/tasks.actions';
import { UsersActions } from '../../store/users/users.action';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from '../task-card/task-card.component';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { AddEditTaskComponent } from '../add-edit-task/add-edit-task.component';

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

  private readonly allToDoTasks$ = this.store.select(selectToDoTasksWithAssigneeName);
  private readonly allInProgressTasks$ = this.store.select(selectInProgressTasksWithAssigneeName);
  private readonly allDoneTasks$ = this.store.select(selectDoneTasksWithAssigneeName);

  private readonly myToDoTasks$ = this.store.select(selectMyToDoTasks);
  private readonly myInProgressTasks$ = this.store.select(selectMyInProgressTasks);
  private readonly myDoneTasks$ = this.store.select(selectMyDoneTasks);

  filterMode: FilterMode = 'all';
  isModalOpen = false;
  editingTask: Task | null = null;

  // Mapping
  private readonly columnStatusMap: Record<string, TaskStatus> = {
    todo: 'To Do',
    inprogress: 'In Progress',
    done: 'Done',
  };

  get toDoTasks$(): Observable<TaskWithAssignee[]> {
    return this.filterMode === 'all' ? this.allToDoTasks$ : this.myToDoTasks$;
  }

  get inProgressTasks$(): Observable<TaskWithAssignee[]> {
    return this.filterMode === 'all' ? this.allInProgressTasks$ : this.myInProgressTasks$;
  }

  get doneTasks$(): Observable<TaskWithAssignee[]> {
    return this.filterMode === 'all' ? this.allDoneTasks$ : this.myDoneTasks$;
  }

  ngOnInit(): void {
    this.store.dispatch(TasksAction.loadTasks());
    this.store.dispatch(UsersActions.loadUsers());
  }

  setFilter(mode: FilterMode): void {
    this.filterMode = mode;
  }

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

  private getColumnStatus(containerId: string): TaskStatus | null {
    const key = Object.keys(this.columnStatusMap).find((k) =>
      containerId.includes(k)
    );
    return key ? this.columnStatusMap[key] : null;
  }
}
