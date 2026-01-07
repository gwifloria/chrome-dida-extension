import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppMode } from '@/contexts/AppModeContext'
import { useTasks } from '@/hooks/useTasks'

interface FocusFloatButtonProps {
  onSwitchView?: () => void
}

export function FocusFloatButton({ onSwitchView }: FocusFloatButtonProps) {
  const { t } = useTranslation('focus')
  const { isGuest } = useAppMode()
  const { data, views } = useTasks()

  const todayCount = isGuest ? data.tasks.length : views.counts.today

  // 访客模式或无切换回调时不显示
  if (isGuest || !onSwitchView) {
    return null
  }

  return (
    <Button
      type="default"
      shape="round"
      onClick={onSwitchView}
      className="todo-float-btn"
      aria-label={t('button.viewTasks', { count: todayCount })}
    >
      Todo
      <span className="bg-[var(--accent)] text-white text-xs px-2 py-0.5 rounded-full">
        {todayCount}
      </span>
    </Button>
  )
}
