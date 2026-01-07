import { useCallback, memo } from 'react'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppMode } from '@/contexts/useAppMode'
import { useTasks } from '@/hooks/useTasks'
import { useTaskCompletion } from '@/hooks/useTaskCompletion'
import { FocusSkeleton } from '../Task/TaskSkeleton'
import { FocusTaskInput } from './FocusTaskInput'
import { TaskCheckbox } from '../common/TaskCheckbox'
import type { Task } from '@/types'

const MAX_LOCAL_TASKS = 3

interface FocusTaskItemProps {
  task: Task
  onComplete: (task: Task) => void
}

const FocusTaskItem = memo(function FocusTaskItem({
  task,
  onComplete,
}: FocusTaskItemProps) {
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
        className={`flex-1 text-2xl text-[var(--text-primary)] transition-all duration-200 font-hand ${completing ? 'line-through text-[var(--text-secondary)]' : ''}`}
      >
        {task.title}
      </span>
    </div>
  )
})

export function FocusTaskList() {
  const { t } = useTranslation('focus')
  const { t: tCommon } = useTranslation('common')
  const { isGuest } = useAppMode()

  const { data, actions, views } = useTasks()
  const { tasks, loading: tasksLoading } = data
  const { completeTask, createInboxTask } = actions
  const { todayFocusTasks } = views

  const focusTasks = isGuest ? tasks : todayFocusTasks
  // 只在初始加载时显示 skeleton，连接过程中保持显示原内容
  const loading = tasksLoading && tasks.length === 0
  const canAddMore = isGuest ? focusTasks.length < MAX_LOCAL_TASKS : true

  const handleCreate = useCallback(
    async (taskData: Partial<Task>): Promise<Task | null> => {
      try {
        return await createInboxTask(taskData)
      } catch (err) {
        if (err instanceof Error && err.message.includes('上限')) {
          message.warning(tCommon('message.taskLimitReached'))
        }
        return null
      }
    },
    [createInboxTask, tCommon]
  )

  return (
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
              onComplete={completeTask}
            />
          ))}
        </div>
      )}

      <FocusTaskInput
        isGuestMode={isGuest}
        canAddMore={canAddMore}
        taskCount={focusTasks.length}
        onCreate={handleCreate}
      />
    </div>
  )
}
