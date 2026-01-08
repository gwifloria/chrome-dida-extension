import { useSyncExternalStore } from 'react'
import { formatTime, formatDisplayDate } from '@/utils/date'

// 全局时间状态 - 所有消费者共享
let currentTime = new Date()
const listeners = new Set<() => void>()
let timerId: number | null = null

function subscribe(callback: () => void): () => void {
  listeners.add(callback)
  startTimer()
  return () => {
    // 防御性删除：确保 callback 确实存在
    if (listeners.has(callback)) {
      listeners.delete(callback)
    }
    stopTimerIfNoListeners()
  }
}

function getSnapshot(): Date {
  return currentTime
}

function startTimer() {
  if (timerId !== null) return
  timerId = window.setInterval(() => {
    currentTime = new Date()
    listeners.forEach((listener) => listener())
  }, 1000)
}

function stopTimerIfNoListeners() {
  if (listeners.size === 0 && timerId !== null) {
    clearInterval(timerId)
    timerId = null
  }
}

/**
 * 订阅当前时间更新的 Hook
 * 使用 useSyncExternalStore 实现最佳性能
 * 所有消费者共享同一个定时器
 */
export function useCurrentTime() {
  const time = useSyncExternalStore(subscribe, getSnapshot)

  return {
    time,
    hours: time.getHours(),
    formattedTime: formatTime(time),
    formattedDate: formatDisplayDate(time),
  }
}
