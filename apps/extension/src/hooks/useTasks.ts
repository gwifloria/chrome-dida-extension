import { useTaskData, type TaskData, type TaskActions } from './useTaskData'
import {
  useTaskViews,
  type TaskViews,
  type TaskFilters,
  type SortOption,
  type GroupOption,
  type TaskGroup,
  type TaskCounts,
} from './useTaskViews'

export type { TaskData, TaskActions, TaskViews, TaskFilters }
export type { SortOption, GroupOption, TaskGroup, TaskCounts }

export interface UseTasksReturn {
  data: TaskData
  actions: TaskActions
  views: TaskViews
  filters: TaskFilters
}

/**
 * 任务管理主 Hook
 * 组合 useTaskData 和 useTaskViews，提供结构化 API
 */
export function useTasks(isLoggedIn: boolean): UseTasksReturn {
  const { data, actions } = useTaskData(isLoggedIn)
  const { views, filters } = useTaskViews(data.tasks, data.projects)

  return { data, actions, views, filters }
}
