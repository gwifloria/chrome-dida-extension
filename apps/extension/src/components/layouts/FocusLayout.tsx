import { memo } from 'react'
import { FocusView } from '@/components/FocusView'
import { Onboarding } from '@/components/Onboarding'
import type { Task } from '@/types'

interface FocusLayoutProps {
  focusTasks: Task[]
  loading: boolean
  todayTaskCount: number
  isGuestMode: boolean
  canAddMore: boolean
  onComplete: (task: Task) => void
  onCreate: (task: Partial<Task>) => Promise<Task | null>
  onSwitchView?: () => void
  onConnect?: () => void
  onDisconnect?: () => void
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
  onDisconnect,
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
        onDisconnect={onDisconnect}
      />
    </>
  )
})
