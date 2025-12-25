import { useMemo } from 'react'
import { formatDateStr } from '@/utils/date'

interface RelativeDates {
  todayStr: string
  tomorrowStr: string
  dayAfterStr: string
  nextWeekStr: string
}

/**
 * 获取相对日期字符串的 Hook
 * 用于任务过滤和分组中的日期比较
 */
export function useRelativeDates(): RelativeDates {
  return useMemo(() => {
    const now = new Date()
    const todayStr = formatDateStr(now)

    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = formatDateStr(tomorrow)

    const dayAfter = new Date(now)
    dayAfter.setDate(dayAfter.getDate() + 2)
    const dayAfterStr = formatDateStr(dayAfter)

    const nextWeek = new Date(now)
    nextWeek.setDate(nextWeek.getDate() + 7)
    const nextWeekStr = formatDateStr(nextWeek)

    return { todayStr, tomorrowStr, dayAfterStr, nextWeekStr }
  }, [])
}
