export type ColumnType = 'backlog' | 'in_progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  column: ColumnType;
  createdAt?: string;
}