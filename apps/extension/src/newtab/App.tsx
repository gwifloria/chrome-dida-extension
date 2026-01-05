import { useState, useCallback, useRef, useEffect } from 'react'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'
import { FocusLayout, ListLayout } from '@/components/layouts'
import { ConnectPrompt } from '@/components/ConnectPrompt'
import { useAppMode } from '@/hooks/useAppMode'
import { useTasks } from '@/hooks/useTasks'
import {
  migrateLocalTasksToDidaList,
  clearLocalTasks,
} from '@/services/taskMigration'
import type { Task } from '@/types'
import type { AdapterType } from '@/api/adapters'

type ViewMode = 'focus' | 'list'

const MAX_LOCAL_TASKS = 3

function AppContent() {
  const { t } = useTranslation('common')
  const {
    isGuest,
    isConnected,
    connect,
    disconnect,
    loading: modeLoading,
  } = useAppMode()

  // 根据连接状态选择适配器
  const adapterType: AdapterType = isConnected ? 'didaList' : 'local'
  const { data, actions, views } = useTasks(adapterType)
  const { tasks, projects, loading: tasksLoading, error } = data
  const { completeTask, deleteTask, updateTask, createTask, createInboxTask } =
    actions
  const { todayFocusTasks, counts } = views

  const [viewMode, setViewMode] = useState<ViewMode>('focus')
  const [selectedFilter, setSelectedFilter] = useState('today')
  const [searchQuery, setSearchQuery] = useState('')

  // Connect prompt state
  const [showConnectPrompt, setShowConnectPrompt] = useState(false)
  const [connectLoading, setConnectLoading] = useState(false)

  // 防止组件卸载后更新状态
  const mountedRef = useRef(true)
  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Handle connect button click
  const handleConnectClick = useCallback(() => {
    setShowConnectPrompt(true)
  }, [])

  // Connect and migrate local tasks
  const handleConnectAndMigrate = useCallback(async () => {
    setConnectLoading(true)
    try {
      await connect()
      const result = await migrateLocalTasksToDidaList()
      if (!mountedRef.current) return
      if (result.success > 0) {
        message.success(t('message.syncSuccess', { count: result.success }))
      }
      if (result.failed > 0) {
        message.warning(t('message.syncFailed', { count: result.failed }))
      }
      setShowConnectPrompt(false)
    } catch {
      if (!mountedRef.current) return
      message.error(t('message.failedToConnect'))
    } finally {
      if (mountedRef.current) {
        setConnectLoading(false)
      }
    }
  }, [connect, t])

  // Connect without migrating
  const handleConnectWithoutMigrate = useCallback(async () => {
    setConnectLoading(true)
    try {
      await connect()
      await clearLocalTasks()
      if (!mountedRef.current) return
      setShowConnectPrompt(false)
    } catch {
      if (!mountedRef.current) return
      message.error(t('message.failedToConnect'))
    } finally {
      if (mountedRef.current) {
        setConnectLoading(false)
      }
    }
  }, [connect, t])

  // Cancel connect
  const handleCancelConnect = useCallback(() => {
    setShowConnectPrompt(false)
  }, [])

  // Switch to list view
  const handleSwitchToList = useCallback(() => {
    setViewMode('list')
  }, [])

  // Handle task completion (统一接口，不再需要类型判断)
  const handleComplete = useCallback(
    async (task: Task) => {
      await completeTask(task)
    },
    [completeTask]
  )

  // Handle task creation (统一接口)
  const handleCreate = useCallback(
    async (taskData: Partial<Task>): Promise<Task | null> => {
      try {
        return await createInboxTask(taskData)
      } catch (err) {
        // 访客模式任务数量超限
        if (err instanceof Error && err.message.includes('上限')) {
          message.warning(t('message.taskLimitReached'))
        }
        return null
      }
    },
    [createInboxTask, t]
  )

  // Focus view 显示的任务
  const focusTasks = isGuest ? tasks : todayFocusTasks
  const todayCount = isGuest ? tasks.length : counts.today
  // 访客模式：最多 3 个任务
  const canAddMore = isGuest ? tasks.length < MAX_LOCAL_TASKS : true

  // Guest mode: Always show Focus view
  // Connected mode: Show Focus or List based on viewMode
  if (isGuest || viewMode === 'focus') {
    return (
      <>
        <FocusLayout
          focusTasks={focusTasks}
          loading={modeLoading || tasksLoading}
          todayTaskCount={todayCount}
          isGuestMode={isGuest}
          canAddMore={canAddMore}
          onComplete={handleComplete}
          onCreate={handleCreate}
          onSwitchView={isGuest ? undefined : handleSwitchToList}
          onConnect={handleConnectClick}
          onDisconnect={disconnect}
        />
        {/* ConnectPrompt 独立渲染，避免状态变化导致 FocusLayout 重渲染 */}
        <ConnectPrompt
          open={showConnectPrompt}
          localTaskCount={tasks.length}
          loading={connectLoading}
          onConnectAndMigrate={handleConnectAndMigrate}
          onConnectWithoutMigrate={handleConnectWithoutMigrate}
          onCancel={handleCancelConnect}
        />
      </>
    )
  }

  // Connected mode: List view
  return (
    <ListLayout
      tasks={tasks}
      projects={projects}
      counts={counts}
      loading={tasksLoading}
      error={error}
      selectedFilter={selectedFilter}
      searchQuery={searchQuery}
      onFilterChange={setSelectedFilter}
      onSearch={setSearchQuery}
      onComplete={completeTask}
      onDelete={deleteTask}
      onUpdate={updateTask}
      onCreate={createTask}
      onFocus={() => setViewMode('focus')}
      onDisconnect={disconnect}
    />
  )
}

function App() {
  return <AppContent />
}

export default App
