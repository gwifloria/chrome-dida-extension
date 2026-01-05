import { useState } from 'react'
import { Input } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSettings } from '@/hooks/useSettings'
import { formatDateTimeWithTimezone } from '@/utils/date'
import { FILTER_NAMES } from '@/constants/task'
import type { Task, Project } from '@/types'

interface QuickAddInputProps {
  filter: string
  projects: Project[]
  onCreate: (task: Partial<Task>) => Promise<Task>
  onOpenEditor: () => void
}

export function QuickAddInput({
  filter,
  projects,
  onCreate,
  onOpenEditor,
}: QuickAddInputProps) {
  const { t } = useTranslation('task')
  const { settings } = useSettings()
  const [quickAddValue, setQuickAddValue] = useState('')

  const handleQuickAdd = async () => {
    if (!quickAddValue.trim()) return

    let projectId: string | undefined
    let dueDate: string | undefined

    // 根据 filter 设置 projectId
    if (filter.startsWith('project:')) {
      projectId = filter.replace('project:', '')
    } else if (settings.defaultProjectId) {
      projectId = settings.defaultProjectId
    } else {
      projectId = projects[0]?.id
    }

    // 根据 filter 设置 dueDate
    if (filter === FILTER_NAMES.TODAY) {
      dueDate = formatDateTimeWithTimezone(new Date())
    } else if (filter === FILTER_NAMES.TOMORROW) {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      dueDate = formatDateTimeWithTimezone(tomorrow)
    }
    // week/overdue/nodate 不设置默认日期

    await onCreate({
      title: quickAddValue.trim(),
      projectId,
      dueDate,
    })
    setQuickAddValue('')
  }

  return (
    <div className="mb-6">
      <Input
        placeholder={t('placeholder.quickAdd')}
        value={quickAddValue}
        onChange={(e) => setQuickAddValue(e.target.value)}
        onPressEnter={handleQuickAdd}
        className="quick-add-input"
        variant="borderless"
        suffix={
          <span
            className="text-[11px] text-[var(--text-secondary)] bg-[var(--bg-card)] py-0.5 px-1.5 rounded cursor-pointer hover:bg-[var(--border)]"
            onClick={onOpenEditor}
          >
            ⌘ K
          </span>
        }
      />
    </div>
  )
}
