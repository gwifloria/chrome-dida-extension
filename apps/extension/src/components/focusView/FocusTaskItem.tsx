import { memo } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useTaskCompletion } from '@/hooks/useTaskCompletion'
import { TaskCheckbox } from '../common/TaskCheckbox'
import type { Task, LocalTask } from '@/types'

interface FocusTaskItemProps {
  task: Task | LocalTask
  onComplete: (task: Task | LocalTask) => void
}

export const FocusTaskItem = memo(function FocusTaskItem({
  task,
  onComplete,
}: FocusTaskItemProps) {
  const { theme } = useTheme()
  const { completing, handleComplete } = useTaskCompletion(onComplete, {
    delayBefore: false,
  })

  return (
    <div
      className={`
        flex items-center gap-5 py-4 px-5 bg-[var(--bg-card)] rounded-xl shadow-sm
        transition-all duration-300 ease-out
        ${completing ? 'animate-[taskComplete_0.4s_ease-out_forwards]' : ''}
      `}
    >
      <TaskCheckbox
        completing={completing}
        onComplete={() => handleComplete(task)}
        variant="focus"
        disabled={completing}
      />
      <span
        className={`flex-1 text-2xl text-[var(--text-primary)] transition-all duration-200 ${completing ? 'line-through text-[var(--text-secondary)]' : ''}`}
        style={{
          fontFamily:
            theme.type === 'journal' ? 'var(--font-heading)' : 'inherit',
        }}
      >
        {task.title}
      </span>
    </div>
  )
})
