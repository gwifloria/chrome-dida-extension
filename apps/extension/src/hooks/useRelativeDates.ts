import { useState, useEffect } from 'react'
import {
  getTodayStr,
  getTomorrowStr,
  getDayAfterStr,
  getNextWeekStr,
} from '@/utils/date'

interface RelativeDates {
  todayStr: string
  tomorrowStr: string
  dayAfterStr: string
  nextWeekStr: string
}

/**
 * 获取相对日期字符串的 Hook
 * 用于任务过滤和分组中的日期比较
 * 会在每天午夜自动更新日期
 */
export function useRelativeDates(): RelativeDates {
  const [dates, setDates] = useState(() => ({
    todayStr: getTodayStr(),
    tomorrowStr: getTomorrowStr(),
    dayAfterStr: getDayAfterStr(),
    nextWeekStr: getNextWeekStr(),
  }))

  useEffect(() => {
    // 记录当前日期，用于检测日期变化
    let lastTodayStr = getTodayStr()

    // 每分钟检查日期是否变化（简单可靠，避免复杂的午夜计算）
    const intervalId = window.setInterval(() => {
      const currentTodayStr = getTodayStr()
      if (currentTodayStr !== lastTodayStr) {
        lastTodayStr = currentTodayStr
        setDates({
          todayStr: currentTodayStr,
          tomorrowStr: getTomorrowStr(),
          dayAfterStr: getDayAfterStr(),
          nextWeekStr: getNextWeekStr(),
        })
      }
    }, 60 * 1000) // 每分钟检查一次

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return dates
}
