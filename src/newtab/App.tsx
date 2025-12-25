import { useState } from 'react'
import { Button } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { useAuth } from '@/hooks/useAuth'
import { useTasks } from '@/hooks/useTasks'
import { TaskList } from '@/components/TaskList'
import { Sidebar } from '@/components/Sidebar'
import { LoginButton } from '@/components/LoginButton'

function AppContent() {
  const { isLoggedIn, loading: authLoading, login, logout } = useAuth()
  const {
    tasks,
    projects,
    loading: tasksLoading,
    error,
    completeTask,
    deleteTask,
    updateTask,
    createTask,
  } = useTasks(isLoggedIn)

  const [selectedFilter, setSelectedFilter] = useState('today')
  const [searchQuery, setSearchQuery] = useState('')

  if (!isLoggedIn) {
    return <LoginButton loading={authLoading} onLogin={login} />
  }

  return (
    <div className="h-screen bg-[var(--bg-primary)] flex overflow-hidden">
      {/* 侧边栏 */}
      <Sidebar
        tasks={tasks}
        projects={projects}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        onSearch={setSearchQuery}
      />

      {/* 右侧内容区域 - 有外边距 */}
      <div className="flex-1 p-3 pl-0 min-h-0">
        <div className="h-full bg-[var(--bg-content)] bg-dotted rounded-2xl overflow-hidden relative shadow-[var(--shadow-small)]">
          {/* 登出按钮 */}
          <div className="absolute top-3 right-3 z-50">
            <Button
              type="text"
              size="small"
              icon={<LogoutOutlined />}
              onClick={logout}
              className="text-[var(--text-secondary)] text-xs hover:text-[var(--accent)]"
            />
          </div>

          <main className="h-full overflow-y-auto">
            <TaskList
              tasks={tasks}
              projects={projects}
              loading={tasksLoading}
              error={error}
              filter={selectedFilter}
              searchQuery={searchQuery}
              onComplete={completeTask}
              onDelete={deleteTask}
              onUpdate={updateTask}
              onCreate={createTask}
            />
          </main>
        </div>
      </div>
    </div>
  )
}

function App() {
  return <AppContent />
}

export default App
