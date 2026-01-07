import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { Sidebar } from '@/components/Sidebar'
import { TaskList } from '@/components/TaskList'
import { useTheme } from '@/hooks/useTheme'

interface ListLayoutProps {
  onFocus: () => void
}

export function ListLayout({ onFocus }: ListLayoutProps) {
  const { theme } = useTheme()

  const { data, actions, views, filters } = useTasks()
  const { projects, loading, error } = data
  const { completeTask, deleteTask, updateTask, createTask } = actions
  const { counts, projectCounts } = views
  const { getTaskGroups } = filters

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
        projects={projects}
        counts={counts}
        projectCounts={projectCounts}
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
              projects={projects}
              loading={loading}
              error={error}
              filter={selectedFilter}
              searchQuery={searchQuery}
              getTaskGroups={getTaskGroups}
              onComplete={completeTask}
              onDelete={deleteTask}
              onUpdate={updateTask}
              onCreate={createTask}
              onFocus={onFocus}
            />
          </main>
        </div>
      </div>
    </div>
  )
}
