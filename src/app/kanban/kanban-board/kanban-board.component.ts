import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Task } from '../../store/tasks/tasks.model';
import { selectDoneTasks, selectInProgressTasks, selectToDoTasks } from '../../store/tasks/tasks.selectors';
import { TasksAction } from '../../store/tasks/tasks.actions';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from "../task-card/task-card.component";
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-kanban-board',
  imports: [CommonModule, TaskCardComponent, DragDropModule],
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.scss'
})
export class KanbanBoardComponent implements OnInit {

  private readonly store = inject(Store);

  toDoTasks$ : Observable<Task[]> = this.store.select(selectToDoTasks);
  inProgresTasks$ : Observable<Task[]> = this.store.select(selectInProgressTasks);
  doneTasks$ : Observable<Task[]> = this.store.select(selectDoneTasks);

  ngOnInit(): void {
      this.store.dispatch(TasksAction.loadTasks())
  }
}
