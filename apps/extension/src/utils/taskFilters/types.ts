import type { Task } from '@/types'

export type SortOption = 'priority' | 'dueDate' | 'createdTime' | 'sortOrder'
export type GroupOption = 'date' | 'priority' | 'project' | 'none'

export interface TaskGroup {
  id: string
  title: string
  tasks: Task[]
}

export interface TaskCounts {
  inbox: number
  today: number
  tomorrow: number
  week: number
  overdue: number
}
