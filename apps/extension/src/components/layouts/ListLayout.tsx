import { useState } from 'react'
import { Button } from 'antd'
import { AppstoreOutlined } from '@ant-design/icons'
import { useTasks } from '@/hooks/useTasks'
import { Sidebar } from '@/components/Sidebar'
import { TaskList } from '@/components/TaskList'
import { useTheme } from '@/hooks/useTheme'

interface ListLayoutProps {
  onFocus: () => void
}

export function ListLayout({ onFocus }: ListLayoutProps) {
  const { theme } = useTheme()

  const { data, actions, views } = useTasks()
  const { tasks, projects, loading, error } = data
  const { completeTask, deleteTask, updateTask, createTask } = actions
  const { counts } = views

  const [selectedFilter, setSelectedFilter] = useState('today')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="h-screen bg-[var(--bg-primary)] flex overflow-hidden relative animate-fadeIn">
      {/* 背景纹理层 */}
      {theme.showTexture && (
        <div className="absolute inset-0 pointer-events-none opacity-40 paper-texture z-0" />
      )}

      {/* 侧边栏 */}
      <Sidebar
        tasks={tasks}
        projects={projects}
        counts={counts}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        onSearch={setSearchQuery}
      />

      {/* 右侧内容区域 - 纸张容器 */}
      <div className="flex-1 p-6 min-h-0 relative z-10">
        <div
          className={`
            h-full bg-[var(--bg-content)] rounded-2xl overflow-hidden relative
            ${theme.showTexture ? 'notebook-shadow' : 'shadow-[var(--shadow-small)]'}
          `}
        >
          {/* 点阵背景 */}
          {theme.showTexture && (
            <div className="absolute inset-0 pointer-events-none dot-grid z-0" />
          )}

          <main className="h-full overflow-y-auto relative z-10">
            <TaskList
              tasks={tasks}
              projects={projects}
              loading={loading}
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

        {/* FOCUS 按钮 - 右上角固定 */}
        <Button
          type="default"
          shape="round"
          size="large"
          onClick={onFocus}
          className="focus-btn absolute top-10 right-10"
        >
          <span className="focus-btn-border">
            <span className="focus-btn-gradient animate-spin-slow" />
          </span>
          <span className="focus-btn-bg" />
          <span className="focus-btn-content">
            <AppstoreOutlined />
            <span>FOCUS</span>
          </span>
        </Button>
      </div>
    </div>
  )
}
