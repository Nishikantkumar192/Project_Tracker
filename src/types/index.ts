export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type Status = 'todo' | 'inprogress' | 'inreview' | 'done';
export type ViewMode = 'kanban' | 'list' | 'timeline';
export type SortField = 'title' | 'priority' | 'dueDate';
export type SortDir = 'asc' | 'desc';

export interface User {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  assigneeId: string;
  priority: Priority;
  status: Status;
  startDate: string | null;
  dueDate: string;
}

export interface FilterState {
  statuses: Status[];
  priorities: Priority[];
  assignees: string[];
  dateFrom: string;
  dateTo: string;
}

export interface CollaboratorPresence {
  user: User;
  taskId: string | null;
}
