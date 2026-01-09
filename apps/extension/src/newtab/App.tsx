import { useState, useCallback } from 'react'
import { useAppMode } from '@/contexts/useAppMode'
import { TaskProvider } from '@/contexts/TaskProvider'
import { FocusLayout, ListLayout } from '@/components/layouts'

type ViewMode = 'focus' | 'list'

function AppContent() {
  const { isGuest } = useAppMode()
  const [viewMode, setViewMode] = useState<ViewMode>('focus')

  const handleSwitchToList = useCallback(() => setViewMode('list'), [])
  const handleSwitchToFocus = useCallback(() => setViewMode('focus'), [])

  // 访客模式始终显示 Focus 视图
  if (isGuest || viewMode === 'focus') {
    return <FocusLayout onSwitchView={handleSwitchToList} />
  }

  // 已连接：列表视图
  return <ListLayout onFocus={handleSwitchToFocus} />
}

function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  )
}

export default App
