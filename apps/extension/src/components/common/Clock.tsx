import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useCurrentTime } from '@/hooks/useCurrentTime'
import { formatPomodoroTime, type PomodoroMode } from '@/hooks/usePomodoro'

interface ClockProps {
  variant: 'small' | 'large'
  showDate?: boolean
  className?: string
  // 番茄时钟模式
  pomodoroMode?: PomodoroMode
  pomodoroTimeLeft?: number
  onClick?: () => void
}

/**
 * 时钟组件 - 支持普通时钟和番茄时钟模式
 */
export const Clock = memo(function Clock({
  variant,
  showDate = false,
  className = '',
  pomodoroMode,
  pomodoroTimeLeft = 0,
  onClick,
}: ClockProps) {
  const { t } = useTranslation('focus')
  const { formattedTime, formattedDate } = useCurrentTime()

  // 番茄模式下显示倒计时
  const isPomodoroActive = pomodoroMode && pomodoroMode !== 'idle'
  const displayTime = isPomodoroActive
    ? formatPomodoroTime(pomodoroTimeLeft)
    : formattedTime

  // 番茄模式颜色
  const pomodoroColor =
    pomodoroMode === 'work'
      ? 'text-[var(--accent)]'
      : pomodoroMode === 'break'
        ? 'text-green-500'
        : ''

  if (variant === 'large') {
    return (
      <div
        role="timer"
        aria-label={displayTime}
        onClick={onClick}
        className={`text-[120px] font-extralight leading-none tracking-tight transition-all duration-700 cursor-pointer hover:scale-105 ${isPomodoroActive ? pomodoroColor : 'text-[var(--text-primary)]'} ${className}`}
      >
        {displayTime}
        {isPomodoroActive && (
          <div className="text-sm font-normal tracking-widest text-center mt-2 uppercase opacity-60">
            {pomodoroMode === 'work'
              ? t('pomodoro.working')
              : t('pomodoro.resting')}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={className} onClick={onClick}>
      <div
        className={`text-4xl max-md:text-2xl font-extralight leading-none ${isPomodoroActive ? pomodoroColor : 'text-[var(--text-secondary)]'}`}
      >
        {displayTime}
      </div>
      {showDate && !isPomodoroActive && (
        <div className="text-xs text-[var(--text-secondary)] mt-1">
          {formattedDate}
        </div>
      )}
    </div>
  )
})
