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
  const { todayStr, tomorrowStr } = useRelativeDates()

  // 过滤任务
  const filteredTasks = useMemo(
    () => filterTasks(tasks, filter, searchQuery),
    [tasks, filter, searchQuery]
  )

  // 按日期分组并排序（单次遍历分类）
  const groups = useMemo<TaskGroup[]>(() => {
    // 预分类容器
    const categorized = {
      pinned: [] as Task[],
      overdue: [] as Task[],
      today: [] as Task[],
      tomorrow: [] as Task[],
      later: [] as Task[],
      nodate: [] as Task[],
    }

    // 单次遍历分类
    for (const task of filteredTasks) {
      if (task.sortOrder > 0) {
        categorized.pinned.push(task)
      } else if (!task.dueDate) {
        categorized.nodate.push(task)
      } else {
        const dateStr = extractDateStr(task.dueDate)
        if (dateStr < todayStr) {
          categorized.overdue.push(task)
        } else if (dateStr === todayStr) {
          categorized.today.push(task)
        } else if (dateStr === tomorrowStr) {
          categorized.tomorrow.push(task)
        } else {
          categorized.later.push(task)
        }
      }
    }

    // 排序函数
    const byPriority = (a: Task, b: Task) => b.priority - a.priority
    const bySortOrder = (a: Task, b: Task) => b.sortOrder - a.sortOrder

    // 分组配置（顺序即显示顺序）
    const groupConfigs: {
      id: keyof typeof categorized
      titleKey: string
      sort: (a: Task, b: Task) => number
    }[] = [
      { id: 'pinned', titleKey: 'group.pinned', sort: bySortOrder },
      { id: 'overdue', titleKey: 'group.overdue', sort: byPriority },
      { id: 'today', titleKey: 'group.today', sort: byPriority },
      { id: 'tomorrow', titleKey: 'group.tomorrow', sort: byPriority },
      { id: 'later', titleKey: 'group.later', sort: byPriority },
      { id: 'nodate', titleKey: 'group.noDate', sort: byPriority },
    ]

    // 构建结果
    return groupConfigs
      .filter((cfg) => categorized[cfg.id].length > 0)
      .map((cfg) => ({
        id: cfg.id,
        title: t(cfg.titleKey),
        tasks: categorized[cfg.id].sort(cfg.sort),
      }))
  }, [filteredTasks, todayStr, tomorrowStr, t])

  return groups
}
