import { useState, useEffect, useCallback, useMemo } from 'react'
import { api } from '@/services/api'
import { storage } from '@/services/storage'
import {
  filterTasks,
  sortTasks,
  groupTasks,
  getTodayTasks,
  getTodayFocusTasks,
  getInboxTasks,
  getOverdueTasks,
  getTomorrowTasks,
  getWeekTasks,
  getTaskCounts,
  type SortOption,
  type GroupOption,
  type TaskGroup,
  type TaskCounts,
} from '@/utils/taskFilters'
import type { Task, Project } from '@/types'

export type { SortOption, GroupOption, TaskGroup, TaskCounts }

export function useTasks(isLoggedIn: boolean) {
  // 原始数据
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 排序和分组选项
  const [sortBy, setSortBy] = useState<SortOption>('priority')
  const [groupBy, setGroupBy] = useState<GroupOption>('none')

  // ============ 数据获取 ============

  const refresh = useCallback(async () => {
    if (!isLoggedIn) return

    setLoading(true)
    setError(null)

    try {
      const data = await api.getAllTasks()
      setTasks(data.tasks)
      setProjects(data.projects)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取任务失败')
      // 尝试使用缓存
      const cachedTasks = await storage.getCachedTasks<Task[]>()
      const cachedProjects = await storage.getCachedProjects<Project[]>()
      if (cachedTasks) setTasks(cachedTasks)
      if (cachedProjects) setProjects(cachedProjects)
    } finally {
      setLoading(false)
    }
  }, [isLoggedIn])

  // 只刷新收集箱任务（用于快速更新）
  const refreshInbox = useCallback(async () => {
    if (!isLoggedIn) return

    try {
      const inboxTasks = await api.getInboxTasks()
      setTasks((prev) => {
        // 移除旧的 inbox 任务，添加新的
        const nonInboxTasks = prev.filter(
          (t) => !t.projectId.startsWith('inbox')
        )
        return [...nonInboxTasks, ...inboxTasks]
      })
    } catch (err) {
      console.error('刷新收集箱失败:', err)
    }
  }, [isLoggedIn])

  useEffect(() => {
    refresh()
  }, [refresh])

  // ============ 计算视图 ============

  // 今日任务
  const todayTasks = useMemo(() => getTodayTasks(tasks), [tasks])

  // 今日专注任务（高优先级优先，最多3个）
  const todayFocusTasks = useMemo(() => getTodayFocusTasks(tasks), [tasks])

  // 收集箱任务
  const inboxTasks = useMemo(() => getInboxTasks(tasks), [tasks])

  // 已过期任务
  const overdueTasks = useMemo(() => getOverdueTasks(tasks), [tasks])

  // 明天任务
  const tomorrowTasks = useMemo(() => getTomorrowTasks(tasks), [tasks])

  // 本周任务
  const weekTasks = useMemo(() => getWeekTasks(tasks), [tasks])

  // 任务统计
  const counts = useMemo(() => getTaskCounts(tasks), [tasks])

  // ============ 筛选和分组 ============

  // 根据 filter 筛选任务
  const getFilteredTasks = useCallback(
    (filter: string, searchQuery?: string) => {
      const filtered = filterTasks(tasks, filter, searchQuery)
      return sortTasks(filtered, sortBy)
    },
    [tasks, sortBy]
  )

  // 分组后的任务
  const getGroupedTasks = useCallback(
    (filter: string, searchQuery?: string): TaskGroup[] => {
      const filtered = filterTasks(tasks, filter, searchQuery)
      const sorted = sortTasks(filtered, sortBy)
      return groupTasks(sorted, groupBy, projects)
    },
    [tasks, sortBy, groupBy, projects]
  )

  // ============ 操作 ============

  const completeTask = useCallback(
    async (task: Task) => {
      try {
        await api.completeTask(task.projectId, task.id)
        // 乐观更新
        setTasks((prev) => prev.filter((t) => t.id !== task.id))
      } catch (err) {
        setError(err instanceof Error ? err.message : '完成任务失败')
        // 失败时刷新以恢复一致性
        await refresh()
      }
    },
    [refresh]
  )

  const deleteTask = useCallback(
    async (task: Task) => {
      try {
        await api.deleteTask(task.projectId, task.id)
        setTasks((prev) => prev.filter((t) => t.id !== task.id))
      } catch (err) {
        setError(err instanceof Error ? err.message : '删除任务失败')
        await refresh()
      }
    },
    [refresh]
  )

  const updateTask = useCallback(
    async (taskId: string, updates: Partial<Task>) => {
      try {
        const updated = await api.updateTask(taskId, updates)
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, ...updated } : t))
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : '更新任务失败')
        await refresh()
      }
    },
    [refresh]
  )

  const createTask = useCallback(
    async (task: Partial<Task>) => {
      try {
        const created = await api.createTask(task)
        // 创建后刷新数据，确保获取完整的任务信息
        await refresh()
        return created
      } catch (err) {
        setError(err instanceof Error ? err.message : '创建任务失败')
        throw err
      }
    },
    [refresh]
  )

  // 创建收集箱任务（只刷新 inbox，更快）
  const createInboxTask = useCallback(
    async (task: Partial<Task>) => {
      try {
        const created = await api.createTask(task)
        // 只刷新收集箱数据
        await refreshInbox()
        return created
      } catch (err) {
        setError(err instanceof Error ? err.message : '创建任务失败')
        throw err
      }
    },
    [refreshInbox]
  )

  return {
    // 原始数据
    tasks,
    projects,
    loading,
    error,

    // 计算视图
    todayTasks,
    todayFocusTasks,
    inboxTasks,
    overdueTasks,
    tomorrowTasks,
    weekTasks,
    counts,

    // 筛选和分组
    getFilteredTasks,
    getGroupedTasks,
    sortBy,
    setSortBy,
    groupBy,
    setGroupBy,

    // 操作
    refresh,
    refreshInbox,
    completeTask,
    deleteTask,
    updateTask,
    createTask,
    createInboxTask,
  }
}
