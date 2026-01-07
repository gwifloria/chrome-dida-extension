import { useMemo } from 'react'
import { useAppMode } from '@/contexts/useAppMode'
import { useTaskData, type TaskData, type TaskActions } from './useTaskData'
import {
  useTaskViews,
  type TaskViews as BaseTaskViews,
  type TaskFilters,
  type SortOption,
  type GroupOption,
  type TaskGroup,
  type TaskCounts,
} from './useTaskViews'
import type { Task } from '@/types'

export type { TaskData, TaskActions, TaskFilters }
export type { SortOption, GroupOption, TaskGroup, TaskCounts }

export interface TaskViews extends BaseTaskViews {
  /** 聚焦任务：guest 模式返回所有本地任务，connected 模式返回今日聚焦任务 */
  focusTasks: Task[]
}

export interface UseTasksReturn {
  data: TaskData
  actions: TaskActions
  views: TaskViews
  filters: TaskFilters
}

/**
 * 任务管理主 Hook
 * 组合 useTaskData 和 useTaskViews，提供结构化 API
 * 自动根据连接状态选择适配器
 */
export function useTasks(): UseTasksReturn {
  const { isConnected, isGuest } = useAppMode()
  const adapterType = isConnected ? 'didaList' : 'local'

  const { data, actions } = useTaskData(adapterType)
  const { views: baseViews, filters } = useTaskViews(data.tasks, data.projects)

  // 聚焦任务：guest 模式显示所有本地任务，connected 模式显示今日聚焦任务
  const focusTasks = useMemo(
    () => (isGuest ? data.tasks : baseViews.todayFocusTasks),
    [isGuest, data.tasks, baseViews.todayFocusTasks]
  )

  const views: TaskViews = { ...baseViews, focusTasks }

  return { data, actions, views, filters }
}
