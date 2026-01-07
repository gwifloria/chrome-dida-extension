import { getRandomQuote, type Quote } from '@/data/quotes'
import { usePomodoro } from '@/hooks/usePomodoro'
import { useTheme } from '@/hooks/useTheme'
import type { Task } from '@/types'
import { Button } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Clock } from '../common/Clock'
import { FocusSkeleton } from '../Task/TaskSkeleton'
import { FocusQuote } from './FocusQuote'
import { FocusTaskInput } from './FocusTaskInput'
import { FocusTaskItem } from './FocusTaskItem'
import { FocusTopBar } from './FocusTopBar'
import { PomodoroControls } from './PomodoroControls'

interface FocusViewProps {
  focusTasks: Task[]
  loading: boolean
  onComplete: (task: Task) => void
  onCreate: (task: Partial<Task>) => Promise<Task | null>
  onSwitchView?: () => void
  todayTaskCount: number
  isGuestMode?: boolean
  canAddMore?: boolean
  onConnect?: () => void
  onDisconnect?: () => void
}

export function FocusView({
  focusTasks,
  loading,
  onComplete,
  onCreate,
  onSwitchView,
  todayTaskCount,
  isGuestMode = false,
  canAddMore = true,
  onConnect,
  onDisconnect,
}: FocusViewProps) {
  const { t } = useTranslation('focus')
  const { theme } = useTheme()
  const [quote] = useState<Quote>(() => getRandomQuote())

  // 番茄时钟
  const pomodoro = usePomodoro()

  return (
    <div className="h-screen bg-[var(--bg-primary)] flex flex-col relative overflow-hidden animate-fadeIn">
      {/* 背景纹理层 */}
      {theme.showTexture && (
        <div className="absolute inset-0 pointer-events-none opacity-40 paper-texture" />
      )}

      <FocusTopBar
        isGuestMode={isGuestMode}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
      />

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* 大时钟 / 番茄倒计时 */}
        <Clock
          variant="large"
          showGreeting
          pomodoroMode={pomodoro.mode}
          pomodoroTimeLeft={pomodoro.timeLeft}
        />

        {/* 番茄控制按钮 */}
        <PomodoroControls
          mode={pomodoro.mode}
          isRunning={pomodoro.isRunning}
          completedCount={pomodoro.completedCount}
          onStart={pomodoro.start}
          onPause={pomodoro.pause}
          onResume={pomodoro.resume}
          onReset={pomodoro.reset}
          onSkip={pomodoro.skip}
        />

        {/* TODAY'S FOCUS */}
        <div className="mt-6 w-full max-w-md">
          <h2 className="text-xs font-medium tracking-[3px] text-center text-[var(--text-secondary)] mb-5">
            {t('title')}
          </h2>

          {loading ? (
            <FocusSkeleton />
          ) : focusTasks.length === 0 ? (
            <div className="text-center text-[var(--text-secondary)] text-lg">
              {t('empty')}
            </div>
          ) : (
            <div className="space-y-4">
              {focusTasks.map((task) => (
                <FocusTaskItem
                  key={task.id}
                  task={task}
                  onComplete={onComplete}
                />
              ))}
            </div>
          )}

          <FocusTaskInput
            isGuestMode={isGuestMode}
            canAddMore={canAddMore}
            taskCount={focusTasks.length}
            onCreate={onCreate}
          />
        </div>
      </div>

      <FocusQuote quote={quote} />

      {/* 右下角 Todo 按钮 - 访客模式隐藏 */}
      {!isGuestMode && onSwitchView && (
        <Button
          type="default"
          shape="round"
          onClick={onSwitchView}
          className="todo-float-btn"
          aria-label={t('button.viewTasks', { count: todayTaskCount })}
        >
          Todo
          <span className="bg-[var(--accent)] text-white text-xs px-2 py-0.5 rounded-full">
            {todayTaskCount}
          </span>
        </Button>
      )}
    </div>
  )
}
