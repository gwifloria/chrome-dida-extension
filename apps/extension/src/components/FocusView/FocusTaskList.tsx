import { useCallback } from 'react'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppMode } from '@/contexts/AppModeContext'
import { useTasks } from '@/hooks/useTasks'
import { FocusSkeleton } from '../Task/TaskSkeleton'
import { FocusTaskInput } from './FocusTaskInput'
import { FocusTaskItem } from './FocusTaskItem'
import type { Task } from '@/types'

const MAX_LOCAL_TASKS = 3

export function FocusTaskList() {
  const { t } = useTranslation('focus')
  const { t: tCommon } = useTranslation('common')
  const { isGuest, loading: modeLoading } = useAppMode()

  const { data, actions, views } = useTasks()
  const { tasks, loading: tasksLoading } = data
  const { completeTask, createInboxTask } = actions
  const { todayFocusTasks } = views

  const focusTasks = isGuest ? tasks : todayFocusTasks
  const loading = modeLoading || tasksLoading
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
