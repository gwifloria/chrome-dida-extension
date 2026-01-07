import { useAppMode } from '@/contexts/AppModeContext'
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
 * 自动根据连接状态选择适配器
 */
export function useTasks(): UseTasksReturn {
  const { isConnected } = useAppMode()
  const adapterType = isConnected ? 'didaList' : 'local'

  const { data, actions } = useTaskData(adapterType)
  const { views, filters } = useTaskViews(data.tasks, data.projects)

  return { data, actions, views, filters }
}
