/**
 * 日期判断函数
 */
import {
  extractDateStr,
  getTodayStr,
  getTomorrowStr,
  getNextWeekStr,
} from '../date'

export function isToday(dueDate?: string): boolean {
  if (!dueDate) return false
  return extractDateStr(dueDate) === getTodayStr()
}

export function isTomorrow(dueDate?: string): boolean {
  if (!dueDate) return false
  return extractDateStr(dueDate) === getTomorrowStr()
}

export function isThisWeek(dueDate?: string): boolean {
  if (!dueDate) return false
  const dateStr = extractDateStr(dueDate)
  const todayStr = getTodayStr()
  const nextWeekStr = getNextWeekStr()
  return dateStr >= todayStr && dateStr < nextWeekStr
}

export function isOverdue(dueDate?: string): boolean {
  if (!dueDate) return false
  return extractDateStr(dueDate) < getTodayStr()
}
