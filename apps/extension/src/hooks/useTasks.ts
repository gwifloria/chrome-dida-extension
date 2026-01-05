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
import type { AdapterType } from '@/api/adapters'

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
 * @param adapterType 适配器类型（'didaList' | 'local'）
 */
export function useTasks(adapterType: AdapterType): UseTasksReturn {
  const { data, actions } = useTaskData(adapterType)
  const { views, filters } = useTaskViews(data.tasks, data.projects)

  return { data, actions, views, filters }
}
