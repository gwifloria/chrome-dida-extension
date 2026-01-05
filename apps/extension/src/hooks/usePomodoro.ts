/**
 * 番茄时钟 Hook - 支持多 Tab 同步
 */
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { storage, type PomodoroStorage } from '@/services/storage'

export type PomodoroMode = 'idle' | 'work' | 'break'

export interface PomodoroConfig {
  workDuration: number // 工作时长（分钟）
  breakDuration: number // 休息时长（分钟）
}

export interface PomodoroState {
  mode: PomodoroMode
  timeLeft: number // 剩余秒数（计算得出）
  isRunning: boolean
  completedCount: number // 完成的番茄数
}

export interface PomodoroActions {
  start: () => void
  pause: () => void
  resume: () => void
  reset: () => void
  skip: () => void
}

const DEFAULT_CONFIG: PomodoroConfig = {
  workDuration: 25,
  breakDuration: 5,
}

// 计算剩余时间
function calculateTimeLeft(stored: PomodoroStorage): number {
  if (stored.mode === 'idle') {
    return stored.config.workDuration * 60
  }

  if (!stored.isRunning) {
    return stored.pausedTimeLeft ?? stored.config.workDuration * 60
  }

  const duration =
    stored.mode === 'work'
      ? stored.config.workDuration * 60
      : stored.config.breakDuration * 60

  // 防御性检查：startTime 应该在 isRunning 时存在
  if (!stored.startTime) {
    console.warn('[Pomodoro] isRunning=true 但 startTime 为空，返回完整时长')
    return duration
  }

  const elapsed = Math.floor((Date.now() - stored.startTime) / 1000)
  return Math.max(0, duration - elapsed)
}

export function usePomodoro(
  config: Partial<PomodoroConfig> = {}
): PomodoroState & PomodoroActions {
  const mergedConfig = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...config }),
    [config]
  )
  const intervalRef = useRef<number | null>(null)
  const storageRef = useRef<PomodoroStorage | null>(null)
  const switchToNextPhaseRef = useRef<(() => Promise<void>) | null>(null)

  const [state, setState] = useState<PomodoroState>({
    mode: 'idle',
    timeLeft: mergedConfig.workDuration * 60,
    isRunning: false,
    completedCount: 0,
  })

  // 从存储状态更新本地状态
  const updateFromStorage = useCallback(
    (stored: PomodoroStorage | null) => {
      if (!stored) {
        setState({
          mode: 'idle',
          timeLeft: mergedConfig.workDuration * 60,
          isRunning: false,
          completedCount: 0,
        })
        storageRef.current = null
        return
      }

      storageRef.current = stored
      setState({
        mode: stored.mode,
        timeLeft: calculateTimeLeft(stored),
        isRunning: stored.isRunning,
        completedCount: stored.completedCount,
      })
    },
    [mergedConfig.workDuration]
  )

  // 切换到下一阶段（不自动开始，等待用户手动触发）
  const switchToNextPhase = useCallback(async () => {
    const stored = storageRef.current
    if (!stored) return

    const now = Date.now()
    const nextMode = stored.mode === 'work' ? 'break' : 'work'
    const nextDuration =
      nextMode === 'work'
        ? stored.config.workDuration * 60
        : stored.config.breakDuration * 60

    const newStored: PomodoroStorage = {
      ...stored,
      mode: nextMode,
      isRunning: false, // 不自动开始，等待用户手动触发
      startTime: null,
      pausedTimeLeft: nextDuration, // 设置为下一阶段的完整时长
      completedCount:
        stored.mode === 'work'
          ? stored.completedCount + 1
          : stored.completedCount,
      lastNotificationTime: now,
    }

    await storage.setPomodoro(newStored)
  }, [])

  // 保持 ref 与最新函数同步
  useEffect(() => {
    switchToNextPhaseRef.current = switchToNextPhase
  }, [switchToNextPhase])

  // 初始化和监听 storage 变化
  useEffect(() => {
    // 加载初始状态
    storage.getPomodoro().then(updateFromStorage)

    // 监听 storage 变化
    const unsubscribe = storage.onPomodoroChange(updateFromStorage)

    return unsubscribe
  }, [updateFromStorage])

  // 定时器：每秒更新 timeLeft 并检查是否需要切换阶段
  useEffect(() => {
    if (!state.isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = window.setInterval(() => {
      const stored = storageRef.current
      if (!stored || !stored.isRunning) return

      const timeLeft = calculateTimeLeft(stored)

      if (timeLeft <= 0) {
        // 使用 ref 避免依赖变化导致定时器重注册
        switchToNextPhaseRef.current?.()
      } else {
        setState((prev) => ({ ...prev, timeLeft }))
      }
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [state.isRunning])

  // 开始工作
  const start = useCallback(async () => {
    const newStored: PomodoroStorage = {
      mode: 'work',
      isRunning: true,
      completedCount: storageRef.current?.completedCount ?? 0,
      startTime: Date.now(),
      pausedTimeLeft: null,
      lastNotificationTime: null,
      config: mergedConfig,
    }
    await storage.setPomodoro(newStored)
  }, [mergedConfig])

  // 暂停
  const pause = useCallback(async () => {
    const stored = storageRef.current
    if (!stored || !stored.isRunning) return

    const timeLeft = calculateTimeLeft(stored)
    const newStored: PomodoroStorage = {
      ...stored,
      isRunning: false,
      pausedTimeLeft: timeLeft,
      startTime: null,
    }
    await storage.setPomodoro(newStored)
  }, [])

  // 继续
  const resume = useCallback(async () => {
    const stored = storageRef.current
    if (!stored || stored.isRunning || stored.mode === 'idle') return

    const newStored: PomodoroStorage = {
      ...stored,
      isRunning: true,
      startTime: Date.now(),
      // startTime 基于 pausedTimeLeft 反推
    }

    // 计算新的 startTime，使得 timeLeft = pausedTimeLeft
    const duration =
      stored.mode === 'work'
        ? stored.config.workDuration * 60
        : stored.config.breakDuration * 60
    const elapsed = duration - (stored.pausedTimeLeft ?? duration)
    newStored.startTime = Date.now() - elapsed * 1000

    await storage.setPomodoro(newStored)
  }, [])

  // 重置
  const reset = useCallback(async () => {
    await storage.clearPomodoro()
  }, [])

  // 跳过当前阶段
  const skip = useCallback(async () => {
    const stored = storageRef.current
    if (!stored || stored.mode === 'idle') return

    const newStored: PomodoroStorage = {
      ...stored,
      mode: stored.mode === 'work' ? 'break' : 'work',
      isRunning: true,
      startTime: Date.now(),
      pausedTimeLeft: null,
      completedCount:
        stored.mode === 'work'
          ? stored.completedCount + 1
          : stored.completedCount,
    }
    await storage.setPomodoro(newStored)
  }, [])

  return {
    ...state,
    start,
    pause,
    resume,
    reset,
    skip,
  }
}

/**
 * 格式化时间为 MM:SS
 */
export function formatPomodoroTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
