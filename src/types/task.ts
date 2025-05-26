
export interface Task {
  id: string;
  dateCreated: string;
  entityName: string;
  taskType: TaskType;
  scheduledTime: string;
  contactPerson: string;
  note?: string;
  status: TaskStatus;
}

export type TaskType = 
  | 'Meeting'
  | 'Call'
  | 'Email'
  | 'Follow-up'
  | 'Presentation'
  | 'Documentation'
  | 'Review'
  | 'Other';

export type TaskStatus = 'open' | 'closed';

export interface FilterOptions {
  taskType?: TaskType;
  status?: TaskStatus;
  contactPerson?: string;
  entityName?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export type SortOption = 
  | 'dateCreated'
  | 'scheduledTime'
  | 'entityName'
  | 'taskType'
  | 'contactPerson'
  | 'status';
