import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Task } from '../../store/tasks/tasks.model';
import { selectDoneTasks, selectInProgressTasks, selectToDoTasks } from '../../store/tasks/tasks.selectors';
import { TasksAction } from '../../store/tasks/tasks.actions';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from "../task-card/task-card.component";
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { AddEditTaskComponent } from '../add-edit-task/add-edit-task.component';

@Component({
  selector: 'app-kanban-board',
  imports: [CommonModule, TaskCardComponent, DragDropModule, AddEditTaskComponent],
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.scss'
})
export class KanbanBoardComponent implements OnInit {

  private readonly store = inject(Store);

  toDoTasks$ : Observable<Task[]> = this.store.select(selectToDoTasks);
  inProgresTasks$ : Observable<Task[]> = this.store.select(selectInProgressTasks);
  doneTasks$ : Observable<Task[]> = this.store.select(selectDoneTasks);

  isModalOpen = false;
  editingTask: Task | null = null;

  ngOnInit(): void {
    this.store.dispatch(TasksAction.loadTasks())
  }

  //openModal
  openModal(task: Task | null = null): void {
    this.editingTask = task;
    this.isModalOpen = true;
  }

  //closeModal
  closeModal() : void{
    this.isModalOpen = false;
    this.editingTask = null;
  }

  //deleteTask
  onDeleteTask(taskId: string): void {
    if(confirm('Are you sure you want to delete this task?')) {
      this.store.dispatch(TasksAction.deleteTask({taskId}));
    }
  }

  //onDrop
  onDrop(event: CdkDragDrop<Task[]>): void {
    if(event.previousContainer === event.container) return;
    const task = event.previousContainer.data[event.previousIndex];
    const newStatus = this.getColumnStatus(event.container.id);
    if(newStatus) {
      this.store.dispatch(TasksAction.updateTask({
        task: {id: task.id, status: newStatus}
      }))
    }
  }

  getColumnStatus(containerId: string) {
    if(containerId.includes('todo')) return 'To Do';
    if(containerId.includes('inprogress')) return 'In Progress';
    if(containerId.includes('done')) return 'Done'
    return null;
  }
}
