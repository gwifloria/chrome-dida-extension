/**
 * 番茄时钟控制按钮
 */
import { memo } from 'react'
import { Button } from 'antd'
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  RedoOutlined,
  ForwardOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import type { PomodoroMode } from '@/hooks/usePomodoro'

interface PomodoroControlsProps {
  mode: PomodoroMode
  isRunning: boolean
  completedCount: number
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onReset: () => void
  onSkip: () => void
}

export const PomodoroControls = memo(function PomodoroControls({
  mode,
  isRunning,
  completedCount,
  onStart,
  onPause,
  onResume,
  onReset,
  onSkip,
}: PomodoroControlsProps) {
  const { t } = useTranslation('focus')

  // 空闲模式：显示开始按钮
  if (mode === 'idle') {
    return (
      <div className="mt-4">
        <Button
          type="text"
          size="large"
          icon={<PlayCircleOutlined />}
          onClick={onStart}
          className="!text-[var(--text-secondary)] hover:!text-[var(--accent)] !text-base"
        >
          {t('pomodoro.start')}
        </Button>
      </div>
    )
  }

  // 工作/休息模式：显示控制按钮
  return (
    <div className="mt-4 flex items-center gap-4">
      {/* 暂停/继续 */}
      {isRunning ? (
        <Button
          type="text"
          size="large"
          icon={<PauseCircleOutlined />}
          onClick={onPause}
          className="!text-[var(--text-secondary)] hover:!text-[var(--accent)]"
        >
          {t('pomodoro.pause')}
        </Button>
      ) : (
        <Button
          type="text"
          size="large"
          icon={<PlayCircleOutlined />}
          onClick={onResume}
          className="!text-[var(--text-secondary)] hover:!text-[var(--accent)]"
        >
          {t('pomodoro.resume')}
        </Button>
      )}

      {/* 跳过 */}
      <Button
        type="text"
        size="small"
        icon={<ForwardOutlined />}
        onClick={onSkip}
        className="!text-[var(--text-secondary)] hover:!text-[var(--text-primary)]"
      >
        {t('pomodoro.skip')}
      </Button>

      {/* 重置 */}
      <Button
        type="text"
        size="small"
        icon={<RedoOutlined />}
        onClick={onReset}
        className="!text-[var(--text-secondary)] hover:!text-[var(--text-primary)]"
      >
        {t('pomodoro.reset')}
      </Button>

      {/* 完成计数 */}
      {completedCount > 0 && (
        <span className="text-sm text-[var(--text-secondary)]">
          🍅 × {completedCount}
        </span>
      )}
    </div>
  )
})
