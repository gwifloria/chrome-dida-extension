import { memo } from 'react'
import { FocusView } from '@/components/FocusView'
import { Onboarding } from '@/components/Onboarding'
import type { Task, LocalTask } from '@/types'

interface FocusLayoutProps {
  focusTasks: (Task | LocalTask)[]
  loading: boolean
  todayTaskCount: number
  isGuestMode: boolean
  canAddMore: boolean
  onComplete: (task: Task | LocalTask) => void
  onCreate: (task: Partial<Task>) => Promise<Task | LocalTask | null>
  onSwitchView?: () => void
  onConnect?: () => void
}

// memo 避免 ConnectPrompt 状态变化导致重渲染
export const FocusLayout = memo(function FocusLayout({
  focusTasks,
  loading,
  todayTaskCount,
  isGuestMode,
  canAddMore,
  onComplete,
  onCreate,
  onSwitchView,
  onConnect,
}: FocusLayoutProps) {
  return (
    <>
      <Onboarding />
      <FocusView
        focusTasks={focusTasks}
        loading={loading}
        onComplete={onComplete}
        onCreate={onCreate}
        onSwitchView={onSwitchView}
        todayTaskCount={todayTaskCount}
        isGuestMode={isGuestMode}
        canAddMore={canAddMore}
        onConnect={onConnect}
      />
    </>
  )
})
