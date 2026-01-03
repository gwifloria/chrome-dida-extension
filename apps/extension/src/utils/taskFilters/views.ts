/**
 * 任务视图计算函数
 */
import type { Task } from '@/types'
import type { TaskCounts } from './types'
import { isToday, isTomorrow, isThisWeek, isOverdue } from './predicates'

export function getTodayTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => isToday(t.dueDate))
}

/**
 * 获取今日专注任务
 * 逻辑：
 * 1. 优先显示今日任务（按优先级排序）
 * 2. 不足则用过期任务补足（按优先级排序）
 * 3. 最多显示 3 个
 */
export function getTodayFocusTasks(tasks: Task[], limit = 3): Task[] {
  // 今日任务，按优先级排序
  const todayTasks = tasks
    .filter((t) => isToday(t.dueDate))
    .sort((a, b) => b.priority - a.priority)

  if (todayTasks.length >= limit) {
    return todayTasks.slice(0, limit)
  }

  // 不足则用过期任务补足
  const overdueTasks = tasks
    .filter((t) => isOverdue(t.dueDate))
    .sort((a, b) => b.priority - a.priority)

  const combined = [...todayTasks, ...overdueTasks]
  return combined.slice(0, limit)
}

export function getInboxTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => t.projectId.startsWith('inbox'))
}

export function getOverdueTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => isOverdue(t.dueDate))
}

export function getTomorrowTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => isTomorrow(t.dueDate))
}

export function getWeekTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => isThisWeek(t.dueDate))
}

export function getTaskCounts(tasks: Task[]): TaskCounts {
  return {
    inbox: getInboxTasks(tasks).length,
    today: getTodayTasks(tasks).length,
    tomorrow: getTomorrowTasks(tasks).length,
    week: getWeekTasks(tasks).length,
    overdue: getOverdueTasks(tasks).length,
  }
}
