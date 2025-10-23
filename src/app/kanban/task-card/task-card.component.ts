import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../store/tasks/tasks.model';

@Component({
  selector: 'app-task-card',
  imports: [],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;

  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();
}
