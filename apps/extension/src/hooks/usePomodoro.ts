/**
 * 番茄时钟 Hook
 */
import { useState, useEffect, useCallback, useRef } from 'react'

export type PomodoroMode = 'idle' | 'work' | 'break'

export interface PomodoroConfig {
  workDuration: number // 工作时长（分钟）
  breakDuration: number // 休息时长（分钟）
}

export interface PomodoroState {
  mode: PomodoroMode
  timeLeft: number // 剩余秒数
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

// 共享的 AudioContext 实例（Safari 兼容）
let sharedAudioContext: AudioContext | null = null
function getAudioContext(): AudioContext | null {
  if (!sharedAudioContext) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    if (AudioContextClass) {
      sharedAudioContext = new AudioContextClass()
    }
  }
  return sharedAudioContext
}

export function usePomodoro(
  config: Partial<PomodoroConfig> = {}
): PomodoroState & PomodoroActions {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }
  const intervalRef = useRef<number | null>(null)

  const [state, setState] = useState<PomodoroState>({
    mode: 'idle',
    timeLeft: mergedConfig.workDuration * 60,
    isRunning: false,
    completedCount: 0,
  })

  // 清理定时器
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // 播放提示音（复用共享 AudioContext）
  const playNotification = useCallback(() => {
    try {
      const audioContext = getAudioContext()
      if (!audioContext) return

      // 确保 AudioContext 处于运行状态
      if (audioContext.state === 'suspended') {
        audioContext.resume()
      }

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      gainNode.gain.value = 0.3

      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.2)

      // 第二声
      setTimeout(() => {
        const ctx = getAudioContext()
        if (!ctx) return
        const osc2 = ctx.createOscillator()
        const gain2 = ctx.createGain()
        osc2.connect(gain2)
        gain2.connect(ctx.destination)
        osc2.frequency.value = 1000
        osc2.type = 'sine'
        gain2.gain.value = 0.3
        osc2.start()
        osc2.stop(ctx.currentTime + 0.2)
      }, 250)
    } catch {
      // 静默失败
    }
  }, [])

  // 开始工作
  const start = useCallback(() => {
    clearTimer()
    setState((prev) => ({
      ...prev,
      mode: 'work',
      timeLeft: mergedConfig.workDuration * 60,
      isRunning: true,
    }))
  }, [clearTimer, mergedConfig.workDuration])

  // 暂停
  const pause = useCallback(() => {
    clearTimer()
    setState((prev) => ({ ...prev, isRunning: false }))
  }, [clearTimer])

  // 继续
  const resume = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: true }))
  }, [])

  // 重置
  const reset = useCallback(() => {
    clearTimer()
    setState({
      mode: 'idle',
      timeLeft: mergedConfig.workDuration * 60,
      isRunning: false,
      completedCount: 0,
    })
  }, [clearTimer, mergedConfig.workDuration])

  // 跳过当前阶段
  const skip = useCallback(() => {
    clearTimer()
    setState((prev) => {
      if (prev.mode === 'work') {
        return {
          ...prev,
          mode: 'break',
          timeLeft: mergedConfig.breakDuration * 60,
          isRunning: true,
          completedCount: prev.completedCount + 1,
        }
      } else if (prev.mode === 'break') {
        return {
          ...prev,
          mode: 'work',
          timeLeft: mergedConfig.workDuration * 60,
          isRunning: true,
        }
      }
      return prev
    })
  }, [clearTimer, mergedConfig.breakDuration, mergedConfig.workDuration])

  // 倒计时逻辑
  useEffect(() => {
    if (!state.isRunning) return

    intervalRef.current = window.setInterval(() => {
      setState((prev) => {
        if (prev.timeLeft <= 1) {
          playNotification()

          // 切换模式
          if (prev.mode === 'work') {
            return {
              ...prev,
              mode: 'break',
              timeLeft: mergedConfig.breakDuration * 60,
              completedCount: prev.completedCount + 1,
            }
          } else if (prev.mode === 'break') {
            return {
              ...prev,
              mode: 'work',
              timeLeft: mergedConfig.workDuration * 60,
            }
          }
        }

        return { ...prev, timeLeft: prev.timeLeft - 1 }
      })
    }, 1000)

    return clearTimer
  }, [
    state.isRunning,
    clearTimer,
    playNotification,
    mergedConfig.breakDuration,
    mergedConfig.workDuration,
  ])

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
