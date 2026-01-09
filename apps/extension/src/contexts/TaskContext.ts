/**
 * 任务数据 Context
 * 统一管理任务数据，避免视图切换时重复请求
 */
import { createContext, useContext } from 'react'
import type { TaskData, TaskActions } from '@/hooks/useTaskData'
import type { TaskViews, TaskFilters } from '@/hooks/useTaskViews'

export interface TaskContextValue {
  data: TaskData
  actions: TaskActions
  views: TaskViews & { focusTasks: import('@/types').Task[] }
  filters: TaskFilters
}

export const TaskContext = createContext<TaskContextValue | null>(null)

export function useTaskContext(): TaskContextValue {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTaskContext must be used within TaskProvider')
  }
  return context
}
