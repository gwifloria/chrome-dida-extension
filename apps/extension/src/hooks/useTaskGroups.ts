import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useRelativeDates } from './useRelativeDates'
import { filterTasks, type TaskGroup } from '@/utils/taskFilters'
import { extractDateStr } from '@/utils/date'
import type { Task } from '@/types'

interface UseTaskGroupsOptions {
  tasks: Task[]
  filter: string
  searchQuery?: string
}

export function useTaskGroups({
  tasks,
  filter,
  searchQuery,
}: UseTaskGroupsOptions): TaskGroup[] {
  const { t } = useTranslation('task')
  const { todayStr, tomorrowStr, dayAfterStr } = useRelativeDates()

  // 过滤任务
  const filteredTasks = useMemo(
    () => filterTasks(tasks, filter, searchQuery),
    [tasks, filter, searchQuery]
  )

  // 按日期分组并排序
  const groups = useMemo<TaskGroup[]>(() => {
    const result: TaskGroup[] = []

    // 置顶任务 (sortOrder 较大的表示置顶)
    const pinned = filteredTasks.filter((t) => t.sortOrder > 0)
    if (pinned.length > 0) {
      result.push({
        id: 'pinned',
        title: t('group.pinned'),
        tasks: pinned.sort((a, b) => b.sortOrder - a.sortOrder),
      })
    }

    // 非置顶任务
    const unpinned = filteredTasks.filter((t) => t.sortOrder <= 0)

    // 已过期
    const overdue = unpinned.filter((task) => {
      if (!task.dueDate) return false
      return extractDateStr(task.dueDate) < todayStr
    })
    if (overdue.length > 0) {
      result.push({ id: 'overdue', title: t('group.overdue'), tasks: overdue })
    }

    // 今天
    const todayTasks = unpinned.filter((task) => {
      if (!task.dueDate) return false
      return extractDateStr(task.dueDate) === todayStr
    })
    if (todayTasks.length > 0) {
      result.push({ id: 'today', title: t('group.today'), tasks: todayTasks })
    }

    // 明天
    const tomorrowTasks = unpinned.filter((task) => {
      if (!task.dueDate) return false
      return extractDateStr(task.dueDate) === tomorrowStr
    })
    if (tomorrowTasks.length > 0) {
      result.push({
        id: 'tomorrow',
        title: t('group.tomorrow'),
        tasks: tomorrowTasks,
      })
    }

    // 之后
    const later = unpinned.filter((task) => {
      if (!task.dueDate) return false
      return extractDateStr(task.dueDate) >= dayAfterStr
    })
    if (later.length > 0) {
      result.push({ id: 'later', title: t('group.later'), tasks: later })
    }

    // 无日期
    const noDate = unpinned.filter((task) => !task.dueDate)
    if (noDate.length > 0) {
      result.push({ id: 'nodate', title: t('group.noDate'), tasks: noDate })
    }

    // 对每组内的任务按优先级排序
    return result.map((group) => ({
      ...group,
      tasks:
        group.id === 'pinned'
          ? group.tasks // 置顶组保持 sortOrder 排序
          : [...group.tasks].sort((a, b) => b.priority - a.priority),
    }))
  }, [filteredTasks, todayStr, tomorrowStr, dayAfterStr, t])

  return groups
}
