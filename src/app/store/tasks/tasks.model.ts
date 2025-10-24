export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  reporterId: string;
  assigneeId?: string;
}

export interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

export interface TaskWithAssignee extends Task {
  assigneeName?: string
}
